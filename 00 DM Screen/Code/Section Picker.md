---
hide_from_related: true
---

**Purpose:** Turns a long reference note into a row of buttons, one per section, for the Session Hub. Click a button and that section appears below; click it again to hide it. Several sections can be open at once. Built for the Conditions note, where you usually want one condition and not the other fourteen.

**Exports:** `SectionPicker`, `sectionsOf`

**Depends on:** [[Shared Helpers]]

**Used by:** [[Session Hub]]

Conventions this module relies on:

- **The buttons are the note's headings.** By default every `##` heading in the note is a button, in the note's order. `level="3"` uses `###` headings instead. The text under a heading, up to the next heading of the same or a higher level, is its section. Headings inside code fences are ignored.
- **Nothing to maintain.** Add a section to the note and it gets a button. Rename a heading and the button follows.
- **Using it.** `<SectionPicker note="Conditions" />`. The note is found by name, the way a `[[link]]` finds it. `level` is optional.
- **Several open at once.** Useful when conditions stack, such as Unconscious (which includes Incapacitated and Prone). The newest section opens at the top, and "Close all" clears them.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Section Picker.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { useNoteText, stripComments, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const P = {
  row: { display: "flex", flexWrap: "wrap", gap: "6px", margin: "8px 0" },
  panel: { borderTop: "1px solid var(--background-modifier-border)", margin: "10px 0 0", padding: "8px 0 0" },
  title: { fontWeight: 600, margin: "0 0 4px" },
  on: { background: "var(--interactive-accent)", color: "var(--text-on-accent)" },
};

/** Sections of a note: [{ name, body }] for each heading of the given level, in order. Headings in code fences are ignored. */
function sectionsOf(text, level = 2) {
  const out = [];
  let current = null;
  let fenced = false;
  for (const line of stripComments(text).split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    const h = fenced ? null : line.match(/^(#{1,6})\s+(.*?)\s*$/);
    if (h && h[1].length <= level) {
      current = null;
      if (h[1].length === level) {
        current = { name: h[2], lines: [] };
        out.push(current);
      }
      continue;
    }
    if (current) current.lines.push(line);
  }
  return out.map((s) => ({ name: s.name, body: s.lines.join("\n").trim() }));
}

function SectionPicker({ note, level }) {
  const from = dc.currentPath ? dc.currentPath() : "";
  const path = app.metadataCache.getFirstLinkpathDest?.(note ?? "", from)?.path ?? null;
  const text = useNoteText(path);
  const [open, setOpen] = dc.useState([]);
  const sections = sectionsOf(text, Number(level) || 2);
  if (!path) return <div style={S.muted}>No note named "{note}" found.</div>;
  if (!sections.length) return <div style={S.muted}>No level-{Number(level) || 2} headings in {note}.</div>;

  const toggle = (name) => setOpen((cur) => (cur.includes(name) ? cur.filter((n) => n !== name) : [name, ...cur]));
  const shown = open.filter((n) => sections.some((s) => s.name === n));

  return (
    <div>
      <div style={P.row}>
        {sections.map((s) => (
          <button key={s.name} style={shown.includes(s.name) ? P.on : undefined} onClick={() => toggle(s.name)}>
            {s.name}
          </button>
        ))}
        {shown.length ? <button onClick={() => setOpen([])}>Close all</button> : null}
      </div>
      {shown.map((name) => {
        const s = sections.find((x) => x.name === name);
        return (
          <div key={name} style={P.panel}>
            <div style={P.title}>{s.name}</div>
            <dc.Markdown content={s.body} sourcePath={path} />
          </div>
        );
      })}
    </div>
  );
}

return { SectionPicker, sectionsOf };
```
