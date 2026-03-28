## 1. Component extraction

- [x] 1.1 Add `src/components/AddMonsterModal.tsx` (or equivalent name) wrapping `Modal`, filters, scrollable list, and empty states; props: `opened`, `onClose`, `monsters`, `onPick(Monster)`.

## 2. Filters

- [x] 2.1 Derive tier/role option sets from `monsters` (unique, stable order e.g. sorted).
- [x] 2.2 Implement Mantine controls for multi-select tier and multi-select role; wire filter state with AND semantics and empty-selection = no constraint on that axis.
- [x] 2.3 Show a message when the filtered list is empty but the catalog is not.

## 3. App integration

- [x] 3.1 Replace inline modal markup in `App.tsx` with the new component; keep header button and `useDisclosure` (or move opened state if cleaner).

## 4. Verify

- [x] 4.1 Run `npm run build`; manually test: no filters = all monsters; tier only; role only; both; no matches message.
