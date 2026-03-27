## Requirements

### Requirement: Repository layout for monster data

Monster definitions MUST live under version control as YAML files in the repository. The repository SHALL either use a single aggregate file at `data/monsters.yaml` with a top-level `monsters` array, OR multiple files under `data/monsters/` with one monster per file. The chosen layout MUST be documented in the project README for contributors.

#### Scenario: Single aggregate file

- **WHEN** the project uses `data/monsters.yaml`
- **THEN** the file MUST parse as YAML and contain a `monsters` key whose value is a sequence of monster objects.

#### Scenario: Directory of files

- **WHEN** the project uses `data/monsters/*.yaml`
- **THEN** each file MUST parse as YAML and represent one monster object at the document root (not wrapped in a `monsters` array per file).

### Requirement: Minimum monster fields

Each monster object MUST include: `id` (string, stable unique within the catalog), `name` (string, display name). The system MAY define additional optional fields (for example description, tags, statistics); unknown fields MUST be preserved in source YAML for forward compatibility and MAY be shown in the UI when present.

#### Scenario: Valid minimal record

- **WHEN** a monster object contains `id` and `name`
- **THEN** it MUST be considered valid for inclusion in the generated catalog artifact consumed by the site.

#### Scenario: Duplicate ids

- **WHEN** two monster records share the same `id`
- **THEN** the build step MUST fail with a clear error message identifying the duplicate `id`.

### Requirement: Build-time catalog artifact

The build pipeline MUST produce a JSON catalog (for example `monsters.json`) derived from the YAML source(s), suitable for static hosting alongside the site. The JSON structure MUST expose a list of monster objects equivalent to the merged YAML content after validation.

#### Scenario: Successful build output

- **WHEN** all YAML sources are valid and `id` values are unique
- **THEN** the build MUST emit one JSON file consumed by the static site at deploy time.
