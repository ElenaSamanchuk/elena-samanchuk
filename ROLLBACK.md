# Откат копирайт-рефреша

Перед правками сохранён снимок в git.

## Если правки на ветке `copywriter-refresh`

```bash
cd tochka-site-marketer-new

# Вернуться к состоянию до правок (ветка main / master)
git checkout main

# Или удалить ветку с правками и остаться на main
git branch -D copywriter-refresh
```

## Если нужно снова открыть правки

```bash
git checkout copywriter-refresh
```

## Снимок до правок

Коммит с меткой: **`before-copywriter-refresh`** (создаётся при `git init` в этом сеансе).

```bash
git checkout before-copywriter-refresh
# detached HEAD — только посмотреть файлы

git checkout main
```

## Без git

Если репозиторий не инициализировался, откат только через историю Cursor / локальные копии файлов.

Основные файлы правок:

- `src/data/siteCopy.ts` (новый)
- `src/main.ts`
- `src/data/cases.ts`
- `src/data/collaboration.ts`
- `src/data/siteMeta.ts`
- `index.html`
- `src/style.css`
- `src/effects/pageAnchors.ts`
