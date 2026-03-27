/**
 * Читает data/monsters.yaml, проверяет уникальность id и записывает public/monsters.json.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

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

for (let i = 0; i < doc.monsters.length; i++) {
  const m = doc.monsters[i];
  if (!m || typeof m !== "object") {
    console.error(`monsters[${i}] is not an object`);
    process.exit(1);
  }
  if (typeof m.id !== "string" || !m.id.trim()) {
    console.error(`monsters[${i}] missing string field "id"`);
    process.exit(1);
  }
  if (typeof m.name !== "string" || !m.name.trim()) {
    console.error(`monsters[${i}] missing string field "name"`);
    process.exit(1);
  }
  if (seen.has(m.id)) {
    console.error(`Duplicate monster id: "${m.id}" (indices ${seen.get(m.id)} and ${i})`);
    process.exit(1);
  }
  seen.set(m.id, i);
  monsters.push(m);
}

await mkdir(outDir, { recursive: true });
await writeFile(outFile, JSON.stringify({ monsters }, null, 2), "utf8");
console.log(`Wrote ${monsters.length} monsters to ${outFile}`);
