# Откат правок

## Версии

| Тег / revision | Что это |
|----------------|---------|
| `snapshot-restored-baseline` | **Восстановленная** версия: Poppins/Space Grotesk, полный контент, бенто с groups, marquee стека, custom cursor |
| `pro-portfolio` (ветка `premium-refined-pass`) | **Текущая pro-версия:** Literata + Inter, редакторские кейсы, без AI-эффектов |
| `premium-refined` | refined до pro-finish |
| `da543c6` / pass 2 | Чёрный фон `#000`, сильное упрощение — **не использовать** |
| `1c029d2` / pass 1 | Промежуточный premium (Inter, тёмнее) |

## Вернуть восстановленную версию (по запросу)

```bash
cd tochka-site-marketer-new
git checkout master
git reset --hard snapshot-restored-baseline
npm run dev:fresh
```

Консоль (F12): `[site] revision: restored-pre-premium-ui`

## Смотреть refined premium

```bash
git checkout premium-refined-pass
npm run dev:fresh
```

Консоль: `[site] revision: premium-refined`

Откройте **http://127.0.0.1:5180/** (не 5173/5174 — старые процессы).

## Вы смотрите не ту вкладку, если видите:

- чёрный фон и **Telegram** только в шапке (без «Доступна · удалённо»);
- заголовок без «без разрыва между смыслом, дизайном и кодом»;
- чипы **Цель / Аудитория** в брифе вместо списка.

Это **premium pass 2** в кэше или старом dev-сервере.

## Другие откаты

```bash
git reset --hard snapshot-pre-premium-ui   # то же, что restored-baseline
git reset --hard snapshot-pre-qa-seo       # до QA/SEO
git reset --hard da543c6                   # pass 2 (не рекомендуется)
git reset --hard 1c029d2                   # pass 1
```

## Перед новым проходом

```bash
git tag snapshot-pre-НАЗВАНИЕ -m "Before …"
```

Ссылки в кейсах (`href` в `cases.ts`) не менялись при откатах.
