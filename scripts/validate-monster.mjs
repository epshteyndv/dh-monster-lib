/**
 * Daggerheart card validation (shared between build script and tooling).
 * @param {unknown} m
 * @param {number} index
 * @returns {string[]} error messages (empty if valid)
 */

const ROLES = new Set([
  "Bruiser",
  "Horde",
  "Leader",
  "Minion",
  "Ranged",
  "Skulk",
  "Social",
  "Solo",
  "Standard",
  "Support",
]);

const ATTACK_RANGES = new Set([
  "Melee",
  "Very Close",
  "Close",
  "Far",
  "Very Far",
]);

export function validateMonsterRecord(m, index) {
  const prefix = `monsters[${index}]`;
  const errs = [];

  const id = m && typeof m === "object" && typeof m.id === "string" ? m.id : null;
  const label = id ? `${prefix} (id="${id}")` : prefix;

  if (!m || typeof m !== "object") {
    errs.push(`${prefix}: not an object`);
    return errs;
  }

  const str = (key) =>
    typeof m[key] === "string" && m[key].trim() ? m[key].trim() : null;

  if (Object.hasOwn(m, "tierLevel") || Object.hasOwn(m, "tierRole")) {
    errs.push(
      `${label}: deprecated fields "tierLevel" and "tierRole"; use "tier" (integer) and "role" (enum) instead`
    );
  }

  if (typeof m.tier === "string") {
    errs.push(
      `${label}: "tier" must be a number (integer ≥ 1), not a string`
    );
  } else if (typeof m.tier !== "number" || !Number.isInteger(m.tier)) {
    errs.push(`${label}: tier must be an integer`);
  } else if (m.tier < 1) {
    errs.push(`${label}: tier must be >= 1`);
  }

  const roleTrim = typeof m.role === "string" ? m.role.trim() : "";
  if (!roleTrim) {
    errs.push(`${label}: missing or empty string field "role"`);
  } else if (!ROLES.has(roleTrim)) {
    errs.push(
      `${label}: role must be one of: ${[...ROLES].sort().join(", ")}`
    );
  }

  for (const key of ["id", "name"]) {
    if (!str(key)) {
      errs.push(`${label}: missing or empty string field "${key}"`);
    }
  }

  if (Object.hasOwn(m, "flavor")) {
    if (typeof m.flavor !== "string" || !m.flavor.trim()) {
      errs.push(
        `${label}: when set, "flavor" must be a non-empty string`
      );
    }
  }

  if (Object.hasOwn(m, "motives")) {
    if (typeof m.motives !== "string" || !m.motives.trim()) {
      errs.push(
        `${label}: when set, "motives" must be a non-empty string`
      );
    }
  }

  if (Object.hasOwn(m, "experience")) {
    if (!Array.isArray(m.experience)) {
      errs.push(`${label}: "experience" must be an array of strings when set`);
    } else {
      m.experience.forEach((line, ei) => {
        if (typeof line !== "string" || !line.trim()) {
          errs.push(
            `${label}: experience[${ei}] must be a non-empty string`
          );
        }
      });
    }
  }

  if (!m.stats || typeof m.stats !== "object") {
    errs.push(`${label}: missing object "stats"`);
  } else {
    const s = m.stats;
    if (typeof s.difficulty !== "number" || Number.isNaN(s.difficulty)) {
      errs.push(`${label}: stats.difficulty must be a number`);
    }
    if (typeof s.thresholds !== "string" || !s.thresholds.trim()) {
      errs.push(`${label}: stats.thresholds must be a non-empty string`);
    }
    if (typeof s.hp !== "number" || Number.isNaN(s.hp)) {
      errs.push(`${label}: stats.hp must be a number`);
    }
    if (typeof s.stress !== "number" || Number.isNaN(s.stress)) {
      errs.push(`${label}: stats.stress must be a number`);
    }
    if (!s.attack || typeof s.attack !== "object") {
      errs.push(`${label}: missing object stats.attack`);
    } else {
      const a = s.attack;
      if (typeof a.atk !== "number" || Number.isNaN(a.atk)) {
        errs.push(`${label}: stats.attack.atk must be a number`);
      }
      for (const k of ["name", "damage"]) {
        if (typeof a[k] !== "string" || !a[k].trim()) {
          errs.push(`${label}: stats.attack.${k} must be a non-empty string`);
        }
      }
      if (typeof a.range !== "string" || !a.range.trim()) {
        errs.push(`${label}: stats.attack.range must be a non-empty string`);
      } else if (!ATTACK_RANGES.has(a.range.trim())) {
        errs.push(
          `${label}: stats.attack.range must be one of: ${[...ATTACK_RANGES].join(", ")}`
        );
      }
    }
  }

  if (!Array.isArray(m.features) || m.features.length === 0) {
    errs.push(`${label}: "features" must be a non-empty array`);
  } else {
    const allowed = new Set(["passive", "action", "reaction"]);
    m.features.forEach((f, fi) => {
      if (!f || typeof f !== "object") {
        errs.push(`${label}: features[${fi}] is not an object`);
        return;
      }
      if (Object.hasOwn(f, "cost")) {
        errs.push(
          `${label}: features[${fi}]: deprecated field "cost"; use "value" (string) instead`
        );
      }
      if (typeof f.name !== "string" || !f.name.trim()) {
        errs.push(`${label}: features[${fi}].name must be a non-empty string`);
      }
      if (typeof f.type !== "string" || !allowed.has(f.type)) {
        errs.push(
          `${label}: features[${fi}].type must be one of passive, action, reaction`
        );
      }
      if (typeof f.description !== "string" || !f.description.trim()) {
        errs.push(
          `${label}: features[${fi}].description must be a non-empty string`
        );
      }
      if (f.value !== undefined && f.value !== null) {
        if (typeof f.value !== "string" || !f.value.trim()) {
          errs.push(
            `${label}: features[${fi}].value must be a non-empty string when set`
          );
        }
      }
    });
  }

  return errs;
}
