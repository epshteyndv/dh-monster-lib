/**
 * Читает все `data/monsters/*.yaml`, валидирует карточки Daggerheart, пишет public/monsters.json.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { validateMonsterRecord } from "./validate-monster.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const monstersDir = join(root, "data", "monsters");
const outDir = join(root, "public");
const outFile = join(outDir, "monsters.json");

let dirents;
try {
  dirents = await readdir(monstersDir, { withFileTypes: true });
} catch (e) {
  console.error(`Cannot read ${monstersDir}:`, e.message);
  process.exit(1);
}

const yamlFiles = dirents
  .filter((d) => d.isFile() && d.name.endsWith(".yaml"))
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b));

if (yamlFiles.length === 0) {
  console.error("No .yaml files found in data/monsters/");
  process.exit(1);
}

const merged = [];

for (const name of yamlFiles) {
  const filePath = join(monstersDir, name);
  const raw = await readFile(filePath, "utf8");
  let doc;
  try {
    doc = YAML.parse(raw);
  } catch (e) {
    console.error(`YAML parse error in ${filePath}:`, e.message);
    process.exit(1);
  }
  if (!doc || typeof doc !== "object" || !Array.isArray(doc.monsters)) {
    console.error(
      `Expected top-level key \`monsters\` with an array in ${filePath}`
    );
    process.exit(1);
  }
  for (const m of doc.monsters) {
    merged.push({ file: name, monster: m });
  }
}

if (merged.length === 0) {
  console.error(
    "No monsters found: every data/monsters/*.yaml file has an empty `monsters` array"
  );
  process.exit(1);
}

const seen = new Map();
const monsters = [];
const allErrors = [];

for (let i = 0; i < merged.length; i++) {
  const { file, monster: m } = merged[i];
  const errs = validateMonsterRecord(m, i);
  if (errs.length) {
    for (const err of errs) {
      allErrors.push(`${file}: ${err}`);
    }
    continue;
  }
  if (typeof m.id !== "string" || !m.id.trim()) {
    allErrors.push(`${file}: monsters[${i}]: missing string field "id"`);
    continue;
  }
  if (seen.has(m.id)) {
    const prevFile = seen.get(m.id);
    allErrors.push(
      `Duplicate monster id: "${m.id}" (in ${prevFile} and ${file})`
    );
    continue;
  }
  seen.set(m.id, file);
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
console.log(
  `Wrote ${monsters.length} monsters from ${yamlFiles.length} file(s) to ${outFile}`
);
