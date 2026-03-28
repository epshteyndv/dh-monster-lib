## MODIFIED Requirements

### Requirement: Monster list and detail view

The application MUST make the full catalog of monsters available for **adding to the encounter** through a **dedicated control in the page header** (for example a button next to the page title). Activating that control MUST open a **dismissible overlay** (for example a modal) that lists all catalog monsters. Each row in that list MUST show the monster **name** and a **tier line** readable as **`Tier {tier} {role}`**. **When** the user selects a monster in that overlay list, the application MUST append a new encounter entry for that monster (without removing prior entries) and MUST **close** the overlay. The main layout MUST still allow viewing monster card details via encounter focus as specified elsewhere. The application MUST NOT rely on a permanent sidebar catalog whose primary action is click-to-add to the encounter.

#### Scenario: Open add overlay from header

- **WHEN** the catalog JSON has loaded and the user activates the header add-to-encounter control
- **THEN** the UI MUST show an overlay containing the full monster list.

#### Scenario: List entry shows tier and role in overlay

- **WHEN** the add overlay is visible
- **THEN** each monster row MUST display **`Tier {tier} {role}`** with the same structured `tier` and `role` as the card, and MUST NOT rely on legacy combined tier strings.

#### Scenario: Select monster adds and closes overlay

- **WHEN** the user selects a monster in the add overlay list
- **THEN** the application MUST append a new encounter entry for that monster and MUST close the overlay.

#### Scenario: Browse catalog for adding

- **WHEN** the user needs to add monsters to the encounter
- **THEN** they MUST be able to do so via the header-driven overlay list (not only via an always-visible sidebar whose rows add on click).

### Requirement: Mantine for list and detail presentation

The monster **catalog** list (including the list inside the add-to-encounter overlay), the **encounter** list, and the monster detail view SHALL be rendered using **Mantine** components from `@mantine/core` (and **Mantine hooks** such as `@mantine/hooks` where appropriate for overlay state) so that layout and typography are consistent with the Mantine design system.

#### Scenario: List and detail use Mantine

- **WHEN** the catalog JSON has loaded successfully
- **THEN** the add overlay list, encounter list, and visible monster detail SHALL be presented using Mantine components, not plain unstyled HTML blocks without Mantine.
