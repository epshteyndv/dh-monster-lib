## MODIFIED Requirements

### Requirement: Daggerheart monster card fields

Each monster object in the catalog SHALL include the following keys:

- **`id`**: string, stable and unique within the catalog.
- **`name`**: string, display title of the monster.
- **`tierLevel`**: integer, tier number MUST be ≥ 1 (for example `1` for “Tier 1 …”).
- **`tierRole`**: string, non-empty role or bucket label (for example `Solo`, `Horde`) used for search and display together with `tierLevel`.
- **`flavor`**: string, short evocative description (flavor text on the card).
- **`motives`**: string, comma-separated or prose listing motives and tactics.
- **`experience`**: string, experience or special sense line (for example `Tremor Sense +2`).
- **`stats`**: object containing:
  - **`difficulty`**: number.
  - **`thresholds`**: string (for example minor/severe pair `8/15`).
  - **`hp`**: number.
  - **`stress`**: number.
  - **`attack`**: object containing:
    - **`atk`**: number (attack modifier, positive value; display MAY prefix `+`).
    - **`name`**: string (attack name, for example `Claws`).
    - **`range`**: string (range label, for example `Very Close`).
    - **`damage`**: string (damage expression, for example `1d12+2 phy`).
- **`features`**: non-empty array of feature objects; each feature SHALL have:
  - **`name`**: string.
  - **`type`**: one of `passive`, `action`, `reaction` (lowercase).
  - **`description`**: string, full rules text for the feature.
  - **`cost`**: optional number when the feature shows a parenthetical cost (for example Relentless (3)).

The catalog MUST NOT rely on a single combined string field named `tier` for tier and role; those dimensions SHALL be expressed only via `tierLevel` and `tierRole`.

#### Scenario: Valid monster matches the example shape

- **WHEN** a monster includes all required keys with correct types
- **THEN** the build step SHALL accept the record for the JSON catalog.

#### Scenario: Missing required key

- **WHEN** a monster omits `stats`, `features`, `tierLevel`, `tierRole`, or any other required key
- **THEN** the build step SHALL fail with an error naming the monster `id` and the missing path.

#### Scenario: Invalid feature type

- **WHEN** a feature’s `type` is not one of `passive`, `action`, `reaction`
- **THEN** the build step SHALL fail with a clear validation error.

#### Scenario: Invalid tier level

- **WHEN** `tierLevel` is not an integer or is less than 1
- **THEN** the build step SHALL fail with a clear validation error.

#### Scenario: Empty tier role

- **WHEN** `tierRole` is missing, empty, or only whitespace
- **THEN** the build step SHALL fail with a clear validation error.

#### Scenario: Duplicate ids

- **WHEN** two monster records share the same `id`
- **THEN** the build step MUST fail with a clear error message identifying the duplicate `id`.
