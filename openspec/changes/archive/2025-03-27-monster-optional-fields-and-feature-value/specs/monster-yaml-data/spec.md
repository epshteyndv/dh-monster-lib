## MODIFIED Requirements

### Requirement: Daggerheart monster card fields

Each monster object in the catalog SHALL include the following keys:

- **`id`**: string, stable and unique within the catalog.
- **`name`**: string, display title of the monster.
- **`tier`**: integer, tier number MUST be ≥ 1 (for example `1` for “Tier 1 …”).
- **`role`**: string MUST be exactly one of: `Bruiser`, `Horde`, `Leader`, `Minion`, `Ranged`, `Skulk`, `Social`, `Solo`, `Standard`, `Support`.
- **`flavor`**: optional; when present MUST be a non-empty string (short evocative description).
- **`motives`**: optional; when present MUST be a non-empty string (comma-separated or prose listing motives and tactics).
- **`experience`**: optional collection; when present MUST be an array (possibly empty) of strings; each non-empty element MUST be a trimmed non-empty string representing one experience or sense line. Omitted key or empty array means no experience lines.
- **`stats`**: object containing:
  - **`difficulty`**: number.
  - **`thresholds`**: string (for example minor/severe pair `8/15`).
  - **`hp`**: number.
  - **`stress`**: number.
  - **`attack`**: object containing:
    - **`atk`**: number (attack modifier, positive value; display MAY prefix `+`).
    - **`name`**: string (attack name, for example `Claws`).
    - **`range`**: string MUST be exactly one of: `Melee`, `Very Close`, `Close`, `Far`, `Very Far`.
    - **`damage`**: string (damage expression, for example `1d12+2 phy`).
- **`features`**: non-empty array of feature objects; each feature SHALL have:
  - **`name`**: string.
  - **`type`**: one of `passive`, `action`, `reaction` (lowercase).
  - **`description`**: string, full rules text for the feature.
  - **`value`**: optional non-empty string when the feature shows a parenthetical cost or dice expression (for example `Relentless ("3")` or `("1d6+3")` in prose — stored as `"3"` or `"1d6+3"`).

The catalog MUST NOT use deprecated keys `tierLevel` or `tierRole`. The catalog MUST NOT use a single combined string field for both tier number and role; those dimensions SHALL be expressed only via integer `tier` and enumerated `role`. A legacy string-valued key named `tier` (non-number) SHALL be rejected by validation. The catalog MUST NOT use `cost` on features; contributors SHALL use `value` (string) instead.

#### Scenario: Valid monster matches the example shape

- **WHEN** a monster includes all required keys with correct types and a valid `role`, and any optional fields conform to the rules above
- **THEN** the build step SHALL accept the record for the JSON catalog.

#### Scenario: Missing required key

- **WHEN** a monster omits `stats`, `features`, `tier`, `role`, or any other required key (required keys are those listed as mandatory above, not including optional `flavor`, `motives`, or `experience`)
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

#### Scenario: Deprecated keys for tier/role

- **WHEN** a monster includes `tierLevel` or `tierRole`
- **THEN** the build step SHALL fail with an error that names the deprecated key and instructs migration to `tier` and `role`.

#### Scenario: Deprecated feature cost key

- **WHEN** a feature includes `cost`
- **THEN** the build step SHALL fail with an error that instructs migration to `value` (string).

#### Scenario: Invalid attack range

- **WHEN** `stats.attack.range` is not exactly one of `Melee`, `Very Close`, `Close`, `Far`, `Very Far`
- **THEN** the build step SHALL fail with a clear validation error listing allowed values.

#### Scenario: Invalid experience shape

- **WHEN** `experience` is present but is not an array, or contains a non-string or empty string element
- **THEN** the build step SHALL fail with a clear validation error.

#### Scenario: Invalid optional string fields

- **WHEN** `flavor` or `motives` is present but empty or not a string
- **THEN** the build step SHALL fail with a clear validation error.

#### Scenario: Duplicate ids

- **WHEN** two monster records share the same `id`
- **THEN** the build step MUST fail with a clear error message identifying the duplicate `id`.
