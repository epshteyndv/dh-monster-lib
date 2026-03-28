import type { Monster } from "./types";

export interface EncounterEntry {
  instanceId: string;
  monster: Monster;
}

export type EncounterState = {
  encounter: EncounterEntry[];
  /** Which encounter entry’s card is shown; `null` when encounter is empty. */
  focusedId: string | null;
};

export type EncounterAction =
  | { type: "ADD"; monster: Monster }
  | { type: "REMOVE"; instanceId: string }
  | { type: "FOCUS"; instanceId: string };

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
        focusedId: instanceId,
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
      let focusedId = state.focusedId;
      if (state.focusedId === action.instanceId) {
        if (next.length === 0) focusedId = null;
        else if (idx < next.length) focusedId = next[idx].instanceId;
        else focusedId = next[next.length - 1].instanceId;
      }
      return { encounter: next, focusedId };
    }
    case "FOCUS": {
      if (!state.encounter.some((e) => e.instanceId === action.instanceId)) {
        return state;
      }
      return { ...state, focusedId: action.instanceId };
    }
    default:
      return state;
  }
}
