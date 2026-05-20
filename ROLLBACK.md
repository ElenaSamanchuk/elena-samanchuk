# Откат правок

Текущая ветка `master` — **до всех premium-проходов** (`af8825a`: QA/SEO + фикс превью/видео).

## Быстрый откат (копировать в терминал)

```bash
cd tochka-site-marketer-new

# Сейчас на диске — полная версия до premium (рекомендуется)
git reset --hard snapshot-pre-premium-ui

# Ещё раньше — до QA/SEO
git reset --hard snapshot-pre-qa-seo
```

## Все снимки

| Тег | Коммит | Что это |
|-----|--------|---------|
| **`snapshot-pre-premium-ui`** | `af8825a` | **До premium pass 1 и 2** — Poppins, полные тексты, marquee, сайдбар |
| `snapshot-pre-premium-pass-2` | `1c029d2` | Только premium pass 1 (Inter, укороченные блоки) |
| `snapshot-pre-qa-seo` | `769ac8b`… | До robots/sitemap/base path |
| `snapshot-pre-dev-pass-4` | … | До fullstack pass 4 |
| `snapshot-pre-ux-pass-3` | … | До UX pass 3 |

## Вернуть эксперименты premium (если понадобится)

```bash
# Premium pass 1 (первый «воздушный»)
git reset --hard snapshot-pre-premium-pass-2
# или
git checkout premium-ui-pass

# Premium pass 2 (сильное упрощение / Apple-black)
git reset --hard da543c6
# или
git checkout premium-pass-2
```

## Перед любым новым проходом — создать снимок

```bash
git tag snapshot-pre-НАЗВАНИЕ-ПРОХОДА -m "Before …"
```

Ссылки в кейсах (`cases.ts`, поле `href`) не трогали при откатах.
