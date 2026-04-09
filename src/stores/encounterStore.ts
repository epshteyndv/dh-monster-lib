import { create } from "zustand";
import { clampPartySize } from "../encounterDifficulty";
import {
  encounterReducer,
  type EncounterEntry,
  type EncounterState,
} from "../encounterState";
import type { Monster } from "../types";

export type EncounterStore = EncounterState & {
  /** Party size for encounter difficulty (Minion groups); clamped 1–12 in `setPartySize`. */
  partySize: number;
  setPartySize: (n: number) => void;
  addMonster: (monster: Monster) => void;
  removeEntry: (instanceId: string) => void;
  setEncounterFromIds: (
    ids: string[],
    monstersById: ReadonlyMap<string, Monster>
  ) => void;
};

export const useEncounterStore = create<EncounterStore>((set) => ({
  encounter: [],
  partySize: 4,
  setPartySize: (n) =>
    set(() => ({
      partySize: clampPartySize(n),
    })),
  addMonster: (monster) =>
    set((s) => ({
      ...s,
      ...encounterReducer({ encounter: s.encounter }, { type: "ADD", monster }),
    })),
  removeEntry: (instanceId) =>
    set((s) => ({
      ...s,
      ...encounterReducer(
        { encounter: s.encounter },
        { type: "REMOVE", instanceId }
      ),
    })),
  setEncounterFromIds: (ids, monstersById) =>
    set(() => {
      const encounter: EncounterEntry[] = [];
      for (const id of ids) {
        const m = monstersById.get(id);
        if (m) encounter.push({ instanceId: crypto.randomUUID(), monster: m });
      }
      return { encounter };
    }),
}));
