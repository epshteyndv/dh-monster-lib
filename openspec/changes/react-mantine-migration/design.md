## Context

Проект: Vite 6, TypeScript, каталог монстров из JSON, GitHub Pages. Сейчас UI в `src/main.ts` без фреймворка. Нужна миграция на **React + TypeScript** и **Mantine v7** (актуальная мажорная линия с CSS-модулями и `MantineProvider`).

## Goals / Non-Goals

**Goals:**

- Единая точка входа: `main.tsx` → `createRoot` → `MantineProvider` → корневой layout.
- Список и карточка монстра на компонентах Mantine (например `AppShell`, `List`, `Paper`, `Alert`, `Loader`).
- Сохранить текущий контракт данных: `fetch` к `monsters.json` относительно `import.meta.env.BASE_URL`, те же сценарии ошибок.

**Non-Goals:**

- Маршрутизация (react-router) — не требуется без новых страниц.
- SSR, RSC, Next.js.
- Тёмная тема и кастомизация темы сверх базового `MantineProvider` (можно дефолтную тему).

## Decisions

| Решение | Выбор | Rationale |
|--------|--------|-----------|
| Плагин Vite | `@vitejs/plugin-react` | Стандарт для React + Vite, быстрый HMR |
| Версия Mantine | v7.x | Текущая линия; требует `@mantine/core` + `@mantine/hooks` при необходимости; стили через импорт CSS |
| Стили | Импорт `@mantine/core/styles.css` в entry | Официальный путь Mantine 7 |
| Состояние | `useState` + `useEffect` для загрузки каталога | Достаточно без Redux для одного списка |

## Risks / Trade-offs

- **[Risk]** Рост размера бандла. **→** Tree-shaking Mantine, импорт только используемых компонентов.
- **[Trade-off]** Удаление прежнего `style.css` — визуал сменится на Mantine; приемлемо по запросу.

## Migration Plan

1. Добавить зависимости и `plugin-react`, настроить `tsconfig` для JSX.
2. Заменить entry и перенести логику загрузки в `App` + хуки.
3. Удалить неиспользуемый vanilla-код и старые стили.
4. `npm run build` и ручная проверка с `VITE_BASE_PATH`.

## Open Questions

- Точное имя пакетов Mantine (только `@mantine/core` или ещё `@mantine/hooks`) — зафиксировать в задачах по факту использования.
