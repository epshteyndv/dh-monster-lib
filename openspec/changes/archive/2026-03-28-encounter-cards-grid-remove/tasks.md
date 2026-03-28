## 1. State: drop focus

- [x] 1.1 Remove `focusedId` and `FOCUS` action from `encounterState.ts` and `encounterStore.ts`; keep `addMonster` / `removeEntry` semantics.

## 2. MonsterCard

- [x] 2.1 Add optional `onRemoveFromEncounter?: () => void` (or equivalent) and render a header-row remove control on the right when set; keep accessible label.

## 3. App layout

- [x] 3.1 Replace the encounter list column + single detail column with a main `Stack` (or grid) mapping `encounter` to `MonsterCard` with `onRemoveFromEncounter` wired to `removeEntry(instanceId)`; empty-state copy when `encounter.length === 0`.

## 4. Verify

- [x] 4.1 Run `npm run build` and smoke-test add, duplicate entries, remove from card header.
