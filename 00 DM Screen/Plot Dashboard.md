---
cssclasses:
  - wide-page
---

## Plot Manager

```datacorejsx
// Plot Dashboard (Datacore 0.1.29)
// One card per plot thread, grouped by stage. Every note connected to a plot
// (linked from it, or linking to it) is listed on that plot's card, so a note
// tied to three plots appears on all three cards.

// Settings
const STALE_DAYS = 14;       // amber after this many days without an edit
const VERY_STALE_DAYS = 45;  // red after this many days

// color: the theme color used for that stage's card header (Obsidian's built-in
// palette: red, orange, yellow, green, cyan, blue, purple, pink)
const STAGES = [
  { tag: "plot/active", label: "Active", open: true, color: "green" },
  { tag: "plot/upcoming", label: "Upcoming", open: true, color: "blue" },
  { tag: "plot/seed", label: "Seed", open: false, color: "purple" },
  { tag: "plot/paused", label: "Paused", open: false, color: "yellow" },
  { tag: null, label: "No stage tag", open: false, color: null },
];
const HEADER_TINT = 0.22; // header background strength, 0 to 1

const stageBg = (stage) =>
  stage.color ? `rgba(var(--color-${stage.color}-rgb), ${HEADER_TINT})` : "var(--background-modifier-hover)";

// Main groups are always visible on a card; minor groups sit in a collapsed section.
const GROUPS = [
  { tag: "npc", label: "NPCs", main: true },
  { tag: "artifact", label: "Items", main: true },
  { tag: "location", label: "Locations", main: true },
  { tag: "faction", label: "Factions", main: true },
  { tag: "lore", label: "Lore", main: true },
  { tag: "plot", label: "Related plots", main: true },
  { tag: "session", label: "Sessions", main: false },
  { tag: null, label: "Other notes", main: false },
];

// Helpers
const tagsOf = (p) => (p.$tags ?? []).map((t) => String(t).replace(/^#/, "").toLowerCase());
const hasTag = (p, tag) => tagsOf(p).some((t) => t === tag || t.startsWith(tag + "/"));
const fileName = (path) => path.split("/").pop().replace(/\.md$/i, "");
const nameOf = (p) => p.$name ?? fileName(p.$path);
const shortName = (p) => nameOf(p).replace(/ - DM Notes$/, "");
const inZFolder = (p) => p.$path.split("/").some((part) => part.startsWith("z_"));

const prop = (p, key) => {
  try {
    const v = p.value?.(key);
    if (v !== undefined) return v;
  } catch (e) {}
  const fm = p.$frontmatter ?? {};
  return fm[key]?.value ?? fm[key.toLowerCase()]?.value;
};

const ageDays = (p) => {
  const m = p.$mtime;
  const ms = m?.toMillis ? m.toMillis() : new Date(m).getTime();
  return Math.max(0, Math.floor((Date.now() - ms) / 86400000));
};
const ageLabel = (d) =>
  d < 1 ? "today" : d === 1 ? "1 day" : d < 14 ? `${d} days` : d < 60 ? `${Math.round(d / 7)} wks` : `${Math.round(d / 30)} mos`;
const ageColor = (d) =>
  d >= VERY_STALE_DAYS ? "var(--color-red)" : d >= STALE_DAYS ? "var(--color-orange)" : "var(--text-muted)";

// Link styling. dc.Link renders a normal Obsidian link, so it is styled here.
// Plot titles: heading size, normal text color. Connected notes: normal text color,
// accent color and underline only on hover. Edit these rules to taste.
const CSS = `
.plot-dash a.internal-link { text-decoration: none; }
.plot-dash .pd-title a.internal-link {
  color: var(--text-normal);
  font-size: 1.2em;
  font-weight: 700;
  line-height: 1.25;
}
.plot-dash .pd-item a.internal-link { color: var(--text-normal); }
.plot-dash a.internal-link:hover {
  color: var(--text-accent);
  text-decoration: underline;
}
`;

// Styles
const S = {
  bar: { display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "12px" },
  search: { flex: "1 1 260px", padding: "6px 10px", borderRadius: "6px" },
  stat: { fontSize: "var(--font-ui-small)", color: "var(--text-muted)" },
  stageSummary: { fontSize: "1.15em", fontWeight: 600, cursor: "pointer", margin: "14px 0 8px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" },
  card: {
    border: "1px solid var(--background-modifier-border)",
    borderLeftWidth: "4px",
    borderRadius: "8px",
    padding: "10px 12px",
    background: "var(--background-secondary)",
    overflow: "hidden",
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "8px",
    margin: "-10px -12px 0",
    padding: "8px 12px",
  },
  badge: {
    fontSize: "var(--font-ui-smaller)",
    fontWeight: 600,
    whiteSpace: "nowrap",
    padding: "1px 6px",
    borderRadius: "10px",
    background: "var(--background-primary)",
  },
  counts: { fontSize: "var(--font-ui-smaller)", color: "var(--text-muted)", margin: "6px 0 2px" },
  groupLabel: {
    fontSize: "var(--font-ui-smaller)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--text-muted)",
    marginTop: "8px",
  },
  list: { listStyle: "none", margin: "2px 0 0", padding: 0 },
  item: { padding: "1px 4px", borderRadius: "4px", lineHeight: 1.45 },
  hit: { background: "var(--text-highlight-bg)" },
  detail: { color: "var(--text-muted)", fontSize: "var(--font-ui-smaller)" },
  minor: { marginTop: "8px", fontSize: "var(--font-ui-smaller)", color: "var(--text-muted)", cursor: "pointer" },
  empty: { color: "var(--text-faint)", fontStyle: "italic", fontSize: "var(--font-ui-smaller)" },
};

// Components
function NoteLink({ page }) {
  const name = shortName(page);
  const link = page.$link?.withDisplay ? page.$link.withDisplay(name) : page.$link;
  return <dc.Link link={link} />;
}

function Val({ v }) {
  if (v === null || v === undefined || v === "") return null;
  if (Array.isArray(v)) {
    return (
      <span>
        {v.map((x, i) => (
          <span key={i}>
            {i > 0 ? ", " : ""}
            <Val v={x} />
          </span>
        ))}
      </span>
    );
  }
  if (typeof v === "object" && v.path) return <dc.Link link={v} />;
  const text = String(v).replace(/^\[\[/, "").replace(/\]\]$/, "").replace(/\|.*$/, "").replace(/ - DM Notes$/, "");
  return <span>{text}</span>;
}

function NpcDetail({ page }) {
  const disp = prop(page, "disposition");
  const loc = prop(page, "current_location");
  if (!disp && !loc) return null;
  return (
    <span style={S.detail}>
      {" · "}
      {disp ? <span>{String(disp)}</span> : null}
      {disp && loc ? ", " : null}
      {loc ? <Val v={loc} /> : null}
    </span>
  );
}

function ItemList({ items, query, showDetail }) {
  return (
    <ul style={S.list}>
      {items.map((p) => {
        const hit = query && shortName(p).toLowerCase().includes(query);
        return (
          <li key={p.$path} class="pd-item" style={hit ? { ...S.item, ...S.hit } : S.item}>
            <NoteLink page={p} />
            {showDetail ? <NpcDetail page={p} /> : null}
          </li>
        );
      })}
    </ul>
  );
}

function PlotCard({ plot, query }) {
  const main = plot.groups.filter((g) => g.main && g.items.length);
  const minor = plot.groups.filter((g) => !g.main && g.items.length);
  const minorCount = minor.reduce((n, g) => n + g.items.length, 0);
  const minorHit = query && minor.some((g) => g.items.some((p) => shortName(p).toLowerCase().includes(query)));
  const counts = main.map((g) => `${g.items.length} ${g.label.toLowerCase()}`).join(" · ");
  return (
    <div style={{ ...S.card, borderLeftColor: ageColor(plot.age) }}>
      <div style={{ ...S.cardHead, background: stageBg(plot.stage) }}>
        <span class="pd-title">
          <NoteLink page={plot.page} />
        </span>
        <span style={{ ...S.badge, color: ageColor(plot.age) }} title="Time since this plot note was last edited">
          {ageLabel(plot.age)}
        </span>
      </div>
      <div style={S.counts}>{counts || "No connected NPCs, items, locations, or factions"}</div>
      {main.map((g) => (
        <div key={g.label}>
          <div style={S.groupLabel}>{g.label}</div>
          <ItemList items={g.items} query={query} showDetail={g.tag === "npc"} />
        </div>
      ))}
      {minorCount > 0 ? (
        <details open={minorHit ? true : undefined}>
          <summary style={S.minor}>Sessions and other notes ({minorCount})</summary>
          {minor.map((g) => (
            <div key={g.label}>
              <div style={S.groupLabel}>{g.label}</div>
              <ItemList items={g.items} query={query} showDetail={false} />
            </div>
          ))}
        </details>
      ) : null}
    </div>
  );
}

return function PlotDashboard() {
  const all = dc.useQuery("@page");
  const [rawQuery, setQuery] = dc.useState("");
  const query = rawQuery.trim().toLowerCase();
  const self = dc.currentPath ? dc.currentPath() : null;

  const plots = dc.useMemo(() => {
    const pages = all.filter((p) => !inZFolder(p) && p.$path !== self);
    const byPath = new Map(pages.map((p) => [p.$path, p]));
    const byName = new Map(pages.map((p) => [fileName(p.$path).toLowerCase(), p]));
    const resolve = (l) => {
      if (!l || !l.path) return undefined;
      return byPath.get(l.path) ?? byPath.get(l.path + ".md") ?? byName.get(fileName(l.path).toLowerCase());
    };
    const hidden = (p) => prop(p, "hide_from_related") === true;

    // Notes with hide_from_related (e.g. index notes) get no card and appear on no card
    const plotPages = pages.filter((p) => hasTag(p, "plot") && !hidden(p));
    const conns = new Map(plotPages.map((p) => [p.$path, new Map()]));

    // Notes the plot links to
    for (const plot of plotPages) {
      for (const l of plot.$links ?? []) {
        const target = resolve(l);
        if (target && target.$path !== plot.$path && !hidden(target)) conns.get(plot.$path).set(target.$path, target);
      }
    }
    // Notes that link to the plot
    for (const page of pages) {
      if (hidden(page)) continue;
      for (const l of page.$links ?? []) {
        const target = resolve(l);
        if (target && target.$path !== page.$path && conns.has(target.$path)) conns.get(target.$path).set(page.$path, page);
      }
    }

    return plotPages.map((page) => {
      const linked = [...conns.get(page.$path).values()];
      const used = new Set();
      const groups = GROUPS.map((g) => {
        const items = linked
          .filter((p) => !used.has(p.$path) && (g.tag === null || hasTag(p, g.tag)))
          .sort((a, b) => shortName(a).localeCompare(shortName(b)));
        items.forEach((p) => used.add(p.$path));
        return { ...g, items };
      });
      const stage = STAGES.find((s) => s.tag && tagsOf(page).includes(s.tag)) ?? STAGES[STAGES.length - 1];
      return { page, stage, groups, age: ageDays(page) };
    });
  }, [all, self]);

  const matches = (plot) =>
    !query ||
    shortName(plot.page).toLowerCase().includes(query) ||
    plot.groups.some((g) => g.items.some((p) => shortName(p).toLowerCase().includes(query)));

  const active = plots.filter((p) => p.stage.tag === "plot/active");
  const staleActive = active.filter((p) => p.age >= STALE_DAYS).length;

  return (
    <div class="plot-dash">
      <style>{CSS}</style>
      <div style={S.bar}>
        <input
          type="search"
          placeholder="Filter by plot or connected note (e.g. Qalix)"
          value={rawQuery}
          onInput={(e) => setQuery(e.currentTarget.value)}
          style={S.search}
        />
        <span style={S.stat}>
          {STAGES.map((s) => `${s.label}: ${plots.filter((p) => p.stage === s).length}`).join("  ·  ")}
        </span>
        <span style={{ ...S.stat, color: staleActive ? "var(--color-orange)" : "var(--text-muted)" }}>
          {staleActive} active {staleActive === 1 ? "plot" : "plots"} untouched {STALE_DAYS}+ days
        </span>
      </div>

      {STAGES.map((s) => {
        const list = plots
          .filter((p) => p.stage === s && matches(p))
          .sort((a, b) => b.age - a.age || shortName(a.page).localeCompare(shortName(b.page)));
        if (list.length === 0) return null;
        return (
          <details key={s.label} open={s.open || query ? true : undefined}>
            <summary style={S.stageSummary}>
              {s.label} ({list.length})
            </summary>
            <div style={S.grid}>
              {list.map((p) => (
                <PlotCard key={p.page.$path} plot={p} query={query} />
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
};
```
