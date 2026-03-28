## REMOVED Requirements

### Requirement: Encounter list and removal

**Reason:** Encounter entries are no longer shown as a separate sidebar list; each entry is a full card on the main surface with removal in the card header.

**Migration:** Behavior covered by **Encounter cards and removal** (ADDED below).

### Requirement: Encounter focus and monster card

**Reason:** A single focused detail column is replaced by showing all encounter monster cards at once.

**Migration:** Behavior covered by **Encounter cards and removal** (ADDED below).

## MODIFIED Requirements

### Requirement: Mantine for list and detail presentation

The monster **catalog** list (including the list inside the add-to-encounter overlay), each **encounter monster card** on the main surface, and related chrome SHALL be rendered using **Mantine** components from `@mantine/core` (and **Mantine hooks** such as `@mantine/hooks` where appropriate for overlay state) so that layout and typography are consistent with the Mantine design system.

#### Scenario: List and detail use Mantine

- **WHEN** the catalog JSON has loaded successfully
- **THEN** the add overlay list, encounter cards, and their controls SHALL be presented using Mantine components, not plain unstyled HTML blocks without Mantine.

### Requirement: Encounter composition

The application SHALL maintain client-side state **encounter**: an ordered sequence of **entries**. Each entry MUST reference exactly one monster from the loaded catalog data and MUST carry a unique **instance identifier** distinct from the catalog monster `id`, so that the same catalog monster MAY appear in multiple entries.

#### Scenario: Duplicate catalog monsters allowed

- **WHEN** the user adds the same catalog monster more than once
- **THEN** the encounter MUST contain multiple entries, each with its own instance identifier, preserving append order.

#### Scenario: Instance identity

- **WHEN** two encounter entries reference the same catalog `id`
- **THEN** the UI MUST still treat them as separate cards (for example separate removal).

## ADDED Requirements

### Requirement: Encounter cards and removal

The application SHALL render every encounter entry as a full **Monster card** on the main page surface in encounter order (for example a vertical stack or responsive grid). There MUST NOT be a separate sidebar whose primary purpose is listing encounter entries for selection. Each monster card MUST expose a **remove** control in the **card header** (for example top-right) that removes **only** that encounter entry. The user MUST be able to remove a single entry without clearing the entire encounter unless it was the last entry.

#### Scenario: Remove one entry from card header

- **WHEN** the user activates the remove control on a specific encounter card
- **THEN** only that entry MUST be removed; remaining cards MUST stay in order.

#### Scenario: All encounter entries visible

- **WHEN** the encounter has one or more entries
- **THEN** the UI MUST show a full monster card for each entry at once (not only one card behind a focus or selection step).

#### Scenario: Empty encounter

- **WHEN** the encounter has no entries
- **THEN** the main surface MUST NOT show monster cards as if entries existed.

#### Scenario: New entry appears as a card

- **WHEN** the user adds a monster from the catalog overlay
- **THEN** a new full monster card for that entry MUST appear with the others on the main surface.
