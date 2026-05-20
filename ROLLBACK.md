# Откат правок

**Сейчас в `master`:** версия **до всех premium-pass** (`snapshot-pre-premium-ui`).

## Вы смотрите не ту вкладку, если видите:

- чёрный фон и синюю кнопку **Telegram** только в шапке;
- заголовок «Страницы, которые доходят до релиза.** (без «без разрыва…»);
- строку «Два формата — на выбор» и чипы **Цель / Аудитория** в брифе.

Это **premium pass 2** — старый dev-сервер или кэш. В файлах проекта этого уже нет.

## Правильная локальная версия

```bash
cd tochka-site-marketer-new
git reset --hard snapshot-pre-premium-ui
npm run dev:fresh
```

Откройте **http://127.0.0.1:5180/** (не 5173/5174 — там могут висеть старые процессы).

В консоли браузера (F12) должно быть: `[site] revision: restored-pre-premium-ui`

На странице: фиолетовый градиент, в nav **«Доступна · удалённо»**, полный заголовок с «без разрыва между смыслом, дизайном и кодом».

## Откат в git

```bash
git reset --hard snapshot-pre-premium-ui   # до premium (текущая цель)
git reset --hard snapshot-pre-qa-seo      # ещё раньше — до QA/SEO
```

## Вернуть эксперимент premium (если понадобится)

```bash
git reset --hard da543c6    # pass 2 (чёрный Apple)
git reset --hard 1c029d2    # pass 1 (Inter, укороченно)
```

## Перед новым проходом

```bash
git tag snapshot-pre-НАЗВАНИЕ -m "Before …"
```

Ссылки в кейсах (`href` в `cases.ts`) не менялись при откатах.
