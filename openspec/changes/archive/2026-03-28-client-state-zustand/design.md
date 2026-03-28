## Context

`App.tsx` использует `useState` для `loading`, `error`, `monsters` и `useReducer(encounterReducer, …)` из `encounterState.ts`. Редьюсер уже инкапсулирует переходы ADD / REMOVE / FOCUS.

## Goals / Non-Goals

**Goals:**

- Один или два **Zustand**-стора с явными действиями (`addToEncounter`, `removeEncounterEntry`, `focusEncounterEntry`, загрузка каталога).
- Сохранить семантику `encounterReducer` (можно вызывать ту же чистую функцию внутри `set`, либо перенести тело в `immer`-совместимый стиль — предпочтительно без `immer`, чтобы не тянуть лишнюю зависимость).
- Типизированные селекторы; компоненты подписываются на нужные срезы, чтобы лишний раз не ререндерить всё приложение.

**Non-Goals:**

- Persist в `localStorage`/URL, middleware devtools (можно упомянуть как follow-up).
- Изменение спеки UI-флоу энкаунтера.

## Decisions

1. **Два стора** — `useCatalogStore` (monsters, loading, error, `fetchCatalog`) и `useEncounterStore` (encounter, focusedId, действия). Рationale: разделение ответственности; меньше конфликтов при будущих фичах.

2. **Повторное использование `encounterReducer`** — действия стора вызывают `set((s) => ({ ...s, ...encounterReducer(s, action) }))` для энкаунтера или оборачивают текущий state в объект, совместимый с `EncounterState`. Рationale: без дублирования логики фокуса при удалении.

3. **Асинхронная загрузка** — `fetchCatalog` внутри catalog store: `set` loading/error/monsters по завершении `loadCatalog()` из `./catalog`. Rationale: убирает размазанный `useEffect` из `App` или оставляет тонкий `useEffect` только на один вызов при mount.

## Risks / Trade-offs

- **[Risk]** Лишние ререндеры при широких селекторах — **Mitigation:** узкие селекторы или отдельные поля в подписке.

## Migration Plan

Добавить `zustand`, внедрить сторы, удалить локальный reducer из `App`, прогнать `npm run build` и ручной смоук-тест UI.

## Open Questions

- Нет.
