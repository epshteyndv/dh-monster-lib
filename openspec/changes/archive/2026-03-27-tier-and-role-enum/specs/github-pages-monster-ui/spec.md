## MODIFIED Requirements

### Requirement: Monster card layout

When displaying a selected monster, the application SHALL present content in a card-oriented layout that reflects the Daggerheart-style sections: title; a **tier line** formed from integer **`tier`** and enumerated **`role`** (MUST be readable as a single phrase, for example **Tier 1 Solo** via `tier: 1` and `role: Solo`); flavor text (visually distinct from body text); motives line; a grouped **stats** region showing difficulty, thresholds, HP, stress, and the primary attack line (ATK, attack name and range, damage); then the **Experience** line; then a **Features** section listing each feature with its name, optional cost, type (Passive / Action / Reaction), and description.

#### Scenario: Tier line from structured fields

- **WHEN** the monster has `tier` and `role`
- **THEN** the UI MUST show a tier line that incorporates both values (for example `Tier {tier} {role}`) and MUST NOT require legacy keys `tierLevel`, `tierRole`, or a single combined string for tier and role.

#### Scenario: Stats region readable

- **WHEN** catalog data includes `stats` and `stats.attack`
- **THEN** the UI MUST show difficulty, thresholds, HP, stress, and the attack fields in a single scannable block (for example one or two rows with clear separators), not as an unordered flat key list.

#### Scenario: Features show type and body

- **WHEN** the monster has `features`
- **THEN** each feature MUST display the feature `name`, optional `cost`, human-readable type derived from `type`, and the full `description` text.
