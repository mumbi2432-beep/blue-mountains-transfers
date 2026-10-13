#!/usr/bin/env node
// Rank areas from an ABS Census export so you can decide which to launch.
//
//   node scripts/rank-areas.mjs census.csv
//
// CSV (header row required, one row per suburb or LGA, from ABS TableBuilder / DataPacks):
//   area,total_pop,nepal_born,nepali_language,nepalese_ancestry
// The three Nepal columns are optional individually, but at least one is needed. They overlap (the same person
// can be in all three), so the score is the HIGHEST of them, not the sum. Output is ranked by score, with share of
// population, and flags rows that match an area already in src/data/areas.ts.
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) { console.error("usage: node scripts/rank-areas.mjs census.csv"); process.exit(1); }

const lines = readFileSync(file, "utf8").split(/\r?\n/).filter((l) => l.trim());
const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
const idx = (k) => header.indexOf(k);
if (idx("area") < 0) { console.error("missing column: area"); process.exit(1); }
const cols = ["nepal_born", "nepali_language", "nepalese_ancestry"].filter((c) => idx(c) >= 0);
if (!cols.length) { console.error("need at least one of: nepal_born, nepali_language, nepalese_ancestry"); process.exit(1); }

// Existing areas from the data file (name -> slug) so you can see what is already configured.
const src = readFileSync(new URL("../src/data/areas.ts", import.meta.url), "utf8");
const known = new Map();
for (const m of src.matchAll(/slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*type:\s*"(suburb|lga)",\s*state:\s*"(\w+)"[^}]*?launch:\s*(true|false)/g)) {
	known.set(m[2].toLowerCase(), { slug: m[1], launch: m[5] === "true" });
}

const num = (v) => Number(String(v ?? "").replace(/[^\d.]/g, "")) || 0;
const rows = lines.slice(1).map((l) => {
	const c = l.split(",");
	const score = Math.max(...cols.map((k) => num(c[idx(k)])));
	const pop = num(c[idx("total_pop")]);
	return { area: c[idx("area")].trim(), score, pop, share: pop ? (score / pop) * 100 : 0 };
}).filter((r) => r.score > 0).sort((a, b) => b.score - a.score);

console.log("rank  area                          nepali  share   in areas.ts");
rows.forEach((r, i) => {
	const k = known.get(r.area.toLowerCase());
	console.log(
		String(i + 1).padEnd(5), r.area.padEnd(29), String(r.score).padEnd(7),
		(r.share.toFixed(1) + "%").padEnd(7), k ? `${k.slug} (launch: ${k.launch})` : "NOT YET ADDED",
	);
});
console.log("\nNext: for each top row marked NOT YET ADDED, add an entry to src/data/areas.ts with a short unique blurb and launch: true.");
