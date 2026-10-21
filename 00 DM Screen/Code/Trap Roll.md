---
hide_from_related: true
---

**Purpose:** Rolls a random trap or hazard for the Session Hub, with a name search underneath. The text comes from the 5e.tools data (`trapshazards.json`), the same source and cache as the item search ([[Item Data]]).

**Exports:** `TrapRoll`, `loadTraps`, `filterTraps`, `trapMarkdown`

**Depends on:** [[Shared Helpers]] · [[Item Data]]

**Used by:** [[Session Hub]]

Conventions this module relies on:

- **Filters.** Trap or hazard; tier (1 is levels 1-4, 2 is 5-10, 3 is 11-16, 4 is 17-20); threat (nuisance, setback, moderate, dangerous, deadly); "2024 books only".
- **Ratings.** Only some entries carry a tier and threat rating: all of the 2024 DMG's, and a few from other books. Entries without one appear only while tier and threat are both "Any".
- **Reprints.** When a 2024 entry replaces an older one (the 2014 DMG's Collapsing Roof, for example), only the 2024 entry is listed and the older book is named at the bottom.
- **Roll.** Picks one entry at random from whatever the filters allow and opens it. The search below uses the same filters and lists matches by name; each opens to its full text.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Trap Roll.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const { loadRaw, cleanTags, renderEntries, is2024, sourceLabel } = await dc.require(dc.headerLink("00 DM Screen/Code/Item Data.md", "Code"));

const THREATS = ["nuisance", "setback", "moderate", "dangerous", "deadly"];
const TIER_LABEL = { 1: "levels 1-4", 2: "levels 5-10", 3: "levels 11-16", 4: "levels 17-20" };
const KIND_LABEL = { trap: "Trap", hazard: "Hazard" };
const TYPE_LABEL = {
  SMPL: "Simple trap", CMPX: "Complex trap", MECH: "Mechanical trap", MAG: "Magic trap", HAUNT: "Haunted trap",
  TRP: "Trap", ENV: "Environmental", WLD: "Wilderness", WTH: "Weather", EST: "Estate", GEN: "General",
};

// ── Data ─────────────────────────────────────────────────────────

/** Entries from the raw file: { key, name, kind, source, page, is2024, ratings, raw, alsoIn }. Reprinted older entries are folded into the new one. */
function normalizeTraps(file) {
  const all = [
    ...(file.trap ?? []).map((r) => ({ r, kind: "trap" })),
    ...(file.hazard ?? []).map((r) => ({ r, kind: "hazard" })),
  ];
  const have = new Set(all.map(({ r }) => `${r.name}|${r.source}`.toLowerCase()));
  const alsoIn = new Map();
  const kept = [];
  for (const { r, kind } of all) {
    const targets = (r.reprintedAs ?? []).map((t) => (typeof t === "string" ? t : t.uid ?? "")).filter(Boolean);
    const found = targets.filter((t) => have.has(t.split("|").slice(0, 2).join("|").toLowerCase()));
    if (found.length) {
      for (const t of found) {
        const k = t.split("|").slice(0, 2).join("|").toLowerCase();
        alsoIn.set(k, [...(alsoIn.get(k) ?? []), r.source]);
      }
      continue;
    }
    kept.push({ r, kind });
  }
  return kept.map(({ r, kind }) => ({
    key: `${r.name}|${r.source}`.toLowerCase(),
    name: r.name,
    lower: r.name.toLowerCase(),
    kind,
    source: r.source,
    page: r.page,
    is2024: is2024(r.source),
    type: TYPE_LABEL[r.trapHazType] ?? "",
    ratings: (r.rating ?? []).map((x) => ({ tier: x.tier, threat: x.threat })),
    raw: r,
    alsoIn: alsoIn.get(`${r.name}|${r.source}`.toLowerCase()) ?? [],
  }));
}

async function loadTraps(opts) {
  const res = await loadRaw("trapshazards.json", opts);
  if (res.error) return { error: res.error };
  return { entries: normalizeTraps(res.data), fetchedAt: res.time, fromCache: res.fromCache };
}

/** Entries that pass the filters. tier and threat are "any" or a value; unrated entries pass only when both are "any". */
function filterTraps(entries, { kind = "any", tier = "any", threat = "any", only2024 = false, query = "" } = {}) {
  const q = query.trim().toLowerCase();
  return entries.filter((e) => {
    if (kind !== "any" && e.kind !== kind) return false;
    if (only2024 && !e.is2024) return false;
    if (q && !e.lower.includes(q)) return false;
    if (tier !== "any" || threat !== "any") {
      return e.ratings.some((r) => (tier === "any" || String(r.tier) === String(tier)) && (threat === "any" || r.threat === threat));
    }
    return true;
  });
}

const ratingText = (e) => e.ratings.map((r) => `${r.threat} · ${TIER_LABEL[r.tier] ?? `tier ${r.tier}`}`).join("; ");

function listLine(label, v) {
  if (!v || !v.length) return "";
  const text = v.map((x) => (typeof x === "string" ? cleanTags(x) : x.type === "instant" ? "instant" : cleanTags(JSON.stringify(x)))).join(" ");
  return `**${label}.** ${text}`;
}

/** Markdown for one entry. */
function trapMarkdown(e) {
  const r = e.raw;
  const lines = [];
  lines.push(`*${[e.type || KIND_LABEL[e.kind], ratingText(e)].filter(Boolean).join(" · ")}*`);
  const dur = (r.duration ?? []).map((d) => (d.type === "instant" ? "instant" : d.type === "timed" ? `${d.duration?.amount ?? ""} ${d.duration?.type ?? ""}`.trim() : d.type)).filter(Boolean);
  for (const part of [listLine("Trigger", r.trigger), dur.length ? `**Duration.** ${dur.join(", ")}` : "", listLine("Initiative", r.initiative !== undefined ? [`Count ${r.initiative}`] : null)]) {
    if (part) lines.push(part);
  }
  const body = renderEntries(r.entries ?? []);
  if (body) lines.push(body);
  for (const part of [listLine("Effect", r.effect), listLine("Countermeasures", r.countermeasures)]) {
    if (part) lines.push(part);
  }
  const where = `${sourceLabel(e.source)}${e.page ? ` p. ${e.page}` : ""}${e.alsoIn.length ? `; also in ${[...new Set(e.alsoIn)].map(sourceLabel).join(", ")}` : ""}`;
  lines.push(`*${where}*`);
  return cleanTags(lines.join("\n\n"));
}

// ── Interface ────────────────────────────────────────────────────

const Q = {
  card: { border: "1px solid var(--background-modifier-border)", borderRadius: "10px", padding: "16px 20px", margin: "8px 0" },
  label: { fontSize: "var(--font-ui-smaller)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", margin: "0 0 8px" },
  row: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", margin: "8px 0" },
  rolled: { borderTop: "1px solid var(--background-modifier-border)", marginTop: "14px", paddingTop: "12px" },
  search: { borderTop: "1px solid var(--background-modifier-border)", marginTop: "14px", paddingTop: "12px" },
};

function TrapResult({ entry, sourcePath, startOpen }) {
  const [open, setOpen] = dc.useState(!!startOpen);
  return (
    <details style={{ margin: "6px 0" }} open={startOpen ? true : undefined} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        <strong>{entry.name}</strong>
        <span style={S.muted}>
          {" · "}
          {[KIND_LABEL[entry.kind], ratingText(entry), sourceLabel(entry.source)].filter(Boolean).join(" · ")}
        </span>
      </summary>
      {open ? (
        <div style={{ margin: "6px 0 12px 14px" }}>
          <dc.Markdown content={trapMarkdown(entry)} sourcePath={sourcePath} />
        </div>
      ) : null}
    </details>
  );
}

const MAX_RESULTS = 25;

function TrapRoll() {
  const [data, setData] = dc.useState(null);
  const [loading, setLoading] = dc.useState(false);
  const [kind, setKind] = dc.useState("any");
  const [tier, setTier] = dc.useState("any");
  const [threat, setThreat] = dc.useState("any");
  const [only2024, setOnly2024] = dc.useState(false);
  const [query, setQuery] = dc.useState("");
  const [rolled, setRolled] = dc.useState(null);
  const [rollCount, setRollCount] = dc.useState(0);
  const here = dc.currentPath ? dc.currentPath() : "";

  async function ensure(force) {
    if (loading || (data?.entries && !force)) return data;
    setLoading(true);
    const d = await loadTraps({ force: !!force });
    setData(d);
    setLoading(false);
    return d;
  }

  const filters = { kind, tier, threat, only2024 };
  const pool = data?.entries ? filterTraps(data.entries, filters) : [];
  const matches = data?.entries && query.trim() ? filterTraps(data.entries, { ...filters, query }) : [];
  const unrated = data?.entries && (tier !== "any" || threat !== "any") ? filterTraps(data.entries, { kind, only2024 }).length - pool.length : 0;

  async function roll() {
    const d = data?.entries ? data : await ensure(false);
    if (!d?.entries) return;
    const list = filterTraps(d.entries, filters);
    if (!list.length) {
      setRolled({ none: true });
      return;
    }
    setRolled({ entry: list[Math.floor(Math.random() * list.length)] });
    setRollCount((n) => n + 1);
  }

  const select = (value, set, options) => (
    <select value={value} onChange={(e) => set(e.currentTarget.value)}>
      {options.map(([v, l]) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  );

  return (
    <div style={Q.card}>
      <div style={Q.label}>Roll a trap or hazard</div>
      <div style={Q.row}>
        <label>{select(kind, setKind, [["any", "Trap or hazard"], ["trap", "Trap"], ["hazard", "Hazard"]])}</label>
        <label>
          <span style={S.muted}>Tier </span>
          {select(tier, setTier, [["any", "Any"], ...Object.entries(TIER_LABEL).map(([k, l]) => [k, `${k} (${l})`])])}
        </label>
        <label>
          <span style={S.muted}>Threat </span>
          {select(threat, setThreat, [["any", "Any"], ...THREATS.map((t) => [t, t])])}
        </label>
        <label style={S.muted}>
          <input type="checkbox" checked={only2024} onChange={(e) => setOnly2024(e.currentTarget.checked)} /> 2024 books only
        </label>
        <button onClick={roll} disabled={loading}>{loading ? "Loading…" : "Roll"}</button>
      </div>
      {data?.error ? (
        <div style={S.muted}>{data.error} <button onClick={() => ensure(true)}>Try again</button></div>
      ) : null}
      {!data && !loading ? <div style={S.muted}>The first roll or search downloads the trap data (a small file).</div> : null}
      {data?.entries ? (
        <div style={S.muted}>
          {pool.length} entries match{unrated > 0 ? `; ${unrated} unrated ones are left out while a tier or threat is set` : ""}.
        </div>
      ) : null}
      {rolled?.none ? <div style={Q.rolled}>Nothing matches those filters.</div> : null}
      {rolled?.entry ? (
        <div style={Q.rolled}>
          <TrapResult key={`${rolled.entry.key}#${rollCount}`} entry={rolled.entry} sourcePath={here} startOpen />
        </div>
      ) : null}
      <div style={Q.search}>
        <div style={Q.label}>Find by name</div>
        <input
          type="text"
          placeholder="Trap or hazard name"
          value={query}
          style={{ width: "100%", marginBottom: "8px" }}
          onFocus={() => ensure(false)}
          onInput={(e) => {
            setQuery(e.currentTarget.value);
            ensure(false);
          }}
        />
        {data?.entries && query.trim() && !matches.length ? <div style={S.muted}>No trap or hazard matches "{query.trim()}".</div> : null}
        {matches.slice(0, MAX_RESULTS).map((e) => (
          <TrapResult key={e.key} entry={e} sourcePath={here} />
        ))}
        {matches.length > MAX_RESULTS ? <div style={S.muted}>Showing the first {MAX_RESULTS} matches.</div> : null}
        {data?.entries ? (
          <div style={{ ...S.muted, marginTop: "8px" }}>
            5e.tools data: {data.fromCache ? "saved copy from" : "downloaded"} {new Date(data.fetchedAt).toLocaleDateString("en-US")}.{" "}
            <button onClick={() => ensure(true)}>Refresh data</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

return { TrapRoll, loadTraps, filterTraps, trapMarkdown };
```
