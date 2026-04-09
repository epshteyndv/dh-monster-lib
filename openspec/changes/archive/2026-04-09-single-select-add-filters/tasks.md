## 1. Filter controls

- [x] 1.1 In `AddMonsterModal`, replace `MultiSelect` controls for `tier` and `role` with single-select controls.
- [x] 1.2 Update filter state from arrays to single values (`string | null`) and keep clearable behavior.

## 2. Filter logic

- [x] 2.1 Update predicate logic for single-value matching per axis; keep AND semantics between tier and role.
- [x] 2.2 Keep/verify empty-match message behavior.

## 3. Verify

- [x] 3.1 Run `npm run build`; manually test: select one tier, one role, both, and clear each filter.
