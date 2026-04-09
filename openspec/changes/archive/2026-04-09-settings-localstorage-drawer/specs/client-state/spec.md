## ADDED Requirements

### Requirement: Persistent client settings in localStorage

The application SHALL persist user settings in browser `localStorage` and restore them on startup. At minimum, persisted settings SHALL include **party size** used by encounter difficulty and party strength calculations. The persisted state surface MUST remain typed and validated at read/write boundaries.

#### Scenario: Restore settings on reload

- **WHEN** the user reloads the page after previously changing settings
- **THEN** the application MUST restore the saved settings values from `localStorage`.

#### Scenario: Fallback on invalid stored data

- **WHEN** stored settings are missing or invalid
- **THEN** the application MUST use safe defaults instead of crashing.

## MODIFIED Requirements

### Requirement: Party size for encounter difficulty

The application SHALL persist the user-selected **party size** (positive integer used in encounter difficulty and party strength) in **client-side state** and in browser **`localStorage`** so it survives reloads. Changing party size MUST update displayed party strength and encounter difficulty without a full page reload. The public surface MUST remain typed (no `any` for store selectors/actions used by the header or settings drawer).

#### Scenario: Typed party size

- **WHEN** a component reads or updates party size for encounter controls
- **THEN** it MUST use typed store APIs consistent with the declared state shape.
