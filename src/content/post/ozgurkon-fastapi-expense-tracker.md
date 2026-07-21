---
title: "ÖzgürKon’da FastAPI: Expense Tracker API"
description: "ÖzgürKon atölyesi için geliştirdiğim FastAPI projesinin layer yapısını, request flow’unu ve authentication modelini inceleyelim."
publishDate: 2026-07-21
tags: ["Python", "FastAPI", "ÖzgürKon", "Backend"]
aiAssisted: true
coverImage:
  src: "/blog/fastapi-api-cover-v2.png"
  alt: "FastAPI logosu, client’lar, service layer ve database arasındaki request flow’u gösteren teknik illüstrasyon"
draft: false
---

FastAPI’yi anlatmanın en iyi yolu küçük ama gerçek bir uygulama geliştirmek. ÖzgürKon 2026 atölyesi için hazırladığım **Expense Tracker API**, kullanıcıların hesap oluşturabildiği, giriş yapabildiği ve kendi harcamalarını yönetebildiği bir demo proje.

Bu yazıda tek tek endpoint yazmaktan çok, uygulamanın parçalarını nasıl ayırdığımı ve bir request’in sistem içinde hangi layer’lardan geçtiğini anlatacağım.

Projenin kaynak koduna [GitHub üzerinden](https://github.com/erhan/ozgurkon), çalışan sürümüne ise [FastAPI Cloud üzerinden](https://ozgurkon.fastapicloud.dev) ulaşabilirsiniz.

## Uygulama ne yapıyor?

Proje iki temel alan üzerine kurulu:

- JWT tabanlı register, login, token refresh ve logout flow’u
- Harcama ekleme, listeleme, güncelleme, silme ve aylık özet oluşturma

Harcama kayıtları kullanıcıya ait. Bir kullanıcı yalnızca kendi verilerini görebiliyor ve değiştirebiliyor. Listeleme endpoint’i ay, kategori, para birimi ve tutar aralığına göre filtrelemeyi; sayfalama yapmayı da destekliyor.

## Tech stack

Projenin dependency’leri `pyproject.toml` dosyasında tutuluyor:

- **FastAPI:** HTTP layer, dependency injection ve OpenAPI dokümantasyonu
- **Pydantic ve Pydantic Settings:** Request validation, response schema ve configuration
- **SQLAlchemy 2.0:** Async database access ve ORM layer
- **PostgreSQL ve psycopg:** Data persistence
- **Alembic:** Database migration’ları ve seed data
- **PyJWT:** Access token üretme ve doğrulama
- **uv:** Dependency ve virtual environment yönetimi
- **Ruff:** Code style ve static analysis

## Project structure

Uygulamayı sorumluluklarına göre küçük layer’lara ayırdım:

```text
ozgurkon/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── deps.py
│   │   └── v1/routes/
│   │       ├── auth.py
│   │       ├── expenses.py
│   │       └── users.py
│   ├── core/
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── exceptions.py
│   │   ├── middleware.py
│   │   ├── responses.py
│   │   └── security.py
│   ├── crud/
│   ├── models/
│   ├── schemas/
│   └── services/
├── alembic/
├── alembic.ini
└── pyproject.toml
```

Bu yapıdaki temel akış şöyle:

```text
HTTP request
  → route
  → Pydantic schema
  → service
  → CRUD
  → SQLAlchemy model
  → PostgreSQL
```

Her layer’ın sınırı belli olduğunda endpoint’ler kısa kalıyor; validation, business rule ve database query’leri birbirine karışmıyor.

## Application entry point

`app/main.py`, uygulamanın bootstrap edildiği yer. Router’lar, middleware ve exception handler’lar burada bir araya geliyor:

```python
from contextlib import asynccontextmanager

from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.create_tables_on_startup:
        await create_db_and_tables()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.project_name,
        version=settings.version,
        lifespan=lifespan,
    )

    app.add_middleware(RequestResponseLoggingMiddleware)
    setup_exception_handlers(app)
    app.include_router(api_v1_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()
```

`Application factory` pattern’i, kurulum adımlarını tek yerde topluyor. `lifespan` ise startup ve shutdown sırasında çalışması gereken işleri yönetiyor.

## Configuration’ı koddan ayırmak

Database connection, JWT settings ve token süreleri `BaseSettings` üzerinden environment variable’lardan okunuyor:

```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "Expense Tracker API"
    api_v1_prefix: str = "/api/v1"
    database_con: str
    secret_key: str
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    model_config = SettingsConfigDict(env_file=".env")
```

Bu sayede development ve production ortamları aynı kodu, farklı configuration değerleriyle çalıştırabiliyor. Gerçek bir production ortamında `secret_key` ve database bilgileri kesinlikle source code içinde tutulmamalı.

## Pydantic ile request validation

Bir harcama kaydının tutarı pozitif olmalı, para birimi ve kategorisi tanımlı değerlerden gelmeli, harcama tarihi gelecekte olmamalı:

```python
class ExpenseBase(BaseModel):
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    currency: CurrencyEnum
    category: ExpenseCategoryEnum
    description: str | None = Field(default=None, max_length=255)
    spent_at: datetime

    @field_validator("spent_at")
    @classmethod
    def spent_at_cannot_be_future(cls, value: datetime) -> datetime:
        now = datetime.now(value.tzinfo) if value.tzinfo else datetime.now()
        if value > now:
            raise ValueError("spent_at cannot be in the future")
        return value
```

Kurallar schema içinde tanımlandığı için route’a ulaşan veri artık beklediğimiz biçimde oluyor. Aynı schema OpenAPI dokümantasyonuna da yansıyor.

## Dependency injection ile user ve database session

FastAPI’nin dependency injection yapısını database session ve current user için kullanıyorum:

```python
DbSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_expense(
    payload: ExpenseCreate,
    db: DbSession,
    current_user: CurrentUser,
):
    return await expense_service.create_expense(
        db=db,
        user_id=current_user.id,
        payload=payload,
    )
```

Endpoint’in authentication veya connection lifecycle ayrıntılarını bilmesine gerek kalmıyor. İhtiyacı olan dependency’leri type’larıyla birlikte bildiriyor.

## Service ve CRUD layer’ları

Route yalnızca HTTP ile ilgileniyor. Harcamanın gerçekten var olup olmadığı gibi business rule’lar service layer’da, SQL query’leri ise CRUD layer’da tutuluyor:

```python
async def get_expense(db, user_id, expense_id):
    expense = await expense_crud.get_expense_by_id(
        db=db,
        user_id=user_id,
        expense_id=expense_id,
    )
    if expense is None:
        raise ExpenseNotFoundException()

    return ExpenseResponse.model_validate(expense)
```

Query’ye `user_id` eklenmesi önemli. Kaydın ID’si bilinse bile başka bir kullanıcıya ait harcamaya erişilmesini engelliyor.

## JWT ve refresh token akışı

Login başarılı olduğunda kısa ömürlü bir access token ve daha uzun ömürlü bir refresh token üretiliyor. Access token JWT olarak imzalanıyor; refresh token ise plain text olarak değil, SHA-256 hash’iyle database’de saklanıyor.

Token refresh sırasında eski refresh token revoke edilip yeni bir token pair oluşturuluyor. Logout işlemi de refresh token’ı geçersiz kılıyor. Böylece access token’ları kısa tutarken kullanıcıyı her yarım saatte bir yeniden login olmaya zorlamıyoruz.

## Projeyi çalıştırmak

Önce örnek environment file’ını kopyalayıp dependency’leri kurun:

```bash
cp .env.example .env
uv sync
```

Ardından development server’ı başlatın:

```bash
fastapi dev app/main.py
```

Migration’ları ve default user’ı oluşturmak için:

```bash
uv run alembic upgrade head
```

Uygulama çalıştığında Swagger UI’a `/docs` adresinden ulaşabilir, register ve login flow’unu doğrudan tarayıcıdan deneyebilirsiniz.

## Sonuç

Bu proje, FastAPI ile birkaç endpoint yazmanın ötesine geçip büyümeye açık bir API’nin temel parçalarını gösteriyor: net layer boundary’leri, validated request data, async database access, centralized exception handling ve refresh token flow’u.

Atölyedeki asıl fikir framework’ün bütün özelliklerini ezberlemek değil; bir HTTP request’in uygulama içinde nasıl ilerlediğini ve her sorumluluğun nerede yaşaması gerektiğini görmekti.

## Kaynaklar

- [ÖzgürKon Expense Tracker API](https://github.com/erhan/ozgurkon)
- [Çalışan demo](https://ozgurkon.fastapicloud.dev)
- [FastAPI dokümantasyonu](https://fastapi.tiangolo.com/)
- [SQLAlchemy dokümantasyonu](https://docs.sqlalchemy.org/)
- [Alembic dokümantasyonu](https://alembic.sqlalchemy.org/)
