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

### Requirement: Encounter URL codec in client code

The application SHALL implement encoding and decoding of the encounter URL payload in **client-side TypeScript** (together with the Zustand encounter store), using `URLSearchParams` / `history` / `location` APIs appropriate for the static GitHub Pages deployment. The codec MUST be typed and MUST NOT use `any` for the public encode/decode surface. Compression and decompression of the JSON string for the `enc` parameter SHALL use the **`lz-string`** package (LZString), for example `compressToEncodedURIComponent` and `decompressFromEncodedURIComponent`, rather than manual UTF-8 + Base64 URL-safe encoding.

#### Scenario: Typed codec

- **WHEN** the project builds
- **THEN** the URL encode/decode helpers MUST be part of the typed client source tree and consumable by the encounter store or app shell.

### Requirement: Party size for encounter difficulty

The application SHALL persist the user-selected **party size** (positive integer used in encounter difficulty and party strength) in **client-side state** together with the Zustand encounter store (either extended encounter store or a small dedicated store). Changing party size MUST update displayed party strength and encounter difficulty without a full page reload. The public surface MUST remain typed (no `any` for store selectors/actions used by the header).

#### Scenario: Typed party size

- **WHEN** a component reads or updates party size for the header
- **THEN** it MUST use typed store APIs consistent with the declared state shape.
