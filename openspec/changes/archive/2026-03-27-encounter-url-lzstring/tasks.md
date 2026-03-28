## 1. Dependency

- [x] 1.1 Add `lz-string` to `package.json` dependencies and install (update lockfile).

## 2. Codec

- [x] 2.1 Replace manual Base64 URL-safe UTF-8 helpers in `encounterUrlCodec.ts` with LZString (`compressToEncodedURIComponent` / `decompressFromEncodedURIComponent`) around the JSON-serialized `EncounterUrlPayload`; bump `ENCOUNTER_URL_VERSION` (or equivalent) so the wire format is explicitly new.
- [x] 2.2 Adjust `MAX_ENCOUNTER_URL_PARAM_LENGTH` if needed after measuring typical compressed sizes; keep guard + `console.warn` when over limit.

## 3. Integration

- [x] 3.1 Ensure `useEncounterUrlSync` (or callers) still passes only the string through `URLSearchParams`/`replaceState`; no behavior change beyond codec.

## 4. Verify

- [x] 4.1 Run `npm run build`; smoke-test: add monsters, reload, copy URL; confirm old bookmarked Base64-only `enc` links are not expected to work.
