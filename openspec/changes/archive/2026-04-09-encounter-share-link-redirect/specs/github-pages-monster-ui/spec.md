## ADDED Requirements

### Requirement: Encounter share link entry and redirect

The application SHALL support a **share entry flow** separate from the normal **`enc`** URL sync: a dedicated query parameter **`share`** whose **value encoding, versioning, and JSON payload shape** MUST match the **`enc`** parameter rules defined in **Encounter state in URL** (LZString compression via **`lz-string`**, same versioned payload with ordered catalog `id` list).

The application MUST expose a **dedicated control** (for example a header button) that lets the user obtain a **full share URL** containing the **`share`** query parameter reflecting the **current** encounter composition (same id sequence semantics as **`enc`**, including duplicates). This control MUST NOT be required for normal encounter editing; it is an optional sharing affordance.

When the user opens the application with a **`share`** parameter:

- **WHEN** the catalog has finished loading successfully and **`share`** decodes to a valid payload for the current wire version
- **THEN** the application MUST populate the encounter from the decoded id list using the same **skip unknown ids / preserve order** rules as **`enc`** hydration
- **AND THEN** the application MUST update the browser URL via **`history.replaceState`** (or equivalent) so that **`share` is removed**, the path remains the **normal application entry path** (respecting the configured base path), and the **`enc`** query parameter reflects the resulting encounter (or **`enc`** is omitted when the encounter is empty), with **no full page reload** and **no new history entry** solely for this canonicalization step.

#### Scenario: Share URL opens and lands on canonical enc URL

- **WHEN** the user opens a URL that contains a valid **`share`** value and the catalog loads
- **THEN** the encounter MUST match the shared id sequence (after unknown-id handling)
- **AND** the visible URL MUST NOT retain **`share`** after processing
- **AND** the **`enc`** parameter MUST be consistent with the displayed encounter (or absent if empty).

#### Scenario: Invalid or missing share payload

- **WHEN** the **`share`** parameter is present but does not decode to a valid payload for the current version
- **THEN** the application MUST NOT crash
- **AND** the application SHOULD remove **`share`** from the URL via replace semantics where practical, without requiring a reload.

#### Scenario: Dedicated control provides share link

- **WHEN** the user activates the dedicated sharing control
- **THEN** the user MUST be able to obtain (for example copy) a URL containing **`share=`** with the current encounter encoded
- **AND** the URL MUST be valid for the deployed base path (project Pages subpath when applicable).

#### Scenario: Share redirect uses replace not push

- **WHEN** the share entry flow runs after catalog load
- **THEN** URL canonicalization from **`share`** to **`enc`** MUST use **replace** semantics so the browser back button does not return to the raw **`share`** URL as an extra history step attributable only to this redirect.

## MODIFIED Requirements

### Requirement: Encounter state in URL

The application SHALL serialize the encounter’s **catalog identity order** to the page URL so that reloading or opening the same URL restores the same sequence of monsters (including duplicates). Serialization SHALL use a **versioned JSON** payload (extensible for future fields) as a UTF-8 string, then **compressed for the URL** using the **LZString** algorithm via the **`lz-string`** library (for example `compressToEncodedURIComponent` / `decompressFromEncodedURIComponent`), so the value stored in the query string is URL-safe and typically shorter than the prior uncompressed Base64 URL-safe encoding. The encoded value SHALL appear in a single **query parameter** (for example `enc`). The application MAY additionally accept the same encoded payload in a separate **`share`** query parameter for the **share entry flow** described in **Encounter share link entry and redirect**; that flow SHALL canonicalize to **`enc`** after hydration. The application SHALL NOT be required to decode or migrate links produced by the previous Base64 URL-safe-only encoder.

#### Scenario: Restore after reload

- **WHEN** the user opens a URL that contains a valid encounter payload and the catalog has loaded
- **THEN** the encounter MUST be populated to match the decoded monster id sequence (unknown ids MAY be skipped; valid ids MUST be applied in order).

#### Scenario: Share link

- **WHEN** two users open the same URL with the same `enc` value after the catalog loads
- **THEN** both MUST see the same encounter composition (same ids in the same order).

#### Scenario: URL updates on edit

- **WHEN** the user adds or removes monsters in the encounter
- **THEN** the URL query parameter MUST be updated to reflect the new state without requiring a full page reload.
