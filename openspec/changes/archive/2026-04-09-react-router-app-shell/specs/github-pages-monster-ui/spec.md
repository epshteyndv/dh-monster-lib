## ADDED Requirements

### Requirement: Client-side routing with React Router

The application SHALL use **`react-router-dom`** as the client-side routing library for the user-facing UI. The router SHALL be configured with a **`basename`** that matches the **deployed subpath** / Vite **`base`** (for example the repository name segment under `https://<user>.github.io/<repo>/`) so that **path-based URLs** and **asset resolution** remain consistent with **Correct base path for project Pages**.

The initial route map SHALL include at least one route that hosts the **encounter** experience (monster catalog overlay, encounter cards, header controls including any share affordance) so that all existing encounter-related requirements remain reachable after the router is introduced.

Encounter URL behaviors (**`enc`**, **`share`**, replace-style updates) SHALL continue to satisfy **Encounter state in URL**, **URL history behavior**, and **Encounter share link entry and redirect**; implementation MAY use React Router primitives (for example **`useSearchParams`**, **`replace: true`** navigations) instead of direct `window.location` / `history` manipulation where equivalent.

#### Scenario: App boots inside the router

- **WHEN** the user opens the deployed site (root or project Pages URL with the configured base path)
- **THEN** the application MUST render through the React Router root and MUST display the encounter experience on the default route without a full server redirect.

#### Scenario: Encounter query parameters under subpath

- **WHEN** the user opens the encounter app under a non-root base path with **`enc`** or **`share`** query parameters as specified elsewhere
- **THEN** the same hydration and canonicalization behaviors MUST apply as before the router adoption (no regression solely due to `basename`).

## MODIFIED Requirements

### Requirement: Correct base path for project Pages

The application MUST support a configurable base path (for example `/repository-name/`) so that asset URLs and client-side routes resolve correctly when the site is not hosted at domain root. The **React Router `basename`** MUST be derived from the same deployment base configuration as static assets (for example Vite **`base` / `import.meta.env.BASE_URL`**) so that in-app navigation and deep links remain correct.

#### Scenario: Assets load under subpath

- **WHEN** the site is deployed to `https://<user>.github.io/<repo>/`
- **THEN** stylesheet and script references MUST resolve under that base path without manual path editing by visitors.

#### Scenario: Routed URLs respect base path

- **WHEN** the application uses client-side routing under a project Pages subpath
- **THEN** the default encounter route MUST resolve relative to that subpath (users MUST NOT need to strip or manually prefix the repo segment when following in-app navigation).
