## 1. Pure math

- [x] 1.1 Add `src/encounterDifficulty.ts` (or similar) with `computeEncounterDifficulty(roles: MonsterRole[], partySize: number): number` and `computePartyStrength(partySize: number): number` implementing the spec rules (empty encounter → 0; Minion groups via `floor`; Solo bonus; penalty when non-empty and no Bruiser/Horde/Leader/Solo).

## 2. Client state

- [x] 2.1 Add `partySize` (number, default e.g. 4, min 1, max chosen in design) to Zustand — extend `encounterStore` or add `uiStore` / `partyStore`; expose `setPartySize`.

## 3. Header UI

- [x] 3.1 Add header sub-row or extend the existing `Group` in `App.tsx` (or extract `PageHeader`) to show encounter difficulty, party strength `(3*n+2)`, and a Mantine control (`NumberInput` / `Select`) for party size; wire to encounter + party size.

## 4. Verify

- [x] 4.1 Run `npm run build`; manually spot-check: empty encounter → 0; known role mixes; two Solos → +10+2; penalty line; Minion count vs party size.
