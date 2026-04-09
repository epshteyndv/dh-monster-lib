import type { MonsterRole } from "./types";

/** Roles that avoid the −1 penalty when at least one is present. */
const PENALTY_EXEMPT = new Set<MonsterRole>([
  "Bruiser",
  "Horde",
  "Leader",
  "Solo",
]);

/** Party strength: (3 × party size) + 2. */
export function computePartyStrength(partySize: number): number {
  const n = clampPartySize(partySize);
  return 3 * n + 2;
}

export const PARTY_SIZE_MIN = 1;
export const PARTY_SIZE_MAX = 12;

export function clampPartySize(n: number): number {
  if (!Number.isFinite(n)) return 4;
  return Math.min(PARTY_SIZE_MAX, Math.max(PARTY_SIZE_MIN, Math.floor(n)));
}

/**
 * Daggerheart-style encounter difficulty from roles in encounter order (order does not matter for this sum).
 * Empty encounter → 0.
 */
export function computeEncounterDifficulty(
  roles: MonsterRole[],
  partySize: number
): number {
  if (roles.length === 0) return 0;

  const ps = clampPartySize(partySize);
  const counts = new Map<MonsterRole, number>();
  for (const r of roles) {
    counts.set(r, (counts.get(r) ?? 0) + 1);
  }

  let score = 0;

  const minionCount = counts.get("Minion") ?? 0;
  score += Math.floor(minionCount / ps);

  score += (counts.get("Social") ?? 0) + (counts.get("Support") ?? 0);

  for (const r of ["Horde", "Ranged", "Skulk", "Standard"] as const) {
    score += 2 * (counts.get(r) ?? 0);
  }

  score += 3 * (counts.get("Leader") ?? 0);
  score += 4 * (counts.get("Bruiser") ?? 0);

  const soloCount = counts.get("Solo") ?? 0;
  score += 5 * soloCount;
  if (soloCount >= 2) score += 2;

  const hasBruiserHordeLeaderOrSolo = roles.some((r) => PENALTY_EXEMPT.has(r));
  if (!hasBruiserHordeLeaderOrSolo) score -= 1;

  return score;
}
