import type { Monster } from "./types";

export interface EncounterEntry {
  instanceId: string;
  monster: Monster;
}

export type EncounterState = {
  encounter: EncounterEntry[];
};

export type EncounterAction =
  | { type: "ADD"; monster: Monster }
  | { type: "REMOVE"; instanceId: string };

export function encounterReducer(
  state: EncounterState,
  action: EncounterAction
): EncounterState {
  switch (action.type) {
    case "ADD": {
      const instanceId = crypto.randomUUID();
      const entry: EncounterEntry = { instanceId, monster: action.monster };
      return {
        encounter: [...state.encounter, entry],
      };
    }
    case "REMOVE": {
      const idx = state.encounter.findIndex(
        (e) => e.instanceId === action.instanceId
      );
      if (idx === -1) return state;
      const next = state.encounter.filter(
        (e) => e.instanceId !== action.instanceId
      );
      return { encounter: next };
    }
    default:
      return state;
  }
}
