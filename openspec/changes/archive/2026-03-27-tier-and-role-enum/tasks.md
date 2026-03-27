## 1. Модель и данные

- [x] 1.1 Обновить `src/types.ts`: `tier: number`, `role` с union-типом из десяти строк или `string` + комментарий к enum.
- [x] 1.2 Обновить `data/monsters.yaml`: заменить `tierLevel`/`tierRole` на `tier`/`role`; значения `role` только из списка.

## 2. Валидация

- [x] 2.1 Обновить `scripts/validate-monster.mjs`: проверка `tier` (целое ≥ 1), `role` по allowlist; ошибки на `tierLevel`, `tierRole`, строковый устаревший `tier`.
- [x] 2.2 `npm run build` без ошибок.

## 3. UI

- [x] 3.1 Обновить `MonsterCard.tsx`: строка `Tier {tier} {role}`.

## 4. Документация

- [x] 4.1 Обновить `README.md`: поля `tier`, `role` и перечень допустимых ролей.
