## ADDED Requirements

### Requirement: Encounter state in URL

The application SHALL serialize the encounter’s **catalog identity order** to the page URL so that reloading or opening the same URL restores the same sequence of monsters (including duplicates). Serialization SHALL use a **versioned JSON** payload (extensible for future fields) encoded as **Base64 URL-safe** (no reliance on raw binary in the query string). The encoded value SHALL appear in a single **query parameter** (for example `enc`).

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

## MODIFIED Requirements

### Requirement: Encounter composition

The application SHALL maintain client-side state **encounter**: an ordered sequence of **entries**. Each entry MUST reference exactly one monster from the loaded catalog data and MUST carry a unique **instance identifier** distinct from the catalog monster `id`, so that the same catalog monster MAY appear in multiple entries. The application MAY persist the **ordered list of catalog `id` values** in the URL as specified in **Encounter state in URL** so that the encounter can be restored after navigation or reload.

#### Scenario: Duplicate catalog monsters allowed

- **WHEN** the user adds the same catalog monster more than once
- **THEN** the encounter MUST contain multiple entries, each with its own instance identifier, preserving append order.

#### Scenario: Instance identity

- **WHEN** two encounter entries reference the same catalog `id`
- **THEN** the UI MUST still treat them as separate cards (for example separate removal).
