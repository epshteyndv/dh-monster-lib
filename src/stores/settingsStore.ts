import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { clampPartySize } from "../encounterDifficulty";

const SETTINGS_STORAGE_KEY = "dh-monster-settings";

export type SettingsStore = {
  partySize: number;
  setPartySize: (n: number) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      partySize: 4,
      setPartySize: (n) =>
        set(() => ({
          partySize: clampPartySize(n),
        })),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SettingsStore> | undefined;
        return {
          ...currentState,
          partySize: clampPartySize(persisted?.partySize ?? currentState.partySize),
        };
      },
    }
  )
);
