## ADDED Requirements

### Requirement: Add overlay catalog filters

The add-to-encounter overlay (modal opened from the header control) SHALL provide **filter controls** for **tier** and **role** independently. The user SHALL be able to select **zero or more** tier values and **zero or more** role values. Tier and role options SHALL reflect the catalog’s structured fields (`tier` as integer, `role` as the catalog role enum). When **no** tier value is selected in the tier filter, the tier SHALL NOT restrict which monsters are listed; when **no** role value is selected in the role filter, the role SHALL NOT restrict the list. When one or more tier values are selected, a monster SHALL be listed only if its `tier` equals one of the selected tier values; when one or more role values are selected, a monster SHALL be listed only if its `role` equals one of the selected role values. When both filters have selections, a monster SHALL be shown only if it satisfies **both** the tier and role constraints (logical AND between the two axes). Row presentation (name and tier line) SHALL remain consistent with **Monster list and detail view**.

#### Scenario: Filter by tier only

- **WHEN** the user selects one or more tier values and selects no role filter values
- **THEN** the overlay list SHALL show only monsters whose `tier` is among the selected tiers (and SHALL show every such monster from the loaded catalog).

#### Scenario: Filter by role only

- **WHEN** the user selects one or more role values and selects no tier filter values
- **THEN** the overlay list SHALL show only monsters whose `role` is among the selected roles.

#### Scenario: Combined tier and role filters

- **WHEN** the user selects at least one tier and at least one role
- **THEN** each listed monster SHALL match both a selected tier and a selected role.

#### Scenario: No filters

- **WHEN** the user has not selected any tier filter value and has not selected any role filter value
- **THEN** the overlay SHALL list all catalog monsters (subject to the same empty-catalog messaging as before).

#### Scenario: No matching monsters

- **WHEN** the active filters exclude every monster
- **THEN** the overlay SHALL show a clear empty state (for example a short message) instead of a blank list with no explanation.

## MODIFIED Requirements

### Requirement: Monster list and detail view

The application MUST make the full catalog of monsters available for **adding to the encounter** through a **dedicated control in the page header** (for example a button next to the page title). Activating that control MUST open a **dismissible overlay** (for example a modal) that lists catalog monsters available for selection. The overlay MUST implement **Add overlay catalog filters** so the user MAY narrow the list by tier and role as specified there. Each row in the filtered list MUST show the monster **name** and a **tier line** readable as **`Tier {tier} {role}`**. **When** the user selects a monster in that overlay list, the application MUST append a new encounter entry for that monster (without removing prior entries) and MUST **close** the overlay. The main layout MUST show each encounter entry as a full **Monster card** on the main page surface in encounter order so that monster fields are readable on each card (at minimum `id` and `name`, plus additional fields on the card); see **Encounter cards and removal**. The application MUST NOT rely on a permanent sidebar catalog whose primary action is click-to-add to the encounter.

#### Scenario: Open add overlay from header

- **WHEN** the catalog JSON has loaded and the user activates the header add-to-encounter control
- **THEN** the UI MUST show an overlay containing the monster list and tier/role filter controls.

#### Scenario: List entry shows tier and role in overlay

- **WHEN** the add overlay is visible
- **THEN** each monster row MUST display **`Tier {tier} {role}`** with the same structured `tier` and `role` as the card, and MUST NOT rely on legacy combined tier strings.

#### Scenario: Select monster adds and closes overlay

- **WHEN** the user selects a monster in the add overlay list
- **THEN** the application MUST append a new encounter entry for that monster and MUST close the overlay.

#### Scenario: Browse catalog for adding

- **WHEN** the user needs to add monsters to the encounter
- **THEN** they MUST be able to do so via the header-driven overlay list (not only via an always-visible sidebar whose rows add on click).
