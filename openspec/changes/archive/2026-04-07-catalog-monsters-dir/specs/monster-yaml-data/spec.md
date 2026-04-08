## MODIFIED Requirements

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

### Requirement: Build-time catalog artifact

The build pipeline MUST produce a JSON catalog (for example `monsters.json`) derived from the YAML source(s), suitable for static hosting alongside the site. The JSON structure MUST expose a list of monster objects equivalent to the **merged** YAML content from all `data/monsters/*.yaml` files after validation. The build MUST run schema validation for Daggerheart card fields before writing the JSON artifact; validation failures MUST abort the build with a non-zero exit code.

#### Scenario: Successful build output

- **WHEN** all YAML sources under `data/monsters/` are valid, `id` values are unique in the merged catalog, and every monster conforms to the Daggerheart card field requirement
- **THEN** the build MUST emit one JSON file consumed by the static site at deploy time.

#### Scenario: Validation failure aborts build

- **WHEN** any monster fails Daggerheart field validation
- **THEN** the build MUST NOT write a partial `monsters.json` for deployment consumption (the process may emit diagnostics only).
