## Context

Каталог уже использует Daggerheart-модель; поле `tier` — одна строка. Нужна нормализация для индексации и будущих фильтров на клиенте или внешних системах.

## Goals / Non-Goals

**Goals:**

- `tierLevel`: целое число ≥ 1.
- `tierRole`: непустая строка (например `Solo`, `Horde`, `Double` — без жёсткого enum в первой версии).
- Сборка и JSON содержат оба поля как отдельные ключи верхнего уровня монстра.

**Non-Goals:**

- Поиск/фильтры в UI в этой итерации (только подготовка данных).
- Обратная совместимость со старым ключом `tier` (миграция примеров вручную).

## Decisions

| Решение | Выбор | Rationale |
|--------|--------|-----------|
| Имена полей | `tierLevel`, `tierRole` | Явно, без конфликта с прежним `tier` |
| Тип `tierLevel` | integer (YAML number) | Прямое сравнение в коде |
| Отображение | `Tier ${tierLevel} ${tierRole}` | Сохраняет привычный текст «Tier 1 Solo» |

## Risks / Trade-offs

- **[Risk]** Забытые записи со старым `tier`. **→** Валидация с явной ошибкой «unknown or missing tierLevel/tierRole».

## Migration Plan

1. Заменить в YAML `tier` на `tierLevel` + `tierRole`.
2. Обновить валидатор и типы.
3. Обновить `MonsterCard`.
4. `npm run build`.

## Open Questions

- Нужен ли enum для `tierRole` позже — вынести в отдельный change при появлении списка допустимых значений.
