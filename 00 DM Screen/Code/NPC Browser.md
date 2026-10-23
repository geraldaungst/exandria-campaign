---
hide_from_related: true
---

**Purpose:** The NPC browser for a campaign's folder note. It lists the NPCs of the campaign's world and narrows them with filters you combine: place, region, faction, disposition, a name search, and cross-check toggles for NPCs with no place, no faction, or `needs-work`.

**Exports:** `NpcBrowser`, `buildRows`, `optionsFor`, `matches`

**Depends on:** [[Shared Helpers]]

**Used by:** [[Prophecy of Eryndor]]

Conventions this module relies on:

- **Which NPCs.** Notes tagged `npc` (name in [[Hub Config]]) that carry the `world/…` tag of the world named in the current note's `world` property. Notes in the Player Wiki folder and in excluded folders are left out. A note with no `world` property makes the browser list every NPC.
- **Place, region, and faction are tags.** `place/…`, `region/…`, and `faction/…`, nested to any depth. Choosing a parent includes its children: choosing `zadash` also lists NPCs tagged `place/zadash/evening-nip`. A choice list holds only values the world's NPCs use, children indented under their parent.
- **Filters combine.** Every filter that is set must match. "No place" and "No faction" list NPCs without any `place/…` or `faction/…` tag, and they replace the place or faction choice. "Needs work" lists NPCs tagged `needs-work`.
- **Rows.** Name (a link), disposition, factions, and place. A note tagged with both a parent and its child shows the deepest tag only. Nothing here depends on a hand-updated field.
- **Prefixes** `world/`, `region/`, `place/`, and `faction/` are the ones the NPC, Faction, and Location templates write.

Embed it in a note with a `datacorejsx` block that loads `NpcBrowser` from the Code section of this note with `dc.require`, as [[Plot Dashboard]] does for its views, and returns it.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/NPC Browser.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, tagsOf, hasTag, isExcluded, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const PREFIX = { world: "world", region: "region", place: "place", faction: cfg().faction_tag_prefix };
const NONE = "__none__";

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
  String(name ?? "").replace(/ - DM Notes$/i, "").trim().normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/&/g, " and ").replace(/['’`]/g, "").replace(/[^a-z0-9_]+/g, "-").replace(/^-+|-+$/g, "");
const plainName = (p) => String(p.$name ?? p.$path.split("/").pop().replace(/\.md$/, "")).replace(/ - DM Notes$/i, "");
const underPrefix = (tags, prefix) => tags.filter((t) => t.startsWith(prefix + "/"));
const deepest = (tags) => tags.filter((t) => !tags.some((o) => o.startsWith(t + "/")));
const levelsOf = (tag, prefix) => tag.slice(prefix.length + 1).split("/").join(" / ");
const inTag = (tags, wanted) => tags.some((t) => t === wanted || t.startsWith(wanted + "/"));

/** The world's NPCs as plain rows: { page, name, tags, places, regions, factions, disposition, needsWork }. */
function buildRows(pages, { worldName, c }) {
  const worldTag = worldName ? `${PREFIX.world}/${slug(worldName)}` : null;
  return pages
    .filter((p) => hasTag(p, c.tag_npc) && !isExcluded(p) && !p.$path.startsWith(c.folder_player_wiki + "/"))
    .map((p) => {
      const tags = tagsOf(p);
      return {
        page: p,
        name: plainName(p),
        tags,
        places: deepest(underPrefix(tags, PREFIX.place)),
        regions: underPrefix(tags, PREFIX.region),
        factions: deepest(underPrefix(tags, PREFIX.faction)),
        allPlaces: underPrefix(tags, PREFIX.place),
        allFactions: underPrefix(tags, PREFIX.faction),
        disposition: String(p.value("disposition") ?? "").trim().toLowerCase(),
        needsWork: tags.includes(c.tag_needs_work),
      };
    })
    .filter((r) => !worldTag || inTag(r.tags, worldTag))
    .sort((a, b) => a.name.localeCompare(b.name));
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
    return { tag, label: "  ".repeat(depth) + tag.split("/").pop() };
  });
}

/** True when the row passes every filter that is set. */
function matches(r, f) {
  if (f.place === NONE ? r.allPlaces.length : f.place && !inTag(r.allPlaces, f.place)) return false;
  if (f.faction === NONE ? r.allFactions.length : f.faction && !inTag(r.allFactions, f.faction)) return false;
  if (f.region && !inTag(r.regions, f.region)) return false;
  if (f.disposition && r.disposition !== f.disposition) return false;
  if (f.needsWork && !r.needsWork) return false;
  const q = f.query.trim().toLowerCase();
  if (q && !r.name.toLowerCase().includes(q)) return false;
  return true;
}

const EMPTY = { place: "", region: "", faction: "", disposition: "", needsWork: false, query: "" };

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
  const all = dc.useQuery(`@page and #${c.tag_npc}`);
  const [f, setF] = dc.useState(EMPTY);
  const set = (patch) => setF({ ...f, ...patch });

  const rows = dc.useMemo(() => buildRows(all, { worldName: given.trim(), c }), [all, given]);
  const placeOpts = dc.useMemo(() => optionsFor(rows, PREFIX.place, "allPlaces"), [rows]);
  const factionOpts = dc.useMemo(() => optionsFor(rows, PREFIX.faction, "allFactions"), [rows]);
  const regionOpts = dc.useMemo(() => optionsFor(rows, PREFIX.region, "regions"), [rows]);
  const dispositions = dc.useMemo(() => [...new Set(rows.map((r) => r.disposition).filter(Boolean))].sort(), [rows]);
  const shown = rows.filter((r) => matches(r, f));
  const dirty = JSON.stringify(f) !== JSON.stringify(EMPTY);

  return (
    <div style={B.wrap}>
      <div style={B.bar}>
        <label style={B.field}>
          <span style={B.label}>Name</span>
          <input type="text" placeholder="Search names" value={f.query} onInput={(e) => set({ query: e.currentTarget.value })} />
        </label>
        <Pick label="Place" value={f.place} onChange={(v) => set({ place: v })}>
          <option value="">Any place</option>
          <option value={NONE}>No place</option>
          {placeOpts.map((o) => (
            <option key={o.tag} value={o.tag}>{o.label}</option>
          ))}
        </Pick>
        <Pick label="Region" value={f.region} onChange={(v) => set({ region: v })}>
          <option value="">Any region</option>
          {regionOpts.map((o) => (
            <option key={o.tag} value={o.tag}>{o.label}</option>
          ))}
        </Pick>
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
              <th style={B.th}>Place</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.page.$path}>
                <td style={B.td}>
                  <dc.Link link={r.page.$link?.withDisplay ? r.page.$link.withDisplay(r.name) : r.page.$link} />
                </td>
                <td style={B.td}>{r.disposition}</td>
                <td style={B.td}>{r.factions.map((t) => levelsOf(t, PREFIX.faction)).join(", ")}</td>
                <td style={B.td}>{r.places.map((t) => levelsOf(t, PREFIX.place)).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

return { NpcBrowser, buildRows, optionsFor, matches };
```
