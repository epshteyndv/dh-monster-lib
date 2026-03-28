import { create } from "zustand";
import { encounterReducer, type EncounterState } from "../encounterState";
import type { Monster } from "../types";

export type EncounterStore = EncounterState & {
  addMonster: (monster: Monster) => void;
  removeEntry: (instanceId: string) => void;
  focusEntry: (instanceId: string) => void;
};

export const useEncounterStore = create<EncounterStore>((set) => ({
  encounter: [],
  focusedId: null,
  addMonster: (monster) =>
    set((s) => ({
      ...s,
      ...encounterReducer(
        { encounter: s.encounter, focusedId: s.focusedId },
        { type: "ADD", monster }
      ),
    })),
  removeEntry: (instanceId) =>
    set((s) => ({
      ...s,
      ...encounterReducer(
        { encounter: s.encounter, focusedId: s.focusedId },
        { type: "REMOVE", instanceId }
      ),
    })),
  focusEntry: (instanceId) =>
    set((s) => ({
      ...s,
      ...encounterReducer(
        { encounter: s.encounter, focusedId: s.focusedId },
        { type: "FOCUS", instanceId }
      ),
    })),
}));
