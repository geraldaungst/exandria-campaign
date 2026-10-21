---
hide_from_related: true
---

**Purpose:** The Party card for the Session Hub: one row per player character with level, AC, HP, speed, passive Perception, Insight and Investigation, spell save DC, defenses, and languages. The data comes from Roll20, where the sheets are kept, through a small script ([[Roll20 Party Script]]), so nothing in the vault is typed by hand.

**Exports:** `PartyCard`, `parsePaste`, `parseTable`, `buildNote`, `mergeRows`

**Depends on:** [[Shared Helpers]]

**Used by:** [[Session Hub]]

Conventions this module relies on:

- **The data note.** `party_card_note` in [[Hub Config]] (default `00 DM Screen/Party Card Data.md`) holds a Markdown table and an `as_of` date. The card reads it and the hub shows it with that date. The note is plain text, so you can fix a cell by hand.
- **Updating.** In Roll20 type `!party`. The script whispers one line per character, each starting with `PARTY|`. Copy the lines, open "Update from Roll20" on the card, paste, and press Save. Rows are matched by character name: pasted characters replace their old rows, and characters not in the paste stay as they were.
- **Level.** The card heading shows the highest level in the table.
- **Languages.** The 2014 Roll20 sheet exposes them to the script. The 2024 sheet does not, so those cells are blank. You can type them into the data note's table by hand; a later paste keeps a hand-typed language list when the paste has none for that character.
- **Defenses.** Resistances, immunities, and vulnerabilities come from the sheet's NPC-style fields on the 2024 sheet; the 2014 sheet doesn't expose them. Conditions the sheet lists there (such as charmed) are shown separately as "Conditions", because the sheet doesn't say whether they mean immunity or advantage.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Party Card.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, useNoteText, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const COLUMNS = ["Character", "Level", "AC", "HP", "Speed", "Perception", "Insight", "Investigation", "Spell DC", "Resistances", "Immunities", "Vulnerabilities", "Conditions", "Languages"];
const FIELD_KEYS = ["name", "level", "ac", "hp", "speed", "pp", "pi", "pinv", "dc", "resist", "immune", "vuln", "cond", "languages"];

const clean = (v) => String(v ?? "").replace(/\|/g, "/").replace(/\s+/g, " ").trim();

/** Rows from pasted Roll20 text: lines (anywhere in the text) of the form PARTY|Name|Level|AC|... */
function parsePaste(text) {
  const rows = [];
  for (const raw of String(text ?? "").split(/\r?\n/)) {
    const at = raw.indexOf("PARTY|");
    if (at < 0) continue;
    const parts = raw.slice(at + 6).split("|");
    if (parts.length < 2 || !parts[0].trim()) continue;
    const row = {};
    FIELD_KEYS.forEach((key, i) => {
      row[key] = clean(parts[i]);
    });
    rows.push(row);
  }
  return rows;
}

/** Rows from the data note's Markdown table. */
function parseTable(text) {
  const rows = [];
  let header = null;
  for (const line of String(text ?? "").split("\n")) {
    if (!/^\s*\|/.test(line)) continue;
    const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
    if (!header) {
      header = cells.map((c) => c.toLowerCase());
      continue;
    }
    const row = {};
    COLUMNS.forEach((col, i) => {
      const at = header.indexOf(col.toLowerCase());
      row[FIELD_KEYS[i]] = at >= 0 ? clean(cells[at]) : "";
    });
    if (row.name) rows.push(row);
  }
  return rows;
}

/** Existing rows with pasted ones merged in by character name (case-insensitive). A pasted row with no languages keeps the old languages. */
function mergeRows(existing, pasted) {
  const rows = existing.map((r) => ({ ...r }));
  for (const p of pasted) {
    const at = rows.findIndex((r) => r.name.toLowerCase() === p.name.toLowerCase());
    if (at < 0) {
      rows.push({ ...p });
      continue;
    }
    rows[at] = { ...p, languages: p.languages || rows[at].languages };
  }
  return rows;
}

/** The data note's text: frontmatter with the date, and the table. */
function buildNote(rows, asOf) {
  const table = [
    `| ${COLUMNS.join(" | ")} |`,
    `| ${COLUMNS.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${FIELD_KEYS.map((k) => clean(r[k]) || " ").join(" | ")} |`),
  ];
  return [
    "---",
    "hide_from_related: true",
    `as_of: ${asOf}`,
    "---",
    "",
    "Written by the Party card on the Session Hub from the Roll20 `!party` script. You can fix a cell by hand; a later paste replaces the rows of the characters it contains.",
    "",
    ...table,
    "",
  ].join("\n");
}

const todayText = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

async function saveNote(path, rows) {
  const text = buildNote(rows, todayText());
  const file = app.vault.getAbstractFileByPath(path);
  if (file) {
    await app.vault.process(file, () => text);
    return;
  }
  const slash = path.lastIndexOf("/");
  if (slash > 0 && !app.vault.getAbstractFileByPath(path.slice(0, slash))) await app.vault.createFolder(path.slice(0, slash));
  await app.vault.create(path, text);
}

const Q = {
  card: { margin: "8px 0" },
  head: { display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "12px", margin: "0 0 8px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontWeight: 600, padding: "4px 12px 4px 0", borderBottom: "1px solid var(--background-modifier-border)", whiteSpace: "nowrap" },
  td: { padding: "6px 12px 6px 0", verticalAlign: "top", borderBottom: "1px solid var(--background-modifier-border)" },
  num: { textAlign: "center" },
  area: { width: "100%", minHeight: "6em", fontFamily: "var(--font-monospace)", marginTop: "8px" },
};

function defensesText(r) {
  return [
    r.resist ? `Resist ${r.resist}` : "",
    r.immune ? `Immune ${r.immune}` : "",
    r.vuln ? `Vulnerable ${r.vuln}` : "",
    r.cond ? `Conditions: ${r.cond}` : "",
  ].filter(Boolean).join(" · ");
}

function PartyCard({ source }) {
  const path = source ?? cfg().party_card_note;
  const text = useNoteText(path);
  const rows = parseTable(text);
  const asOf = (text.match(/^as_of:\s*(.+)$/m) ?? [])[1] ?? "";
  const [open, setOpen] = dc.useState(false);
  const [paste, setPaste] = dc.useState("");
  const [message, setMessage] = dc.useState("");
  const level = rows.reduce((m, r) => Math.max(m, Number(r.level) || 0), 0);
  const showLanguages = rows.some((r) => r.languages);

  async function save() {
    const pasted = parsePaste(paste);
    if (!pasted.length) {
      setMessage("No lines starting with PARTY| in what you pasted.");
      return;
    }
    try {
      await saveNote(path, mergeRows(rows, pasted));
      setPaste("");
      setMessage(`Saved ${pasted.length} character${pasted.length === 1 ? "" : "s"}.`);
    } catch (e) {
      setMessage(`Couldn't save: ${e.message}`);
    }
  }

  const header = (label, center) => (
    <th key={label} style={{ ...Q.th, ...(center ? Q.num : {}) }}>{label}</th>
  );

  return (
    <div style={Q.card}>
      <div style={Q.head}>
        <strong>{level ? `Party level ${level}` : "Party"}</strong>
        <span style={S.muted}>{asOf ? `From Roll20, ${asOf}` : "No data yet"}</span>
      </div>
      {rows.length ? (
        <table style={Q.table}>
          <thead>
            <tr>
              {header("Character")}
              {header("AC", true)}
              {header("Max HP", true)}
              {header("Speed", true)}
              {header("Passive P / I / Inv", true)}
              {header("Spell DC", true)}
              {header("Defenses")}
              {showLanguages ? header("Languages") : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td style={Q.td}><strong>{r.name}</strong></td>
                <td style={{ ...Q.td, ...Q.num }}>{r.ac}</td>
                <td style={{ ...Q.td, ...Q.num }}>{r.hp}</td>
                <td style={{ ...Q.td, ...Q.num }}>{r.speed}</td>
                <td style={{ ...Q.td, ...Q.num }}>{[r.pp, r.pi, r.pinv].map((v) => v || "-").join(" / ")}</td>
                <td style={{ ...Q.td, ...Q.num }}>{r.dc || "-"}</td>
                <td style={Q.td}>{defensesText(r)}</td>
                {showLanguages ? <td style={Q.td}>{r.languages}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={S.muted}>Nothing saved yet. Update from Roll20 below.</div>
      )}
      <details style={{ marginTop: "10px" }} open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
        <summary>Update from Roll20</summary>
        <div style={S.muted}>
          In Roll20 chat type <code>!party</code>, copy the lines that start with <code>PARTY|</code>, paste them here, and press Save.
        </div>
        <textarea style={Q.area} value={paste} placeholder="PARTY|Name|8|16|67|..." onInput={(e) => setPaste(e.currentTarget.value)} />
        <div style={{ margin: "6px 0" }}>
          <button onClick={save} disabled={!paste.trim()}>Save</button> <span style={S.muted}>{message}</span>
        </div>
      </details>
    </div>
  );
}

return { PartyCard, parsePaste, parseTable, buildNote, mergeRows };
```
