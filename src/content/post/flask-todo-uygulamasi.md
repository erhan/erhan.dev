---
title: "Flask Todo Uygulaması"
description: "Flask ile genişletilebilir bir todo uygulamasının modüllerini ve klasör yapısını adım adım inceleyelim."
publishDate: 2017-02-11
tags: ["Python", "Flask", "Todo", "Backend"]
coverImage:
  src: "/blog/flask-todo-cover-v2.png"
  alt: "Flask logosu, todo listesi ve modüler application component’lerini gösteren editoryal teknik illüstrasyon"
draft: false
---

Herkese merhaba,

Flask, Python ile yazılmış ve hızlı biçimde web uygulaması geliştirmenizi sağlayan bir web framework’üdür. Mikro framework olması nedeniyle yalnızca basit uygulamalarda kullanılabileceği düşünülse de esnek yapısı sayesinde farklı ölçeklerde uygulamalar geliştirmek mümkündür.

Flask hakkında yeterli sayıda Türkçe kaynak bulunmuyor. Var olan içerikler de çoğunlukla tek sayfalık örneklerle sınırlı kalıyor. Bu nedenle Flask ile daha geniş kapsamlı bir uygulamanın nasıl geliştirilebileceğini, hangi modüllerin ne amaçla kullanıldığını ve dosya yapısının nasıl kurulabileceğini örnek bir todo uygulaması üzerinden anlatmak istedim.

Uygulamanın kaynak koduna [GitHub üzerinden ulaşabilirsiniz](https://github.com/erhan/flask-todo).

> Bu yazı ilk olarak 11 Şubat 2017’de Medium’da yayımlandı. Metin, teknik bağlamı korunarak ve yazım hataları düzeltilerek arşive aktarıldı.

## Kullanılan modüller

Projede kullanılan paketlerin tamamını [`requirements.txt`](https://github.com/erhan/flask-todo/blob/develop/requirements.txt) dosyasında görebilirsiniz.

- **Flask:** Web uygulamasının temel framework’ü.
- **Flask-WTF:** Uygulamadaki formları yönetmek için kullanılan Flask entegrasyonu.
- **Flask-Bootstrap:** WTForms ile oluşturulan formlarda Bootstrap bileşenlerini kullanmayı kolaylaştırır. Daha özel form tasarımlarında gerekli olmayabilir.
- **psycopg2:** PostgreSQL database driver’ı. MySQL tercih edilirse `mysqlclient` kullanılabilir.
- **Flask-Migrate:** Database schema değişiklikleri için migration oluşturmayı sağlar.
- **Flask-SQLAlchemy:** Flask projelerinde sık kullanılan SQLAlchemy entegrasyonu ve ORM layer’ı.
- **Gunicorn:** Uygulamayı production ortamında çalıştırmak için kullanılan WSGI server.

Todo uygulaması basit olsa da projeyi genişletilebilir bir klasör yapısıyla oluşturdum. Daha büyük Flask uygulamalarında tercih ettiğim yapı genel olarak şöyle:

```text
~/flask-todo
├── run.py
├── config.py
├── migrate.py
├── migrations/
├── env/
└── app/
    ├── __init__.py
    ├── helpers/
    ├── models/
    │   ├── __init__.py
    │   ├── model_1.py
    │   ├── model_2.py
    │   └── model_3.py
    ├── modules/
    │   ├── __init__.py
    │   ├── module_1/
    │   │   ├── __init__.py
    │   │   ├── controllers.py
    │   │   └── forms.py
    │   ├── module_2/
    │   │   ├── __init__.py
    │   │   ├── controllers.py
    │   │   └── forms.py
    │   └── module_3/
    │       ├── __init__.py
    │       ├── controllers.py
    │       └── forms.py
    ├── templates/
    │   ├── module_1/
    │   │   └── index.html
    │   ├── module_2/
    │   │   └── index.html
    │   ├── module_3/
    │   │   └── index.html
    │   ├── 404.html
    │   ├── 500.html
    │   └── _base.html
    └── static/
        ├── css/
        ├── fonts/
        ├── images/
        └── js/
```

## Dosya ve klasörlerin görevleri

### `run.py`

Uygulamanın entry point’idir.

### `config.py`

Application config’i içerir.

### `migrate.py` ve `migrations/`

Database migration’larını oluşturmak ve uygulamak için Flask-Migrate tarafından kullanılan dosyalardır.

### `env/`

Projenin virtual environment klasörüdür.

### `app/__init__.py`

Flask uygulaması ve uygulamanın ihtiyaç duyduğu bileşenler bu dosyada oluşturulur.

### `helpers/`

Decorator’lar, özel Jinja filtreleri ve uygulama genelinde kullanılacak yardımcı fonksiyonlar bu klasörde tutulabilir.

### `models/`

Uygulamanın database model’lerini içerir.

### `modules/`

Uygulamanın bağımsız modüllerini içerir. Todo uygulamasındaki kullanıcı işlemleri bir modül, todo işlemleri ise ayrı bir modül olarak düşünülebilir.

### `static/`

Görseller, fontlar, CSS ve JavaScript dosyaları gibi static asset’ler burada toplanır.

### `templates/`

Uygulamanın HTML template’lerini içerir. Modüllere ait template’leri ayrı klasörlerde tutmak, proje büyüdükçe düzeni korumayı kolaylaştırır.

## Sonuç

Flask uygulamasını modüllere ayırarak ihtiyaç duyduğunuz ölçüde genişletebilirsiniz. Bu ilk yazıda genel yapıyı ele aldım; Blueprint, Jinja, SQLAlchemy, WTForms, veritabanı migration’ları ve deployment gibi konuların her biri ayrı bir yazıyı hak ediyor.

## Kaynaklar

- [Flask dokümantasyonu](https://flask.palletsprojects.com/)
- [Flask ile büyük uygulama yapısı](https://www.digitalocean.com/community/tutorials/how-to-structure-large-flask-applications)
- [SQLAlchemy dokümantasyonu](https://docs.sqlalchemy.org/)
- [Jinja dokümantasyonu](https://jinja.palletsprojects.com/)
- [Flask-WTF dokümantasyonu](https://flask-wtf.readthedocs.io/)
- [Flask-Migrate dokümantasyonu](https://flask-migrate.readthedocs.io/)
- [Yazının Medium’daki ilk sürümü](https://medium.com/@erhanbute/flask-todo-uygulamas%C4%B1-777e0727bf84)
