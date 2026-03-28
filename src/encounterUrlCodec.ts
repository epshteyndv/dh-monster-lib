/** Query param name for the encoded encounter payload. */
export const ENCOUNTER_URL_PARAM = "enc";

/** Current wire format version; bump when JSON shape changes. */
export const ENCOUNTER_URL_VERSION = 1;

export type EncounterUrlPayload = {
  v: number;
  ids: string[];
};

/** Skip writing `enc` if the encoded value would exceed this (typical URL limits). */
export const MAX_ENCOUNTER_URL_PARAM_LENGTH = 8192;

function utf8ToBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToUtf8(encoded: string): string | null {
  let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function isEncounterUrlPayload(value: unknown): value is EncounterUrlPayload {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  if (typeof o.v !== "number" || !Array.isArray(o.ids)) return false;
  return o.ids.every((x) => typeof x === "string");
}

export function encodeEncounterPayload(payload: EncounterUrlPayload): string {
  return utf8ToBase64Url(JSON.stringify(payload));
}

export function decodeEncounterPayload(encoded: string): EncounterUrlPayload | null {
  const json = base64UrlToUtf8(encoded.trim());
  if (!json) return null;
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
