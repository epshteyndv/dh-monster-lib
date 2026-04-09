## 1. Codec and URL helpers

- [x] 1.1 Add a named constant for the **`share`** query parameter alongside **`enc`** (reuse existing encode/decode helpers, no duplicate algorithms).

## 2. Bootstrap: share → enc canonicalization

- [x] 2.1 Extend encounter URL sync (or add a focused effect) so that when **`share`** is present and valid after catalog load, encounter is hydrated and the URL is **`replaceState`**’d to drop **`share`** and set **`enc`** (or remove **`enc`** if encounter is empty).
- [x] 2.2 Define interaction when both **`share`** and **`enc`** exist on first load (document in code: prefer **`share`** for one-shot apply, then canonicalize).

## 3. UI: dedicated share control

- [x] 3.1 Add a header button (or equivalent) that builds a full share URL with correct **base path** and copies it (or exposes it in a copy-friendly way).
- [x] 3.2 Respect **`MAX_ENCOUNTER_URL_PARAM_LENGTH`** (warn or disable if exceeded, consistent with **`enc`** sync).

## 4. Verify

- [x] 4.1 Manual: open a `?share=...` link, confirm encounter loads and address bar shows **`enc`** without **`share`**.
- [x] 4.2 Run `npm run build`.
