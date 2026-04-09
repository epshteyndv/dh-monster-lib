## 1. Dependency and shell

- [x] 1.1 Add **`react-router-dom`** to dependencies (pin compatible major with React 18).
- [x] 1.2 Wrap the app entry (`main.tsx`) with **`RouterProvider`** or **`BrowserRouter`** and set **`basename`** from **`import.meta.env.BASE_URL`** (normalize trailing slash per chosen router API).

## 2. Route map and structure

- [x] 2.1 Introduce a small route configuration (for example `src/routes.tsx` or inline in `main.tsx`) with at least an index route mounting the encounter UI.
- [x] 2.2 Extract the encounter screen from monolithic **`App`** into a dedicated component (for example `EncounterPage`) if that reduces coupling; keep **`App`** as layout/router host only if preferable.

## 3. URL sync migration

- [x] 3.1 Refactor **`useEncounterUrlSync`** (or successor) to update encounter query params via **`useSearchParams`** / **`setSearchParams(..., { replace: true })`** (or **`navigate(..., { replace: true })`**) instead of raw **`history.replaceState`**, preserving semantics for **`enc`**, **`share`**, and length limits.
- [x] 3.2 Re-verify first-load hydration order (catalog loaded → one-shot **`share`**/**`enc`** apply → canonical URL) after router migration.

## 4. Verify

- [x] 4.1 Manual: open site at **`/`** and under a non-root **`base`** (local dev with `VITE_BASE_PATH` if applicable); confirm **`enc`** reload, **`share`** land-and-canonicalize, and encounter edits do not spam browser history.
- [x] 4.2 Run **`npm run build`**.
