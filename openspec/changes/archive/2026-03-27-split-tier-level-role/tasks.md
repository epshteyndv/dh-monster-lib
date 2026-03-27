## 1. Модель и данные

- [x] 1.1 Обновить `src/types.ts`: заменить `tier` на `tierLevel: number` и `tierRole: string`.
- [x] 1.2 Обновить `data/monsters.yaml`: для каждого монстра задать `tierLevel` и `tierRole` вместо `tier`.

## 2. Валидация

- [x] 2.1 Обновить `scripts/validate-monster.mjs`: проверка `tierLevel` (целое ≥ 1), `tierRole` (непустая строка); отклонять устаревший ключ `tier`, если встретится.
- [x] 2.2 Прогнать `npm run build` и убедиться, что каталог собирается.

## 3. UI

- [x] 3.1 Обновить `MonsterCard.tsx`: строка тира вида `Tier {tierLevel} {tierRole}`.
- [x] 3.2 При необходимости скорректировать список слева (подписи без изменения логики выбора).

## 4. Документация

- [x] 4.1 Обновить `README.md`: описание полей `tierLevel` и `tierRole` вместо `tier`.
