## MODIFIED Requirements

### Requirement: Monster list and detail view

The application MUST display a list of all monsters from the catalog JSON. Each entry in that list MUST show the monster **name** and a **tier line** using integer **`tier`** and enumerated **`role`**, readable as **`Tier {tier} {role}`** (for example **Tier 1 Solo**). Selecting a monster MUST show its fields (at minimum `id` and `name`, plus any additional fields present in the record) in a readable layout.

#### Scenario: Browse catalog

- **WHEN** the catalog JSON loads successfully
- **THEN** the user MUST see a list or grid of monsters and MUST be able to open or focus a single monster to see its attributes.

#### Scenario: List entry shows tier and role

- **WHEN** the catalog JSON has loaded and the monster list is visible
- **THEN** each row (or cell) for a monster MUST display **`Tier {tier} {role}`** alongside or under the display name, using the same structured `tier` and `role` fields as the detail card, and MUST NOT rely on legacy combined tier strings.
