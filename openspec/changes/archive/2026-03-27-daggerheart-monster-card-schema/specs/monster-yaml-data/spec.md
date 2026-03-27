## REMOVED Requirements

### Requirement: Minimum monster fields

**Reason:** Поля карточки заменены нормативной структурой Daggerheart (тир, блок статов, фичи и т.д.); свободные произвольные поля больше не являются основой модели.

**Migration:** Для каждой записи задайте `tier`, `flavor`, `motives`, `experience`, вложенный объект `stats` и массив `features` по схеме в ADDED Requirements; поля `description`/`tags` при необходимости перенесите в `flavor` / текст фич.

## ADDED Requirements

### Requirement: Daggerheart monster card fields

Each monster object in the catalog SHALL include the following keys:

- **`id`**: string, stable and unique within the catalog.
- **`name`**: string, display title of the monster.
- **`tier`**: string summarizing tier and role (for example `Tier 1 Solo`).
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

#### Scenario: Valid monster matches the example shape

- **WHEN** a monster includes all required keys with correct types
- **THEN** the build step SHALL accept the record for the JSON catalog.

#### Scenario: Missing required key

- **WHEN** a monster omits `stats`, `features`, or any other required key
- **THEN** the build step SHALL fail with an error naming the monster `id` and the missing path.

#### Scenario: Invalid feature type

- **WHEN** a feature’s `type` is not one of `passive`, `action`, `reaction`
- **THEN** the build step SHALL fail with a clear validation error.

#### Scenario: Duplicate ids

- **WHEN** two monster records share the same `id`
- **THEN** the build step MUST fail with a clear error message identifying the duplicate `id`.

## MODIFIED Requirements

### Requirement: Build-time catalog artifact

The build pipeline MUST produce a JSON catalog (for example `monsters.json`) derived from the YAML source(s), suitable for static hosting alongside the site. The JSON structure MUST expose a list of monster objects equivalent to the merged YAML content after validation. The build MUST run schema validation for Daggerheart card fields before writing the JSON artifact; validation failures MUST abort the build with a non-zero exit code.

#### Scenario: Successful build output

- **WHEN** all YAML sources are valid, `id` values are unique, and every monster conforms to the Daggerheart card field requirement
- **THEN** the build MUST emit one JSON file consumed by the static site at deploy time.

#### Scenario: Validation failure aborts build

- **WHEN** any monster fails Daggerheart field validation
- **THEN** the build MUST NOT write a partial `monsters.json` for deployment consumption (the process may emit diagnostics only).
