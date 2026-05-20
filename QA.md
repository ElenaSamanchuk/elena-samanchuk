# QA-отчёт: адаптив, кроссбраузер, perf, SEO

Дата: 2026-05-20 · ветка `qa-seo-pass` · откат: `snapshot-pre-qa-seo`

## Адаптив

| Viewport | Проверка | Статус |
|----------|----------|--------|
| ≥1040px | Две колонки hero, сайдбар, bento-сетка | OK |
| 900–1040px | Метрики hero 2+1, кейсы в одну колонку | OK (CSS) |
| 720px | Hero-modes в 1 колонку, nav scroll, pipeline | OK |
| 520px | Метрики 1 колонка, короткий nav-status | OK |
| Safe area | `scroll-top` с `env(safe-area-inset-*)` | OK |

## Кроссбраузер

| Область | Мера |
|---------|------|
| `backdrop-filter` | `-webkit-backdrop-filter` + fallback без blur |
| Smooth scroll | Только при `prefers-reduced-motion: no-preference` |
| `100dvh` | Hero min-height с `@supports` |
| Длинные URL в кейсах | `overflow-wrap: anywhere` |
| Firefox / Safari iOS | Ручная проверка после деплоя рекомендуется |

## Производительность

| Мера | Файл |
|------|------|
| WebGL отключён на ≤900px, coarse pointer, save-data, reduced motion | `mediaPrefs.ts` |
| `content-visibility` на секциях и превью | `performance.css` |
| Lazy + `fetchpriority="low"` на скриншотах кейсов | `renderSite.ts` |
| Шрифты async (`media=print` + onload) | `index.html` |
| Chunk WebGL отдельно | `vite.config.ts` |
| Observers `unobserve` после срабатывания | `initSite.ts` |

Сборка (`npm run build`): JS ~38 KB + webgl chunk ~2.7 KB (gzip меньше).

## SEO

| Элемент | Путь |
|---------|------|
| `robots.txt` | `public/robots.txt` |
| `sitemap.xml` | `public/sitemap.xml` |
| Web manifest | `public/site.webmanifest` |
| OG / Twitter / canonical | `index.html` |
| JSON-LD `@graph` (WebSite, Person, ProfessionalService) | `index.html` |
| `theme-color`, keywords, robots meta | `index.html` |
| Meta-константы для кода | `src/data/siteMeta.ts` |
| Base path GitHub Pages | `vite.config.ts`, `.env.production` |

## Доступность (кратко)

- Skip-link, focus-visible, `aria-current` в nav
- Pipeline: клавиатура, `aria-selected`, `hidden` на панелях
- Внешние ссылки: `rel` из `contacts.ts`

## Не менялось

- URL в `src/data/cases.ts` (19 ссылок)

## Ручной чеклист после деплоя

- [ ] https://elenasamanchuk.github.io/tochka-site-marketer-new/ — стили и JS грузятся (base path)
- [ ] Google Rich Results Test для JSON-LD
- [ ] Lighthouse Mobile (Performance ≥85, SEO ≥95)
- [ ] iOS Safari: hire-bar, превью кейсов, видео механик

## Откат

```bash
git reset --hard snapshot-pre-qa-seo
```

См. `ROLLBACK.md`.
