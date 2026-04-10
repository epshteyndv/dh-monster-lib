## Requirements

### Requirement: Static deployment target

The user-facing application MUST be built as static assets (HTML, JS, CSS) with no requirement for a server-side runtime at hosting time. The deployment target MUST be GitHub Pages for the repository’s Pages URL.

#### Scenario: No server API dependency

- **WHEN** the site is opened in a browser
- **THEN** all catalog data MUST be loaded via static files served from the same GitHub Pages origin (for example `fetch` to a deployed JSON path), without calling a private backend API.

### Requirement: Correct base path for project Pages

The application MUST support a configurable base path (for example `/repository-name/`) so that asset URLs and client-side routes resolve correctly when the site is not hosted at domain root. The **React Router `basename`** MUST be derived from the same deployment base configuration as static assets (for example Vite **`base` / `import.meta.env.BASE_URL`**) so that in-app navigation and deep links remain correct.

#### Scenario: Assets load under subpath

- **WHEN** the site is deployed to `https://<user>.github.io/<repo>/`
- **THEN** stylesheet and script references MUST resolve under that base path without manual path editing by visitors.

#### Scenario: Routed URLs respect base path

- **WHEN** the application uses client-side routing under a project Pages subpath
- **THEN** the default encounter route MUST resolve relative to that subpath (users MUST NOT need to strip or manually prefix the repo segment when following in-app navigation).

### Requirement: Client-side routing with React Router

The application SHALL use **`react-router-dom`** as the client-side routing library for the user-facing UI. The router SHALL be configured with a **`basename`** that matches the **deployed subpath** / Vite **`base`** (for example the repository name segment under `https://<user>.github.io/<repo>/`) so that **path-based URLs** and **asset resolution** remain consistent with **Correct base path for project Pages**.

The initial route map SHALL include at least one route that hosts the **encounter** experience (monster catalog overlay, encounter cards, header controls including any share affordance) so that all existing encounter-related requirements remain reachable after the router is introduced.

Encounter behaviors involving **`share`**, legacy **`enc`** cleanup, **localStorage** persistence (**Encounter state persistence in localStorage**), and URL canonicalization (**Encounter share link entry and redirect**, **Encounter state in URL**) SHALL remain satisfied; implementation MAY use React Router primitives (for example **`useSearchParams`**, **`replace: true`** navigations) instead of direct `window.location` / `history` manipulation where equivalent.

#### Scenario: App boots inside the router

- **WHEN** the user opens the deployed site (root or project Pages URL with the configured base path)
- **THEN** the application MUST render through the React Router root and MUST display the encounter experience on the default route without a full server redirect.

#### Scenario: Encounter query parameters under subpath

- **WHEN** the user opens the encounter app under a non-root base path with **`enc`**, **`share`**, or related query parameters as specified elsewhere
- **THEN** the same bootstrap, canonicalization, and localStorage restore behaviors MUST apply as before the router adoption (no regression solely due to `basename`).

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

### Requirement: Encounter difficulty and party strength in header

The application SHALL provide encounter metrics from the header through an **on-hover (or focus/tap equivalent) summary attached to the page title `Энкаунтер`**, rather than as always-visible inline metric blocks. The summary MUST include computed values for exactly three fixed party sizes: **3**, **4**, and **5**. For each of these party sizes, the summary MUST show both **encounter difficulty** (computed from the current encounter roles using existing rules) and **party strength** (`3*n + 2`). The application MUST NOT require an always-visible party-size editor in the header for this behavior.

**Difficulty rules** (integer score; apply in order conceptually, all additions and penalties are to the same running total):

- **Empty encounter:** if there are **no** encounter entries, the difficulty MUST be **`0`** (no other rules apply).
- **Minion:** `+1` for each **full group** of Minions equal to party size: let `minionCount` be the number of encounter entries whose monster `role` is `Minion`; the contribution MUST be **`floor(minionCount / partySize)`** when `partySize ≥ 1`; if `minionCount` is zero, the contribution MUST be `0`.
- **Social** or **Support:** `+1` per encounter entry whose monster `role` is `Social` or `Support`.
- **Horde, Ranged, Skulk, or Standard:** `+2` per encounter entry whose monster `role` is one of `Horde`, `Ranged`, `Skulk`, `Standard`.
- **Leader:** `+3` per encounter entry whose monster `role` is `Leader`.
- **Bruiser:** `+4` per encounter entry whose monster `role` is `Bruiser`.
- **Solo:** `+5` per encounter entry whose monster `role` is `Solo`, **plus** an additional `+2` if there are **two or more** such entries in the encounter.
- **Penalty:** if the encounter is **non-empty** and there is **no** encounter entry whose monster `role` is `Bruiser`, `Horde`, `Leader`, or `Solo`, the score MUST apply **`−1`**.

#### Scenario: Empty encounter shows zero difficulty

- **WHEN** the encounter has no entries
- **THEN** the displayed encounter difficulty MUST be `0` regardless of party size.

#### Scenario: Party strength formula

- **WHEN** the user sets party size to a positive integer `n`
- **THEN** the displayed party strength MUST be `3 * n + 2`.

#### Scenario: Hover summary shows 3/4/5

- **WHEN** the user hovers (or otherwise opens the title summary UI) on `Энкаунтер`
- **THEN** the UI MUST display rows for party sizes 3, 4, and 5 with both difficulty and party strength values.

#### Scenario: Header remains uncluttered

- **WHEN** the user views the header without opening the summary
- **THEN** difficulty/strength values MUST NOT be rendered as permanent inline text blocks in the header row.

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

- **WHEN** the active filters exclude every monster
- **THEN** the overlay SHALL show a clear empty state (for example a short message) instead of a blank list with no explanation.

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

The application SHALL maintain client-side state **encounter**: an ordered sequence of **entries**. Each entry MUST reference exactly one monster from the loaded catalog data and MUST carry a unique **instance identifier** distinct from the catalog monster `id`, so that the same catalog monster MAY appear in multiple entries. The application MAY persist the **ordered list of catalog `id` values** as specified in **Encounter state persistence in localStorage** and **Encounter state in URL** so that the encounter can be restored after navigation or reload.

#### Scenario: Duplicate catalog monsters allowed

- **WHEN** the user adds the same catalog monster more than once
- **THEN** the encounter MUST contain multiple entries, each with its own instance identifier, preserving append order.

#### Scenario: Instance identity

- **WHEN** two encounter entries reference the same catalog `id`
- **THEN** the UI MUST still provide separate removal controls for each entry instance even if entries are rendered inside one shared card.

### Requirement: Encounter share link entry and redirect

The application SHALL support a **share entry flow** via query parameter **`share`**, but this flow SHALL be separate from regular ongoing state persistence. The `share` payload encoding and versioning MUST remain compatible with the encounter payload format used by the app (versioned ordered id list, typed decode/validation behavior).

The application MUST expose a dedicated sharing control (for example a header button) that lets the user obtain a full URL containing `share=` for explicit sharing.

When the user opens the application with a `share` parameter and the catalog is loaded:

- **THEN** the encounter MUST be populated from the decoded `share` payload (skipping unknown ids, preserving valid order and duplicates),
- **AND THEN** the application MUST canonicalize to the main page URL by removing `share` via replace semantics,
- **AND** the resulting current encounter state MUST be persisted to `localStorage` as the active working state.

#### Scenario: Share URL applies state and returns to main URL

- **WHEN** the user opens a valid `share` URL and catalog load succeeds
- **THEN** encounter state MUST be applied from `share`
- **AND** the visible URL MUST NOT keep `share` afterward
- **AND** the applied state MUST become the current persisted local state.

#### Scenario: Invalid share payload does not break app

- **WHEN** `share` is invalid for current payload/version rules
- **THEN** the UI MUST NOT crash
- **AND** the URL SHOULD be cleaned from `share` using replace behavior where practical.

### Requirement: Encounter state in URL

The application SHALL NOT treat URL query parameters as the primary persistence mechanism for the **current working encounter state** during normal editing. Instead, ongoing encounter state persistence SHALL be handled by **localStorage** as defined in **Encounter state persistence in localStorage**. URL payload parameters MAY still be used for explicit share-entry import flows.

#### Scenario: Edit does not rewrite enc parameter

- **WHEN** the user adds or removes monsters in the encounter during normal usage
- **THEN** the app MUST persist state locally and MUST NOT require writing `enc` into the URL on each edit.

### Requirement: Encounter state persistence in localStorage

The application SHALL persist the current encounter composition in **`localStorage`** so that reloads and revisits in the same browser restore the last working encounter state without requiring URL query parameters. Persisted data MUST preserve ordered catalog ids and duplicates; unknown ids at restore time MAY be skipped.

#### Scenario: Reload restores from localStorage

- **WHEN** the user edits encounter state and reloads the page in the same browser profile
- **THEN** the encounter MUST be restored from localStorage to the last persisted valid state.

#### Scenario: Empty encounter persistence

- **WHEN** the encounter becomes empty
- **THEN** persisted local encounter state MUST represent emptiness (for example by clearing the storage key or storing an empty valid payload), and subsequent reload MUST show an empty encounter.

#### Scenario: Storage access failure

- **WHEN** reading from or writing to localStorage throws (for example quota/privacy mode restrictions)
- **THEN** the application MUST continue running without crash and SHOULD gracefully fall back to in-memory state for the session.

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
