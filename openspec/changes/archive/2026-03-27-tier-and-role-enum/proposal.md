## Why

Имена **`tierLevel`** и **`tierRole`** длиннее, чем нужно для стабильного API. Короткие поля **`tier`** (число) и **`role`** (строка) проще читать в YAML и в коде. Ограничение **`role`** фиксированным списком значений снижает опечатки и готовит каталог к фильтрации по известным ролям.

## What Changes

- Переименовать **`tierLevel` → `tier`** (по смыслу прежний целочисленный уровень, ≥ 1).
- Переименовать **`tierRole` → `role`**.
- Ввести **enum** для `role`: `Bruiser`, `Horde`, `Leader`, `Minion`, `Ranged`, `Skulk`, `Social`, `Solo`, `Standard`, `Support` (ровно эти строки; регистр как в списке или нормализовать в валидаторе — зафиксировать в design/tasks).
- Обновить **валидацию**, **типы**, **YAML**, **UI** (строка карточки вида `Tier {tier} {role}`), **README**.

**BREAKING** для текущих записей с `tierLevel`/`tierRole`.

## Capabilities

### New Capabilities

- *(нет.)*

### Modified Capabilities

- `monster-yaml-data`: Поля карточки и правила валидации `tier`, `role` с enum.
- `github-pages-monster-ui`: Отображение тира из полей `tier` и `role`.

## Impact

- `data/monsters.yaml`, `scripts/validate-monster.mjs`, `src/types.ts`, `src/components/MonsterCard.tsx`, `README.md`.
