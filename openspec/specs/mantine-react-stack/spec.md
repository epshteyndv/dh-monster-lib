## Requirements

### Requirement: React with TypeScript entry

The front-end application SHALL be built with **React** and **TypeScript**. UI code SHALL use `.tsx` files for components that render JSX. The Vite configuration SHALL include the official React plugin (`@vitejs/plugin-react` or equivalent) so that JSX transforms correctly at build time.

#### Scenario: Production build produces React bundle

- **WHEN** `npm run build` completes successfully
- **THEN** the output SHALL include a client bundle that bootstraps React via `createRoot` (or equivalent API) from a TypeScript entry file.

### Requirement: Mantine provider and styles

The application SHALL wrap the component tree in **Mantine**’s `MantineProvider` from `@mantine/core`. Global Mantine styles SHALL be imported exactly once from the Mantine package (for example `@mantine/core/styles.css` for Mantine v7) so that components render with correct layout and theming.

#### Scenario: Mantine styles active

- **WHEN** the user opens the deployed site
- **THEN** Mantine components SHALL appear with Mantine default styling (not unstyled browser defaults for Mantine primitives).

### Requirement: No vanilla DOM application shell

The catalog user interface (list, detail area, loading and error states) SHALL NOT be implemented solely with imperative `document.createElement` / manual DOM manipulation for the main layout. Those concerns SHALL be expressed as React components; low-level DOM APIs MAY appear only inside React or library internals.

#### Scenario: Main UI is component-based

- **WHEN** a developer inspects the `src/` tree for the app entry and feature components
- **THEN** the primary list and detail views SHALL be implemented as React function components using Mantine primitives rather than a single script building the DOM by hand.
