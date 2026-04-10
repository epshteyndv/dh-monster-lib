## Why

Постоянная сериализация состояния энкаунтера в URL усложняет логику роутинга и синхронизации search-параметров, особенно после перехода на React Router. Для обычного пользовательского сценария удобнее хранить «текущее рабочее состояние» локально в браузере, а URL использовать только для явного шаринга.

## What Changes

- **BREAKING (behavioral):** прекратить автосохранение текущего энкаунтера в `enc` query-параметр при обычном редактировании.
- Ввести постоянное сохранение/восстановление текущего энкаунтера через `localStorage` (по id монстров, с сохранением порядка и дублей).
- Оставить отдельный flow `share` для передачи состояния по ссылке: открытие `share`-ссылки создаёт энкаунтер в приложении и далее канонизирует URL на «основную страницу» без `share`.
- Обновить требования, где сейчас зафиксированы `enc`-ориентированные правила, на `localStorage`-ориентированное поведение для текущей сессии пользователя.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `github-pages-monster-ui`: заменить источник «текущего состояния» с URL на `localStorage`, обновить share-редирект и убрать обязательность URL-апдейтов на каждое изменение.
- `client-state`: заменить URL-ориентированный codec requirement на typed localStorage persistence requirement для encounter state.

## Impact

- `src/useEncounterUrlSync.ts` (или его замена), `src/stores/encounterStore.ts`, возможно новый persistence helper/hook.
- `src/EncounterPage.tsx` и share-кнопка/обработка `share`-параметра.
- OpenSpec: `openspec/specs/github-pages-monster-ui/spec.md` и `openspec/specs/client-state/spec.md`.
