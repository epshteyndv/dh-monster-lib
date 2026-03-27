## MODIFIED Requirements

### Requirement: Daggerheart monster card fields

Each monster object in the catalog SHALL include the following keys:

- **`id`**: string, stable and unique within the catalog.
- **`name`**: string, display title of the monster.
- **`tier`**: integer, tier number MUST be ≥ 1 (for example `1` for “Tier 1 …”).
- **`role`**: string MUST be exactly one of: `Bruiser`, `Horde`, `Leader`, `Minion`, `Ranged`, `Skulk`, `Social`, `Solo`, `Standard`, `Support`.
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

The catalog MUST NOT use deprecated keys `tierLevel` or `tierRole`. The catalog MUST NOT use a single combined string field for both tier number and role; those dimensions SHALL be expressed only via integer `tier` and enumerated `role`. A legacy string-valued key named `tier` (non-number) SHALL be rejected by validation.

#### Scenario: Valid monster matches the example shape

- **WHEN** a monster includes all required keys with correct types and a valid `role`
- **THEN** the build step SHALL accept the record for the JSON catalog.

#### Scenario: Missing required key

- **WHEN** a monster omits `stats`, `features`, `tier`, `role`, or any other required key
- **THEN** the build step SHALL fail with an error naming the monster `id` and the missing path.

#### Scenario: Invalid feature type

- **WHEN** a feature’s `type` is not one of `passive`, `action`, `reaction`
- **THEN** the build step SHALL fail with a clear validation error.

#### Scenario: Invalid tier

- **WHEN** `tier` is not an integer or is less than 1
- **THEN** the build step SHALL fail with a clear validation error.

#### Scenario: Invalid or unknown role

- **WHEN** `role` is not exactly one of the allowed role strings
- **THEN** the build step SHALL fail with a clear validation error listing allowed values.

#### Scenario: Deprecated keys

- **WHEN** a monster includes `tierLevel` or `tierRole`
- **THEN** the build step SHALL fail with an error that names the deprecated key and instructs migration to `tier` and `role`.

#### Scenario: Duplicate ids

- **WHEN** two monster records share the same `id`
- **THEN** the build step MUST fail with a clear error message identifying the duplicate `id`.
