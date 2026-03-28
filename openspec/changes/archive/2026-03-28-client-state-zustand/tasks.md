## 1. Dependency

- [x] 1.1 Add `zustand` to `package.json` dependencies and run `npm install` (update lockfile).

## 2. Stores

- [x] 2.1 Create a Zustand store for catalog loading (`monsters`, `loading`, `error`, async load action using existing `loadCatalog`).
- [x] 2.2 Create a Zustand store for encounter state; reuse `encounterReducer` from `encounterState.ts` inside store actions to preserve ADD / REMOVE / FOCUS semantics.

## 3. App integration

- [x] 3.1 Refactor `src/App.tsx` to use the new stores (remove `useReducer` and local catalog `useState` for those concerns); keep presentation structure (Grid, panels) aligned with current UI.

## 4. Verify

- [x] 4.1 Run `npm run build` and smoke-test add/remove/focus/duplicate encounter flows.
