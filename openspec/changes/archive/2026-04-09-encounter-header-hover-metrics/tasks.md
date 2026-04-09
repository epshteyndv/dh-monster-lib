## 1. Header UX

- [x] 1.1 Replace always-visible difficulty/strength blocks in `App` header with a hover/focus summary attached to title `Энкаунтер`.
- [x] 1.2 Show three fixed rows for party sizes 3, 4, 5; each row includes `Сложность` (from existing formula) and `Сила группы`.

## 2. Remove obsolete settings path

- [x] 2.1 Remove settings drawer trigger and drawer component usage from header flow.
- [x] 2.2 Remove party-size editing state/store usage related to header (including persisted localStorage settings for this scenario) if no longer needed elsewhere.

## 3. Wiring and cleanup

- [x] 3.1 Keep encounter role derivation and formulas; compute metrics for 3/4/5 without introducing new persistent state.
- [x] 3.2 Remove unused imports/files/types created only for old settings-drawer approach.

## 4. Verify

- [x] 4.1 Run `npm run build`; manual check: hover on `Энкаунтер` shows rows 3/4/5; header has no inline metrics or party-size control; add/remove monsters updates values.
