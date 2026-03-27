## ADDED Requirements

### Requirement: Mantine for list and detail presentation

The monster list and the selected monster detail view SHALL be rendered using **Mantine** components from `@mantine/core` (for example list, card, text, or stack primitives) so that layout and typography are consistent with the Mantine design system.

#### Scenario: List and detail use Mantine

- **WHEN** the catalog JSON has loaded successfully
- **THEN** the list of monsters and the visible attributes of the selected monster SHALL be presented using Mantine components, not plain unstyled HTML blocks without Mantine.

### Requirement: Loading and error states with Mantine

The loading state while fetching the catalog and the error state when fetch or JSON parsing fails SHALL use Mantine feedback components (for example `Loader`, `Alert`, or `Text` within a Mantine container) so the user sees a clear, styled message consistent with the rest of the UI.

#### Scenario: Error uses Mantine alert or equivalent

- **WHEN** the catalog cannot be loaded or parsed
- **THEN** the UI SHALL show an explanatory message using Mantine components (for example `Alert`) instead of only `console.error` or unstyled text.
