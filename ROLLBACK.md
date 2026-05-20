# Откат правок

## Откатить fullstack pass 4 (последний)

```bash
cd tochka-site-marketer-new
git checkout before-dev-pass-4
```

или:

```bash
git reset --hard snapshot-pre-dev-pass-4
```

## Вернуть pass 4

```bash
git checkout master
```

## Предыдущие снимки

| Тег | Состояние |
|-----|-----------|
| `snapshot-pre-dev-pass-4` | до pass 4 |
| `snapshot-pre-dev-pass` | до pass 1 |
| `snapshot-pre-ux-pass-3` | до UX pass 3 |
| `snapshot-pre-pass2` | до копирайт pass 2 |

## Файлы pass 4

- `src/renderSite.ts` — разметка страницы (вынесена из `main.ts`)
- `src/main.ts` — только entry: render + init
- `src/data/contacts.ts` — единые контакты и `rel`
- `src/lib/safeUrl.ts`, `scrollOffset.ts`
- `src/initSite.ts` — делегирование кликов, динамический offset, unobserve observers
- `src/markup/collaborationRoadmap.ts` — escape + safe href

Ссылки в кейсах (`cases.ts`) не менялись.
