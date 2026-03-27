## ADDED Requirements

### Requirement: Monster card layout

When displaying a selected monster, the application SHALL present content in a card-oriented layout that reflects the Daggerheart-style sections: title and tier, flavor text (visually distinct from body text), motives line, a grouped **stats** region showing difficulty, thresholds, HP, stress, and the primary attack line (ATK, attack name and range, damage), then the **Experience** line, then a **Features** section listing each feature with its name, optional cost, type (Passive / Action / Reaction), and description.

#### Scenario: Stats region readable

- **WHEN** catalog data includes `stats` and `stats.attack`
- **THEN** the UI MUST show difficulty, thresholds, HP, stress, and the attack fields in a single scannable block (for example one or two rows with clear separators), not as an unordered flat key list.

#### Scenario: Features show type and body

- **WHEN** the monster has `features`
- **THEN** each feature MUST display the feature `name`, optional `cost`, human-readable type derived from `type`, and the full `description` text.

### Requirement: Loading and error behavior unchanged for new schema

Existing requirements for loading JSON and showing errors SHALL remain; if validation errors occur only at build time, the runtime error state applies to missing or corrupt JSON as before.

#### Scenario: Deployed JSON valid

- **WHEN** the user opens the site and `monsters.json` loads
- **THEN** each monster entry MUST render using the card layout requirement without requiring raw JSON key iteration as the primary display mode.
