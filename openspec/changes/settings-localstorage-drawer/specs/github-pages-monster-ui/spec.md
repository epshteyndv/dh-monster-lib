## ADDED Requirements

### Requirement: Settings drawer from header

The application SHALL provide a **settings drawer** anchored to the **left** side of the viewport. The drawer SHALL be reachable from the main page header via an explicit settings control (for example a button or icon button). Opening the drawer MUST NOT navigate away from the page and MUST preserve current encounter entries.

#### Scenario: Open settings drawer

- **WHEN** the user activates the settings control in the header
- **THEN** a left-side drawer with editable settings MUST open.

### Requirement: Party size edited in settings drawer

The user-editable control for **party size** SHALL be located in the settings drawer (not inline in the header row). Changing party size in the drawer MUST update encounter difficulty and party strength displayed in the header immediately.

#### Scenario: Party size moved out of header

- **WHEN** the main page header is visible
- **THEN** the header MUST show encounter metrics but MUST NOT provide direct inline editing for party size.

#### Scenario: Drawer change updates header metrics

- **WHEN** the user changes party size in the settings drawer
- **THEN** displayed encounter difficulty and party strength MUST update without a full page reload.

## MODIFIED Requirements

### Requirement: Encounter difficulty and party strength in header

The application SHALL show, in the **header row** of the main catalog/encounter page (alongside the primary page title and the control that opens the add-monster overlay), the current **encounter difficulty** and **party strength**. The user-editable control for **party size** SHALL be provided in the **Settings drawer from header** and not inline in the header itself. Labels MUST be human-readable (consistent with the rest of the UI language). The encounter difficulty MUST be computed from the ordered encounter entries using the role on each entry’s monster and the selected party size, according to the rules below. The party strength MUST equal **`(3 × party size) + 2`** where **party size** is the user-selected positive integer.

**Difficulty rules** (integer score; apply in order conceptually, all additions and penalties are to the same running total):

- **Empty encounter:** if there are **no** encounter entries, the difficulty MUST be **`0`** (no other rules apply).
- **Minion:** `+1` for each **full group** of Minions equal to party size: let `minionCount` be the number of encounter entries whose monster `role` is `Minion`; the contribution MUST be **`floor(minionCount / partySize)`** when `partySize ≥ 1`; if `minionCount` is zero, the contribution MUST be `0`.
- **Social** or **Support:** `+1` per encounter entry whose monster `role` is `Social` or `Support`.
- **Horde, Ranged, Skulk, or Standard:** `+2` per encounter entry whose monster `role` is one of `Horde`, `Ranged`, `Skulk`, `Standard`.
- **Leader:** `+3` per encounter entry whose monster `role` is `Leader`.
- **Bruiser:** `+4` per encounter entry whose monster `role` is `Bruiser`.
- **Solo:** `+5` per encounter entry whose monster `role` is `Solo`, **plus** an additional `+2` if there are **two or more** such entries in the encounter.
- **Penalty:** if the encounter is **non-empty** and there is **no** encounter entry whose monster `role` is `Bruiser`, `Horde`, `Leader`, or `Solo`, the score MUST apply **`−1`**.

#### Scenario: Header shows metrics while settings are elsewhere

- **WHEN** the catalog has loaded and the main page header is visible
- **THEN** the header MUST show encounter difficulty and party strength, while party size editing is available via the settings drawer.
