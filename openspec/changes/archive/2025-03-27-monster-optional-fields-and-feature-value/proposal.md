## Why

Monster YAML today requires every narrative field (`flavor`, `motives`, `experience`) and treats `experience` as a single string. Contributors often want minimal stubs or to omit flavor; `experience` fits better as an optional list of lines (senses, traits). Attack range and feature costs also need tighter, UI-friendly shapes: enumerated ranges and string **values** (e.g. dice expressions) instead of numeric-only `cost`.

## What Changes

- **`flavor`**, **`motives`**: optional strings when present (non-empty when set); monsters MAY omit these keys entirely.
- **`experience`**: optional **collection** (array of non-empty strings). Omitted or empty array means no experience lines on the card.
- **`stats.attack.range`**: MUST be exactly one of: `Melee`, `Very Close`, `Close`, `Far`, `Very Far` (enum validation at build time).
- **`features`**: rename **`cost`** → **`value`**; **`value`** is optional; when set it MUST be a non-empty **string** (e.g. `"3"`, `"1d6+3"`) for display in parentheses after the feature name. **BREAKING** for existing YAML that uses `cost` as a number — migrate to `value` as string.

## Capabilities

### New Capabilities

_(none — behavior extends existing catalog + UI capabilities.)_

### Modified Capabilities

- `monster-yaml-data`: Update Daggerheart card field requirements for optional `flavor` / `motives`, optional `experience` array, attack `range` enum, feature `value` string (replacing `cost`).
- `github-pages-monster-ui`: Card layout: hide or soften sections when optional fields absent; render `experience` as a list; show feature `value` in parentheses; attack line uses enumerated range labels.

## Impact

- `data/monsters.yaml` and any future YAML: migrate `cost` → `value` (strings); split string `experience` into array items where applicable; ensure `range` uses enum labels.
- `scripts/validate-monster.mjs`, `scripts/build-catalog.mjs` if needed.
- `src/types.ts`, `src/components/MonsterCard.tsx` (and any feature heading logic).
- `README.md` contributor docs.
- Published `monsters.json` shape changes for consumers (`cost` → `value`, `experience` type).
