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

The application MUST make the full catalog of monsters available for **adding to the encounter** through a **dedicated control in the page header** (for example a button next to the page title). Activating that control MUST open a **dismissible overlay** (for example a modal) that lists all catalog monsters. Each row in that list MUST show the monster **name** and a **tier line** readable as **`Tier {tier} {role}`**. **When** the user selects a monster in that overlay list, the application MUST append a new encounter entry for that monster (without removing prior entries) and MUST **close** the overlay. The main layout MUST show each encounter entry as a full **Monster card** on the main page surface in encounter order so that monster fields are readable on each card (at minimum `id` and `name`, plus additional fields on the card); see **Encounter cards and removal**. The application MUST NOT rely on a permanent sidebar catalog whose primary action is click-to-add to the encounter.

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

The monster **catalog** list (including the list inside the add-to-encounter overlay), each **encounter monster card** on the main surface, and related chrome SHALL be rendered using **Mantine** components from `@mantine/core` (and **Mantine hooks** such as `@mantine/hooks` where appropriate for overlay state) so that layout and typography are consistent with the Mantine design system.

#### Scenario: List and detail use Mantine

- **WHEN** the catalog JSON has loaded successfully
- **THEN** the add overlay list, encounter cards, and their controls SHALL be presented using Mantine components, not plain unstyled HTML blocks without Mantine.

### Requirement: Encounter composition

The application SHALL maintain client-side state **encounter**: an ordered sequence of **entries**. Each entry MUST reference exactly one monster from the loaded catalog data and MUST carry a unique **instance identifier** distinct from the catalog monster `id`, so that the same catalog monster MAY appear in multiple entries. The application MAY persist the **ordered list of catalog `id` values** in the URL as specified in **Encounter state in URL** so that the encounter can be restored after navigation or reload.

#### Scenario: Duplicate catalog monsters allowed

- **WHEN** the user adds the same catalog monster more than once
- **THEN** the encounter MUST contain multiple entries, each with its own instance identifier, preserving append order.

#### Scenario: Instance identity

- **WHEN** two encounter entries reference the same catalog `id`
- **THEN** the UI MUST still treat them as separate cards (for example separate removal).

### Requirement: Encounter state in URL

The application SHALL serialize the encounter’s **catalog identity order** to the page URL so that reloading or opening the same URL restores the same sequence of monsters (including duplicates). Serialization SHALL use a **versioned JSON** payload (extensible for future fields) as a UTF-8 string, then **compressed for the URL** using the **LZString** algorithm via the **`lz-string`** library (for example `compressToEncodedURIComponent` / `decompressFromEncodedURIComponent`), so the value stored in the query string is URL-safe and typically shorter than the prior uncompressed Base64 URL-safe encoding. The encoded value SHALL appear in a single **query parameter** (for example `enc`). The application SHALL NOT be required to decode or migrate links produced by the previous Base64 URL-safe-only encoder.

#### Scenario: Restore after reload

- **WHEN** the user opens a URL that contains a valid encounter payload and the catalog has loaded
- **THEN** the encounter MUST be populated to match the decoded monster id sequence (unknown ids MAY be skipped; valid ids MUST be applied in order).

#### Scenario: Share link

- **WHEN** two users open the same URL with the same `enc` value after the catalog loads
- **THEN** both MUST see the same encounter composition (same ids in the same order).

#### Scenario: URL updates on edit

- **WHEN** the user adds or removes monsters in the encounter
- **THEN** the URL query parameter MUST be updated to reflect the new state without requiring a full page reload.

### Requirement: URL history behavior

Updates to the encounter-driven query parameter SHALL use **`history.replaceState`** (or equivalent) so that normal encounter editing does not create a deep stack of history entries for each keystroke-level change.

#### Scenario: No history spam

- **WHEN** the user adds several monsters in one session
- **THEN** the browser back button MUST NOT require one undo per add solely for URL updates (replace semantics).

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
