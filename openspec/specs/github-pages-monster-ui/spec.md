## Requirements

### Requirement: Static deployment target

The user-facing application MUST be built as static assets (HTML, JS, CSS) with no requirement for a server-side runtime at hosting time. The deployment target MUST be GitHub Pages for the repository’s Pages URL.

#### Scenario: No server API dependency

- **WHEN** the site is opened in a browser
- **THEN** all catalog data MUST be loaded via static files served from the same GitHub Pages origin (for example `fetch` to a deployed JSON path), without calling a private backend API.

### Requirement: Correct base path for project Pages

The application MUST support a configurable base path (for example `/repository-name/`) so that asset URLs and client-side routes resolve correctly when the site is not hosted at domain root.

#### Scenario: Assets load under subpath

- **WHEN** the site is deployed to `https://<user>.github.io/<repo>/`
- **THEN** stylesheet and script references MUST resolve under that base path without manual path editing by visitors.

### Requirement: Monster list and detail view

The application MUST make the full catalog of monsters available for **adding to the encounter** through a **dedicated control in the page header** (for example a button next to the page title). Activating that control MUST open a **dismissible overlay** (for example a modal) that lists all catalog monsters. Each row in that list MUST show the monster **name** and a **tier line** readable as **`Tier {tier} {role}`**. **When** the user selects a monster in that overlay list, the application MUST append a new encounter entry for that monster (without removing prior entries) and MUST **close** the overlay. The main layout MUST still allow viewing monster fields in a readable layout via the encounter-driven detail view (at minimum `id` and `name`, plus additional fields on the card). The application MUST NOT rely on a permanent sidebar catalog whose primary action is click-to-add to the encounter.

#### Scenario: Open add overlay from header

- **WHEN** the catalog JSON has loaded and the user activates the header add-to-encounter control
- **THEN** the UI MUST show an overlay containing the full monster list.

#### Scenario: List entry shows tier and role in overlay

- **WHEN** the add overlay is visible
- **THEN** each monster row MUST display **`Tier {tier} {role}`** with the same structured `tier` and `role` as the card, and MUST NOT rely on legacy combined tier strings.

#### Scenario: Select monster adds and closes overlay

- **WHEN** the user selects a monster in the add overlay list
- **THEN** the application MUST append a new encounter entry for that monster and MUST close the overlay.

#### Scenario: Browse catalog for adding

- **WHEN** the user needs to add monsters to the encounter
- **THEN** they MUST be able to do so via the header-driven overlay list (not only via an always-visible sidebar whose rows add on click).

### Requirement: Load failure handling

If the catalog JSON cannot be loaded (network error, missing file, or invalid JSON), the application MUST show a clear error state to the user instead of a blank page.

#### Scenario: Missing catalog file

- **WHEN** the fetch for the catalog fails or returns non-JSON
- **THEN** the UI MUST display an explanatory message and MUST NOT throw an unhandled exception to the console as the only feedback.

### Requirement: Mantine for list and detail presentation

The monster **catalog** list (including the list inside the add-to-encounter overlay), the **encounter** list, and the monster detail view SHALL be rendered using **Mantine** components from `@mantine/core` (and **Mantine hooks** such as `@mantine/hooks` where appropriate for overlay state) so that layout and typography are consistent with the Mantine design system.

#### Scenario: List and detail use Mantine

- **WHEN** the catalog JSON has loaded successfully
- **THEN** the add overlay list, encounter list, and visible monster detail SHALL be presented using Mantine components, not plain unstyled HTML blocks without Mantine.

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

### Requirement: Loading and error states with Mantine

The loading state while fetching the catalog and the error state when fetch or JSON parsing fails SHALL use Mantine feedback components (for example `Loader`, `Alert`, or `Text` within a Mantine container) so the user sees a clear, styled message consistent with the rest of the UI.

#### Scenario: Error uses Mantine alert or equivalent

- **WHEN** the catalog cannot be loaded or parsed
- **THEN** the UI SHALL show an explanatory message using Mantine components (for example `Alert`) instead of only `console.error` or unstyled text.

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

### Requirement: Loading and error behavior unchanged for new schema

Existing requirements for loading JSON and showing errors SHALL remain; if validation errors occur only at build time, the runtime error state applies to missing or corrupt JSON as before.

#### Scenario: Deployed JSON valid

- **WHEN** the user opens the site and `monsters.json` loads
- **THEN** each monster entry MUST render using the card layout requirement without requiring raw JSON key iteration as the primary display mode.
