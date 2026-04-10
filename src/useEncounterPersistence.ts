import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  decodeEncounterPayload,
  ENCOUNTER_SHARE_URL_PARAM,
  ENCOUNTER_URL_PARAM,
} from "./encounterUrlCodec";
import { loadPersistedEncounterIds, savePersistedEncounterIds } from "./encounterPersistence";
import { useEncounterStore } from "./stores/encounterStore";
import type { Monster } from "./types";

/**
 * One-shot bootstrap from `?share=`, otherwise from localStorage; strips `share` and `enc`
 * from the URL. Persists encounter ids to localStorage after bootstrap and on every change.
 */
export function useEncounterPersistence(options: {
  loading: boolean;
  monsters: Monster[];
}): void {
  const { loading, monsters } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const setEncounterFromIds = useEncounterStore((s) => s.setEncounterFromIds);
  const encounter = useEncounterStore((s) => s.encounter);
  const bootstrapDoneRef = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (bootstrapDoneRef.current) return;

    const monstersById = new Map(monsters.map((m) => [m.id, m]));
    const params = new URLSearchParams(searchParams);

    let sharePayload: ReturnType<typeof decodeEncounterPayload> = null;
    if (params.has(ENCOUNTER_SHARE_URL_PARAM)) {
      const shareRaw = params.get(ENCOUNTER_SHARE_URL_PARAM) ?? "";
      sharePayload = decodeEncounterPayload(shareRaw);
      params.delete(ENCOUNTER_SHARE_URL_PARAM);
    }

    if (sharePayload) {
      setEncounterFromIds(sharePayload.ids, monstersById);
    } else {
      const storedIds = loadPersistedEncounterIds();
      if (storedIds !== null) {
        setEncounterFromIds(storedIds, monstersById);
      }
    }

    params.delete(ENCOUNTER_URL_PARAM);

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }

    bootstrapDoneRef.current = true;
  }, [loading, monsters, searchParams, setEncounterFromIds, setSearchParams]);

  useEffect(() => {
    if (loading) return;
    if (!bootstrapDoneRef.current) return;
    const ids = useEncounterStore
      .getState()
      .encounter.map((e) => e.monster.id);
    savePersistedEncounterIds(ids);
  }, [loading, encounter]);
}
