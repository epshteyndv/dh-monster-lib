import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  decodeEncounterPayload,
  encodeEncounterPayload,
  encounterToPayload,
  ENCOUNTER_SHARE_URL_PARAM,
  ENCOUNTER_URL_PARAM,
  MAX_ENCOUNTER_URL_PARAM_LENGTH,
} from "./encounterUrlCodec";
import { useEncounterStore } from "./stores/encounterStore";
import type { Monster } from "./types";

/**
 * Hydrates encounter from `?share=` (preferred one-shot) or `?enc=` once after catalog load,
 * canonicalizes `share` → `enc`, then keeps `enc` in sync via `setSearchParams(..., { replace: true })`.
 * Must run under React Router (inside `RouterProvider`).
 */
export function useEncounterUrlSync(options: {
  loading: boolean;
  monsters: Monster[];
}): void {
  const { loading, monsters } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const setEncounterFromIds = useEncounterStore((s) => s.setEncounterFromIds);
  const encounter = useEncounterStore((s) => s.encounter);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const monstersById = new Map(monsters.map((m) => [m.id, m]));
    const params = new URLSearchParams(searchParams);

    // If `share` is present, it wins over `enc` for initial hydration; invalid `share` falls back to `enc`.
    let payload: ReturnType<typeof decodeEncounterPayload> = null;
    if (params.has(ENCOUNTER_SHARE_URL_PARAM)) {
      const shareRaw = params.get(ENCOUNTER_SHARE_URL_PARAM) ?? "";
      payload = decodeEncounterPayload(shareRaw);
      params.delete(ENCOUNTER_SHARE_URL_PARAM);
      if (!payload) {
        const encRaw = params.get(ENCOUNTER_URL_PARAM);
        if (encRaw) payload = decodeEncounterPayload(encRaw);
      }
    } else {
      const encRaw = params.get(ENCOUNTER_URL_PARAM);
      if (encRaw) payload = decodeEncounterPayload(encRaw);
    }

    if (payload) {
      setEncounterFromIds(payload.ids, monstersById);
    }

    const ids = useEncounterStore
      .getState()
      .encounter.map((e) => e.monster.id);
    const encoded = encodeEncounterPayload(encounterToPayload(ids));

    if (encoded.length > MAX_ENCOUNTER_URL_PARAM_LENGTH) {
      params.delete(ENCOUNTER_URL_PARAM);
      console.warn(
        "[encounter] URL param too long after hydration; omitting enc (limit %s)",
        MAX_ENCOUNTER_URL_PARAM_LENGTH
      );
    } else {
      if (ids.length === 0) params.delete(ENCOUNTER_URL_PARAM);
      else params.set(ENCOUNTER_URL_PARAM, encoded);
    }

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [
    loading,
    monsters,
    searchParams,
    setEncounterFromIds,
    setSearchParams,
  ]);

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

    const params = new URLSearchParams(searchParams);
    params.delete(ENCOUNTER_SHARE_URL_PARAM);
    if (ids.length === 0) {
      params.delete(ENCOUNTER_URL_PARAM);
    } else {
      params.set(ENCOUNTER_URL_PARAM, encoded);
    }

    if (params.toString() === searchParams.toString()) {
      return;
    }

    setSearchParams(params, { replace: true });
  }, [loading, encounter, searchParams, setSearchParams]);
}
