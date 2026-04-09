## 1. Group duplicate encounter entries for UI

- [x] 1.1 In `App`, group encounter entries by catalog monster `id` while preserving per-instance identity for remove actions.
- [x] 1.2 Update encounter rendering to show one full card per monster group instead of one full card per entry.

## 2. Per-instance sections and removal

- [x] 2.1 Extend `MonsterCard` to render multiple per-instance sections (name + remove button), one for each grouped entry.
- [x] 2.2 Wire each section remove button to delete only the corresponding encounter instance.

## 3. Verify behavior

- [ ] 3.1 Validate manually: add same monster multiple times, ensure one shared card with multiple sections and correct single-instance removal behavior.
- [x] 3.2 Run `npm run build` to ensure typecheck and production build remain green.
