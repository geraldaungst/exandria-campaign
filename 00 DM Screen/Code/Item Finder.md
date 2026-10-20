---
hide_from_related: true
---

**Purpose:** The item search for the Session Hub. Type a name and matching items appear in the hub with their type, rarity, cost, and text, from the 5e.tools data ([[Item Data]]). Below the results, buttons open the same search on D&D Beyond or another site. Beside it sits the magic item price table from [[Prices Card]].

**Exports:** `ItemFinder`, `parseEngines`, `engineUrl`

**Depends on:** [[Shared Helpers]] · [[Item Data]]

**Used by:** [[Session Hub]]

Conventions this module relies on:

- **Loading.** The item data loads the first time you click the search box: about 3 MB downloaded once, then kept in the browser's storage so the search works offline. "Refresh data" downloads it again.
- **Results.** Typing filters as you go. "All", "Magic", and "Mundane" narrow the list; "2024 books only" leaves out items that appear only in older books. Each result opens to its full text. When a name appears in both a 2024 and an older book, the 2024 entry is shown and the older source is named at the bottom.
- **The sites are a list in a note.** Under the `## Item finder` heading of [[Table References]], each bullet `- [Label](https://address) · description` is one button. Add, remove, or reorder bullets to change the buttons.
- **`{q}` in the address** is replaced with what you typed, so the site opens already searching. An address without `{q}` opens as written, and what you typed is copied to the clipboard so you can paste it into the site's search box.
- **Enter** runs the first button.
- **The price table** is the section named `Magic item value by rarity` in [[Prices Card]], embedded live, so editing that note changes it here.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Item Finder.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { useNoteText, stripComments, escapeRe, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const { loadItems, searchItems, itemMarkdown, sourceLabel } = await dc.require(dc.headerLink("00 DM Screen/Code/Item Data.md", "Code"));

const F = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start", margin: "8px 0" },
  card: { border: "1px solid var(--background-modifier-border)", borderRadius: "10px", padding: "16px 20px" },
  label: {
    fontSize: "var(--font-ui-smaller)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--text-muted)",
    marginBottom: "8px",
  },
  input: { width: "100%", marginBottom: "12px" },
  row: { display: "flex", alignItems: "center", gap: "10px", margin: "6px 0" },
  filters: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", margin: "0 0 12px" },
  result: { margin: "6px 0" },
  detail: { margin: "6px 0 12px 14px" },
  sites: { borderTop: "1px solid var(--background-modifier-border)", marginTop: "14px", paddingTop: "10px" },
};

const MAX_RESULTS = 25;

function ItemResult({ entry, sourcePath }) {
  const [open, setOpen] = dc.useState(false);
  const shownRarity = entry.rarity !== "none" && entry.rarity !== "unknown" ? entry.rarity : "";
  return (
    <details style={F.result} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        <strong>{entry.name}</strong>
        <span style={S.muted}>
          {" · "}
          {[entry.type, shownRarity, sourceLabel(entry.source)].filter(Boolean).join(" · ")}
        </span>
      </summary>
      {open ? (
        <div style={F.detail}>
          <dc.Markdown content={itemMarkdown(entry)} sourcePath={sourcePath} />
        </div>
      ) : null}
    </details>
  );
}

/** Buttons from the list under a heading: [{ label, url, desc }]. Bullets are "- [Label](https://…) · description". */
function parseEngines(text, heading) {
  const lines = stripComments(text).split("\n");
  const start = lines.findIndex((l) => new RegExp(`^##\\s+${escapeRe(heading)}\\s*$`, "i").test(l));
  if (start < 0) return [];
  const out = [];
  for (const line of lines.slice(start + 1)) {
    if (/^#{1,6}\s/.test(line)) break;
    const m = line.match(/^\s*[-*+]\s+.*?\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)(.*)$/);
    if (m) out.push({ label: m[1].trim(), url: m[2], desc: m[3].trim().replace(/^[·:\-–—]\s*/, "") });
  }
  return out;
}

/** The address to open: {q} filled in, or the address as written. */
const engineUrl = (engine, query) => engine.url.replace(/\{q\}/g, encodeURIComponent(query.trim()));

function ItemFinder({ source, group, prices, priceHeading }) {
  const sourcePath = source ?? "00 DM Screen/Table References.md";
  const pricesPath = prices ?? "00 DM Screen/Prices Card.md";
  const text = useNoteText(sourcePath);
  const engines = parseEngines(text, group ?? "Item finder");
  const [query, setQuery] = dc.useState("");
  const [message, setMessage] = dc.useState("");
  const [data, setData] = dc.useState(null);
  const [loading, setLoading] = dc.useState(false);
  const [kind, setKind] = dc.useState("all");
  const [only2024, setOnly2024] = dc.useState(false);
  const here = dc.currentPath ? dc.currentPath() : "";

  async function ensureData(force) {
    if (loading || (data?.entries && !force)) return;
    setLoading(true);
    setData(await loadItems({ force: !!force }));
    setLoading(false);
  }

  const results = data?.entries ? searchItems(data.entries, query, { kind, only2024 }) : [];

  async function run(engine) {
    const takesQuery = engine.url.includes("{q}");
    if (takesQuery && !query.trim()) {
      setMessage("Type an item name first.");
      return;
    }
    if (!takesQuery && query.trim()) {
      try {
        await navigator.clipboard.writeText(query.trim());
        setMessage(`Copied "${query.trim()}". Paste it into the search box on ${engine.label}.`);
      } catch (e) {
        setMessage("Couldn't copy to the clipboard. Type the name on the site.");
      }
    } else {
      setMessage("");
    }
    window.open(engineUrl(engine, query), "_blank");
  }

  return (
    <div style={F.grid}>
      <div style={F.card}>
        <div style={F.label}>Find an item</div>
        <input
          type="text"
          placeholder="Item name"
          value={query}
          style={F.input}
          onFocus={() => ensureData(false)}
          onInput={(e) => {
            setQuery(e.currentTarget.value);
            ensureData(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && engines.length) run(engines[0]);
          }}
        />
        <div style={F.filters}>
          {[["all", "All"], ["magic", "Magic"], ["mundane", "Mundane"]].map(([key, label]) => (
            <button key={key} disabled={kind === key} onClick={() => setKind(key)}>
              {label}
            </button>
          ))}
          <label style={S.muted}>
            <input type="checkbox" checked={only2024} onChange={(e) => setOnly2024(e.currentTarget.checked)} /> 2024 books only
          </label>
        </div>
        {loading ? <div style={S.muted}>Loading item data. The first time downloads about 3 MB.</div> : null}
        {data?.error ? (
          <div style={S.muted}>
            {data.error} <button onClick={() => ensureData(true)}>Try again</button>
          </div>
        ) : null}
        {!data && !loading ? <div style={S.muted}>Click the box to load the item data. After the first load it works offline.</div> : null}
        {data?.entries && query.trim() && !results.length ? <div style={S.muted}>No item matches "{query.trim()}".</div> : null}
        {results.slice(0, MAX_RESULTS).map((e) => (
          <ItemResult key={`${e.key}|${e.kind}`} entry={e} sourcePath={here} />
        ))}
        {results.length > MAX_RESULTS ? <div style={S.muted}>Showing the first {MAX_RESULTS} matches. Keep typing to narrow the list.</div> : null}
        {data?.entries ? (
          <div style={{ ...S.muted, marginTop: "8px" }}>
            5e.tools data: {data.fromCache ? "saved copy from" : "downloaded"} {new Date(data.fetchedAt).toLocaleDateString("en-US")}.{" "}
            <button onClick={() => ensureData(true)}>Refresh data</button>
          </div>
        ) : null}
        <div style={F.sites}>
        <div style={F.label}>Open on a site</div>
        {engines.length ? (
          engines.map((en) => (
            <div key={en.url} style={F.row}>
              <button onClick={() => run(en)}>{en.label}</button>
              {en.desc ? <span style={S.muted}>{en.desc}</span> : null}
            </div>
          ))
        ) : (
          <div style={S.muted}>No sites listed. Add bullets under "Item finder" in Table References.</div>
        )}
        {message ? <div style={{ ...S.muted, marginTop: "8px" }}>{message}</div> : null}
        </div>
      </div>
      <div style={F.card}>
        <div style={F.label}>Price by rarity</div>
        <dc.LinkEmbed link={dc.headerLink(pricesPath, priceHeading ?? "Magic item value by rarity")} />
      </div>
    </div>
  );
}

return { ItemFinder, parseEngines, engineUrl };
```
