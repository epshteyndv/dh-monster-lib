## Context

`App.tsx` renders the sidebar as `Button` components with `{m.name}` only. `MonsterCard` already shows `Tier {monster.tier} {monster.role}` under the title. Catalog JSON always includes `tier` and `role` for valid monsters.

## Goals / Non-Goals

**Goals:**

- Show `Tier {tier} {role}` on every monster list row, visually paired with the name.
- Keep Mantine `Button` (or equivalent) for selection behavior and accessibility.

**Non-Goals:**

- Changing JSON schema, validation, or the detail card layout.
- Sorting or filtering the list by tier (future enhancement).

## Decisions

1. **Layout inside the list control** — Use Mantine `Button` with `children` as a small vertical `Stack`: first line **name** (`fw={600}` or default), second line **`Tier {tier} {role}`** (`size="xs"`, `c="dimmed"`). Rationale: matches card hierarchy, works with `fullWidth` and `justify="flex-start"`.

2. **Single source for the tier string** — Add a tiny helper in `src/` (e.g. `formatMonsterTierLine(monster: Pick<Monster, "tier" | "role">): string` returning `` `Tier ${tier} ${role}` ``) and use it in both `App` and `MonsterCard` so list and card never drift. Rationale: one phrase, one function.

## Risks / Trade-offs

- **[Risk]** Taller list rows on small screens — **Mitigation:** keep second line `xs`; acceptable for two-line rows.

## Migration Plan

Deploy with the next site build; no data migration.

## Open Questions

- None.
