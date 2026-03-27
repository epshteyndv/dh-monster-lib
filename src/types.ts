/** Daggerheart-style monster card (YAML / JSON catalog). */

export type FeatureType = "passive" | "action" | "reaction";

/** Allowed monster role labels (must match YAML exactly). */
export type MonsterRole =
  | "Bruiser"
  | "Horde"
  | "Leader"
  | "Minion"
  | "Ranged"
  | "Skulk"
  | "Social"
  | "Solo"
  | "Standard"
  | "Support";

/** Allowed primary attack range labels (must match YAML exactly). */
export type AttackRange =
  | "Melee"
  | "Very Close"
  | "Close"
  | "Far"
  | "Very Far";

export interface MonsterAttack {
  atk: number;
  name: string;
  range: AttackRange;
  damage: string;
}

export interface MonsterStats {
  difficulty: number;
  thresholds: string;
  hp: number;
  stress: number;
  attack: MonsterAttack;
}

export interface MonsterFeature {
  name: string;
  type: FeatureType;
  description: string;
  /** Parenthetical cost or dice, e.g. "3" or "1d6+3". */
  value?: string;
}

export interface Monster {
  id: string;
  name: string;
  /** Tier number (≥ 1), e.g. 1 for “Tier 1 …”. */
  tier: number;
  role: MonsterRole;
  flavor?: string;
  motives?: string;
  /** Optional lines (senses, traits); omit or [] when none. */
  experience?: string[];
  stats: MonsterStats;
  features: MonsterFeature[];
}

export interface Catalog {
  monsters: Monster[];
}
