import { create } from "zustand";
import { loadCatalog } from "../catalog";
import type { Monster } from "../types";

export type CatalogStore = {
  monsters: Monster[];
  loading: boolean;
  error: string | null;
  fetchCatalog: () => Promise<void>;
};

export const useCatalogStore = create<CatalogStore>((set) => ({
  monsters: [],
  loading: true,
  error: null,
  fetchCatalog: async () => {
    set({ loading: true, error: null });
    try {
      const catalog = await loadCatalog();
      set({
        monsters: catalog.monsters,
        loading: false,
        error: null,
      });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : String(e),
        loading: false,
      });
    }
  },
}));
