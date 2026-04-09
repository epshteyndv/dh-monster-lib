## MODIFIED Requirements

### Requirement: Monster list and detail view

The application MUST make the full catalog of monsters available for **adding to the encounter** through a **dedicated control in the page header** (for example a button next to the page title). Activating that control MUST open a **dismissible overlay** (for example a modal) that lists catalog monsters available for selection. The overlay MUST implement **Add overlay catalog filters** so the user MAY narrow the list by tier and role as specified there. Each row in the filtered list MUST show the monster **name** and a **tier line** readable as **`Tier {tier} {role}`**. **When** the user selects a monster in that overlay list, the application MUST append a new encounter entry for that monster (without removing prior entries) and MUST **close** the overlay. The main layout MUST show encounter monsters as full **Monster cards** on the main page surface, where entries with the same catalog monster `id` MAY be represented by a single shared full card that contains multiple per-instance sections; see **Encounter cards and removal**. The application MUST NOT rely on a permanent sidebar catalog whose primary action is click-to-add to the encounter. The **page header** MUST also implement **Encounter difficulty and party strength in header** so encounter difficulty, party strength, and party size selection appear in the same header region as the add-to-encounter control.

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

### Requirement: Encounter composition

The application SHALL maintain client-side state **encounter**: an ordered sequence of **entries**. Each entry MUST reference exactly one monster from the loaded catalog data and MUST carry a unique **instance identifier** distinct from the catalog monster `id`, so that the same catalog monster MAY appear in multiple entries. The application MAY persist the **ordered list of catalog `id` values** in the URL as specified in **Encounter state in URL** so that the encounter can be restored after navigation or reload.

#### Scenario: Duplicate catalog monsters allowed

- **WHEN** the user adds the same catalog monster more than once
- **THEN** the encounter MUST contain multiple entries, each with its own instance identifier, preserving append order.

#### Scenario: Instance identity

- **WHEN** two encounter entries reference the same catalog `id`
- **THEN** the UI MUST still provide separate removal controls for each entry instance even if entries are rendered inside one shared card.

### Requirement: Encounter cards and removal

The application SHALL render encounter monsters as full **Monster cards** on the main page surface. When the encounter contains multiple entries with the same catalog monster `id`, the UI MUST render a single full monster card for that `id` and include separate per-instance sections inside that card. Each per-instance section MUST include the monster name and a **remove** control that removes only that specific encounter entry. There MUST NOT be a separate sidebar whose primary purpose is listing encounter entries for selection. The user MUST be able to remove a single entry without clearing the entire encounter unless it was the last entry.

#### Scenario: Remove one duplicate instance from shared card

- **WHEN** the user activates remove in one per-instance section of a shared card
- **THEN** only that corresponding encounter entry MUST be removed, and other instances of the same monster MUST remain.

#### Scenario: Shared card for duplicates

- **WHEN** the encounter has two or more entries with the same monster `id`
- **THEN** the UI MUST show one full monster card for that monster plus multiple per-instance sections (one per entry).

#### Scenario: Empty encounter

- **WHEN** the encounter has no entries
- **THEN** the main surface MUST NOT show monster cards as if entries existed.

#### Scenario: First and repeated add behavior

- **WHEN** the user adds a monster that is not yet in the encounter, then adds the same monster again
- **THEN** the first add MUST create one card with one per-instance section, and the second add MUST increase sections in that same card rather than creating a second full duplicate card.
