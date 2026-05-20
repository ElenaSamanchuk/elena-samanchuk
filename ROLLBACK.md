# Откат правок

## Откатить QA / SEO pass (последний)

```bash
cd tochka-site-marketer-new
git reset --hard snapshot-pre-qa-seo
```

## Вернуть QA / SEO pass

```bash
git checkout qa-seo-pass
```

## Откатить fullstack pass 4

```bash
git reset --hard snapshot-pre-dev-pass-4
```

## Предыдущие снимки

| Тег | Состояние |
|-----|-----------|
| `snapshot-pre-qa-seo` | до QA/SEO pass |
| `snapshot-pre-dev-pass-4` | до fullstack pass 4 |
| `snapshot-pre-dev-pass` | до fullstack pass 1 |
| `snapshot-pre-ux-pass-3` | до UX pass 3 |
| `snapshot-pre-pass2` | до копирайт pass 2 |

## Файлы QA / SEO pass

- `public/robots.txt`, `sitemap.xml`, `site.webmanifest`
- `index.html` — robots, theme-color, keywords, JSON-LD @graph, manifest
- `src/data/siteMeta.ts` — URL, OG, JSON-LD для кода
- `vite.config.ts`, `.env.production` — `base` для GitHub Pages
- `src/compat.css`, `src/performance.css`
- `src/lib/mediaPrefs.ts` — WebGL off на mobile/tablet
- `QA.md` — чеклист и результаты

Ссылки в кейсах (`cases.ts`) не менялись.
