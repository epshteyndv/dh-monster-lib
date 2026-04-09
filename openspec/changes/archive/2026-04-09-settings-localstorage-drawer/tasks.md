## 1. Settings state

- [x] 1.1 Add a typed settings store (or persisted slice) with `partySize` and `setPartySize`, backed by Zustand `persist` to `localStorage`.
- [x] 1.2 Validate/clamp persisted `partySize` on read and write; keep existing difficulty formulas consuming this source of truth.

## 2. Settings drawer UI

- [x] 2.1 Add a left `Drawer` component for settings (for example `SettingsDrawer.tsx`) with party size control.
- [x] 2.2 Add a header control to open/close the settings drawer.

## 3. Header cleanup

- [x] 3.1 Remove inline party size editor from header; keep encounter difficulty and party strength display in header.
- [x] 3.2 Wire drawer edits to immediate header metric updates.

## 4. Verify

- [x] 4.1 Run `npm run build`; manual checks: change party size in drawer, reload page, value restored from `localStorage`, metrics remain correct.
