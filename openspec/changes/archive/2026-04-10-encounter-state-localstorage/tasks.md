## 1. Persistence switch from URL to localStorage

- [x] 1.1 Add/adjust a typed persistence helper for encounter localStorage read/write (ordered ids, duplicates, graceful fallback on storage errors).
- [x] 1.2 Update encounter bootstrap logic to load initial state from localStorage when no valid `share` import is applied.
- [x] 1.3 Update encounter change sync to persist to localStorage and stop per-edit `enc` query rewrites.

## 2. Share flow alignment

- [x] 2.1 Keep `share` decode/import flow and canonical URL cleanup, but route post-import state into localStorage as active working state.
- [x] 2.2 Ensure invalid `share` values do not crash and are cleaned from URL with replace semantics where practical.

## 3. Verification

- [x] 3.1 Manual: edit encounter, reload page, verify state restores from localStorage with no required `enc` param updates.
- [x] 3.2 Manual: open valid `share` link, verify encounter imports, URL cleans from `share`, and subsequent reload restores imported state from localStorage.
- [x] 3.3 Run `npm run build`.
