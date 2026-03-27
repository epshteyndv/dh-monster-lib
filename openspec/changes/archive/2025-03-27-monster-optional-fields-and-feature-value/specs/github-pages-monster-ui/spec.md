## MODIFIED Requirements

### Requirement: Monster card layout

When displaying a selected monster, the application SHALL present content in a card-oriented layout that reflects the Daggerheart-style sections: title; a **tier line** formed from integer **`tier`** and enumerated **`role`** (MUST be readable as a single phrase, for example **Tier 1 Solo** via `tier: 1` and `role: Solo`); optional **flavor** text when present (visually distinct from body text); optional **motives** line when `motives` is present; a grouped **stats** region showing difficulty, thresholds, HP, stress, and the primary attack line (ATK, attack name and **range** label, damage), where **range** is one of the catalog-validated labels (`Melee`, `Very Close`, `Close`, `Far`, `Very Far`); optional **Experience** section when the monster has one or more experience lines (render the collection as a list or equivalent readable block); then a **Features** section listing each feature with its name, optional **value** (string shown in parentheses when present), type (Passive / Action / Reaction), and description.

#### Scenario: Tier line from structured fields

- **WHEN** the monster has `tier` and `role`
- **THEN** the UI MUST show a tier line that incorporates both values (for example `Tier {tier} {role}`) and MUST NOT require legacy keys `tierLevel`, `tierRole`, or a single combined string for tier and role.

#### Scenario: Stats region readable

- **WHEN** catalog data includes `stats` and `stats.attack`
- **THEN** the UI MUST show difficulty, thresholds, HP, stress, and the attack fields in a single scannable block (for example one or two rows with clear separators), not as an unordered flat key list.

#### Scenario: Optional narrative fields

- **WHEN** `flavor`, `motives`, or `experience` is absent or `experience` is an empty array
- **THEN** the UI MUST NOT show an empty placeholder section for that content; optional sections SHALL be omitted or omitted for empty collections as appropriate.

#### Scenario: Experience collection

- **WHEN** `experience` is a non-empty array of strings
- **THEN** the UI MUST show each entry as part of the Experience presentation (for example a bulleted list or stacked lines).

#### Scenario: Features show type and body

- **WHEN** the monster has `features`
- **THEN** each feature MUST display the feature `name`, optional string `value` in parentheses when present, human-readable type derived from `type`, and the full `description` text.
