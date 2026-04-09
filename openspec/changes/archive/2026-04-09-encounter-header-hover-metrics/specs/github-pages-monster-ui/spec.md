## MODIFIED Requirements

### Requirement: Encounter difficulty and party strength in header

The application SHALL provide encounter metrics from the header through an **on-hover (or focus/tap equivalent) summary attached to the page title `Энкаунтер`**, rather than as always-visible inline metric blocks. The summary MUST include computed values for exactly three fixed party sizes: **3**, **4**, and **5**. For each of these party sizes, the summary MUST show both **encounter difficulty** (computed from the current encounter roles using existing rules) and **party strength** (`3*n + 2`). The application MUST NOT require an always-visible party-size editor in the header for this behavior.

#### Scenario: Hover summary shows 3/4/5

- **WHEN** the user hovers (or otherwise opens the title summary UI) on `Энкаунтер`
- **THEN** the UI MUST display rows for party sizes 3, 4, and 5 with both difficulty and party strength values.

#### Scenario: Header remains uncluttered

- **WHEN** the user views the header without opening the summary
- **THEN** difficulty/strength values MUST NOT be rendered as permanent inline text blocks in the header row.

## REMOVED Requirements

### Requirement: Settings drawer from header
**Reason**: The approach changed to quick hover summary on the title; dedicated settings drawer is no longer required for party-size interaction.
**Migration**: Remove settings drawer trigger and drawer UI related to party-size editing from the header path.

### Requirement: Party size edited in settings drawer
**Reason**: Party size is no longer edited by users for this feature; metrics are shown for fixed sizes 3/4/5.
**Migration**: Remove party-size control from settings UI and present fixed-size metric rows in the title hover summary.
