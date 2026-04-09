## ADDED Requirements

### Requirement: Encounter difficulty and party strength in header

The application SHALL show, in the **header row** of the main catalog/encounter page (alongside the primary page title and the control that opens the add-monster overlay), the current **encounter difficulty** and **party strength**, and SHALL provide a control to set **party size** in that same header region. Labels MUST be human-readable (consistent with the rest of the UI language). The encounter difficulty MUST be computed from the ordered encounter entries using the role on each entry’s monster and the selected party size, according to the rules below. The party strength MUST equal **`(3 × party size) + 2`** where **party size** is the user-selected positive integer.

**Difficulty rules** (integer score; apply in order conceptually, all additions and penalties are to the same running total):

- **Empty encounter:** if there are **no** encounter entries, the difficulty MUST be **`0`** (no other rules apply).
- **Minion:** `+1` for each **full group** of Minions equal to party size: let `minionCount` be the number of encounter entries whose monster `role` is `Minion`; the contribution MUST be **`floor(minionCount / partySize)`** when `partySize ≥ 1`; if `minionCount` is zero, the contribution MUST be `0`.
- **Social** or **Support:** `+1` per encounter entry whose monster `role` is `Social` or `Support`.
- **Horde, Ranged, Skulk, or Standard:** `+2` per encounter entry whose monster `role` is one of `Horde`, `Ranged`, `Skulk`, `Standard`.
- **Leader:** `+3` per encounter entry whose monster `role` is `Leader`.
- **Bruiser:** `+4` per encounter entry whose monster `role` is `Bruiser`.
- **Solo:** `+5` per encounter entry whose monster `role` is `Solo`, **plus** an additional `+2` if there are **two or more** such entries in the encounter.
- **Penalty:** if the encounter is **non-empty** and there is **no** encounter entry whose monster `role` is `Bruiser`, `Horde`, `Leader`, or `Solo`, the score MUST apply **`−1`**.

#### Scenario: Empty encounter shows zero difficulty

- **WHEN** the encounter has no entries
- **THEN** the displayed encounter difficulty MUST be `0` regardless of party size.

#### Scenario: Party strength formula

- **WHEN** the user sets party size to a positive integer `n`
- **THEN** the displayed party strength MUST be `3 * n + 2`.

#### Scenario: Header shows both values and party size control

- **WHEN** the catalog has loaded and the main page header is visible
- **THEN** the user MUST be able to see encounter difficulty, party strength, and change party size without leaving the header band.

## MODIFIED Requirements

### Requirement: Monster list and detail view

The application MUST make the full catalog of monsters available for **adding to the encounter** through a **dedicated control in the page header** (for example a button next to the page title). Activating that control MUST open a **dismissible overlay** (for example a modal) that lists catalog monsters available for selection. The overlay MUST implement **Add overlay catalog filters** so the user MAY narrow the list by tier and role as specified there. Each row in the filtered list MUST show the monster **name** and a **tier line** readable as **`Tier {tier} {role}`**. **When** the user selects a monster in that overlay list, the application MUST append a new encounter entry for that monster (without removing prior entries) and MUST **close** the overlay. The main layout MUST show each encounter entry as a full **Monster card** on the main page surface in encounter order so that monster fields are readable on each card (at minimum `id` and `name`, plus additional fields on the card); see **Encounter cards and removal**. The application MUST NOT rely on a permanent sidebar catalog whose primary action is click-to-add to the encounter. The **page header** MUST also implement **Encounter difficulty and party strength in header** so encounter difficulty, party strength, and party size selection appear in the same header region as the add-to-encounter control.

#### Scenario: Open add overlay from header

- **WHEN** the catalog JSON has loaded and the user activates the header add-to-encounter control
- **THEN** the UI MUST show an overlay containing the monster list and tier/role filter controls.

#### Scenario: List entry shows tier and role in overlay

- **WHEN** the add overlay is visible
- **THEN** each monster row MUST display **`Tier {tier} {role}`** with the same structured `tier` and `role` as the card, and MUST NOT rely on legacy combined tier strings.

#### Scenario: Select monster adds and closes overlay

- **WHEN** the user selects a monster in the add overlay list
- **THEN** the application MUST append a new encounter entry for that monster and MUST close the overlay.

#### Scenario: Browse catalog for adding

- **WHEN** the user needs to add monsters to the encounter
- **THEN** they MUST be able to do so via the header-driven overlay list (not only via an always-visible sidebar whose rows add on click).
