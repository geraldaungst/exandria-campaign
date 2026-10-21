---
hide_from_related: true
---

**Purpose:** Layout pieces for the Session Hub: rows of cards that sit side by side on a wide pane and stack on a narrow one, and a fold that stays closed until opened. They hold other components and change nothing about them.

**Exports:** `Row`, `Cell`, `Fold`

**Depends on:** none

**Used by:** [[Session Hub]]

Conventions this module relies on:

- **Row.** `<Row>` lays its cells out left to right and wraps them onto the next line when they no longer fit. Cells keep their own height, so a tall result in one cell doesn't stretch the others.
- **Cell.** `<Cell grow={3} min={360} title="Conditions">`. `min` is the narrowest the cell gets before it wraps (pixels, default 300). `grow` is its share of the spare width (default 1), so `grow={3}` next to `grow={2}` gives roughly a 60/40 split. `title` is an optional small label above the cell.
- **Fold.** `<Fold label="Sites">` shows a summary line and builds its contents only when opened, so closed folds cost nothing.
- **Section folding is Obsidian's.** The hub's `##` headings fold with the ordinary Markdown fold arrows; nothing here changes that.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Hub Layout.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const Y = {
  row: { display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "16px 28px", margin: "8px 0" },
  label: {
    fontSize: "var(--font-ui-smaller)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--text-muted)",
    margin: "0 0 8px",
  },
};

function Row({ children }) {
  return <div style={Y.row}>{children}</div>;
}

function Cell({ grow, min, title, children }) {
  const g = Number(grow) || 1;
  const m = Number(min) || 300;
  return (
    <div style={{ flex: `${g} 1 ${m}px`, minWidth: 0 }}>
      {title ? <div style={Y.label}>{title}</div> : null}
      {children}
    </div>
  );
}

function Fold({ label, children }) {
  const [open, setOpen] = dc.useState(false);
  return (
    <details style={{ margin: "8px 0" }} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{label}</summary>
      {open ? <div style={{ marginTop: "8px" }}>{children}</div> : null}
    </details>
  );
}

return { Row, Cell, Fold };
```
