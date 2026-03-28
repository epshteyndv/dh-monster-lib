## 1. Codec

- [x] 1.1 Add `src/encounterUrlCodec.ts` (or similar): versioned JSON type `{ v: number; ids: string[] }`, `encodeEncounterPayload` / `decodeEncounterPayload` using **base64url** (TextEncoder + `btoa`/`atob` with URL-safe alphabet or `Buffer` not available in browser — use browser-safe base64url helpers).

## 2. Wire URL ↔ store

- [x] 2.1 After catalog load: if `enc` query param present, decode and replace encounter by mapping each id to `addMonster` (or a bulk `setEncounterFromIds` action to avoid N store updates) with validation against loaded `monsters`.
- [x] 2.2 On encounter change: encode current ordered ids, `history.replaceState` to update `?enc=...` preserving path and other params (respect Vite base).

## 3. Edge cases

- [x] 3.1 Skip unknown monster ids; avoid infinite loops between URL parse and replace; optional max length guard.

## 4. Verify

- [x] 4.1 Run `npm run build`; manually test reload, copy URL, open in new tab, empty encounter clears or omits param per chosen behavior.
