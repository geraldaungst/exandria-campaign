---
hide_from_related: true
---

**Purpose:** The views on an artifact hub (the Lorestone Shard Status Tracker): a one-line "held by" overview, a who-knows-what grid, and a card per piece showing its holder, location, who knows, who pursues it, and its inscribed lines, with a detail panel for its full history, rulings, notes, open questions, and sessions. Read-only; editing comes in a later stage.

**Exports:** `PieceOverview`, `PieceCards`, `WhoKnowsGrid`, `usePartyLocation`

**Depends on:** [[Shared Helpers]] · [[Campaign State]] · [[Session Hub Views]] · [[Hub Layout]] · [[Artifact Pieces]]

**Used by:** [[Lorestone Shard Status Tracker]]

Conventions this module relies on:

- **Props.** Both components take `piece`, the artifact's slug (`piece="lorestone-of-eryndor"`); pieces are the notes tagged `<piece_tag_prefix>/<slug>` ([[Artifact Pieces]] has the note format). `PieceCards` also takes `original` and `modern`, the names of the notes holding the labeled inscription lines.
- **Card colors** (left border): green when the party or a PC holds the piece; gray when no one holds it; the accent color when the party knows where it is or who holds it; red when only you know. A key under the cards repeats this.
- **Line dots.** One per original line: ● the party has read it, ◐ they know only its modern version, ○ they know neither. Hover for the text.
- **Party location.** The link in the `Party location` bullet under `Where we left off` in the last played session, the same rule as the Session Hub's "Where are we". A piece held by a PC or by the party shows that place.
- **Overview.** One line: each holder followed by the numbers of the pieces they hold; each number opens its note. Made to be embedded elsewhere (the artifact's DM note, the plot thread).
- **Cards.** One per piece in number order. "More" opens the detail panel under the cards, one piece at a time. A card with lines the reader could not parse shows a warning; the panel lists them.
- **Who knows what.** One row per person, faction, or the party; one column per piece. Each cell is shaded by the highest level known: light green knows it exists, mid green knows where (or who holds it), dark green holds it; gold believes something false (whatever the false belief is); ↗ marks pursuing, on top of any of these. Factions and the party start folded: click a folded group's name to show its members. Once open, the name is a link to its note and the ▾ beside it folds the group again (a name, faction, or place filter opens the groups it matches). Rows come from the pieces' holders and their Who knows and Pursued by lines; a person's lines also count for each faction they belong to and, for a PC, for the party, and they are listed under it. Filters: name, faction, and place (the `place/…` tags on the people's own notes). Clicking a cell lists the lines behind it.
- **Sessions in the panel.** Every session note a piece's lines cite, plus every session note that links to the piece's note, newest first.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Artifact Hub Views.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, num, useNoteText, S: BASE } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));
const { useActiveCampaign, useSessionState } = await dc.require(dc.headerLink("00 DM Screen/Code/Campaign State.md", "Code"));
const { sectionText, labelItems } = await dc.require(dc.headerLink("00 DM Screen/Code/Session Hub Views.md", "Code"));
const { Row, Cell } = await dc.require(dc.headerLink("00 DM Screen/Code/Hub Layout.md", "Code"));
const { usePieces, displayName, CODES } = await dc.require(dc.headerLink("00 DM Screen/Code/Artifact Pieces.md", "Code"));

// Link styling, as on the Plot Dashboard: normal text color, accent and underline on hover.
const CSS = `
.piece-hub a.internal-link { text-decoration: none; color: var(--text-normal); }
.piece-hub a.internal-link:hover { color: var(--text-accent); text-decoration: underline; }
.piece-hub .ph-title a.internal-link { font-weight: 700; font-size: 1.1em; }
.piece-hub .ph-held a.internal-link { color: var(--text-accent); font-weight: 600; }
`;

const H = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px", margin: "8px 0" },
  card: {
    border: "1px solid var(--background-modifier-border)",
    borderLeftWidth: "4px",
    borderRadius: "8px",
    padding: "10px 12px",
    background: "var(--background-secondary)",
  },
  cardOpen: { boxShadow: "0 0 0 2px var(--interactive-accent)" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: "6px" },
  badge: {
    fontSize: "var(--font-ui-smaller)",
    fontWeight: 600,
    whiteSpace: "nowrap",
    padding: "1px 6px",
    borderRadius: "10px",
    background: "var(--background-primary)",
  },
  row: { fontSize: "var(--font-ui-small)", margin: "3px 0", lineHeight: 1.45 },
  label: { color: "var(--text-muted)", marginRight: "4px" },
  dots: { letterSpacing: "2px", cursor: "help" },
  foot: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" },
  warn: { color: "var(--color-orange)", fontSize: "var(--font-ui-smaller)" },
  panel: {
    border: "1px solid var(--background-modifier-border)",
    borderRadius: "8px",
    padding: "12px 16px",
    margin: "12px 0",
    background: "var(--background-primary-alt)",
  },
  panelHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: "4px" },
  section: {
    fontSize: "var(--font-ui-smaller)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--text-muted)",
    margin: "12px 0 4px",
  },
  list: { listStyle: "none", margin: 0, padding: 0 },
  item: { fontSize: "var(--font-ui-small)", margin: "4px 0", lineHeight: 1.45 },
  date: { color: "var(--text-accent)", fontWeight: 600, marginRight: "6px" },
  kind: {
    fontSize: "var(--font-ui-smaller)",
    padding: "0 6px",
    borderRadius: "8px",
    background: "var(--background-modifier-hover)",
    marginRight: "6px",
  },
  strip: { fontSize: "var(--font-ui-small)", lineHeight: 1.9, margin: "4px 0 8px" },
};

// Left-border color, from what the party knows (Artifact Pieces' partyKnowledge).
const COLORS = {
  holds: { color: "var(--color-green)", label: "the party holds it" },
  known: { color: "var(--interactive-accent)", label: "the party knows where it is" },
  secret: { color: "var(--color-red)", label: "only you know where it is" },
  none: { color: "var(--background-modifier-border)", label: "no one holds it" },
};
const colorKey = (p) => (p.party === "holds" ? "holds" : !p.state.holder ? "none" : p.party === "where" ? "known" : "secret");
const DOT = { read: "●", modern: "◐", unknown: "○" };
const DOT_TEXT = { read: "read", modern: "modern version only", unknown: "not known" };

// ── Small pieces ──────────────────────────────────────────────────

/** A ref as markdown: a link (with its display text) or plain text. */
const refMd = (r) => (!r ? "" : r.plain ? r.plain : `[[${r.target}${r.display ? `|${r.display}` : ""}]]`);
const refName = (r) => (!r ? "" : r.plain ? r.plain : r.display || displayName(r.page?.name ?? r.target));

function Md({ text, source }) {
  return text ? <dc.Markdown content={text} inline={true} sourcePath={source} /> : null;
}

function RefList({ refs, source, empty = "—" }) {
  if (!refs.length) return <span style={BASE.muted}>{empty}</span>;
  return <Md text={refs.map((r) => (r.suffix ? `${refMd(r)} ${r.suffix}` : refMd(r))).join(", ")} source={source} />;
}

const pieceLabel = (p) => String(p.name).replace(/^\D*\d+\s*-\s*/, "") || p.name;
const noteLink = (p, label) => <dc.Link link={p.page.$link?.withDisplay ? p.page.$link.withDisplay(label) : p.page.$link} />;

function locationText(state) {
  if (!state.location) return null;
  const hint = state.locationSource === "party" ? " (with the party)" : state.locationSource === "tag" ? " (holder's place)" : "";
  return `${refMd(state.location)}${hint}`;
}

/** Where the party is: the link in the last played session's Party location bullet. */
function usePartyLocation() {
  const c = cfg();
  const { campaign } = useActiveCampaign();
  const { lastPlayed } = useSessionState(campaign?.tag);
  const text = useNoteText(lastPlayed?.$path);
  return dc.useMemo(() => {
    if (!lastPlayed) return null;
    const first = labelItems(sectionText(text, c.heading_left_off), c.label_party_location)
      .map((i) => i.text)
      .find(Boolean);
    if (!first) return null;
    const m = first.match(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\\?\|([^\]]*))?\]\]/);
    return m ? { target: m[1].trim(), display: (m[2] ?? "").trim() || null } : { plain: first };
  }, [text, lastPlayed?.$path]);
}

function NoPieces({ tag }) {
  return <div style={BASE.muted}>No notes are tagged #{tag} yet. Each piece of the artifact needs that tag.</div>;
}

// ── Overview: who holds what ──────────────────────────────────────

/** One line: each holder, then the numbers of the pieces they hold (each opens its note). */
function PieceOverview({ piece }) {
  const party = usePartyLocation();
  const { pieces, tag, loading } = usePieces(piece, party);
  if (!pieces.length) return <NoPieces tag={tag} />;
  if (loading) return <div style={BASE.muted}>Reading pieces…</div>;
  const groups = [];
  for (const p of pieces) {
    const key = p.state.holder ? refName(p.state.holder) : "";
    let g = groups.find((x) => x.key === key);
    if (!g) groups.push((g = { key, holder: p.state.holder, source: p.path, pieces: [] }));
    g.pieces.push(p);
  }
  groups.sort((a, b) => (a.key === "" ? 1 : b.key === "" ? -1 : 0));
  return (
    <div className="piece-hub" style={H.strip}>
      <style>{CSS}</style>
      {groups.map((g, i) => (
        <span key={g.key || "none"}>
          {i ? <span style={BASE.muted}> · </span> : null}
          {g.holder ? <Md text={refMd(g.holder)} source={g.source} /> : <span style={BASE.muted}>no holder</span>}{" "}
          {g.pieces.map((p) => (
            <span key={p.path} className="ph-held" style={{ marginRight: "6px" }}>
              {noteLink(p, String(p.number))}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

// ── Cards ─────────────────────────────────────────────────────────

function Lines({ lines }) {
  if (!lines.length) return <span style={BASE.muted}>none recorded</span>;
  return (
    <span style={H.dots} title={lines.map((l) => `${l.key} (${DOT_TEXT[l.state]}): ${l.text}`).join("\n")}>
      {lines.map((l) => DOT[l.state]).join("")}
    </span>
  );
}

function Legend() {
  return (
    <div style={{ ...BASE.muted, margin: "4px 0 8px", display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
      {Object.values(COLORS).map((k) => (
        <span key={k.label}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", background: k.color, marginRight: "5px", verticalAlign: "middle" }} />
          {k.label}
        </span>
      ))}
      <span>● read · ◐ modern version only · ○ not known</span>
    </div>
  );
}

function PieceCard({ p, open, onToggle }) {
  const s = p.state;
  const knows = p.parsed.knows.map((k) => ({ ...k.who, suffix: k.level === "wrong" ? "(wrong)" : "" }));
  const pursuers = p.parsed.pursuit.map((q) => q.who);
  const loc = locationText(s);
  return (
    <div style={{ ...H.card, borderLeftColor: COLORS[colorKey(p)].color, ...(open ? H.cardOpen : {}) }} title={COLORS[colorKey(p)].label}>
      <div style={H.head}>
        <span className="ph-title">{noteLink(p, `${p.number === Infinity ? "?" : p.number} · ${pieceLabel(p)}`)}</span>
        {p.party === "holds" ? <span style={H.badge}>{cfg().label_party}</span> : null}
      </div>
      <div style={H.row}>
        <span style={H.label}>Holder</span>
        {s.holder ? <Md text={refMd(s.holder)} source={p.path} /> : <span style={BASE.muted}>none</span>}
      </div>
      <div style={H.row}>
        <span style={H.label}>At</span>
        {loc ? <Md text={loc} source={p.path} /> : <span style={BASE.muted}>unknown</span>}
      </div>
      <div style={H.row}>
        <span style={H.label}>Knows</span>
        <RefList refs={knows} source={p.path} empty="no one" />
      </div>
      <div style={H.row}>
        <span style={H.label}>Pursued by</span>
        <RefList refs={pursuers} source={p.path} empty="no one" />
      </div>
      <div style={H.row}>
        <span style={H.label}>Lines</span>
        <Lines lines={p.lines} />
      </div>
      <div style={H.foot}>
        {p.parsed.problems.length ? <span style={H.warn} title={p.parsed.problems.map((x) => x.line).join("\n")}>⚠ unreadable lines</span> : <span />}
        <button onClick={onToggle}>{open ? "Less" : "More"}</button>
      </div>
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div>
      <div style={H.section}>{title}</div>
      {children}
    </div>
  );
}

function HistoryList({ p }) {
  if (!p.parsed.history.length) return <div style={BASE.muted}>Nothing recorded.</div>;
  return (
    <ul style={H.list}>
      {p.parsed.history.map((e, i) => {
        const tail = [e.who ? refMd(e.who) : "", e.at ? `at ${refMd(e.at)}` : "", e.session ? refMd(e.session) : ""].filter(Boolean).join(" · ");
        return (
          <li key={i} style={{ ...H.item, opacity: e.kind === "holder" || e.kind === "moved" ? 1 : 0.85 }}>
            <span style={H.date}>{e.label}</span>
            <span style={H.kind}>{e.kind}</span>
            <Md text={e.description + (tail ? ` · ${tail}` : "")} source={p.path} />
            {e.details.map((d, j) => (
              <div key={j} style={{ ...BASE.muted, marginLeft: "14px" }}>
                <Md text={d} source={p.path} />
              </div>
            ))}
          </li>
        );
      })}
    </ul>
  );
}

const LEVEL_TEXT = { exists: "knows it exists", where: "knows where", wrong: "believes something false" };

function KnowsList({ p }) {
  if (!p.parsed.knows.length) return <div style={BASE.muted}>No one recorded.</div>;
  return (
    <ul style={H.list}>
      {p.parsed.knows.map((k, i) => (
        <li key={i} style={H.item}>
          <Md text={refMd(k.who)} source={p.path} /> <span style={H.kind}>{LEVEL_TEXT[k.level]}</span>
          <Md text={[k.note, k.session ? refMd(k.session) : ""].filter(Boolean).join(" · ")} source={p.path} />
        </li>
      ))}
    </ul>
  );
}

function PursuitList({ p }) {
  if (!p.parsed.pursuit.length) return <div style={BASE.muted}>No one recorded.</div>;
  return (
    <ul style={H.list}>
      {p.parsed.pursuit.map((q, i) => (
        <li key={i} style={H.item}>
          <Md text={[refMd(q.who), q.how, q.session ? refMd(q.session) : ""].filter(Boolean).join(" · ")} source={p.path} />
        </li>
      ))}
    </ul>
  );
}

function TaskList({ items, source, empty, mark }) {
  if (!items.length) return <div style={BASE.muted}>{empty}</div>;
  return (
    <ul style={H.list}>
      {items.map((t, i) => (
        <li key={i} style={H.item}>
          <span style={{ marginRight: "6px" }}>{mark(t)}</span>
          <Md text={[t.text, t.session ? refMd(t.session) : ""].filter(Boolean).join(" · ")} source={source} />
        </li>
      ))}
    </ul>
  );
}

function LineList({ lines }) {
  if (!lines.length) return <div style={BASE.muted}>None recorded.</div>;
  return (
    <ul style={H.list}>
      {lines.map((l) => (
        <li key={l.key} style={H.item} title={DOT_TEXT[l.state]}>
          <span style={{ marginRight: "6px" }}>{DOT[l.state]}</span>
          <span style={H.kind}>{l.key}</span>
          {l.text}
          {l.modern ? <div style={{ ...BASE.muted, marginLeft: "22px", fontStyle: "italic" }}>Known today as: {l.modern}</div> : null}
        </li>
      ))}
    </ul>
  );
}

/** Session notes the piece's lines cite, plus session notes linking to the piece; newest first. */
function useSessionsFor(p) {
  const c = cfg();
  const sessions = dc.useQuery(`@page and #${c.tag_session}`);
  return dc.useMemo(() => {
    const out = new Map();
    const add = (path, page) => {
      if (path && !out.has(path)) out.set(path, page ?? sessions.find((s) => s.$path === path) ?? null);
    };
    const cited = [
      ...p.parsed.history.map((e) => e.session),
      ...p.parsed.knows.map((k) => k.session),
      ...p.parsed.pursuit.map((q) => q.session),
    ].filter(Boolean);
    for (const r of cited) add(p.ctx.resolve(r.target)?.path);
    const links = app.metadataCache.resolvedLinks ?? {};
    for (const s of sessions) if (links[s.$path]?.[p.path]) add(s.$path, s);
    return [...out.entries()]
      .map(([path, page]) => ({ path, page, n: page ? num(page.value("session_number")) : -Infinity }))
      .sort((a, b) => b.n - a.n || b.path.localeCompare(a.path));
  }, [p.path, p.parsed, sessions]);
}

function SessionList({ p }) {
  const list = useSessionsFor(p);
  if (!list.length) return <div style={BASE.muted}>No sessions linked yet.</div>;
  return (
    <ul style={H.list}>
      {list.map((s) => (
        <li key={s.path} style={H.item}>
          <Md text={`[[${s.path.replace(/\.md$/, "")}|${s.path.split("/").pop().replace(/\.md$/, "")}]]`} source={p.path} />
        </li>
      ))}
    </ul>
  );
}

function SectionEmbed({ p, heading }) {
  const has = (p.page.$sections ?? []).some((s) => String(s.$title).trim().toLowerCase() === heading.toLowerCase());
  if (!has) return <div style={BASE.muted}>No "{heading}" section.</div>;
  return <dc.LinkEmbed link={dc.headerLink(p.path, heading)} />;
}

function PieceDetail({ p, onClose }) {
  const c = cfg();
  return (
    <div style={H.panel}>
      <div style={H.panelHead}>
        <span className="ph-title">{noteLink(p, `${p.number === Infinity ? "?" : p.number} · ${pieceLabel(p)}`)}</span>
        <button onClick={onClose}>Close</button>
      </div>
      {p.parsed.problems.length ? (
        <Section title="Lines the hub could not read">
          <ul style={H.list}>
            {p.parsed.problems.map((x, i) => (
              <li key={i} style={{ ...H.item, ...H.warn }}>
                {x.section}: {x.reason} — <code>{x.line}</code>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      <Row>
        <Cell grow={3} min={340}>
          <Section title={c.heading_piece_history}>
            <HistoryList p={p} />
          </Section>
        </Cell>
        <Cell grow={2} min={280}>
          <Section title={c.heading_piece_knows}>
            <KnowsList p={p} />
          </Section>
          <Section title={c.heading_piece_pursuit}>
            <PursuitList p={p} />
          </Section>
        </Cell>
        <Cell grow={2} min={260}>
          <Section title={c.heading_piece_lines}>
            <LineList lines={p.lines} />
          </Section>
          <Section title={c.heading_piece_questions}>
            <TaskList items={p.parsed.questions.filter((q) => q.open)} source={p.path} empty="None open." mark={() => "?"} />
          </Section>
          <Section title="Sessions">
            <SessionList p={p} />
          </Section>
        </Cell>
      </Row>
      <Row>
        <Cell grow={1} min={320}>
          <Section title={c.heading_piece_rulings}>
            <SectionEmbed p={p} heading={c.heading_piece_rulings} />
          </Section>
        </Cell>
        <Cell grow={1} min={320}>
          <Section title={c.heading_piece_notes}>
            <SectionEmbed p={p} heading={c.heading_piece_notes} />
          </Section>
        </Cell>
      </Row>
    </div>
  );
}

/** A card per piece; "More" opens one piece's detail panel under the cards. */
function PieceCards({ piece, original, modern }) {
  const party = usePartyLocation();
  const { pieces, tag, loading } = usePieces(piece, party, { original, modern });
  const [open, setOpen] = dc.useState(null);
  if (!pieces.length) return <NoPieces tag={tag} />;
  if (loading) return <div style={BASE.muted}>Reading pieces…</div>;
  const shown = pieces.find((p) => p.path === open) ?? null;
  return (
    <div className="piece-hub">
      <style>{CSS}</style>
      <Legend />
      <div style={H.grid}>
        {pieces.map((p) => (
          <PieceCard key={p.path} p={p} open={open === p.path} onToggle={() => setOpen(open === p.path ? null : p.path)} />
        ))}
      </div>
      {shown ? <PieceDetail p={shown} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

// ── Who knows what ────────────────────────────────────────────────

const G = {
  bar: { display: "flex", flexWrap: "wrap", alignItems: "end", gap: "10px 16px", margin: "4px 0 10px" },
  field: { display: "flex", flexDirection: "column", gap: "2px" },
  table: { borderCollapse: "collapse", fontSize: "var(--font-ui-small)" },
  th: { padding: "4px 8px", textAlign: "center", color: "var(--text-muted)", fontWeight: 600, borderBottom: "1px solid var(--background-modifier-border)" },
  name: { padding: "3px 12px 3px 0", textAlign: "left", whiteSpace: "nowrap" },
  member: { padding: "3px 12px 3px 18px", textAlign: "left", whiteSpace: "nowrap", color: "var(--text-muted)" },
  cell: { width: "30px", height: "24px", padding: 0, textAlign: "center", borderRadius: "4px", cursor: "pointer", fontSize: "13px", lineHeight: "24px" },
  grid: { borderCollapse: "separate", borderSpacing: "3px", fontSize: "var(--font-ui-small)" },
  fold: { cursor: "pointer", userSelect: "none", display: "inline-block", width: "20px", fontSize: "1.25em", lineHeight: 1, color: "var(--text-muted)", textAlign: "center" },
  foldedName: { cursor: "pointer", userSelect: "none" },
  swatch: { display: "inline-block", width: "12px", height: "12px", borderRadius: "3px", verticalAlign: "-2px", marginRight: "5px" },
  groupRow: { borderTop: "1px solid var(--background-modifier-border-hover)" },
  picked: { background: "var(--background-modifier-hover)", outline: "1px solid var(--interactive-accent)" },
  sources: { margin: "10px 0", padding: "8px 12px", borderLeft: "3px solid var(--interactive-accent)", background: "var(--background-primary-alt)" },
};
const CODE_LABEL = Object.fromEntries(CODES.map((c) => [c.code, c.label]));
// Shade by the highest level known; gold for a false belief; pursuing is a mark on top.
// Greens are mixed with black, so more knowledge reads brighter; all colors are opaque in light and dark themes.
const DARK_INK = "rgba(0, 0, 0, 0.78)";
const LEVELS = [
  { code: "H", label: "holds", bg: "var(--color-green)", ink: DARK_INK },
  { code: "K", label: "knows where", bg: "color-mix(in srgb, var(--color-green) 78%, black)", ink: "#ffffff" },
  { code: "E", label: "knows it exists", bg: "color-mix(in srgb, var(--color-green) 55%, black)", ink: "#ffffff" },
  { code: "W", label: "believes something false", bg: "color-mix(in srgb, var(--color-yellow) 85%, var(--color-orange))", ink: DARK_INK },
];
const levelOf = (cell) => (cell ? LEVELS.find((l) => cell.codes.has(l.code)) ?? null : null);
const pursuing = (cell) => !!cell && cell.codes.has("P");
const cellLabel = (cell) => [levelOf(cell)?.label, pursuing(cell) ? "pursuing" : null].filter(Boolean).join(", ");

const rowPage = (row) => row.ref?.page ?? null;
const placeTags = (page) => (page?.tags ?? []).filter((t) => t.startsWith("place/"));
const inTag = (tags, wanted) => tags.some((t) => t === wanted || t.startsWith(wanted + "/"));

/** Grid rows people, factions, and the party; columns the pieces. Props: piece (slug). */
function WhoKnowsGrid({ piece }) {
  const party = usePartyLocation();
  const { pieces, grid, tag, loading } = usePieces(piece, party);
  const [query, setQuery] = dc.useState("");
  const [faction, setFaction] = dc.useState("");
  const [place, setPlace] = dc.useState("");
  const [picked, setPicked] = dc.useState(null); // { key, number }
  const [open, setOpen] = dc.useState([]); // keys of unfolded groups
  const [hoverCol, setHoverCol] = dc.useState(null);
  if (!pieces.length) return <NoPieces tag={tag} />;
  if (loading) return <div style={BASE.muted}>Reading pieces…</div>;

  const byNumber = new Map(pieces.map((p) => [p.number, p]));
  const people = [...grid.factions.flatMap((f) => [f.row, ...f.members]), ...grid.others, ...(grid.party ? [grid.party.row, ...grid.party.members] : [])];
  const places = [...new Set(people.flatMap((r) => placeTags(rowPage(r))))].sort();
  const q = query.trim().toLowerCase();
  const rowPasses = (r) => (!q || r.name.toLowerCase().includes(q)) && (!place || inTag(placeTags(rowPage(r)), place));

  // Groups: each faction (or the party) with its members, then people in no faction.
  const groups = [];
  for (const f of grid.factions) {
    if (faction && f.row.key !== faction) continue;
    const members = f.members.filter(rowPasses);
    if (members.length || rowPasses(f.row)) groups.push({ head: f.row, members: q || place ? members : f.members, forced: !!(faction || ((q || place) && members.length)) });
  }
  if (!faction) {
    for (const r of grid.others) if (rowPasses(r)) groups.push({ head: r, members: [] });
    if (grid.party) {
      const members = grid.party.members.filter(rowPasses);
      if (members.length || rowPasses(grid.party.row)) groups.push({ head: grid.party.row, members: q || place ? members : grid.party.members, forced: !!((q || place) && members.length) });
    }
  }

  const pickedRow = picked ? people.find((r) => r.key === picked.key) : null;
  const pickedCell = pickedRow?.cells[picked.number] ?? null;
  const pickedPiece = picked ? byNumber.get(picked.number) : null;
  const dirty = query || faction || place;

  const cellsFor = (row) =>
    grid.numbers.map((n) => {
      const cell = row.cells[n];
      const level = levelOf(cell);
      const label = cellLabel(cell);
      const on = picked && picked.key === row.key && picked.number === n;
      const col = hoverCol === n ? { boxShadow: "inset 0 0 0 1px var(--text-faint)" } : {};
      return (
        <td
          key={n}
          data-level={level?.code ?? ""}
          data-pursuing={pursuing(cell) ? "1" : ""}
          aria-label={label || "nothing known"}
          title={label}
          style={{ ...G.cell, background: level ? level.bg : "var(--background-secondary)", color: level ? level.ink : "var(--text-normal)", ...col, ...(on ? G.picked : {}) }}
          onMouseEnter={() => setHoverCol(n)}
          onClick={() => (label ? setPicked(on ? null : { key: row.key, number: n }) : null)}
        >
          {pursuing(cell) ? "↗" : ""}
        </td>
      );
    });
  const isOpen = (g) => g.forced || open.includes(g.head.key);
  const toggle = (key) => setOpen(open.includes(key) ? open.filter((k) => k !== key) : [...open, key]);

  return (
    <div className="piece-hub">
      <style>{CSS}</style>
      <div style={G.bar}>
        <label style={G.field}>
          <span style={H.section}>Name</span>
          <input type="text" placeholder="Search names" value={query} onInput={(e) => setQuery(e.currentTarget.value)} />
        </label>
        <label style={G.field}>
          <span style={H.section}>Faction</span>
          <select value={faction} onChange={(e) => setFaction(e.currentTarget.value)}>
            <option value="">Any faction</option>
            {grid.factions.map((f) => (
              <option key={f.row.key} value={f.row.key}>{f.row.name}</option>
            ))}
          </select>
        </label>
        <label style={G.field}>
          <span style={H.section}>Place</span>
          <select value={place} onChange={(e) => setPlace(e.currentTarget.value)}>
            <option value="">Any place</option>
            {places.map((t) => (
              <option key={t} value={t}>{t.slice("place/".length).split("/").join(" / ")}</option>
            ))}
          </select>
        </label>
        {dirty ? (
          <button onClick={() => { setQuery(""); setFaction(""); setPlace(""); }}>Clear filters</button>
        ) : null}
      </div>
      {!groups.length ? (
        <div style={BASE.muted}>No one matches these filters.</div>
      ) : (
        <table style={G.grid} onMouseLeave={() => setHoverCol(null)}>
          <thead>
            <tr>
              <th style={{ ...G.th, textAlign: "left" }} />
              {grid.numbers.map((n) => (
                <th key={n} style={{ ...G.th, ...(hoverCol === n ? { color: "var(--text-normal)" } : {}) }} className="ph-held">
                  {byNumber.get(n) ? noteLink(byNumber.get(n), String(n)) : n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => [
              <tr key={g.head.key} style={G.groupRow}>
                {g.members.length && !isOpen(g) ? (
                  <td style={{ ...G.name, ...G.foldedName }} data-fold={g.head.key} title="Show members" onClick={() => toggle(g.head.key)}>
                    <span style={G.fold}>▸</span>
                    {g.head.name}
                  </td>
                ) : (
                  <td style={G.name}>
                    {g.members.length ? (
                      <span style={G.fold} data-fold={g.head.key} title="Hide members" onClick={() => toggle(g.head.key)}>
                        ▾
                      </span>
                    ) : (
                      <span style={{ display: "inline-block", width: "20px" }} />
                    )}
                    <Md text={g.head.ref?.page ? `[[${g.head.ref.page.path.replace(/\.md$/, "")}|${g.head.name}]]` : g.head.name} source={pieces[0].path} />
                  </td>
                )}
                {cellsFor(g.head)}
              </tr>,
              ...(isOpen(g) ? g.members : []).map((m) => (
                <tr key={`${g.head.key}>${m.key}`}>
                  <td style={G.member}>
                    <Md text={m.ref?.page ? `[[${m.ref.page.path.replace(/\.md$/, "")}|${m.name}]]` : m.name} source={pieces[0].path} />
                  </td>
                  {cellsFor(m)}
                </tr>
              )),
            ])}
          </tbody>
        </table>
      )}
      <div style={{ ...BASE.muted, margin: "6px 0", display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
        {[...LEVELS.slice(0, 3).reverse(), LEVELS[3]].map((l) => (
          <span key={l.code}>
            <span style={{ ...G.swatch, background: l.bg }} />
            {l.label}
          </span>
        ))}
        <span>↗ pursuing</span>
        <span>Click a cell for the lines behind it; click a folded name to show its members.</span>
      </div>
      {pickedCell && pickedPiece ? (
        <div style={G.sources}>
          <div style={{ marginBottom: "4px" }}>
            <strong>{pickedRow.name}</strong> on {noteLink(pickedPiece, `${pickedPiece.number} · ${pieceLabel(pickedPiece)}`)}
          </div>
          <ul style={H.list}>
            {pickedCell.sources.map((s, i) => (
              <li key={i} style={H.item}>
                <span style={H.kind}>{CODE_LABEL[s.code]}</span>
                {s.via ? <span style={BASE.muted}>via {s.via} · </span> : null}
                <Md text={[s.text, s.session ? refMd(s.session) : ""].filter(Boolean).join(" · ")} source={pickedPiece.path} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

return { PieceOverview, PieceCards, WhoKnowsGrid, usePartyLocation };
```
