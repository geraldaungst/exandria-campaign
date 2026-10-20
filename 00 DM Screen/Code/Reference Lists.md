---
hide_from_related: true
---

**Purpose:** Shows a list of reference notes that you keep as plain bullets in an ordinary note. Each entry is a line that opens to the full note (or one section of it) inside the Session Hub. Add, remove, or reorder bullets in the list note to change what the hub shows.

**Exports:** `ReferenceList`, `parseRefs`

**Depends on:** [[Shared Helpers]]

**Used by:** [[Session Hub]]

Conventions this module relies on:

- **The list note.** Headings (`##`) group the entries. A bullet that contains a wiki link is an entry: `- [[Reaction Card]] · Influence and attitudes`. Text after the link is the description. `[[Note#Heading]]` opens just that section, and `[[Note|Label]]` changes the label. Bullets without a link are ignored.
- **Showing one group.** `<ReferenceList source="…" group="Improv references" />` shows only the entries under that heading. Without `group`, every group is shown.
- **Opening an entry** loads the note's text into the hub at that moment, so a long list costs nothing until you open something.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Reference Lists.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { useNoteText, stripComments, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const R = {
  group: { margin: "10px 0 14px" },
  label: {
    fontSize: "var(--font-ui-smaller)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--text-muted)",
    margin: "0 0 6px",
  },
  entry: { margin: "6px 0" },
  embed: { margin: "6px 0 12px 14px" },
};

const LINK_RE = /\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/;

/** Groups of entries from a list note: [{ title, items: [{ target, header, label, desc }] }]. */
function parseRefs(text) {
  const groups = [];
  let current = { title: "", items: [] };
  groups.push(current);
  for (const line of stripComments(text).split("\n")) {
    const heading = line.match(/^#{1,6}\s+(.*?)\s*$/);
    if (heading) {
      current = { title: heading[1], items: [] };
      groups.push(current);
      continue;
    }
    const bullet = line.match(/^\s*(?:[-*+]|\d+\.)\s+(.*)$/);
    if (!bullet) continue;
    const m = bullet[1].match(LINK_RE);
    if (!m) continue;
    const target = m[1].trim();
    const desc = (bullet[1].slice(0, m.index) + bullet[1].slice(m.index + m[0].length)).trim().replace(/^[·:\-–—]\s*/, "");
    current.items.push({ target, header: m[2]?.trim() ?? "", label: (m[3] ?? target).trim(), desc });
  }
  return groups.filter((g) => g.items.length);
}

function RefEntry({ item, source }) {
  const [open, setOpen] = dc.useState(false);
  const path = safeResolve(item.target, source);
  const page = dc.useFile(path ?? "");
  if (!path || !page) {
    return (
      <div style={R.entry}>
        {item.label} <span style={S.muted}>no note named "{item.target}" found</span>
      </div>
    );
  }
  const link = item.header ? dc.headerLink(path, item.header) : page.$link;
  return (
    <details style={R.entry} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        <dc.Link link={link.withDisplay ? link.withDisplay(item.label) : link} />
        {item.desc ? <span style={S.muted}> · {item.desc}</span> : null}
      </summary>
      {open ? (
        <div style={R.embed}>
          <dc.LinkEmbed link={link} />
        </div>
      ) : null}
    </details>
  );
}

/** The note a link points to, as Obsidian resolves it from the list note; null when there is none. */
function safeResolve(target, source) {
  return app.metadataCache.getFirstLinkpathDest?.(target, source)?.path ?? null;
}

function ReferenceList({ source, group }) {
  const text = useNoteText(source);
  const groups = parseRefs(text).filter((g) => !group || g.title.toLowerCase() === group.toLowerCase());
  if (!groups.length) {
    return (
      <div style={S.muted}>
        Nothing listed{group ? ` under "${group}"` : ""} in {source.split("/").pop().replace(/\.md$/, "")}. Add a bullet with a [[link]] to that note.
      </div>
    );
  }
  return (
    <div>
      {groups.map((g) => (
        <div key={g.title} style={R.group}>
          {!group && g.title ? <div style={R.label}>{g.title}</div> : null}
          {g.items.map((it, i) => (
            <RefEntry key={`${it.target}#${it.header}#${i}`} item={it} source={source} />
          ))}
        </div>
      ))}
    </div>
  );
}

return { ReferenceList, parseRefs };
```
