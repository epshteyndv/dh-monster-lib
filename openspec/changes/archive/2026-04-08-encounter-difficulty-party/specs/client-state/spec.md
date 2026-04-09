## ADDED Requirements

### Requirement: Party size for encounter difficulty

The application SHALL persist the user-selected **party size** (positive integer used in encounter difficulty and party strength) in **client-side state** together with the Zustand encounter store (either extended encounter store or a small dedicated store). Changing party size MUST update displayed party strength and encounter difficulty without a full page reload. The public surface MUST remain typed (no `any` for store selectors/actions used by the header).

#### Scenario: Typed party size

- **WHEN** a component reads or updates party size for the header
- **THEN** it MUST use typed store APIs consistent with the declared state shape.
