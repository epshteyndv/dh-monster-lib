## MODIFIED Requirements

### Requirement: Encounter URL codec in client code

The application SHALL implement encoding and decoding of the encounter URL payload in **client-side TypeScript** (together with the Zustand encounter store), using `URLSearchParams` / `history` / `location` APIs appropriate for the static GitHub Pages deployment. The codec MUST be typed and MUST NOT use `any` for the public encode/decode surface. Compression and decompression of the JSON string for the `enc` parameter SHALL use the **`lz-string`** package (LZString), for example `compressToEncodedURIComponent` and `decompressFromEncodedURIComponent`, rather than manual UTF-8 + Base64 URL-safe encoding.

#### Scenario: Typed codec

- **WHEN** the project builds
- **THEN** the URL encode/decode helpers MUST be part of the typed client source tree and consumable by the encounter store or app shell.
