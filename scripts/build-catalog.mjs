/**
 * Читает data/monsters.yaml, валидирует карточки Daggerheart, пишет public/monsters.json.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { validateMonsterRecord } from "./validate-monster.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const yamlPath = join(root, "data", "monsters.yaml");
const outDir = join(root, "public");
const outFile = join(outDir, "monsters.json");

const raw = await readFile(yamlPath, "utf8");
let doc;
try {
  doc = YAML.parse(raw);
} catch (e) {
  console.error("YAML parse error:", e.message);
  process.exit(1);
}

if (!doc || typeof doc !== "object" || !Array.isArray(doc.monsters)) {
  console.error("Expected top-level key `monsters` with an array in data/monsters.yaml");
  process.exit(1);
}

const seen = new Map();
const monsters = [];
const allErrors = [];

for (let i = 0; i < doc.monsters.length; i++) {
  const m = doc.monsters[i];
  const errs = validateMonsterRecord(m, i);
  if (errs.length) {
    allErrors.push(...errs);
    continue;
  }
  if (typeof m.id !== "string" || !m.id.trim()) {
    allErrors.push(`monsters[${i}]: missing string field "id"`);
    continue;
  }
  if (seen.has(m.id)) {
    allErrors.push(
      `Duplicate monster id: "${m.id}" (indices ${seen.get(m.id)} and ${i})`
    );
    continue;
  }
  seen.set(m.id, i);
  monsters.push(m);
}

if (allErrors.length) {
  console.error("Monster validation failed:");
  for (const line of allErrors) {
    console.error(`  - ${line}`);
  }
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
await writeFile(outFile, JSON.stringify({ monsters }, null, 2), "utf8");
console.log(`Wrote ${monsters.length} monsters to ${outFile}`);
