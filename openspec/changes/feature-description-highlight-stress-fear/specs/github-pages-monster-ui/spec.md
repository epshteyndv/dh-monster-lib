## ADDED Requirements

### Requirement: Feature descriptions highlight Stress and Fear

When rendering a monster feature `description` in the **Features** section of the monster card, the application SHALL emphasize every **whole-word** occurrence of the English tokens **`Stress`** and **`Fear`** using **bold and italic** typography. Non-matching text SHALL remain in the same inline flow and SHALL preserve line breaks consistently with the existing description presentation (for example `white-space: pre-wrap` on the description container). The application SHALL NOT alter catalog data or JSON to achieve this effect.

#### Scenario: Stress token highlighted

- **WHEN** a feature `description` contains the whole word `Stress` as distinct from adjacent letters (for example `Mark a Stress to`)
- **THEN** each such occurrence MUST render with both bold weight and italic style within the description body.

#### Scenario: Fear token highlighted

- **WHEN** a feature `description` contains the whole word `Fear` as distinct from adjacent letters (for example `You gain a Fear`)
- **THEN** each such occurrence MUST render with both bold weight and italic style within the description body.

#### Scenario: Substring inside a larger token not highlighted

- **WHEN** the letters of `Stress` or `Fear` appear only as part of a longer alphabetic token (not a whole word at English word boundaries)
- **THEN** the application MUST NOT apply the bold-italic emphasis to that substring.
