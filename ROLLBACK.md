# Откат правок

## Откатить UX pass 3 (последний)

```bash
cd tochka-site-marketer-new
git checkout before-ux-pass-3
```

или:

```bash
git reset --hard snapshot-pre-ux-pass-3
```

## Вернуть pass 3

```bash
git checkout master
```

## Предыдущие снимки

| Команда | Состояние |
|---------|-----------|
| `git reset --hard snapshot-pre-ux-pass` | до UX pass 1–2 |
| `git reset --hard snapshot-pre-pass2` | до копирайт pass 2 |
| `git reset --hard 7bf26b3` | первый git-снимок |

## Теги

- `snapshot-pre-ux-pass-3` — перед pass 3
- `snapshot-pre-ux-pass` — перед pass 1–2
- `snapshot-pre-pass2` — перед копирайт pass 2

## Файлы UX pass 3

- `src/style.css` — mobile hero, метрики, timeline, navbar scroll, safe-area
- `src/initSite.ts` — nav по scrollY, navbar is-scrolled, клавиатура вкладок pipeline
- `src/markup/heroPipelineCard.ts` — tabindex вкладок

Ссылки в кейсах не менялись.
