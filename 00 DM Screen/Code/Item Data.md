---
hide_from_related: true
---

**Purpose:** The data side of the item search: downloads the 5e.tools item files, keeps them cached in the browser's own storage (nothing is written to the vault), turns them into searchable entries, and renders an entry's text. No interface here; [[Item Finder]] is the interface.

**Exports:** `loadItems`, `searchItems`, `itemMarkdown`, `cleanTags`, `normalizeAll`, `describeCost`

**Depends on:** [[Shared Helpers]]

**Used by:** [[Item Finder]]

Conventions this module relies on:

- **Where the data comes from.** `data_url_5etools` in [[Hub Config]] is the folder address of a 5e.tools data mirror (default: the `5etools-mirror-3/5etools-src` repository on raw.githubusercontent.com). Three files are used: `items.json` (magic and many other items), `items-base.json` (weapons, armor, gear, tools), and `magicvariants.json` (generic items such as "+1 Weapon", shown as templates).
- **Cache.** Each file is stored once in IndexedDB (database `hub-5etools`) the first time it is needed and read from there afterward, so the search works offline. Nothing refreshes by itself. The Refresh button in the finder downloads the files again.
- **Editions.** Entries from the 2024 books (XPHB, XDMG, XMM, and EFA) win over the same-named entry from an older book; the older sources are listed as "also in".
- **Costs.** 5e.tools stores values in copper pieces. Magic items without a stated value show the suggested value for their rarity from the 2024 DMG ([[Prices Card]]), halved for potions; check consumables and scrolls against the card.
- **Text.** 5e.tools markup such as `{@dice 1d6}` and `{@spell fireball}` is reduced to plain text. Tables and lists become Markdown.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Item Data.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const FILES = ["items.json", "items-base.json", "magicvariants.json"];

// Suggested value in gold by rarity (2024 DMG, see the Prices Card).
const RARITY_GP = { common: 100, uncommon: 400, rare: 4000, "very rare": 40000, legendary: 200000 };

const TYPE_LABEL = {
  A: "Ammunition", AF: "Ammunition", AIR: "Airship", AT: "Artisan's tools", EXP: "Explosive", FD: "Food and drink",
  G: "Adventuring gear", GS: "Gaming set", GV: "Generic variant", HA: "Heavy armor", INS: "Instrument", LA: "Light armor",
  M: "Melee weapon", MA: "Medium armor", MNT: "Mount", OTH: "Other", P: "Potion", R: "Ranged weapon", RD: "Rod",
  RG: "Ring", S: "Shield", SC: "Scroll", SCF: "Spellcasting focus", SHP: "Ship", SPC: "Spelljammer vehicle",
  T: "Tools", TAH: "Tack and harness", TB: "Tools", TG: "Trade good", VEH: "Vehicle", WD: "Wand",
  ST: "Staff", $A: "Art object", $C: "Treasure", $G: "Gemstone",
};

const PROPERTY_LABEL = {
  A: "Ammunition", AF: "Ammunition", BF: "Burst fire", F: "Finesse", H: "Heavy", L: "Light", LD: "Loading",
  R: "Reach", RLD: "Reload", S: "Special", T: "Thrown", V: "Versatile", "2H": "Two-handed",
};

const DAMAGE_LABEL = { S: "slashing", P: "piercing", B: "bludgeoning", N: "necrotic", R: "radiant", F: "fire", C: "cold", L: "lightning", A: "acid", O: "force", Y: "psychic", T: "thunder", I: "poison" };

const SOURCE_LABEL = {
  XPHB: "2024 PHB", XDMG: "2024 DMG", XMM: "2025 MM", PHB: "PHB (2014)", DMG: "DMG (2014)", MM: "MM (2014)",
  XGE: "Xanathar's", TCE: "Tasha's", EGW: "Explorer's Guide to Wildemount", VGM: "Volo's", MTF: "Mordenkainen's Tome of Foes",
  SCAG: "Sword Coast Guide", GGR: "Guildmasters' Guide", ERLW: "Eberron: Rising from the Last War", CoS: "Curse of Strahd",
  ToA: "Tomb of Annihilation", WDH: "Waterdeep: Dragon Heist", WDMM: "Waterdeep: Dungeon of the Mad Mage",
  BGG: "Bigby Presents", FTD: "Fizban's", BMT: "Book of Many Things", SCC: "Strixhaven", AAG: "Astral Adventurer's Guide",
  MOT: "Mythic Odysseys of Theros", AI: "Acquisitions Incorporated", EFA: "Eberron: Forge of the Artificer",
};

const BOOKS_2024 = new Set(["XPHB", "XDMG", "XMM", "EFA"]);
const is2024 = (source) => BOOKS_2024.has(source);
const sourceLabel = (s) => SOURCE_LABEL[s] ?? s;
const baseCode = (t) => String(t ?? "").split("|")[0];

// ── Cache ────────────────────────────────────────────────────────

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("hub-5etools", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("files");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function cacheGet(key) {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const req = db.transaction("files").objectStore("files").get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

async function cachePut(key, value) {
  try {
    const db = await openDb();
    await new Promise((resolve) => {
      const tx = db.transaction("files", "readwrite");
      tx.objectStore("files").put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  } catch (e) {
    // Without a cache the data still loads; it is just downloaded again next session.
  }
}

// ── Text ─────────────────────────────────────────────────────────

const ATTACK_LABEL = { mw: "Melee Weapon Attack:", rw: "Ranged Weapon Attack:", "mw,rw": "Melee or Ranged Weapon Attack:", ms: "Melee Spell Attack:", rs: "Ranged Spell Attack:", "ms,rs": "Melee or Ranged Spell Attack:" };
const FIRST_ONLY = new Set(["filter", "link", "footnote", "book", "adventure", "quickref", "homebrew", "dice", "damage", "scaledice", "scaledamage", "d20", "chance", "note", "color", "h"]);

/** 5e.tools markup ({@tag text|source|display}) as plain text with a little Markdown. */
function cleanTags(text) {
  let out = String(text ?? "").replace(/\{#itemEntry [^}]*\}/g, "");
  for (let pass = 0; pass < 4 && /\{@/.test(out); pass++) {
    out = out.replace(/\{@(\w+)\s*([^{}]*)\}/g, (_, tag, body) => {
      const parts = body.split("|");
      const first = parts[0].trim();
      switch (tag) {
        case "b":
        case "bold":
          return `**${first}**`;
        case "i":
        case "italic":
        case "note":
          return `*${first}*`;
        case "dc":
          return `DC ${first}`;
        case "hit":
          return /^[+-]/.test(first) ? first : `+${first}`;
        case "h":
          return "Hit: ";
        case "atk":
          return ATTACK_LABEL[first] ?? "Attack:";
        case "recharge":
          return first && first !== "6" ? `(Recharge ${first}–6)` : "(Recharge 6)";
        case "chance":
          return `${first}% chance`;
        case "link":
          return parts[1] ? `[${first}](${parts[1]})` : first;
        default:
          return FIRST_ONLY.has(tag) ? first : (parts[2]?.trim() || first);
      }
    });
  }
  return out;
}

function cellText(cell) {
  if (cell === null || cell === undefined) return "";
  if (typeof cell === "object") {
    if (cell.roll) return cell.roll.exact !== undefined ? String(cell.roll.exact) : cell.roll.min === cell.roll.max ? String(cell.roll.min) : `${cell.roll.min}–${cell.roll.max}`;
    return renderEntries(cell.entry ?? cell.entries ?? "").replace(/\n+/g, " ");
  }
  return cleanTags(cell);
}

function renderTable(t) {
  const cols = t.colLabels ?? [];
  const rows = t.rows ?? [];
  const width = Math.max(cols.length, ...rows.map((r) => r.length), 1);
  const head = Array.from({ length: width }, (_, i) => cleanTags(cols[i] ?? ""));
  const lines = [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`];
  for (const r of rows) lines.push(`| ${Array.from({ length: width }, (_, i) => cellText(r[i]).replace(/\|/g, "/")).join(" | ")} |`);
  return (t.caption ? `**${cleanTags(t.caption)}**\n\n` : "") + lines.join("\n");
}

/** Entry text (strings and nested objects) as Markdown. */
function renderEntries(entries) {
  const list = Array.isArray(entries) ? entries : [entries];
  const blocks = [];
  for (const e of list) {
    if (e === null || e === undefined || e === "") continue;
    if (typeof e === "string") {
      blocks.push(cleanTags(e));
    } else if (e.type === "list") {
      blocks.push((e.items ?? []).map((i) => "- " + renderEntries(i).replace(/\n+/g, " ")).join("\n"));
    } else if (e.type === "table") {
      blocks.push(renderTable(e));
    } else if (e.type === "item") {
      blocks.push(`**${cleanTags(e.name ?? "")}.** ${renderEntries(e.entry ?? e.entries ?? "")}`);
    } else if (e.type === "quote") {
      blocks.push("> " + renderEntries(e.entries ?? "").replace(/\n+/g, "\n> "));
    } else if (e.entries || e.entry) {
      const body = renderEntries(e.entries ?? e.entry);
      blocks.push(e.name ? `**${cleanTags(e.name)}.** ${body}` : body);
    }
  }
  return blocks.join("\n\n");
}

/** Gold, silver, and copper from a value in copper pieces. */
function describeCost(cp) {
  if (cp === null || cp === undefined || cp === "") return "";
  const n = Number(cp);
  if (!Number.isFinite(n)) return "";
  const parts = [];
  if (Math.floor(n / 100)) parts.push(`${Math.floor(n / 100).toLocaleString("en-US")} GP`);
  if (Math.floor((n % 100) / 10)) parts.push(`${Math.floor((n % 100) / 10)} SP`);
  if (n % 10) parts.push(`${n % 10} CP`);
  return parts.join(" ") || "0 CP";
}

// ── Entries ──────────────────────────────────────────────────────

function typeLabel(raw) {
  const code = baseCode(raw.type);
  if (TYPE_LABEL[code]) return TYPE_LABEL[code];
  if (raw.wondrous) return "Wondrous item";
  if (raw.weapon) return "Weapon";
  if (raw.armor) return "Armor";
  return code || "Item";
}

function statsLine(raw) {
  const code = baseCode(raw.type);
  const bits = [];
  if (raw.weaponCategory) bits.push(raw.weaponCategory[0].toUpperCase() + raw.weaponCategory.slice(1) + " weapon");
  if (raw.dmg1) bits.push(`${raw.dmg1} ${DAMAGE_LABEL[raw.dmgType] ?? raw.dmgType ?? ""}`.trim());
  const props = (raw.property ?? []).map((p) => baseCode(typeof p === "string" ? p : p.uid)).map((p) => PROPERTY_LABEL[p] ?? p);
  if (props.length) bits.push(props.map((p) => (p === "Versatile" && raw.dmg2 ? `Versatile (${raw.dmg2})` : p)).join(", "));
  if (raw.range) bits.push(`Range ${raw.range} ft.`);
  if (raw.mastery?.length) bits.push(`Mastery: ${raw.mastery.map((m) => baseCode(typeof m === "string" ? m : m.uid)).join(", ")}`);
  if (raw.ac) {
    const dex = code === "S" ? "" : code === "LA" ? " + Dex" : code === "MA" ? " + Dex (max 2)" : code === "HA" ? "" : "";
    bits.push(code === "S" ? `+${raw.ac} AC` : `AC ${raw.ac}${dex}`);
  }
  if (raw.strength) bits.push(`Strength ${raw.strength}`);
  if (raw.stealth) bits.push("Disadvantage on Stealth");
  if (raw.charges) bits.push(`${raw.charges} charges${raw.recharge ? `, regains ${raw.rechargeAmount ?? "some"} at ${raw.recharge}` : ""}`);
  return bits.join(" · ");
}

function attuneText(raw) {
  if (!raw.reqAttune) return "";
  return raw.reqAttune === true ? "Requires attunement" : `Requires attunement ${raw.reqAttune}`;
}

/** One searchable entry from a raw 5e.tools record. */
function toEntry(raw, kind) {
  const source = raw.source ?? raw.inherits?.source ?? "";
  const rarity = String(raw.rarity ?? raw.inherits?.rarity ?? "none").toLowerCase();
  const cp = raw.value ?? null;
  const entry = {
    key: `${raw.name}|${source}`,
    name: raw.name,
    lower: raw.name.toLowerCase(),
    source,
    page: raw.page ?? raw.inherits?.page ?? null,
    kind,
    type: kind === "variant" ? "Generic variant" : typeLabel(raw),
    rarity,
    attune: attuneText(raw),
    cp,
    weight: raw.weight ?? null,
    stats: statsLine(raw),
    is2024: is2024(source),
    alsoIn: [],
    raw,
  };
  return entry;
}

/** Fill a `_copy` record from the record it names (shallow; `_mod` edits are ignored). */
function resolveCopies(records) {
  const byKey = new Map(records.map((r) => [`${r.name}|${r.source}`.toLowerCase(), r]));
  return records.map((r) => {
    if (!r._copy) return r;
    const base = byKey.get(`${r._copy.name}|${r._copy.source}`.toLowerCase());
    if (!base) return r;
    const own = { ...r };
    delete own._copy;
    return { ...base, ...own };
  });
}

/** All entries from the three raw files, one per name (the 2024 version when there is one). */
function normalizeAll({ items, base, variants }) {
  const records = resolveCopies([...(items ?? []), ...(base ?? [])]);
  const all = [
    ...records.filter((r) => r.name).map((r) => toEntry(r, ["none", "unknown", undefined].includes(r.rarity) ? "mundane" : "magic")),
    ...(variants ?? []).filter((v) => v.name).map((v) => toEntry(v, "variant")),
  ];
  const byName = new Map();
  for (const e of all) {
    const k = `${e.lower}|${e.kind}`;
    const prev = byName.get(k);
    if (!prev) {
      byName.set(k, e);
    } else if (e.is2024 && !prev.is2024) {
      e.alsoIn = [prev.source, ...prev.alsoIn];
      byName.set(k, e);
    } else {
      prev.alsoIn.push(e.source);
    }
  }
  return [...byName.values()];
}

// ── Loading ──────────────────────────────────────────────────────

let memory = null;

/**
 * Loads (and caches) the item data. Returns { entries, fetchedAt, fromCache } or { error }.
 * force: download again even when cached.
 */
async function loadItems({ force = false } = {}) {
  if (memory && !force) return memory;
  const base = cfg().data_url_5etools.replace(/\/+$/, "");
  const raw = {};
  let fetchedAt = Date.now();
  let fromCache = true;
  try {
    for (const file of FILES) {
      let cached = force ? null : await cacheGet(file);
      if (!cached) {
        const res = await fetch(`${base}/${file}`);
        if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
        cached = { time: Date.now(), data: await res.json() };
        await cachePut(file, cached);
        fromCache = false;
      }
      raw[file] = cached.data;
      fetchedAt = Math.min(fetchedAt, cached.time);
    }
  } catch (e) {
    return { error: `Couldn't load the item data from ${base}: ${e.message}` };
  }
  memory = {
    entries: normalizeAll({ items: raw["items.json"]?.item, base: raw["items-base.json"]?.baseitem, variants: raw["magicvariants.json"]?.magicvariant }),
    fetchedAt,
    fromCache,
  };
  return memory;
}

// ── Search and display ───────────────────────────────────────────

/** Matching entries, best first. kind: "all", "magic", or "mundane" (variants count as magic). */
function searchItems(entries, query, { kind = "all", only2024 = false } = {}) {
  const tokens = String(query ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const scored = [];
  for (const e of entries) {
    if (only2024 && !e.is2024) continue;
    if (kind === "magic" && e.kind === "mundane") continue;
    if (kind === "mundane" && e.kind !== "mundane") continue;
    if (!tokens.every((t) => e.lower.includes(t))) continue;
    const q = tokens.join(" ");
    const score = e.lower === q ? 0 : e.lower.startsWith(tokens[0]) ? 1 : e.lower.split(/[\s(]+/).some((w) => w.startsWith(tokens[0])) ? 2 : 3;
    scored.push([score, e]);
  }
  scored.sort((a, b) => a[0] - b[0] || Number(b[1].is2024) - Number(a[1].is2024) || a[1].lower.localeCompare(b[1].lower));
  return scored.map((s) => s[1]);
}

/** The details of an entry as Markdown. */
function itemMarkdown(e) {
  const raw = e.raw;
  const head = [e.type, e.rarity !== "none" && e.rarity !== "unknown" ? e.rarity : "", e.attune].filter(Boolean).join(" · ");
  const lines = [`*${head}*`];
  if (e.stats) lines.push(e.stats);
  const money = [];
  if (e.cp !== null && e.cp !== undefined && e.cp !== "") money.push(`Cost ${describeCost(e.cp)}`);
  else if (RARITY_GP[e.rarity]) money.push(`Suggested value ${(e.type === "Potion" ? RARITY_GP[e.rarity] / 2 : RARITY_GP[e.rarity]).toLocaleString("en-US")} GP by rarity${e.type === "Potion" ? " (potion, halved)" : ""}`);
  if (e.weight) money.push(`${e.weight} lb.`);
  if (money.length) lines.push(money.join(" · "));
  let body = renderEntries(raw.entries ?? raw.inherits?.entries ?? "");
  if (raw.inherits) {
    body = body.replace(/\{=(\w+)\}/g, (_, k) => raw.inherits[k] ?? raw[k] ?? "");
  }
  if (body) lines.push("", body);
  const where = `${sourceLabel(e.source)}${e.page ? ` p. ${e.page}` : ""}${e.alsoIn.length ? `; also in ${[...new Set(e.alsoIn)].map(sourceLabel).join(", ")}` : ""}`;
  lines.push("", `*${where}*`);
  return cleanTags(lines.join("\n"));
}

return { loadItems, searchItems, itemMarkdown, cleanTags, normalizeAll, describeCost, sourceLabel };
```
