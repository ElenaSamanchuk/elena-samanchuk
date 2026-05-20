# Откат правок

## Откатить UX/UI pass (последний)

```bash
cd tochka-site-marketer-new
git checkout before-ux-pass
```

или:

```bash
git reset --hard snapshot-pre-ux-pass
```

## Вернуть UX pass

```bash
git checkout master
```

(после merge ветки `ux-pass`)

## Откатить копирайт pass 2 (без UX)

```bash
git reset --hard snapshot-pre-pass2
```

## Откатить всё до первого git-снимка

```bash
git reset --hard 7bf26b3
```

## Теги и ветки

| Имя | Состояние |
|-----|-----------|
| `snapshot-pre-ux-pass` | перед UX pass (`3f2adc8`) |
| `before-ux-pass` | ветка на том же коммите |
| `ux-pass` | UX/UI правки |
| `snapshot-pre-pass2` | перед копирайт pass 2 |
| `master` | актуальная основная ветка |

## Файлы UX pass

- `src/style.css` — иерархия, фокус, кейсы, hero, контакт, a11y
- `src/initSite.ts` — подсветка пункта меню при скролле, tilt только на desktop
- `src/main.ts` — skip-link

Ссылки в кейсах не менялись.
