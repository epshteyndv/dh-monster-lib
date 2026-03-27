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

The application MUST display a list of all monsters from the catalog JSON. Selecting a monster MUST show its fields (at minimum `id` and `name`, plus any additional fields present in the record) in a readable layout.

#### Scenario: Browse catalog

- **WHEN** the catalog JSON loads successfully
- **THEN** the user MUST see a list or grid of monsters and MUST be able to open or focus a single monster to see its attributes.

### Requirement: Load failure handling

If the catalog JSON cannot be loaded (network error, missing file, or invalid JSON), the application MUST show a clear error state to the user instead of a blank page.

#### Scenario: Missing catalog file

- **WHEN** the fetch for the catalog fails or returns non-JSON
- **THEN** the UI MUST display an explanatory message and MUST NOT throw an unhandled exception to the console as the only feedback.

### Requirement: Mantine for list and detail presentation

The monster list and the selected monster detail view SHALL be rendered using **Mantine** components from `@mantine/core` (for example list, card, text, or stack primitives) so that layout and typography are consistent with the Mantine design system.

#### Scenario: List and detail use Mantine

- **WHEN** the catalog JSON has loaded successfully
- **THEN** the list of monsters and the visible attributes of the selected monster SHALL be presented using Mantine components, not plain unstyled HTML blocks without Mantine.

### Requirement: Loading and error states with Mantine

The loading state while fetching the catalog and the error state when fetch or JSON parsing fails SHALL use Mantine feedback components (for example `Loader`, `Alert`, or `Text` within a Mantine container) so the user sees a clear, styled message consistent with the rest of the UI.

#### Scenario: Error uses Mantine alert or equivalent

- **WHEN** the catalog cannot be loaded or parsed
- **THEN** the UI SHALL show an explanatory message using Mantine components (for example `Alert`) instead of only `console.error` or unstyled text.

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
