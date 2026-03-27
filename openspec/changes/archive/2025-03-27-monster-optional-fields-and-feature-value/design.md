## Context

The catalog validator (`scripts/validate-monster.mjs`) currently requires `flavor`, `motives`, and `experience` as non-empty strings, accepts any non-empty `stats.attack.range` string, and allows optional numeric `features[].cost`. Types in `src/types.ts` and `MonsterCard` assume the same. Contributors want leaner records and dice-like feature costs expressed as strings.

## Goals / Non-Goals

**Goals:**

- Treat `flavor` and `motives` as optional top-level fields; when present they MUST be non-empty trimmed strings.
- Represent `experience` as an optional array of non-empty strings (lines); omit the key or use an empty array when there is nothing to show.
- Restrict `stats.attack.range` to five fixed labels matching Daggerheart range bands.
- Replace `features[].cost` with `features[].value` (optional non-empty string), displayed verbatim in the UI (e.g. `"3"`, `"1d6+3"`).
- Fail validation on legacy `cost` with a migration message (parallel to deprecated `tierLevel` / `tierRole`).

**Non-Goals:**

- Changing tier/role, stats shape beyond `attack.range`, or feature `type` / `description` rules.
- Runtime schema migration in the browser (build-time validation remains the source of truth).

## Decisions

1. **`experience` as JSON array** — Use YAML sequences / JSON arrays of strings. Single-line legacy content migrates to one-element arrays (e.g. `experience: Tremor Sense +2` → `- Tremor Sense +2` or `[ "Tremor Sense +2" ]` after build). Rationale: matches “collection” and supports multiple senses without newline parsing.

2. **Enum set for `range`** — Exact strings: `Melee`, `Very Close`, `Close`, `Far`, `Very Far` (title case and spacing as listed). Rationale: matches user request and existing sample data (`Very Close`, `Close`).

3. **`value` type** — Always string when present; no numeric `cost` going forward. Rationale: supports dice expressions and keeps YAML unambiguous.

4. **Backward compatibility** — Reject `cost` at validation with explicit error to rename to `value` (string). Rationale: clear **BREAKING** migration path without silent coercion.

## Risks / Trade-offs

- **[Risk]** Existing forks or external YAML still using `cost` — **Mitigation:** Document in README and validation error text.
- **[Risk]** Empty card sections if everything optional — **Mitigation:** UI omits flavor / motives / experience blocks when absent; tier + stats remain required for a minimal card.

## Migration Plan

1. Update `data/monsters.yaml`: `cost: 3` → `value: "3"`; `experience: "..."` → `experience: [ "..." ]` or list form.
2. Confirm `range` values match enum (already true for sample data).
3. Run `npm run build`; deploy as usual. Rollback: revert commit and restore previous YAML/JSON.

## Open Questions

- None for this scope; if later we need localized range labels, add a separate change.
