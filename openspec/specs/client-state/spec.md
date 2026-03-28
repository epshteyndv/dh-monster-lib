## Requirements

### Requirement: Zustand for client state

The browser application SHALL use the **Zustand** library for mutable client-side state that drives the catalog list, loading and error handling for the catalog fetch, and encounter composition and focus. User-visible behavior SHALL remain consistent with **github-pages-monster-ui** (no intentional UX regression).

#### Scenario: Dependency present

- **WHEN** production dependencies are installed for the app
- **THEN** `zustand` MUST be declared in `package.json` `dependencies`.

#### Scenario: Encounter updates through the store

- **WHEN** the user adds, removes, or focuses encounter entries
- **THEN** those updates MUST be applied through Zustand store actions rather than ad-hoc React `useState` / `useReducer` for the same encounter data.

#### Scenario: Catalog load through the store

- **WHEN** the application loads or refreshes catalog data from `loadCatalog` (or equivalent)
- **THEN** loading, error, and `monsters` list state MUST be owned by a Zustand store (or coordinated stores), not scattered unrelated `useState` hooks in `App` for the same concerns.

### Requirement: TypeScript typing for stores

Store state shapes and public actions SHALL be typed with TypeScript. Components SHALL consume stores via typed hooks or selectors without using `any` for the store’s public surface.

#### Scenario: Typed consumer

- **WHEN** a component reads encounter or catalog client state
- **THEN** it MUST use typed store APIs (for example typed `useStore` hooks or selectors) consistent with the declared state and action types.
