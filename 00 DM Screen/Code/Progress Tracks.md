---
hide_from_related: true
---

**Purpose:** The hub view for a progress tracker: a note that follows something advancing in stages on one or more tracks (an NPC's recovering memories, a faction's plan). It reads the note's stage cards and History and shows a status line (phase, risk, last entry), a card per track with its stage ladder and the gist of where it stands and what comes next, a knowledge strip by topic, and the open questions. Clicking opens the detail. No form; you update the tracker by adding a History line.

**Exports:** `TrackHub`, `parseTracker`, `parseKnows`, `trackState`, `knowsSplit`

**Depends on:** [[Shared Helpers]] (and [[Hub Config]] through it) · [[Artifact Pieces]] (its line readers)

**Used by:** [[Aveqtaro Memory Recovery Tracker]]

Conventions this module relies on:

- **Stage cards.** Callouts anywhere in the tracker whose title is a stage code and a name: `> [!abstract]- A1 · Instinct`. A code is one capital letter (the track) and a number (the stage): `A0`–`A3`, `B0`–`B3`. Inside a card, a line starting `**Label:**` begins a field; bullets and lines below it belong to it until the next label. The hub shows `Gist` on the track card and `Level` beside the next stage; the detail panel shows every field. Callouts without a stage code (Convergence, reference sections) are ignored.
- **History** (`##` heading `heading_track_history` in [[Hub Config]]; append-only, newest last):
  `- **3 Unndilar 835** · A1 · What happened. · trigger · [[Session 56]]`
  Fields are separated by ` · `: the date label in bold, the entry code, then free text (any number of fields, shown as written). Entry codes: a stage code (the track reached that stage), `phase <name>` (the campaign phase changed), `risk <level>` (the risk changed), `note`. The label is free text, so undated lines (`**Before the campaign**`) work. A description wrapped in a Calendarium span shows on the calendar if the note is tagged `inline-events`.
- **Current state.** Each track's stage is its last stage line; a track with none has not started. Phase and risk are the last `phase` and `risk` lines.
- **Open Issues** (`##` heading `heading_track_questions`): tasks; unticked means open.
- **Knowledge note** (optional, named by the `knows` prop): `##` headings are topics; a bullet starting with a requirement and ` · ` is a fact: `- baseline · text`, `- A3 · text`, or several stages joined with `+` (`- A3+B3 · text`), all of which must be reached. Other bullets and prose are ignored, so DM notes can sit beside the facts. A fact is **now** when all its requirements are met, **next** when one more stage on a track would unlock it, and **later** otherwise.
- **Detail panel.** "More" on a track card opens its current and next stage cards in full and that track's History lines; a topic in the knowledge strip lists its facts. One panel at a time.
- Lines that don't match these shapes are listed under the hub, so a broken edit shows instead of disappearing.

Embed it in the tracker with a `datacorejsx` block that loads `TrackHub` from the Code section of this note, as [[Aveqtaro Memory Recovery Tracker]] does, and returns it. Props: `tracks` maps each track letter to its name (`{ A: "Technical", B: "Personal" }`; letters found only in stage cards still show, under the letter); `knows` is the knowledge note's name (omit it for no knowledge strip); `riskLabel` names the risk (default "Risk"); `knowsLabel` titles the knowledge strip (default "What they can learn"); `source` reads another note instead of the current one.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Progress Tracks.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, useNoteText, stripComments } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));
const { sectionLines, bullets, fields } = await dc.require(dc.headerLink("00 DM Screen/Code/Artifact Pieces.md", "Code"));

const STAGE_RE = /^([A-Z])(\d+)$/;
const CARD_RE = /^>\s*\[![\w-]+\][+-]?\s+([A-Z])(\d+)\s*·\s*(.+?)\s*$/;
const LABEL_RE = /^\*\*(.+?):\*\*\s*(.*)$/;
const REQ_RE = /^(baseline|[A-Z]\d+(?:\s*\+\s*[A-Z]\d+)*)$/i;

// ── Reading the tracker ───────────────────────────────────────────

/** Stage cards → [{ track, stage, code, name, fields: [{ label, text, items }] }]. */
function parseCards(text) {
  const lines = stripComments(text).split("\n");
  const cards = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(CARD_RE);
    if (!m) continue;
    const card = { track: m[1], stage: Number(m[2]), code: `${m[1]}${m[2]}`, name: m[3], fields: [] };
    for (let j = i + 1; j < lines.length && /^>/.test(lines[j]); j++) {
      const body = lines[j].replace(/^>\s?/, "").trim();
      if (!body) continue;
      const label = body.match(LABEL_RE);
      if (label) card.fields.push({ label: label[1].trim(), text: label[2].trim(), items: [] });
      else if (card.fields.length) {
        const f = card.fields[card.fields.length - 1];
        f.items.push(body.replace(/^[-*+]\s+/, ""));
      }
    }
    cards.push(card);
  }
  return cards;
}

function parseEntry(b) {
  const m = b.text.match(/^\*\*(.+?)\*\*\s*·\s*(.*)$/);
  if (!m) return { problem: "expected **date** · code · what happened" };
  const [codeField, ...rest] = fields(m[2]);
  const code = String(codeField ?? "").trim();
  const base = { label: m[1].trim(), text: rest.filter(Boolean).join(" · "), details: b.details, raw: b.text };
  const stage = code.match(STAGE_RE);
  if (stage) return { ...base, kind: "stage", track: stage[1], stage: Number(stage[2]) };
  const phase = code.match(/^phase\s+(.+)$/i);
  if (phase) return { ...base, kind: "phase", value: phase[1].trim() };
  const risk = code.match(/^risk\s+(.+)$/i);
  if (risk) return { ...base, kind: "risk", value: risk[1].trim() };
  if (/^note$/i.test(code)) return { ...base, kind: "note" };
  return { problem: `unknown code "${code}" (a stage like A1, phase <name>, risk <level>, or note)` };
}

function parseTask(b) {
  const m = b.text.match(/^\[([ xX])\]\s*(.*)$/);
  if (!m) return { problem: "expected a task (- [ ] or - [x])" };
  return { text: m[2].trim(), open: m[1] === " ", details: b.details };
}

/** A tracker note's text → { cards, history, questions, problems }. */
function parseTracker(text) {
  const c = cfg();
  const problems = [];
  const read = (heading, parse) => {
    const out = [];
    for (const b of bullets(sectionLines(text, heading))) {
      const r = parse(b);
      if (r.problem) problems.push({ section: heading, line: b.text, reason: r.problem });
      else out.push(r);
    }
    return out;
  };
  return { cards: parseCards(text), history: read(c.heading_track_history, parseEntry), questions: read(c.heading_track_questions, parseTask), problems };
}

/** Where things stand: per track { key, name, current, next } plus the last phase and risk entries. */
function trackState(parsed, names = {}) {
  const keys = [...new Set([...Object.keys(names), ...parsed.cards.map((c) => c.track)])];
  const tracks = keys.map((key) => {
    const cards = parsed.cards.filter((c) => c.track === key).sort((a, b) => a.stage - b.stage);
    const last = [...parsed.history].reverse().find((e) => e.kind === "stage" && e.track === key) ?? null;
    const stage = last ? last.stage : -1;
    const card = (n) => cards.find((c) => c.stage === n) ?? null;
    const nextCard = cards.find((c) => c.stage > stage) ?? null;
    return { key, name: names[key] ?? key, stage, entry: last, current: card(stage), next: nextCard, max: cards.length ? cards[cards.length - 1].stage : null };
  });
  const lastOf = (kind) => [...parsed.history].reverse().find((e) => e.kind === kind) ?? null;
  return { tracks, phase: lastOf("phase"), risk: lastOf("risk"), latest: parsed.history[parsed.history.length - 1] ?? null };
}

// ── Reading the knowledge note ────────────────────────────────────

/** Knowledge note text → { facts: [{ topic, reqs, baseline, text }], problems }. */
function parseKnows(text) {
  const facts = [];
  let topic = "";
  for (const line of stripComments(text).split("\n")) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      topic = h[1];
      continue;
    }
    const b = line.match(/^-\s+(.*)$/);
    if (!b) continue;
    const [req, ...rest] = fields(b[1]);
    if (!REQ_RE.test(String(req ?? "").trim()) || !rest.length) continue;
    const r = req.trim();
    const baseline = /^baseline$/i.test(r);
    const reqs = baseline ? [] : r.split("+").map((s) => s.trim().match(STAGE_RE)).map((m) => ({ track: m[1], stage: Number(m[2]) }));
    facts.push({ topic, reqs, baseline, req: baseline ? "baseline" : r.replace(/\s+/g, ""), text: rest.join(" · ") });
  }
  return { facts };
}

/** Each fact with a status: "now" (met at the current stages), "next" (one more stage on some track unlocks it), or "later". */
function knowsSplit(facts, tracks) {
  const at = Object.fromEntries(tracks.map((t) => [t.key, t]));
  const met = (r) => (at[r.track]?.stage ?? -1) >= r.stage;
  const nextUp = (r) => !!at[r.track]?.next && at[r.track].next.stage === r.stage;
  return facts.map((f) => ({ ...f, status: f.reqs.every(met) ? "now" : f.reqs.every((r) => met(r) || nextUp(r)) ? "next" : "later" }));
}

// ── View ──────────────────────────────────────────────────────────

const CSS = `
.track-hub a.internal-link { text-decoration: none; color: var(--text-normal); }
.track-hub a.internal-link:hover { color: var(--text-accent); text-decoration: underline; }
`;

const T = {
  status: { display: "flex", flexWrap: "wrap", gap: "4px 20px", alignItems: "baseline", margin: "4px 0 10px" },
  label: { fontSize: "var(--font-ui-smaller)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginRight: "6px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px", margin: "8px 0" },
  card: {
    border: "1px solid var(--background-modifier-border)",
    borderLeft: "4px solid var(--interactive-accent)",
    borderRadius: "8px",
    padding: "10px 12px",
    background: "var(--background-secondary)",
  },
  cardOpen: { boxShadow: "0 0 0 2px var(--interactive-accent)" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: "6px" },
  title: { fontWeight: 700, fontSize: "1.05em" },
  ladder: { display: "flex", gap: "10px", fontSize: "var(--font-ui-smaller)", margin: "2px 0 8px" },
  rung: { color: "var(--text-faint)" },
  rungDone: { color: "var(--text-muted)" },
  rungNow: { color: "var(--text-accent)", fontWeight: 700 },
  stage: { fontWeight: 600 },
  gist: { margin: "2px 0 6px" },
  next: { color: "var(--text-muted)", fontSize: "var(--font-ui-small)" },
  more: { fontSize: "var(--font-ui-smaller)", cursor: "pointer", color: "var(--text-accent)", background: "none", border: "none", padding: 0 },
  muted: { color: "var(--text-muted)", fontSize: "var(--font-ui-smaller)" },
  strip: { display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" },
  chip: {
    fontSize: "var(--font-ui-small)",
    padding: "2px 10px",
    borderRadius: "12px",
    border: "1px solid var(--background-modifier-border)",
    background: "var(--background-secondary)",
    cursor: "pointer",
  },
  chipOpen: { borderColor: "var(--interactive-accent)", boxShadow: "0 0 0 1px var(--interactive-accent)" },
  chipNext: { color: "var(--text-accent)", fontWeight: 600 },
  panel: { border: "1px solid var(--background-modifier-border)", borderRadius: "8px", padding: "10px 14px", margin: "8px 0 12px" },
  panelHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" },
  cols: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "8px 24px" },
  section: { fontSize: "var(--font-ui-smaller)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", margin: "10px 0 4px" },
  field: { margin: "4px 0" },
  fieldLabel: { fontWeight: 600, marginRight: "6px" },
  list: { margin: "2px 0 4px", paddingLeft: "20px" },
  item: { margin: "2px 0" },
  req: { fontSize: "var(--font-ui-smaller)", padding: "0 5px", borderRadius: "8px", background: "var(--background-modifier-hover)", marginRight: "6px" },
  date: { fontWeight: 600, marginRight: "6px" },
  summary: { cursor: "pointer", fontWeight: 600, margin: "6px 0 2px" },
  problem: { color: "var(--text-error)", fontSize: "var(--font-ui-smaller)" },
};

const MARK = { now: "●", next: "◐", later: "○" };
const MARK_TEXT = { now: "she can tell them now", next: "unlocks at the next stage", later: "later" };

function Md({ text, source }) {
  return text ? <dc.Markdown content={text} inline={true} sourcePath={source} /> : null;
}

const fieldOf = (card, re) => card?.fields.find((f) => re.test(f.label)) ?? null;
const stageTitle = (card) => (card ? `${card.code} · ${card.name}` : "");

function Ladder({ t, cards }) {
  return (
    <div style={T.ladder}>
      {cards.map((c) => (
        <span key={c.code} title={stageTitle(c)} style={c.stage === t.stage ? T.rungNow : c.stage < t.stage ? T.rungDone : T.rung}>
          {c.stage <= t.stage ? "●" : "○"} {c.code}
        </span>
      ))}
    </div>
  );
}

function TrackCard({ t, cards, open, onToggle, source }) {
  const gist = fieldOf(t.current, /^gist$/i)?.text;
  const level = fieldOf(t.next, /^level$/i)?.text;
  return (
    <div style={{ ...T.card, ...(open ? T.cardOpen : {}) }}>
      <div style={T.head}>
        <span style={T.title}>{t.name}</span>
        <button style={T.more} onClick={onToggle}>
          {open ? "Close" : "More"}
        </button>
      </div>
      <Ladder t={t} cards={cards} />
      {t.stage < 0 ? (
        <div style={T.muted}>Not started.</div>
      ) : (
        <div style={T.gist}>
          <span style={T.stage}>{t.current ? t.current.name : `${t.key}${t.stage}`}</span>
          {gist ? (
            <span>
              {": "}
              <Md text={gist} source={source} />
            </span>
          ) : null}
          {t.entry ? <span style={T.muted}>{` (since ${t.entry.label})`}</span> : null}
        </div>
      )}
      <div style={T.next}>{t.next ? `Next: ${t.next.name}${level ? ` · ${level}` : ""}` : "Last stage reached."}</div>
    </div>
  );
}

function StageFields({ card, source, skip = /^(gist)$/i }) {
  if (!card) return <div style={T.muted}>—</div>;
  return (
    <div>
      {card.fields
        .filter((f) => !skip.test(f.label))
        .map((f, i) => (
          <div key={i} style={T.field}>
            <span style={T.fieldLabel}>{f.label}:</span>
            <Md text={f.text} source={source} />
            {f.items.length ? (
              <ul style={T.list}>
                {f.items.map((x, j) => (
                  <li key={j} style={T.item}>
                    <Md text={x} source={source} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
    </div>
  );
}

function HistoryLines({ entries, source }) {
  if (!entries.length) return <div style={T.muted}>Nothing recorded.</div>;
  return (
    <ul style={T.list}>
      {entries.map((e, i) => (
        <li key={i} style={T.item}>
          <span style={T.date}>{e.label}</span>
          <span style={T.req}>{e.kind === "stage" ? `${e.track}${e.stage}` : e.kind === "note" ? "note" : `${e.kind} ${e.value}`}</span>
          <Md text={e.text} source={source} />
        </li>
      ))}
    </ul>
  );
}

function TrackPanel({ t, parsed, source, onClose }) {
  const entries = parsed.history.filter((e) => e.kind === "stage" && e.track === t.key);
  return (
    <div style={T.panel}>
      <div style={T.panelHead}>
        <span style={T.title}>{t.name}</span>
        <button style={T.more} onClick={onClose}>
          Close
        </button>
      </div>
      <div style={T.cols}>
        <div>
          <div style={T.section}>Now{t.current ? ` · ${stageTitle(t.current)}` : ""}</div>
          {t.stage < 0 ? <div style={T.muted}>Not started.</div> : <StageFields card={t.current} source={source} />}
        </div>
        <div>
          <div style={T.section}>Next{t.next ? ` · ${stageTitle(t.next)}` : ""}</div>
          {t.next ? <StageFields card={t.next} source={source} /> : <div style={T.muted}>Last stage reached.</div>}
        </div>
      </div>
      <div style={T.section}>History</div>
      <HistoryLines entries={entries} source={source} />
    </div>
  );
}

function TopicPanel({ topic, facts, source, onClose }) {
  const order = { now: 0, next: 1, later: 2 };
  const sorted = [...facts].sort((a, b) => order[a.status] - order[b.status]);
  return (
    <div style={T.panel}>
      <div style={T.panelHead}>
        <span style={T.title}>{topic}</span>
        <button style={T.more} onClick={onClose}>
          Close
        </button>
      </div>
      <ul style={{ ...T.list, listStyle: "none", paddingLeft: 0 }}>
        {sorted.map((f, i) => (
          <li key={i} style={T.item} title={MARK_TEXT[f.status]}>
            <span style={{ marginRight: "6px" }}>{MARK[f.status]}</span>
            <span style={T.req}>{f.req}</span>
            <Md text={f.text} source={source} />
          </li>
        ))}
      </ul>
      <div style={T.muted}>
        {Object.entries(MARK)
          .map(([k, m]) => `${m} ${MARK_TEXT[k]}`)
          .join("   ")}
      </div>
    </div>
  );
}

function KnowsStrip({ facts, openTopic, onTopic }) {
  const topics = [];
  for (const f of facts) {
    let t = topics.find((x) => x.name === f.topic);
    if (!t) topics.push((t = { name: f.topic, now: 0, next: 0, later: 0 }));
    t[f.status]++;
  }
  return (
    <div style={T.strip}>
      {topics.map((t) => (
        <span key={t.name} title={`${t.now} now, ${t.next} at the next stage, ${t.later} later`} style={{ ...T.chip, ...(openTopic === t.name ? T.chipOpen : {}) }} onClick={() => onTopic(t.name)}>
          {t.name} <span>{t.now}</span>
          {t.next ? <span style={T.chipNext}>{` +${t.next}`}</span> : null}
        </span>
      ))}
    </div>
  );
}

function TrackHub({ tracks = {}, knows = null, riskLabel = "Risk", knowsLabel = "What they can learn", source = null }) {
  const path = source ? app.metadataCache.getFirstLinkpathDest?.(source, "")?.path ?? null : dc.currentPath();
  const knowsPath = knows ? app.metadataCache.getFirstLinkpathDest?.(knows, path ?? "")?.path ?? null : null;
  const text = useNoteText(path);
  const knowsText = useNoteText(knowsPath);
  const parsed = dc.useMemo(() => parseTracker(text), [text]);
  const state = dc.useMemo(() => trackState(parsed, tracks), [parsed, JSON.stringify(tracks)]);
  const facts = dc.useMemo(() => knowsSplit(parseKnows(knowsText).facts, state.tracks), [knowsText, state]);
  const [panel, setPanel] = dc.useState(null); // { track } or { topic }
  const toggle = (p) => setPanel(panel && JSON.stringify(panel) === JSON.stringify(p) ? null : p);
  const open = parsed.questions.filter((q) => q.open);
  if (!text) return <div style={T.muted}>Loading…</div>;
  const cardsOf = (key) => parsed.cards.filter((c) => c.track === key).sort((a, b) => a.stage - b.stage);
  const openTrack = panel?.track ? state.tracks.find((t) => t.key === panel.track) : null;
  const nextCount = facts.filter((f) => f.status === "next").length;
  return (
    <div className="track-hub">
      <style>{CSS}</style>
      <div style={T.status}>
        <span>
          <span style={T.label}>Phase</span>
          {state.phase ? `${state.phase.value} · since ${state.phase.label}` : <span style={T.muted}>not set</span>}
        </span>
        <span title={state.risk?.text ?? ""}>
          <span style={T.label}>{riskLabel}</span>
          {state.risk ? `${state.risk.value} · ${state.risk.label}` : <span style={T.muted}>not set</span>}
        </span>
        {state.latest ? (
          <span>
            <span style={T.label}>Last entry</span>
            {state.latest.label}
          </span>
        ) : null}
      </div>
      <div style={T.grid}>
        {state.tracks.map((t) => (
          <TrackCard key={t.key} t={t} cards={cardsOf(t.key)} open={panel?.track === t.key} onToggle={() => toggle({ track: t.key })} source={path} />
        ))}
      </div>
      {openTrack ? <TrackPanel t={openTrack} parsed={parsed} source={path} onClose={() => setPanel(null)} /> : null}
      {knows ? (
        <div style={{ margin: "12px 0 4px" }}>
          <div style={T.section}>
            {knowsLabel}
            <span style={{ textTransform: "none", letterSpacing: 0 }}>{` · ${facts.filter((f) => f.status === "now").length} now${nextCount ? `, +${nextCount} at the next stage` : ""}`}</span>
          </div>
          {knowsPath ? <KnowsStrip facts={facts} openTopic={panel?.topic} onTopic={(name) => toggle({ topic: name })} /> : <div style={T.problem}>Knowledge note "{knows}" not found.</div>}
        </div>
      ) : null}
      {panel?.topic ? <TopicPanel topic={panel.topic} facts={facts.filter((f) => f.topic === panel.topic)} source={knowsPath} onClose={() => setPanel(null)} /> : null}
      {open.length ? (
        <details>
          <summary style={T.summary}>Open questions ({open.length})</summary>
          <ul style={T.list}>
            {open.map((q, i) => (
              <li key={i} style={T.item}>
                <Md text={q.text} source={path} />
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      {parsed.problems.map((p, i) => (
        <div key={i} style={T.problem}>
          {p.section}: {p.reason} — {p.line}
        </div>
      ))}
    </div>
  );
}

return { TrackHub, parseTracker, parseKnows, trackState, knowsSplit };
```
