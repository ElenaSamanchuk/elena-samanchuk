# Откат правок (копирайт + структура)

В проекте включён git. Актуальная версия — ветка **`copywriter-refresh`**.

## Быстрый откат (только последние стили hero/кейсов/контакта)

Если не нравятся только доработки CSS после рефреша:

```bash
cd tochka-site-marketer-new
git checkout master
```

На `master` — тот же текст и порядок блоков, без финальных правок в `src/style.css` (`.hero-for-whom`, `.contact-hub__cta-*` и т.д.).

## Вернуть полную версию с рефрешем

```bash
git checkout copywriter-refresh
```

## Полный откат текстов и структуры

Первый коммит (`master`, ветка `before-copywriter-refresh`) сделан **уже после** переноса текстов в `siteCopy.ts` и смены порядка блоков — отдельного «до рефреша» в git нет.

Варианты:

1. **Cursor / VS Code** — Local History по файлам из списка ниже.
2. **OneDrive** — версии файлов в папке проекта (если синхронизация включена).
3. Написать в чат: «откати копирайт-рефреш» — можно собрать ветку `legacy-pre-copywriter` вручную.

## Файлы, которые менялись в рефреше

| Файл | Что изменилось |
|------|----------------|
| `src/data/siteCopy.ts` | новый — hero, навигация, заголовки секций |
| `src/main.ts` | порядок: кейсы → как работаю → форматы; hero под ключ / по этапам |
| `src/data/cases.ts` | разные формулировки задачи/вклада/результата |
| `src/data/collaboration.ts` | тон блока сотрудничества |
| `src/data/siteMeta.ts`, `index.html` | title/description |
| `src/style.css` | стили hero и contact-hub |
| `src/effects/pageAnchors.ts` | якоря из `siteCopy.nav` |

Ссылки в кейсах **не менялись**.

## Ветки

| Ветка | Смысл |
|-------|--------|
| `master` | базовый снимок при `git init` |
| `before-copywriter-refresh` | то же, что `master` (метка-указатель) |
| `copywriter-refresh` | актуальная версия после рефреша |
