## 1. Header and modal

- [x] 1.1 Add a page header row (`Group` / `Title` + button) with copy that opens the add overlay (e.g. «Добавить в энкаунтер»).

## 2. Overlay list

- [x] 2.1 Implement Mantine `Modal` (or `Drawer`) listing all catalog monsters with name + tier line; on row action, call `addMonster` and close the overlay.

## 3. Layout cleanup

- [x] 3.1 Remove the permanent left «Список» column from the main grid; adjust column spans for encounter + card only.

## 4. Verify

- [x] 4.1 Run `npm run build` and manually verify open → pick monster → overlay closes and encounter updates.
