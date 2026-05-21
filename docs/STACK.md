# Стек и зависимости

## Сборка

| Пакет | Роль |
|-------|------|
| **Vite 8** | dev-сервер, бандл, code-splitting |
| **TypeScript** | типы, `tsc` перед `vite build` |
| **Tailwind CSS v4** + `@tailwindcss/vite` | утилиты и дизайн-токены через `@import "tailwindcss"` в `src/styles/tailwind.css` |

Продакшен-база: `VITE_BASE_PATH` или `/tochka-site-marketer-new/` (см. `vite.config.ts`).

## CSS (активные файлы)

Импорт только из `src/styles/index.css` → `src/main.ts`.

| Файл | Содержимое |
|------|------------|
| `tailwind.css` | `@theme`, компоненты (`btn-primary`, nav), фон страницы |
| `type.css` | `type-display`, `type-h2`, `type-lead` и т.д. |
| `widgets.css` | кейсы, collab, capability roadmap, block builder, scroll-top |
| `ux.css` | mobile order, 44px touch, roadmap breakpoints |

**Не подключать** (архив в `src/_legacy/` и корне `src/*.css`): старые темы Apple, `portfolio-final`, `cursor.css`, `compat.css` и др. — дублируют Tailwind и не попадают в бандл.

## JavaScript

### Точка входа

`main.ts` → `renderSite()` (разметка) → `initSite()` (поведение).

### Runtime-зависимости

| Пакет | Где | Зачем |
|-------|-----|--------|
| **lenis** | `lib/siteMotion.ts` | плавный скролл колёсиком; `lenis/dist/lenis.css` подгружается вместе с модулем |
| **motion** | `siteMotion.ts`, `blockBuilderAnim.ts` | `inView` + `animate` для reveal и hero builder |

Оба пакета **динамически импортируются**, если `prefers-reduced-motion: no-preference`. При `reduce` — нативный `scrollTo`, без Lenis/Motion в начальной загрузке.

Rollup вынесет чанки `motion` и `lenis` (`vite.config.ts` → `manualChunks`).

### Активные эффекты (`initSite.ts`)

- `lib/siteMotion.ts` — Lenis, якоря, reveal, счётчики метрик
- `effects/casePreview.ts` — превью кейсов
- `effects/blockBuilderAnim.ts` — анимация hero «page builder»
- `effects/scrollToTop.ts` — кнопка «наверх»

### Не подключены (см. `src/_legacy/README.md`)

`webglBg`, `caseModal`, `chatbot`, `theme`, `pipelineAutoplay` и др. — оставлены как черновики; не импортируются из `initSite.ts`.

## Рекомендации при доработке

1. Новые глобальные стили — в существующий слой (`widgets` / `ux`), не в корневые `*.css`.
2. Новые npm-пакеты — только при явной необходимости; тяжёлую анимацию — через dynamic `import()`.
3. `cases.ts`: не менять `href` кейсов без отдельного согласования.
