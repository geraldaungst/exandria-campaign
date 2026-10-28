---
hide_from_related: true
---

**Purpose:** The NPC browser for a campaign's folder note. It lists the NPCs of the campaign's world and narrows them with filters you combine: a name search, where they are (any place, including everything inside it), faction, disposition, a status choice (no whereabouts, unplaced, player note only), and a `needs-work` toggle.

**Exports:** `NpcBrowser`, `buildRows`, `optionsFor`, `matches`, `withinPaths`

**Depends on:** [[Shared Helpers]] (its `locations()` loads the location core, [[Location Engine Spec]])

**Used by:** [[Prophecy of Eryndor - DM|Prophecy of Eryndor]]

Conventions this module relies on:

- **Which NPCs.** Notes tagged `npc` (name in [[Hub Config]]) that carry the `world/…` tag of the world named in the current note's `world` property. Notes in excluded folders are left out. A Player Wiki NPC note that has a DM twin is left out (its DM note is listed); one with no DM twin is listed and marked with the `label_player_only` text. A note with no `world` property makes the browser list every NPC.
- **Where is read by the location core.** Each NPC's place is `whereIs` of its note: the place its `whereabouts` link reaches, following a chain of holders. Nothing here reads `place/…` or `region/…` tags.
- **Where filter.** Choose a place and the list holds every NPC at it or anywhere inside it, in either hierarchy (political or natural). The choices are the world's places, labeled with their trail. "Include ties" also lists NPCs whose `ties_to` reaches the place.
- **Status filter.** "No whereabouts" lists NPCs that have neither a place nor the `unplaced` tag (and are not `deceased`); "Unplaced" lists those tagged `unplaced`; "Player note only" lists Player Wiki NPC notes with no DM twin.
- **Faction is still a tag.** `faction/…`, nested to any depth; choosing a parent includes its children. "No faction" lists NPCs without any `faction/…` tag. "Needs work" lists NPCs tagged `needs-work`.
- **Filters combine.** Every filter that is set must match.
- **Rows.** Name (a link, marked when it is a player note only), disposition, factions, and where (the trail of the place, or `unplaced`, `deceased`, or `no whereabouts`).
- If the location core cannot be loaded, the browser says so instead of listing.

Embed it in a note with a `datacorejsx` block that loads `NpcBrowser` from the Code section of this note with `dc.require`, as [[Plot Dashboard]] does for its views, and returns it.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/NPC Browser.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, tagsOf, hasTag, isExcluded, S, stripDmSuffix, locations } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const PREFIX = { world: "world", faction: cfg().faction_tag_prefix };
const NONE = "__none__";
const STATUS = [
  ["", "Any status"],
  ["none", "No whereabouts"],
  ["unplaced", "Unplaced"],
  ["player", "Player note only"],
];

const B = {
  wrap: { margin: "8px 0 16px" },
  bar: { display: "flex", flexWrap: "wrap", alignItems: "end", gap: "12px 16px", margin: "0 0 12px" },
  field: { display: "flex", flexDirection: "column", gap: "2px" },
  label: { fontSize: "var(--font-ui-smaller)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" },
  check: { display: "flex", alignItems: "center", gap: "6px", fontSize: "var(--font-ui-small)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "var(--font-ui-smaller)", color: "var(--text-muted)", padding: "4px 10px 4px 0", borderBottom: "1px solid var(--background-modifier-border)" },
  td: { padding: "4px 10px 4px 0", verticalAlign: "top", borderBottom: "1px solid var(--background-modifier-border-hover)" },
};

/** Tag-safe form of a name: the rule the templates use for world/… tags. */
const slug = (name) =>
  stripDmSuffix(name).trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/&/g, " and ").replace(/['’`]/g, "").replace(/[^a-z0-9_]+/g, "-").replace(/^-+|-+$/g, "");
const plainName = (p) => stripDmSuffix(String(p.$name ?? p.$path.split("/").pop().replace(/\.md$/, "")));
const underPrefix = (tags, prefix) => tags.filter((t) => t.startsWith(prefix + "/"));
const deepest = (tags) => tags.filter((t) => !tags.some((o) => o.startsWith(t + "/")));
const levelsOf = (tag, prefix) => tag.slice(prefix.length + 1).split("/").join(" / ");
const inTag = (tags, wanted) => tags.some((t) => t === wanted || t.startsWith(wanted + "/"));

/**
 * The world's NPCs as plain rows:
 * { page, file, name, tags, factions, allFactions, disposition, needsWork, playerOnly, place, source, trail }.
 * `loc` is the location core's index. A Player Wiki note with a DM twin is skipped (its DM note is listed).
 * `fileOf(path)` finds a note's file (the Obsidian vault by default).
 */
function buildRows(pages, { worldName, c, loc, fileOf }) {
  const worldTag = worldName ? `${PREFIX.world}/${slug(worldName)}` : null;
  const find = fileOf ?? ((path) => app.vault.getAbstractFileByPath(path));
  const rows = [];
  for (const p of pages) {
    if (!hasTag(p, c.tag_npc) || isExcluded(p)) continue;
    const file = find(p.$path);
    if (!file) continue;
    const playerOnly = loc.isPlayerOnly(file);
    if (p.$path.startsWith(c.folder_player_wiki + "/") && !playerOnly) continue;
    const tags = tagsOf(p);
    if (worldTag && !inTag(tags, worldTag)) continue;
    const where = loc.whereIs(file);
    rows.push({
      page: p,
      file,
      name: plainName(p),
      tags,
      factions: deepest(underPrefix(tags, PREFIX.faction)),
      allFactions: underPrefix(tags, PREFIX.faction),
      disposition: String(p.value("disposition") ?? "").trim().toLowerCase(),
      needsWork: tags.includes(c.tag_needs_work),
      playerOnly,
      place: where.place,
      source: where.source,
      trail: where.place ? loc.trailLabel(where.place) : "",
    });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

/** Choices for a tag filter: every tag the rows use plus each parent level, sorted so children follow their parent. */
function optionsFor(rows, prefix, key) {
  const out = new Set();
  for (const r of rows)
    for (const t of r[key]) {
      const parts = t.split("/");
      for (let i = 2; i <= parts.length; i++) out.add(parts.slice(0, i).join("/"));
    }
  return [...out].sort((a, b) => a.localeCompare(b)).map((tag) => {
    const depth = tag.split("/").length - 2;
    return { tag, label: "  ".repeat(depth) + tag.split("/").pop() };
  });
}

/** Paths of the rows at `place` or inside it (both hierarchies); `ties` also counts `ties_to`. */
function withinPaths(rows, loc, place, ties) {
  return new Set(rows.filter((r) => loc.within(r.file, place, { ties: !!ties })).map((r) => r.page.$path));
}

/** True when the row passes every filter that is set. `within` is the set from withinPaths, used when f.where is set. */
function matches(r, f, within) {
  if (f.where && !(within && within.has(r.page.$path))) return false;
  if (f.status === "player" ? !r.playerOnly : f.status && r.source !== f.status) return false;
  if (f.faction === NONE ? r.allFactions.length : f.faction && !inTag(r.allFactions, f.faction)) return false;
  if (f.disposition && r.disposition !== f.disposition) return false;
  if (f.needsWork && !r.needsWork) return false;
  const q = f.query.trim().toLowerCase();
  if (q && !r.name.toLowerCase().includes(q)) return false;
  return true;
}

const EMPTY = { where: "", ties: false, status: "", faction: "", disposition: "", needsWork: false, query: "" };

/** What the Where column says for a row. */
const whereText = (r) => r.trail || (r.source === "unplaced" ? "unplaced" : r.source === "deceased" ? "deceased" : "no whereabouts");

function Pick({ label, value, onChange, children }) {
  return (
    <label style={B.field}>
      <span style={B.label}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.currentTarget.value)}>
        {children}
      </select>
    </label>
  );
}

/** Props: `world` (a world name, to override the current note's `world` property). */
function NpcBrowser({ world } = {}) {
  const c = cfg();
  const self = dc.useCurrentFile();
  const given = world ?? String(self?.value("world") ?? "").replace(/^\[\[|\]\]$/g, "").replace(/\|.*$/, "");
  // Wiki-wide so the browser rebuilds when a note (or a place) changes; the NPC list itself comes from the second query.
  const everything = dc.useQuery("@page");
  const all = dc.useQuery(`@page and #${c.tag_npc}`);
  const [f, setF] = dc.useState(EMPTY);
  const set = (patch) => setF({ ...f, ...patch });

  const core = dc.useMemo(() => {
    try {
      return { loc: locations() };
    } catch (e) {
      console.error(e);
      return { loc: null, error: e };
    }
  }, [everything]);
  const loc = core.loc;
  const rows = dc.useMemo(() => (loc ? buildRows(all, { worldName: given.trim(), c, loc }) : []), [all, given, loc]);
  const placeChoices = dc.useMemo(() => (loc ? loc.pickerChoices({ field: "site", world: given.trim() || undefined }) : []), [loc, given]);
  const chosen = f.where ? placeChoices.find((p) => p.place.key === f.where)?.place ?? null : null;
  const within = dc.useMemo(() => (loc && chosen ? withinPaths(rows, loc, chosen, f.ties) : null), [rows, loc, chosen, f.ties]);
  const factionOpts = dc.useMemo(() => optionsFor(rows, PREFIX.faction, "allFactions"), [rows]);
  const dispositions = dc.useMemo(() => [...new Set(rows.map((r) => r.disposition).filter(Boolean))].sort(), [rows]);
  const shown = rows.filter((r) => matches(r, f, within));
  const dirty = JSON.stringify(f) !== JSON.stringify(EMPTY);

  if (!loc) return <div style={S.muted}>The NPC browser needs the location core: {String(core.error?.message ?? "it could not be loaded")}</div>;

  return (
    <div style={B.wrap}>
      <div style={B.bar}>
        <label style={B.field}>
          <span style={B.label}>Name</span>
          <input type="text" placeholder="Search names" value={f.query} onInput={(e) => set({ query: e.currentTarget.value })} />
        </label>
        <Pick label="Where" value={f.where} onChange={(v) => set({ where: v })}>
          <option value="">Anywhere</option>
          {placeChoices.map((p) => (
            <option key={p.place.key} value={p.place.key}>{p.label}</option>
          ))}
        </Pick>
        <label style={B.check}>
          <input type="checkbox" checked={f.ties} disabled={!f.where} onChange={(e) => set({ ties: e.currentTarget.checked })} />
          Include ties
        </label>
        <Pick label="Faction" value={f.faction} onChange={(v) => set({ faction: v })}>
          <option value="">Any faction</option>
          <option value={NONE}>No faction</option>
          {factionOpts.map((o) => (
            <option key={o.tag} value={o.tag}>{o.label}</option>
          ))}
        </Pick>
        <Pick label="Disposition" value={f.disposition} onChange={(v) => set({ disposition: v })}>
          <option value="">Any</option>
          {dispositions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Pick>
        <Pick label="Status" value={f.status} onChange={(v) => set({ status: v })}>
          {STATUS.map(([v, label]) => (
            <option key={v} value={v}>{label}</option>
          ))}
        </Pick>
        <label style={B.check}>
          <input type="checkbox" checked={f.needsWork} onChange={(e) => set({ needsWork: e.currentTarget.checked })} />
          Needs work
        </label>
        {dirty ? <button onClick={() => setF(EMPTY)}>Clear filters</button> : null}
      </div>
      {!rows.length ? (
        <div style={S.muted}>
          No NPCs found{given ? ` for the world "${given}"` : ""}. NPCs need the npc tag and a world/{slug(given) || "…"} tag.
        </div>
      ) : !shown.length ? (
        <div style={S.muted}>No NPC matches these filters.</div>
      ) : (
        <table style={B.table}>
          <thead>
            <tr>
              <th style={B.th}>NPC</th>
              <th style={B.th}>Disposition</th>
              <th style={B.th}>Factions</th>
              <th style={B.th}>Where</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.page.$path}>
                <td style={B.td}>
                  <dc.Link link={r.page.$link?.withDisplay ? r.page.$link.withDisplay(r.name) : r.page.$link} />
                  {r.playerOnly ? <span style={S.pill}>{c.label_player_only}</span> : null}
                </td>
                <td style={B.td}>{r.disposition}</td>
                <td style={B.td}>{r.factions.map((t) => levelsOf(t, PREFIX.faction)).join(", ")}</td>
                <td style={r.trail ? B.td : { ...B.td, color: "var(--text-muted)" }}>{whereText(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

return { NpcBrowser, buildRows, optionsFor, matches, withinPaths };
```
