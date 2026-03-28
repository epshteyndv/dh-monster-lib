## 1. Types and state

- [x] 1.1 Add a type for encounter entries (e.g. `instanceId` + `Monster`) in `src/` (new file or next to `App`).

## 2. Layout and behavior

- [x] 2.1 Refactor `src/App.tsx`: replace single `selected` with `encounter` array and `focusedInstanceId`; catalog click appends an entry with a new unique `instanceId` (e.g. `crypto.randomUUID()`).
- [x] 2.2 Add an **Encounter** panel: ordered list of entries (name + tier line), row click sets focus, per-row remove control.
- [x] 2.3 Detail column: render `MonsterCard` for the focused entry; on append, focus the new entry; handle empty encounter and focus after remove.

## 3. Verify

- [x] 3.1 Run `npm run build`.
