import { useEffect, useRef } from "react";
import {
  decodeEncounterPayload,
  encodeEncounterPayload,
  encounterToPayload,
  ENCOUNTER_URL_PARAM,
  MAX_ENCOUNTER_URL_PARAM_LENGTH,
} from "./encounterUrlCodec";
import { useEncounterStore } from "./stores/encounterStore";
import type { Monster } from "./types";

/**
 * Hydrates encounter from `?enc=` once after catalog load, then keeps the URL in sync via
 * `history.replaceState` (no extra history entries).
 */
export function useEncounterUrlSync(options: {
  loading: boolean;
  monsters: Monster[];
}): void {
  const { loading, monsters } = options;
  const setEncounterFromIds = useEncounterStore((s) => s.setEncounterFromIds);
  const encounter = useEncounterStore((s) => s.encounter);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const raw = params.get(ENCOUNTER_URL_PARAM);
    if (!raw) return;

    const payload = decodeEncounterPayload(raw);
    if (!payload) return;

    const monstersById = new Map(monsters.map((m) => [m.id, m]));
    setEncounterFromIds(payload.ids, monstersById);
  }, [loading, monsters, setEncounterFromIds]);

  useEffect(() => {
    if (loading) return;

    const ids = useEncounterStore
      .getState()
      .encounter.map((e) => e.monster.id);
    const encoded = encodeEncounterPayload(encounterToPayload(ids));

    if (encoded.length > MAX_ENCOUNTER_URL_PARAM_LENGTH) {
      console.warn(
        "[encounter] URL param too long; not updating enc (limit %s)",
        MAX_ENCOUNTER_URL_PARAM_LENGTH
      );
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (ids.length === 0) {
      params.delete(ENCOUNTER_URL_PARAM);
    } else {
      params.set(ENCOUNTER_URL_PARAM, encoded);
    }

    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ""}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (next !== current) {
      history.replaceState(null, "", next);
    }
  }, [loading, encounter]);
}
