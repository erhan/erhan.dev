---
title: "FastAPI’den production’a tek komutla"
description: "FastAPI ekibinin public beta’ya açtığı FastAPI Cloud’u ve tek komutlu deployment akışını kısaca inceleyelim."
publishDate: 2026-07-22
tags: ["Python", "FastAPI", "Cloud", "Deployment"]
aiAssisted: true
coverImage:
  src: "/blog/fastapi-cloud-cover.png"
  alt: "Terminalden FastAPI Cloud’a ve canlı API’ye uzanan deployment flow’unu gösteren teknik illüstrasyon"
draft: false
---

FastAPI ile bir API geliştirmek çoğu zaman hızlı ilerliyor. Uygulama hazır olduğunda ise önümüzde ayrı bir iş kalıyor: build, HTTPS, scaling, loglar ve deployment pipeline. Bu katmanlar arttıkça framework’ün sadeliğinden uzaklaşabiliyoruz.

FastAPI’nin yaratıcısı Sebastián Ramírez ve framework’ü geliştiren ekip bu boşluğu **FastAPI Cloud** ile kapatmak istiyor. Platform artık public beta’da ve temel vaadi oldukça net: FastAPI uygulamasını tek komutla yayına almak.

## FastAPI Cloud ne sunuyor?

FastAPI Cloud, FastAPI ve Python uygulamaları için hazırlanmış managed bir deployment platformu. Generic bir container servisini FastAPI’ye uyarlamak yerine, framework’ün kullandığı standartları ve proje yapısını doğrudan tanıyor.

Platform şu işleri arka planda üstleniyor:

- Cloud build ve deployment
- Varsayılan HTTPS
- Autoscaling ve zero-downtime deployment
- Environment variable ve secret yönetimi
- Runtime logları ve temel metrikler
- GitHub üzerinden otomatik deployment

## Hazır entegrasyonlar

Public beta aşamasında doğrudan bağlanabilen dört servis bulunuyor:

- **[Neon](https://fastapicloud.com/docs/integrations/neon-integration/):** Seçilen PostgreSQL database’inin connection string’ini encrypted bir `DATABASE_URL` olarak uygulamaya ekliyor.
- **[Supabase](https://fastapicloud.com/docs/integrations/supabase-integration/):** Supabase projesindeki PostgreSQL database’ini yine `DATABASE_URL` üzerinden bağlıyor.
- **[Redis Cloud](https://fastapicloud.com/docs/integrations/redis-integration/):** Mevcut bir Redis database’i seçmeye veya bağlantı sırasında ücretsiz bir database oluşturmaya izin veriyor; connection `REDIS_URL` olarak geliyor.
- **[Logfire](https://fastapicloud.com/docs/integrations/logfire-integration/):** Uygulamayı mevcut ya da yeni bir Logfire projesine bağlıyor ve gerekli `LOGFIRE_TOKEN` secret’ını otomatik oluşturuyor.

Bu bağlantılar dashboard üzerinden yapılıyor. Credentials encrypted secret olarak saklanıyor ve istenirse entegrasyon eklenir eklenmez yeni bir deployment başlatılabiliyor.

## İlk deployment

Yeni bir proje oluşturmak için dokümantasyondaki en kısa yol şu:

```bash
uvx fastapi-new myapp
cd myapp
uv run fastapi deploy
```

Mevcut bir FastAPI projesinde ise `fastapi[standard]` dependency’sinin güncel olması yeterli:

```bash
uv add "fastapi[standard]"
uv run fastapi deploy
```

CLI, FastAPI application’ını otomatik olarak buluyor. Daha önce giriş yapılmadıysa authentication için tarayıcıyı açıyor; ardından projeyi build edip `fastapicloud.dev` altında çalışan bir URL veriyor.

Deployment tamamlandığında API’nin otomatik oluşturulan dokümantasyonuna da her zamanki gibi `/docs` endpoint’inden ulaşılabiliyor:

```text
https://myapp.fastapicloud.dev/docs
```

## Neden önemli?

FastAPI’nin güçlü taraflarından biri, doğru varsayımları framework içinde hazır sunması. FastAPI Cloud aynı yaklaşımı deployment tarafına taşımaya çalışıyor. Amaç cloud kavramlarını tamamen gizlemek değil; bir API’yi kullanıcıya ulaştırmak için gereken başlangıç maliyetini küçültmek.

Elbette ürün hâlâ public beta’da. Daha karmaşık altyapı ihtiyaçlarında mevcut cloud araçları gerekli olmaya devam edecektir. Ancak küçük servisler, prototipler, workshop projeleri ve hızla doğrulanmak istenen API’ler için `fastapi deploy` oldukça iyi bir başlangıç noktası gibi görünüyor.

Detaylı kurulum adımlarına [FastAPI Cloud Quick Start](https://fastapicloud.com/docs/getting-started/) dokümantasyonundan, public beta duyurusuna ise [Sebastián Ramírez’in yazısından](https://fastapicloud.com/blog/fastapi-cloud-public-beta/) ulaşabilirsiniz.
