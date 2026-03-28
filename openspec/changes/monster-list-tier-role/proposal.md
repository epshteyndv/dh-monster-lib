## Why

The catalog sidebar lists monsters by **name** only, while the detail card already shows **Tier {n} {role}**. Users browsing the list cannot see tier or role without opening each entry, which slows scanning and comparison.

## What Changes

- Each row in the monster **list** (left column) SHALL show the same tier phrase as the card header: **`Tier {tier} {role}`** (for example `Tier 1 Solo`), together with the monster name, in a readable layout (for example name as primary label and tier line as secondary text, or a single structured block inside the list control).

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `github-pages-monster-ui`: Extend list presentation requirements so each catalog entry in the list displays **`tier`** and **`role`** in the `Tier {tier} {role}` form, consistent with the card’s tier line.

## Impact

- `src/App.tsx` (list rendering only; no JSON or validation changes).
- Optional small extractable helper for the tier string to match `MonsterCard` wording (design decision).
