import {
  encounterToPayload,
  parseEncounterJsonPayload,
  type EncounterUrlPayload,
} from "./encounterUrlCodec";

const STORAGE_KEY = "dh-monster-lib.encounter.v2";

export function loadPersistedEncounterIds(): string[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const payload = parseEncounterJsonPayload(raw);
    if (!payload) return null;
    return payload.ids;
  } catch {
    return null;
  }
}

export function savePersistedEncounterIds(ids: string[]): void {
  try {
    const payload: EncounterUrlPayload = encounterToPayload(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("[encounter] localStorage save failed", e);
  }
}
