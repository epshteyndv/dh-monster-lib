## MODIFIED Requirements

### Requirement: Monster list and detail view

The application MUST display a list of all monsters from the catalog JSON. Interacting with the catalog list SHALL add monsters to a client-side **encounter** (see ADDED requirements) rather than acting as a single exclusive selection that replaces prior choice. The user MUST be able to view monster fields in a readable layout via the encounter-driven detail view (at minimum `id` and `name`, plus additional fields on the card).

#### Scenario: Browse catalog

- **WHEN** the catalog JSON loads successfully
- **THEN** the user MUST see a list or grid of all catalog monsters.

#### Scenario: Add monster to encounter from catalog

- **WHEN** the user activates a catalog row for a monster (for example click)
- **THEN** the application MUST append a new encounter entry for that monster without removing prior encounter entries.

### Requirement: Mantine for list and detail presentation

The monster **catalog** list, the **encounter** list, and the monster detail view SHALL be rendered using **Mantine** components from `@mantine/core` so that layout and typography are consistent with the Mantine design system.

#### Scenario: List and detail use Mantine

- **WHEN** the catalog JSON has loaded successfully
- **THEN** the catalog list, encounter list, and visible monster detail SHALL be presented using Mantine components, not plain unstyled HTML blocks without Mantine.

## ADDED Requirements

### Requirement: Encounter composition

The application SHALL maintain client-side state **encounter**: an ordered sequence of **entries**. Each entry MUST reference exactly one monster from the loaded catalog data and MUST carry a unique **instance identifier** distinct from the catalog monster `id`, so that the same catalog monster MAY appear in multiple entries.

#### Scenario: Duplicate catalog monsters allowed

- **WHEN** the user adds the same catalog monster more than once
- **THEN** the encounter MUST contain multiple entries, each with its own instance identifier, preserving append order.

#### Scenario: Instance identity

- **WHEN** two encounter entries reference the same catalog `id`
- **THEN** the UI MUST still treat them as separate rows (for example separate focus and removal).

### Requirement: Encounter list and removal

The application SHALL render the encounter as an ordered list (or equivalent) showing each entry with enough information to distinguish instances (at minimum monster **name** and **`Tier {tier} {role}`** line). The user MUST be able to **remove** a single entry from the encounter without clearing the entire list unless the encounter becomes empty.

#### Scenario: Remove one entry

- **WHEN** the user removes one encounter entry
- **THEN** only that entry MUST be removed; remaining entries MUST stay in order.

### Requirement: Encounter focus and monster card

The application SHALL show the **Monster card** detail for at most one **focused** encounter entry at a time. When the user adds an entry from the catalog, focus SHOULD move to that new entry. When the user selects an entry in the encounter list, focus MUST move to that entry. If the encounter is empty, the detail region MUST show an empty state (not a stale card).

#### Scenario: Focus follows add

- **WHEN** the user adds a monster from the catalog
- **THEN** the detail view MUST show that monster’s card for the newly added entry (or an equivalent explicit focus rule documented in the UI).

#### Scenario: Focus from encounter list

- **WHEN** the encounter has entries and the user selects an entry in the encounter list
- **THEN** the detail view MUST show the card for that entry’s monster data.

#### Scenario: Empty encounter

- **WHEN** the encounter has no entries
- **THEN** the detail view MUST NOT display a monster card as if an encounter entry were selected.
