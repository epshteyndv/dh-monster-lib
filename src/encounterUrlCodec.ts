import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

/** Query param name for the encoded encounter payload (normal browsing). */
export const ENCOUNTER_URL_PARAM = "enc";

/**
 * Query param for one-shot share links. Same payload encoding as {@link ENCOUNTER_URL_PARAM};
 * after load the app replaces the URL with `enc` only.
 */
export const ENCOUNTER_SHARE_URL_PARAM = "share";

/**
 * Wire format version (JSON payload `v` field). Bump when JSON shape or outer encoding changes.
 * v1 was Base64 URL-safe; v2+ uses LZString on JSON.
 */
export const ENCOUNTER_URL_VERSION = 2;

export type EncounterUrlPayload = {
  v: number;
  ids: string[];
};

/** Skip writing `enc` if the encoded value would exceed this (typical URL limits). */
export const MAX_ENCOUNTER_URL_PARAM_LENGTH = 8192;

function isEncounterUrlPayload(value: unknown): value is EncounterUrlPayload {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  if (typeof o.v !== "number" || !Array.isArray(o.ids)) return false;
  return o.ids.every((x) => typeof x === "string");
}

export function encodeEncounterPayload(payload: EncounterUrlPayload): string {
  return compressToEncodedURIComponent(JSON.stringify(payload));
}

export function decodeEncounterPayload(encoded: string): EncounterUrlPayload | null {
  const json = decompressFromEncodedURIComponent(encoded.trim());
  if (json === "") return null;
  try {
    const parsed: unknown = JSON.parse(json);
    if (!isEncounterUrlPayload(parsed)) return null;
    if (parsed.v !== ENCOUNTER_URL_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function encounterToPayload(ids: string[]): EncounterUrlPayload {
  return { v: ENCOUNTER_URL_VERSION, ids };
}
