## MODIFIED Requirements

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

## ADDED Requirements

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

## REMOVED Requirements

### Requirement: URL history behavior
**Reason**: Regular encounter edits no longer drive URL persistence updates; history spam prevention for per-edit URL writes is no longer the primary mechanism.
**Migration**: Keep replace-style behavior only where URL canonicalization is still needed (for example processing `share`).
