import { create } from "zustand";
import { encounterReducer, type EncounterState } from "../encounterState";
import type { Monster } from "../types";

export type EncounterStore = EncounterState & {
  addMonster: (monster: Monster) => void;
  removeEntry: (instanceId: string) => void;
};

export const useEncounterStore = create<EncounterStore>((set) => ({
  encounter: [],
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
}));
