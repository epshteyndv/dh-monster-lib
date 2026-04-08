## 1. Build script

- [x] 1.1 Update `scripts/build-catalog.mjs` to enumerate `*.yaml` in `data/monsters/` (top-level only), parse each file’s top-level `monsters` array, merge into one list in deterministic filename order, then run existing validation and write `public/monsters.json` as today.
- [x] 1.2 If no `.yaml` files exist in `data/monsters/` (or merge yields no monsters), fail the script with a clear error (or match project preference documented in design).

## 2. Data migration

- [x] 2.1 Move any monsters still only in `data/monsters.yaml` into a new or existing file under `data/monsters/` (same `monsters:` array shape); resolve duplicate `id` with `book-tier1.yaml` if needed.
- [x] 2.2 Remove `data/monsters.yaml` from the repo (or replace with a stub that points contributors to `data/monsters/`) so the single source of truth is the directory.

## 3. Docs

- [x] 3.1 Update `README.md` (and any contributor notes) to describe `data/monsters/*.yaml` as the source, not root `data/monsters.yaml`.

## 4. Verify

- [x] 4.1 Run `npm run build` and confirm `monsters.json` contains the merged catalog; spot-check duplicate-id error if two files share an `id`.
