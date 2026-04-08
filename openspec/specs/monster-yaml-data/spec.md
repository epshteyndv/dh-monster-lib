## Requirements

### Requirement: Repository layout for monster data

Monster definitions MUST live under version control as YAML files in the repository. The **build pipeline’s** YAML source for the monster catalog SHALL be **all files** with the `.yaml` extension **directly under** `data/monsters/` (not the root file `data/monsters.yaml`). Each such file MUST parse as YAML and contain a top-level key **`monsters`** whose value is a **sequence** of monster objects, using the same shape as the former single aggregate file. The build SHALL merge every monster from every such file into one logical catalog (preserving a deterministic merge order — for example sorting file paths lexicographically, then concatenating each file’s `monsters` array in order). The root path `data/monsters.yaml` MUST NOT be read as a catalog source by the build once this layout is in effect. The layout MUST be documented in the project README for contributors.

#### Scenario: Catalog from directory

- **WHEN** the build runs
- **THEN** it MUST discover every `*.yaml` file in `data/monsters/` (at the directory’s top level only) and MUST NOT use `data/monsters.yaml` as the YAML input for `monsters.json`.

#### Scenario: Each file shape

- **WHEN** a contributor adds a file under `data/monsters/` named with the `.yaml` extension
- **THEN** that file MUST contain a `monsters` key whose value is a sequence of monster objects (same aggregate shape as before).

#### Scenario: Merge order is deterministic

- **WHEN** multiple YAML files contribute monsters
- **THEN** the merged order used for validation and JSON output MUST follow a deterministic rule (for example lexicographic sort of filenames, then in-file array order).

#### Scenario: Duplicate ids across files

- **WHEN** two monster records in the merged catalog share the same `id` (including entries from different YAML files)
- **THEN** the build step MUST fail with a clear error message identifying the duplicate `id`.

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

### Requirement: Build-time catalog artifact

The build pipeline MUST produce a JSON catalog (for example `monsters.json`) derived from the YAML source(s), suitable for static hosting alongside the site. The JSON structure MUST expose a list of monster objects equivalent to the **merged** YAML content from all `data/monsters/*.yaml` files after validation. The build MUST run schema validation for Daggerheart card fields before writing the JSON artifact; validation failures MUST abort the build with a non-zero exit code.

#### Scenario: Successful build output

- **WHEN** all YAML sources under `data/monsters/` are valid, `id` values are unique in the merged catalog, and every monster conforms to the Daggerheart card field requirement
- **THEN** the build MUST emit one JSON file consumed by the static site at deploy time.

#### Scenario: Validation failure aborts build

- **WHEN** any monster fails Daggerheart field validation
- **THEN** the build MUST NOT write a partial `monsters.json` for deployment consumption (the process may emit diagnostics only).
