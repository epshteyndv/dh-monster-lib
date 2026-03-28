## 1. Shared tier label

- [x] 1.1 Add `formatMonsterTierLine` (or equivalent) in `src/` that returns `` `Tier ${tier} ${role}` `` for `Pick<Monster, "tier" | "role">`.

## 2. UI

- [x] 2.1 Update `src/App.tsx` list `Button` content to show monster name and tier line (Mantine `Stack` / `Text`), using the shared helper for the tier line.
- [x] 2.2 Update `src/components/MonsterCard.tsx` to use the same helper for the tier line under the title.

## 3. Verify

- [x] 3.1 Run `npm run build`.
