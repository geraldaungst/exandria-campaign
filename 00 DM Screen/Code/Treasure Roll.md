---
hide_from_related: true
---

**Purpose:** Rolls treasure for the Session Hub from the 2024 DMG tables in the 5e.tools data: individual treasure, hoards, gemstones, and art objects. Rolled magic items open to their full text.

**Exports:** `TreasureRoll`, `rollDice`, `rollIndividual`, `rollHoard`, `rollValuables`

**Depends on:** [[Shared Helpers]] · [[Item Data]]

**Used by:** [[Session Hub]]

Conventions this module relies on:

- **Data.** `loot.json` from the same 5e.tools mirror as the item search ([[Item Data]], `data_url_5etools` in [[Hub Config]]), cached the same way. Only the 2024 DMG tables (source `XDMG`) are used; the 2014 tables are in the file but not rolled here.
- **Individual treasure** rolls the coins for the chosen challenge band.
- **Hoard** rolls the band's coins, then its number of magic items. For each item: a d100 on the "By Level" table for the party's level gives the rarity, then the item comes from the Arcana, Armaments, Implements, or Relics table of that rarity. The data doesn't say how the book chooses between those four, so each item picks one at random unless you pin a type.
- **Gems and art objects** pick the stated number at random from the value tier's list. They are not part of a 2024 hoard roll.
- **Rows that offer a choice** (a scroll of a cantrip or a 1st-level spell, a feather token) pick one of the options at random. Generic entries (such as Mithral Armor) are shown by name, for you to attach to a base item.
- **Every roll** is shown with its dice, so you can overrule it.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Treasure Roll.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const { loadItems, loadRaw, findItem, ItemResult, cleanTags } = await dc.require(dc.headerLink("00 DM Screen/Code/Item Data.md", "Code"));

const SOURCE = "XDMG";
const CATEGORIES = ["Arcana", "Armaments", "Implements", "Relics"];
const RARITY_TITLE = { common: "Common", uncommon: "Uncommon", rare: "Rare", "very rare": "Very Rare", legendary: "Legendary" };

// ── Dice ─────────────────────────────────────────────────────────

const die = (sides, rng) => 1 + Math.floor(rng() * sides);

/** Rolls "2d4*100", "1d4-1", or "3d6". Returns { total, text } or null for something it can't read. */
function rollDice(expr, rng = Math.random) {
  const m = String(expr ?? "").replace(/\s+/g, "").match(/^(\d+)d(\d+)(?:([*+-])(\d+))?$/);
  if (!m) return null;
  const rolls = Array.from({ length: Number(m[1]) }, () => die(Number(m[2]), rng));
  let total = rolls.reduce((a, b) => a + b, 0);
  if (m[3] === "*") total *= Number(m[4]);
  if (m[3] === "+") total += Number(m[4]);
  if (m[3] === "-") total -= Number(m[4]);
  return { total: Math.max(0, total), text: `${expr} → ${rolls.join("+")}${m[3] ? `${m[3]}${m[4]}` : ""} = ${Math.max(0, total)}` };
}

const pick = (list, rng) => list[Math.floor(rng() * list.length)];

/** The row of a d100 table that a roll falls in. */
const rowFor = (table, roll) => table.find((r) => roll >= r.min && roll <= r.max) ?? null;

// ── Tables ───────────────────────────────────────────────────────

const ofSource = (list) => (list ?? []).filter((x) => x.source === SOURCE);

function coinText(coins, rng) {
  const parts = [];
  const rolls = [];
  let gp = 0;
  for (const [coin, expr] of Object.entries(coins ?? {})) {
    const r = rollDice(expr, rng);
    if (!r) continue;
    parts.push(`${r.total.toLocaleString("en-US")} ${coin.toUpperCase()}`);
    rolls.push(r.text);
    gp += coin === "gp" ? r.total : 0;
  }
  return { text: parts.join(", ") || "none", rolls, gp };
}

/** Individual treasure for a challenge band: { band, coins, rolls }. */
function rollIndividual(loot, bandName, rng = Math.random) {
  const band = ofSource(loot.individual).find((b) => b.name === bandName);
  if (!band) return { error: `No individual treasure table for ${bandName}.` };
  const row = rowFor(band.table, die(100, rng));
  const c = coinText(row?.coins, rng);
  return { band: band.name, coins: c.text, rolls: c.rolls };
}

/** The item a table row names: "{@item Lookup Name|XDMG|Shown As} (extra text)" gives { lookup, display }. */
function itemRef(raw) {
  const m = String(raw).match(/\{@item ([^|}]+)(?:\|[^|}]*)?(?:\|([^}]*))?\}/);
  if (!m) return { lookup: cleanTags(raw).replace(/\s*\(.*$/, "") };
  return { lookup: m[1].trim(), display: (m[2] ?? m[1]).trim() };
}

/** One magic item for a party level: rarity from the By Level table, then an item from the category table. */
function rollMagicItem(loot, tierName, category, rng, entries) {
  const tables = ofSource(loot.magicItems);
  const byLevel = tables.find((t) => t.name === `By Level - ${tierName}`);
  if (!byLevel) return { error: `No By Level table for levels ${tierName}.` };
  const levelRoll = die(100, rng);
  const rarity = rowFor(byLevel.table, levelRoll)?.choose?.fromMatching?.rarity;
  if (!rarity) return { error: "The By Level table gave no rarity." };
  const cat = category && category !== "Any" ? category : pick(CATEGORIES, rng);
  const table = tables.find((t) => t.name === `${cat} - ${RARITY_TITLE[rarity]}`);
  if (!table) return { error: `No ${cat} table for ${rarity} items.` };
  const itemRoll = die(100, rng);
  const row = rowFor(table.table, itemRoll);
  let ref = null;
  let note = "";
  if (row?.choose?.fromItems) {
    ref = { lookup: pick(row.choose.fromItems, rng).replace(/\|.*$/, "") };
    note = "one of the listed options";
  } else if (row?.choose?.fromGeneric) {
    ref = { lookup: row.choose.fromGeneric[0].replace(/\|.*$/, "") };
    note = "choose a base item";
  } else if (row?.item) {
    ref = itemRef(row.item);
  }
  if (!ref) ref = { lookup: "(choose one)" };
  const entry = entries && ref.lookup !== "(choose one)" ? findItem(entries, ref.lookup) : null;
  const name = ref.display ?? ref.lookup;
  if (!entry && entries && !note) {
    const low = ref.lookup.toLowerCase();
    const variants = entries.filter((e) => e.lower.startsWith(`${low} (`) || e.lower.startsWith(`${low},`));
    if (variants.length) note = `${variants.length} variants, such as ${variants[0].name}`;
  }
  return { rarity, category: cat, levelRoll, itemRoll, name, note, entry };
}

/** A hoard for a challenge band and party level: { band, coins, rolls, count, items }. */
function rollHoard(loot, bandName, tierName, category, rng = Math.random, entries = null) {
  const band = ofSource(loot.hoard).find((b) => b.name === bandName);
  if (!band) return { error: `No hoard table for ${bandName}.` };
  const c = coinText(band.coins, rng);
  const row = rowFor(band.table, die(100, rng));
  const spec = row?.magicItems?.[0];
  const countRoll = spec ? rollDice(spec.amount, rng) : null;
  const items = [];
  for (let i = 0; i < (countRoll?.total ?? 0); i++) {
    const it = rollMagicItem(loot, tierName, category, rng, entries);
    if (it.error) return { error: it.error };
    items.push(it);
  }
  return { band: band.name, coins: c.text, rolls: c.rolls, countText: countRoll?.text ?? "", items };
}

/** Gemstones or art objects of one value: { value, picks: [name] }. */
function rollValuables(loot, kind, value, count, rng = Math.random) {
  const table = ofSource(kind === "gem" ? loot.gems : loot.artObjects).find((t) => t.type === Number(value));
  if (!table) return { error: `No ${kind === "gem" ? "gemstone" : "art object"} table for ${value} GP.` };
  const picks = Array.from({ length: Math.max(1, count) }, () => cleanTags(pick(table.table, rng)));
  return { value: Number(value), picks };
}

// ── Interface ────────────────────────────────────────────────────

const tierForLevel = (level) => (level <= 4 ? "Levels 1-4" : level <= 10 ? "Levels 5-10" : level <= 16 ? "Levels 11-16" : "Levels 17-20");

const Q = {
  card: { border: "1px solid var(--background-modifier-border)", borderRadius: "10px", padding: "16px 20px", margin: "8px 0" },
  label: { fontSize: "var(--font-ui-smaller)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", margin: "0 0 8px" },
  row: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", margin: "8px 0" },
  result: { borderTop: "1px solid var(--background-modifier-border)", marginTop: "14px", paddingTop: "12px" },
};

function ResultView({ result, sourcePath }) {
  if (result.error) return <div style={S.muted}>{result.error}</div>;
  return (
    <div style={Q.result}>
      {result.coins !== undefined ? (
        <div>
          <strong>Coins:</strong> {result.coins} <span style={S.muted}>({result.rolls.join("; ")})</span>
        </div>
      ) : null}
      {result.items ? (
        <div style={{ marginTop: "8px" }}>
          <strong>Magic items:</strong> <span style={S.muted}>{result.countText || "none"}</span>
          {result.items.length === 0 ? <div style={S.muted}>None in this hoard.</div> : null}
          {result.items.map((it, i) => (
            <div key={i}>
              {it.entry ? (
                <ItemResult entry={it.entry} sourcePath={sourcePath} />
              ) : (
                <div style={{ margin: "6px 0" }}>
                  <strong>{it.name}</strong>
                </div>
              )}
              <div style={{ ...S.muted, marginLeft: "14px" }}>
                {it.category} {it.rarity} · rarity roll {it.levelRoll}, item roll {it.itemRoll}
                {it.note ? ` · ${it.note}` : ""}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {result.picks ? (
        <div>
          <strong>{result.picks.length > 1 ? "Items" : "Item"} worth {result.value.toLocaleString("en-US")} GP each:</strong>
          <ul>
            {result.picks.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function TreasureRoll() {
  const [loot, setLoot] = dc.useState(null);
  const [items, setItems] = dc.useState(null);
  const [loading, setLoading] = dc.useState(false);
  const [kind, setKind] = dc.useState("hoard");
  const [band, setBand] = dc.useState("Challenge 5-10");
  const [level, setLevel] = dc.useState(5);
  const [category, setCategory] = dc.useState("Any");
  const [value, setValue] = dc.useState(50);
  const [count, setCount] = dc.useState(1);
  const [result, setResult] = dc.useState(null);
  const here = dc.currentPath ? dc.currentPath() : "";

  async function ensure() {
    if (loot && items) return { loot, items };
    setLoading(true);
    const [l, i] = await Promise.all([loadRaw("loot.json"), loadItems()]);
    setLoading(false);
    if (l.error || i.error) {
      setResult({ error: l.error ?? i.error });
      return null;
    }
    setLoot(l.data);
    setItems(i);
    return { loot: l.data, items: i };
  }

  async function roll() {
    const data = await ensure();
    if (!data) return;
    if (kind === "individual") setResult(rollIndividual(data.loot, band));
    else if (kind === "hoard") setResult(rollHoard(data.loot, band, tierForLevel(Number(level)), category, Math.random, data.items.entries));
    else setResult(rollValuables(data.loot, kind, value, Number(count)));
  }

  const kinds = [["individual", "Individual"], ["hoard", "Hoard"], ["gem", "Gems"], ["art", "Art objects"]];
  const bands = ["Challenge 0-4", "Challenge 5-10", "Challenge 11-16", "Challenge 17+"];
  const gemValues = [10, 50, 100, 500, 1000, 5000];
  const artValues = [25, 250, 750, 2500, 7500];
  const values = kind === "gem" ? gemValues : artValues;

  return (
    <div style={Q.card}>
      <div style={Q.label}>Roll treasure (2024 DMG)</div>
      <div style={Q.row}>
        {kinds.map(([key, label]) => (
          <button key={key} disabled={kind === key} onClick={() => { setKind(key); setResult(null); if (key === "gem") setValue(50); if (key === "art") setValue(250); }}>
            {label}
          </button>
        ))}
      </div>
      <div style={Q.row}>
        {kind === "individual" || kind === "hoard" ? (
          <label>
            <span style={S.muted}>Challenge </span>
            <select value={band} onChange={(e) => setBand(e.currentTarget.value)}>
              {bands.map((b) => (
                <option key={b} value={b}>{b.replace("Challenge ", "")}</option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            <span style={S.muted}>Value each </span>
            <select value={value} onChange={(e) => setValue(Number(e.currentTarget.value))}>
              {values.map((v) => (
                <option key={v} value={v}>{v.toLocaleString("en-US")} GP</option>
              ))}
            </select>
          </label>
        )}
        {kind === "hoard" ? (
          <label>
            <span style={S.muted}>Party level </span>
            <select value={level} onChange={(e) => setLevel(Number(e.currentTarget.value))}>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        ) : null}
        {kind === "hoard" ? (
          <label>
            <span style={S.muted}>Item type </span>
            <select value={category} onChange={(e) => setCategory(e.currentTarget.value)}>
              {["Any", ...CATEGORIES].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        ) : null}
        {kind === "gem" || kind === "art" ? (
          <label>
            <span style={S.muted}>How many </span>
            <input type="number" min="1" max="20" value={count} style={{ width: "4em" }} onInput={(e) => setCount(e.currentTarget.value)} />
          </label>
        ) : null}
        <button onClick={roll} disabled={loading}>
          {loading ? "Loading tables…" : "Roll"}
        </button>
      </div>
      {result ? <ResultView result={result} sourcePath={here} /> : <div style={S.muted}>Choose what to roll and press Roll. The first roll downloads the tables.</div>}
    </div>
  );
}

return { TreasureRoll, rollDice, rollIndividual, rollHoard, rollValuables };
```
