## Why

Сейчас тир и роль объединены в одну строку **`tier`** (например `Tier 1 Solo`), что мешает **фильтрации и поиску** по числовому уровню и по роли отдельно. Нужны два независимых поля в данных и в JSON каталога, чтобы позже строить запросы вида «все tierLevel = 1» или «tierRole = Solo» без парсинга строки.

## What Changes

- Удалить **`tier`** строкой; ввести **`tierLevel`** (число, например `1`) и **`tierRole`** (строка, например `Solo`).
- Обновить **валидацию** сборки (`validate-monster`) и **TypeScript-типы** `Monster`.
- Обновить **данные** в `data/monsters.yaml` и **README**.
- В UI карточки монстра отображать тир как **`Tier {tierLevel} {tierRole}`** (или эквивалентно читаемо), сохраняя вид примера карточки.

**BREAKING:** существующие YAML с полем `tier` перестанут проходить валидацию без миграции.

## Capabilities

### New Capabilities

- *(нет.)*

### Modified Capabilities

- `monster-yaml-data`: Требования к полям карточки — замена `tier` на `tierLevel` + `tierRole`.
- `github-pages-monster-ui`: Требование к карточке — отображение тира из двух полей.

## Impact

- `data/monsters.yaml`, `scripts/validate-monster.mjs`, `src/types.ts`, `src/components/MonsterCard.tsx`, `README.md`.
