# QA-отчёт

Дата: **2026-05-19** · сборка: `stack-tw` · ветка: текущая HEAD

## Итог

| Область | Статус |
|---------|--------|
| Сборка `npm run build` | OK |
| Адаптив (CSS + разметка) | OK |
| Доступность (базовая) | OK |
| SEO (meta, schema, sitemap, контент компетенций) | OK после прохода |
| Кроссбраузер | Ручная проверка после деплоя |

## Адаптив

| Viewport | Проверка | Статус |
|----------|----------|--------|
| ≥900px | Hero 2 колонки, sidebar sticky, roadmap компетенций 4 колонки (как в «Связаться») | OK |
| 720px | Nav horizontal scroll, hero в 1 колонку | OK |
| &lt;720px | Контент до sidebar (`order`), метрики 1 колонка | OK |
| Safe area | `scroll-top` + `env(safe-area-inset-*)` | OK |

## Функциональность

| Функция | Статус | Примечание |
|---------|--------|------------|
| Якорная навигация | OK | Lenis или native smooth |
| Scroll spy / `aria-current` | OK | |
| Кейсы: превью + lazy img | OK | `alt` на скриншотах |
| Block builder hero | OK | `aria-hidden` на декоре |
| Scroll-top | OK | Стили в `widgets.css` |
| `prefers-reduced-motion` | OK | Без Lenis/Motion |
| WebGL фон | N/A | Удалён |

## SEO

| Элемент | Файл |
|---------|------|
| `title`, `description`, `keywords` | `index.html` (синхрон с `siteMeta.ts`) |
| `canonical`, OG, Twitter | `index.html` |
| JSON-LD: WebSite, Person, ProfessionalService, **ItemList** (компетенции) | `index.html` |
| `robots.txt`, `sitemap.xml` | `public/` |
| `site.webmanifest` | `public/` |
| Семантика: `h1` hero, `h2` секции, **`h3` в roadmap** | `renderSite.ts`, `capabilityRoadmap.ts` |
| Полный текст групп компетенций (`dt`/`dd`) | `capabilities.ts` + roadmap |
| Footnote секции компетенций | `siteCopy.ts` |
| `<noscript>` fallback | `index.html` |

Константы для кода: `src/data/siteMeta.ts`. При смене meta править **и** `index.html` (статический head для краулеров до гидрации).

## Доступность

- Skip-link → `#cases`
- `focus-visible` на интерактивных элементах
- Секция компетенций: `aria-labelledby="capabilities-title"`
- Внешние ссылки: `rel` из `contacts.ts`
- Hero builder: декоративный, `aria-hidden="true"`

## Производительность (сборка)

| Чанк | ~gzip |
|------|-------|
| `index-*.js` | ~11 KB |
| `motion-*.js` | ~43 KB (lazy) |
| `lenis-*.js` | ~5 KB (lazy) |
| CSS | ~10 KB |

## Не менялось

- URL в `src/data/cases.ts` (19 ссылок)

## Ручной чеклист после деплоя

- [ ] https://elenasamanchuk.github.io/tochka-site-marketer-new/ — CSS/JS с base path
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) — JSON-LD без ошибок
- [ ] Lighthouse Mobile: SEO ≥95, A11y ≥90
- [ ] iOS Safari: sticky sidebar, превью кейсов, CTA на узком экране

## Известные ограничения

- SPA: основной контент рендерится в JS; для индексации критичны `index.html` meta, JSON-LD и восстановленный текст в DOM компетенций.
- Старые CSS в `src/*.css` (не в бандле) — только архив.
