## MODIFIED Requirements

### Requirement: Encounter state in URL

The application SHALL serialize the encounter’s **catalog identity order** to the page URL so that reloading or opening the same URL restores the same sequence of monsters (including duplicates). Serialization SHALL use a **versioned JSON** payload (extensible for future fields) as a UTF-8 string, then **compressed for the URL** using the **LZString** algorithm via the **`lz-string`** library (for example `compressToEncodedURIComponent` / `decompressFromEncodedURIComponent`), so the value stored in the query string is URL-safe and typically shorter than the prior uncompressed Base64 URL-safe encoding. The encoded value SHALL appear in a single **query parameter** (for example `enc`). The application SHALL NOT be required to decode or migrate links produced by the previous Base64 URL-safe-only encoder.

#### Scenario: Restore after reload

- **WHEN** the user opens a URL that contains a valid encounter payload and the catalog has loaded
- **THEN** the encounter MUST be populated to match the decoded monster id sequence (unknown ids MAY be skipped; valid ids MUST be applied in order).

#### Scenario: Share link

- **WHEN** two users open the same URL with the same `enc` value after the catalog loads
- **THEN** both MUST see the same encounter composition (same ids in the same order).

#### Scenario: URL updates on edit

- **WHEN** the user adds or removes monsters in the encounter
- **THEN** the URL query parameter MUST be updated to reflect the new state without requiring a full page reload.
