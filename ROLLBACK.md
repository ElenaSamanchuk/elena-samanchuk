# Откат правок

## Откатить второй проход копирайта (pass 2)

Версия **до** правок 20.05.2026 — тег и ветка:

```bash
cd tochka-site-marketer-new
git checkout before-copy-pass-2
```

Или жёстко вернуть `master` к снимку:

```bash
git checkout master
git reset --hard snapshot-pre-pass2
```

## Вернуть pass 2

```bash
git checkout copy-pass-2
# или после merge:
git checkout master
```

## Откатить первый рефреш (ещё раньше)

```bash
git reset --hard 7bf26b3
```

Коммит `7bf26b3` — состояние сразу после `git init` (без pass 2, без части стилей pass 1).

## Ветки и теги

| Имя | Что это |
|-----|---------|
| `snapshot-pre-pass2` | снимок перед pass 2 (коммит `73eae20`) |
| `before-copy-pass-2` | ветка на том же коммите |
| `copy-pass-2` | второй проход копирайта |
| `master` | основная ветка (обновляется merge) |

## Файлы pass 2

- `src/data/siteCopy.ts` — hero с метками «Под ключ» / «Один этап», услуги, кейсы
- `src/main.ts` — hero-modes, kickers, footnote
- `src/markup/heroPipelineCard.ts` — «Маршрут проекта»
- `src/data/cases.ts` — усиленные результаты
- `src/data/collaboration.ts`, `siteMeta.ts`, `index.html`
- `src/style.css` — hero-modes, section-kicker

Ссылки в кейсах не менялись.
