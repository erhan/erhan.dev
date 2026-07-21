# erhan.dev

Erhan BÜTE’nin Python ve backend geliştirme üzerine Türkçe teknik notları. Site, [Astro Sienna](https://github.com/anjay-goel/astro-sienna) teması temel alınarak Astro ile geliştirilmiştir.

## Özellikler

- Sienna’nın serif tipografisi ve zaman çizelgesi düzeni
- Sistem tercihine uyumlu açık/koyu tema
- Markdown ve MDX tabanlı teknik yazılar
- Etiket arşivi, RSS, sitemap ve sosyal paylaşım meta verileri
- Mobil uyumlu ve klavye erişilebilir arayüz

## Kurulum

```bash
npm install
npm run dev
```

Yerel geliştirme adresi varsayılan olarak `http://localhost:4321` olur.

## Komutlar

```bash
npm run dev
npm run build
npm run preview
```

## Yeni yazı eklemek

Yazılar `src/content/post/` dizininde tutulur:

```yaml
---
title: "Yazı başlığı"
description: "Yazıyı özetleyen kısa açıklama."
publishDate: 2026-07-21
tags: ["Python", "Backend"]
draft: false
---
```

Site kimliği ve menü bağlantıları `src/site.config.ts`, içerik şeması ise `src/content.config.ts` içinden yönetilir.

## Lisans

MIT
