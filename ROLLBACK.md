# Откат правок

## Откатить fullstack pass (последний)

```bash
cd tochka-site-marketer-new
git checkout before-dev-pass
```

или:

```bash
git reset --hard snapshot-pre-dev-pass
```

## Вернуть fullstack pass

```bash
git checkout master
```

## Предыдущие снимки

| Тег / ветка | Состояние |
|-------------|-----------|
| `snapshot-pre-dev-pass` | до fullstack pass |
| `before-dev-pass` | та же точка (ветка) |
| `snapshot-pre-ux-pass-3` | до UX pass 3 |
| `snapshot-pre-ux-pass` | до UX pass 1–2 |
| `snapshot-pre-pass2` | до копирайт pass 2 |

## Файлы fullstack pass

- `src/lib/scrollRuntime.ts`, `escapeHtml.ts`, `mediaPrefs.ts` — новые утилиты
- `src/data/capabilities.ts` — вынесены данные из `main.ts`
- `src/initSite.ts` — один батч scroll, saveData, tilt
- `src/effects/webglBg.ts`, `scrollToTop.ts` — пауза WebGL, scroll runtime
- `vite.config.ts` — chunk для WebGL
- `index.html` — асинхронная загрузка шрифтов
- Удалены неиспользуемые `counter.ts`, `pageAnchors.ts`
- `src/style.css` — фикс padding кейсов (timeline-card)

Ссылки в кейсах не менялись.
