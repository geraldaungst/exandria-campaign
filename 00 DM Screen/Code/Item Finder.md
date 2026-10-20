---
hide_from_related: true
---

**Purpose:** An item search box for the Session Hub. Type a name, press a button, and the search opens on D&D Beyond or another site. Beside it sits the magic item price table from [[Prices Card]].

**Exports:** `ItemFinder`, `parseEngines`, `engineUrl`

**Depends on:** [[Shared Helpers]]

**Used by:** [[Session Hub]]

Conventions this module relies on:

- **The sites are a list in a note.** Under the `## Item finder` heading of [[Table References]], each bullet `- [Label](https://address) · description` is one button. Add, remove, or reorder bullets to change the buttons.
- **`{q}` in the address** is replaced with what you typed, so the site opens already searching. An address without `{q}` opens as written, and what you typed is copied to the clipboard so you can paste it into the site's search box.
- **Enter** runs the first button.
- **The price table** is the section named `Magic item value by rarity` in [[Prices Card]], embedded live, so editing that note changes it here.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Item Finder.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { useNoteText, stripComments, escapeRe, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

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
};

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
          onInput={(e) => setQuery(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && engines.length) run(engines[0]);
          }}
        />
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
      <div style={F.card}>
        <div style={F.label}>Price by rarity</div>
        <dc.LinkEmbed link={dc.headerLink(pricesPath, priceHeading ?? "Magic item value by rarity")} />
      </div>
    </div>
  );
}

return { ItemFinder, parseEngines, engineUrl };
```
