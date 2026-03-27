/** Daggerheart-style monster card (YAML / JSON catalog). */

export type FeatureType = "passive" | "action" | "reaction";

export interface MonsterAttack {
  atk: number;
  name: string;
  range: string;
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
  /** e.g. Relentless (3) */
  cost?: number;
}

export interface Monster {
  id: string;
  name: string;
  tier: string;
  flavor: string;
  motives: string;
  experience: string;
  stats: MonsterStats;
  features: MonsterFeature[];
}

export interface Catalog {
  monsters: Monster[];
}
