## 1. Types and validation

- [x] 1.1 Update `src/types.ts`: optional `flavor`, `motives`; `experience` as `string[] | undefined`; `MonsterAttack.range` as a union of the five range literals; `MonsterFeature` use optional `value?: string` and remove `cost`.
- [x] 1.2 Update `scripts/validate-monster.mjs`: stop requiring `flavor`/`motives`/`experience` as strings; validate optional non-empty strings for `flavor`/`motives`; validate `experience` as optional array of non-empty strings; add `ATTACK_RANGES` set and validate `stats.attack.range`; reject `features[].cost` with migration message; validate optional `value` as non-empty string when set.

## 2. Sample data and docs

- [x] 2.1 Migrate `data/monsters.yaml`: `experience` to array form; `cost` → `value` as strings; confirm `range` values match the enum.
- [x] 2.2 Update `README.md` (and any contributor notes) for optional fields, experience array, attack range labels, and `value` instead of `cost`.

## 3. UI

- [x] 3.1 Update `src/components/MonsterCard.tsx`: render flavor and motives only when present; render experience as a list when `experience?.length`; use `value` for parenthetical display instead of `cost`; omit empty Experience section.

## 4. Verify

- [x] 4.1 Run `npm run build` and fix any type or catalog errors.
