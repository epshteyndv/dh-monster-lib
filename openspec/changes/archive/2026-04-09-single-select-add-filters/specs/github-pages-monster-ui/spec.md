## MODIFIED Requirements

### Requirement: Add overlay catalog filters

The add-to-encounter overlay (modal opened from the header control) SHALL provide filter controls for **tier** and **role** independently, but each filter SHALL allow selecting **at most one value at a time** (single-select). Tier and role options SHALL reflect the catalog’s structured fields (`tier` as integer, `role` as the catalog role enum). When no tier value is selected, tier SHALL NOT restrict the list; when no role value is selected, role SHALL NOT restrict the list. When both filters have selected values, a monster SHALL be shown only if it matches both selected values (logical AND between axes). Row presentation (name and tier line) SHALL remain consistent with **Monster list and detail view**.

#### Scenario: Single tier filter value

- **WHEN** the user selects one tier value and no role value
- **THEN** the overlay list SHALL show only monsters whose `tier` equals the selected tier.

#### Scenario: Single role filter value

- **WHEN** the user selects one role value and no tier value
- **THEN** the overlay list SHALL show only monsters whose `role` equals the selected role.

#### Scenario: Combined single-value filters

- **WHEN** the user selects one tier value and one role value
- **THEN** each listed monster SHALL match both selected values.

#### Scenario: Clear filter

- **WHEN** the user clears either filter
- **THEN** that axis SHALL return to "no restriction" behavior.

#### Scenario: No matching monsters

- **WHEN** the active selected values exclude every monster
- **THEN** the overlay SHALL show a clear empty state (for example a short message) instead of a blank list with no explanation.
