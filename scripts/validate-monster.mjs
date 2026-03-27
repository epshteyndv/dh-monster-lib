/**
 * Daggerheart card validation (shared between build script and tooling).
 * @param {unknown} m
 * @param {number} index
 * @returns {string[]} error messages (empty if valid)
 */
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

  for (const key of ["id", "name", "tier", "flavor", "motives", "experience"]) {
    if (!str(key)) {
      errs.push(`${label}: missing or empty string field "${key}"`);
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
      for (const k of ["name", "range", "damage"]) {
        if (typeof a[k] !== "string" || !a[k].trim()) {
          errs.push(`${label}: stats.attack.${k} must be a non-empty string`);
        }
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
      if (f.cost !== undefined && f.cost !== null) {
        if (typeof f.cost !== "number" || Number.isNaN(f.cost)) {
          errs.push(`${label}: features[${fi}].cost must be a number when set`);
        }
      }
    });
  }

  return errs;
}
