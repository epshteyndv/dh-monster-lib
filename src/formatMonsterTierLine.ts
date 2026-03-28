import type { Monster } from "./types";

/** Same tier phrase as the card header and list rows: `Tier 1 Solo`. */
export function formatMonsterTierLine(
  m: Pick<Monster, "tier" | "role">
): string {
  return `Tier ${m.tier} ${m.role}`;
}
