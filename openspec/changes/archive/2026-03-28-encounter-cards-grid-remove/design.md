## Context

Сейчас энкаунтер — колонка со строками (имя + tier); справа одна `MonsterCard` по `focusedId`. Удаление — `CloseButton` в строке списка.

## Goals / Non-Goals

**Goals:**

- Основной контент: `Stack` или `SimpleGrid` с `encounter.map` → для каждой записи `<MonsterCard key={instanceId} monster={...} onRemove={() => removeEntry(instanceId)} />` (или эквивалент).
- **Заголовок карточки:** `Group justify="space-between" align="flex-start" wrap="nowrap"`: слева имя (как сейчас), справа **ActionIcon** / **CloseButton** / кнопка «Убрать» с `aria-label`.
- Пустой энкаунтер: короткий текст-плейсхолдер под шапкой (без второй колонки).

**Non-Goals:**

- Изменение модалки добавления и каталога в Zustand.
- Печать / экспорт.

## Decisions

1. **Удалить `focusedId`** из `EncounterState` и из `encounterReducer` (нет FOCUS-действия). `encounterStore` экспортирует только `encounter`, `addMonster`, `removeEntry`. Rationale: меньше мёртвого состояния.

2. **API `MonsterCard`:** опциональный колбэк `onRemoveFromEncounter?: () => void` — при наличии рендерить кнопку в шапке. Без колбэка — как сейчас (для возможного переиспользования без энкаунтера).

3. **Сетка:** на широком экране можно `SimpleGrid` cols={{ base: 1, sm: 2 }} — по желанию в задаче; минимум — вертикальный `Stack gap="lg"`.

## Risks / Trade-offs

- **[Risk]** Длинная страница при многих монстрах — **Mitigation:** норма для encounter builder; прокрутка страницы.

## Migration Plan

Рефакторинг UI и стора; `npm run build`; ручная проверка добавить / несколько карт / удалить.

## Open Questions

- Нет.
