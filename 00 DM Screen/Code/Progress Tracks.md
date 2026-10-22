---
hide_from_related: true
---

**Purpose:** The "Now" panel for a progress tracker: a note that follows something advancing in stages on one or more tracks (an NPC's recovering memories, a faction's plan). It reads the note's stage cards and History and shows where each track stands, what moves it next, the current phase and risk, what the subject can tell the party at those stages, and the open questions. No form; you update the tracker by adding a History line.

**Exports:** `TrackNow`, `parseTracker`, `parseKnows`, `trackState`, `knowsSplit`

**Depends on:** [[Shared Helpers]] (and [[Hub Config]] through it) · [[Artifact Pieces]] (its line readers)

**Used by:** [[Aveqtaro Memory Recovery Tracker]]

Conventions this module relies on:

- **Stage cards.** Callouts anywhere in the tracker whose title is a stage code and a name: `> [!abstract]- A1 · Instinct`. A code is one capital letter (the track) and a number (the stage): `A0`–`A3`, `B0`–`B3`. Inside a card, a line starting `**Label:**` begins a field; bullets and lines below it belong to it until the next label. The panel uses `Level` and every field whose label starts with `Triggers`. Callouts without a stage code (Convergence, reference sections) are ignored.
- **History** (`##` heading `heading_track_history` in [[Hub Config]]; append-only, newest last):
  `- **3 Unndilar 835** · A1 · What happened. · trigger · [[Session 56]]`
  Fields are separated by ` · `: the date label in bold, the entry code, then free text (any number of fields, shown as written). Entry codes: a stage code (the track reached that stage), `phase <name>` (the campaign phase changed), `risk <level>` (the risk changed), `note`. The label is free text, so undated lines (`**Before the campaign**`) work. A description wrapped in a Calendarium span shows on the calendar if the note is tagged `inline-events`.
- **Current state.** Each track's stage is its last stage line; a track with none has not started. Phase and risk are the last `phase` and `risk` lines.
- **Open questions** (`##` heading `heading_track_questions`): tasks; unticked means open.
- **Knowledge note** (optional, named by the `knows` prop): `##` headings are topics; a bullet starting with a requirement and ` · ` is a fact: `- baseline · text`, `- A3 · text`, or several stages joined with `+` (`- A3+B3 · text`), all of which must be reached. Other bullets and prose are ignored, so DM notes can sit beside the facts. "Can tell them now" lists facts whose requirements are all met; "Unlocks next" lists facts that one more stage on a track would unlock.
- Lines that don't match these shapes are listed under the panel, so a broken edit shows instead of disappearing.

Embed it with a `datacorejsx` block:

```
const { TrackNow } = await dc.require(dc.headerLink("00 DM Screen/Code/Progress Tracks.md", "Code"));
return function Now() {
  return <TrackNow tracks={{ A: "Technical", B: "Personal" }} knows="What Aveqtaro Thaan Knows" riskLabel="Qalix risk" nowLabel="She can tell them now" />;
};
```

Props: `tracks` maps each track letter to its name (letters found only in stage cards still show, under the letter); `knows` is the knowledge note's name (omit it for no knowledge lists); `riskLabel` names the risk line (default "Risk"); `nowLabel` titles the first knowledge list (default "Can tell them now"); `source` reads another note instead of the current one.

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

/** Facts → { now, next }: met at the current stages, and unlocked by one more stage on some track. */
function knowsSplit(facts, tracks) {
  const at = Object.fromEntries(tracks.map((t) => [t.key, t]));
  const met = (r) => (at[r.track]?.stage ?? -1) >= r.stage;
  const nextUp = (r) => !!at[r.track]?.next && at[r.track].next.stage === r.stage;
  const now = facts.filter((f) => f.reqs.every(met));
  const next = facts.filter((f) => !f.reqs.every(met) && f.reqs.every((r) => met(r) || nextUp(r)));
  return { now, next };
}

// ── View ──────────────────────────────────────────────────────────

const T = {
  wrap: { border: "1px solid var(--background-modifier-border)", borderRadius: "8px", padding: "10px 14px", margin: "8px 0 16px", background: "var(--background-secondary)" },
  top: { display: "flex", flexWrap: "wrap", gap: "6px 24px", marginBottom: "8px" },
  label: { fontSize: "var(--font-ui-smaller)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginRight: "6px" },
  track: { margin: "8px 0", paddingTop: "8px", borderTop: "1px solid var(--background-modifier-border)" },
  code: { fontWeight: 700, marginRight: "6px" },
  arrow: { color: "var(--text-muted)", margin: "0 8px" },
  muted: { color: "var(--text-muted)", fontSize: "var(--font-ui-smaller)" },
  list: { margin: "2px 0 4px", paddingLeft: "20px" },
  item: { margin: "2px 0" },
  summary: { cursor: "pointer", fontWeight: 600, margin: "6px 0 2px" },
  topic: { color: "var(--text-muted)", fontSize: "var(--font-ui-smaller)", marginRight: "6px" },
  req: { fontSize: "var(--font-ui-smaller)", padding: "0 5px", borderRadius: "8px", background: "var(--background-modifier-hover)", marginRight: "6px" },
  problem: { color: "var(--text-error)", fontSize: "var(--font-ui-smaller)" },
};

function Md({ text, source }) {
  return text ? <dc.Markdown content={text} inline={true} sourcePath={source} /> : null;
}

const stageText = (card, code) => (card ? `${card.code} · ${card.name}` : code);

function TrackRow({ t, source }) {
  const triggers = t.next ? t.next.fields.filter((f) => /^triggers/i.test(f.label)) : [];
  const level = t.next?.fields.find((f) => /^level$/i.test(f.label))?.text;
  return (
    <div style={T.track}>
      <div>
        <span style={T.label}>{t.name}</span>
        <span style={T.code}>{t.stage < 0 ? "not started" : stageText(t.current, `${t.key}${t.stage}`)}</span>
        {t.entry ? <span style={T.muted}>since {t.entry.label}</span> : null}
        <span style={T.arrow}>→</span>
        {t.next ? (
          <span>
            next {stageText(t.next)}
            {level ? <span style={T.muted}> · {level}</span> : null}
          </span>
        ) : (
          <span style={T.muted}>last stage reached</span>
        )}
      </div>
      {triggers.map((f, i) => (
        <div key={i} style={{ marginLeft: "12px" }}>
          <span style={T.muted}>{f.label}: </span>
          {f.text ? <Md text={f.text} source={source} /> : null}
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

function FactList({ title, facts, source, open }) {
  if (!facts.length) return null;
  return (
    <details open={open}>
      <summary style={T.summary}>
        {title} ({facts.length})
      </summary>
      <ul style={T.list}>
        {facts.map((f, i) => (
          <li key={i} style={T.item}>
            <span style={T.req}>{f.req}</span>
            {f.topic ? <span style={T.topic}>{f.topic}</span> : null}
            <Md text={f.text} source={source} />
          </li>
        ))}
      </ul>
    </details>
  );
}

function TrackNow({ tracks = {}, knows = null, riskLabel = "Risk", nowLabel = "Can tell them now", source = null }) {
  const path = source ? app.metadataCache.getFirstLinkpathDest?.(source, "")?.path ?? null : dc.currentPath();
  const knowsPath = knows ? app.metadataCache.getFirstLinkpathDest?.(knows, path ?? "")?.path ?? null : null;
  const text = useNoteText(path);
  const knowsText = useNoteText(knowsPath);
  const parsed = dc.useMemo(() => parseTracker(text), [text]);
  const state = dc.useMemo(() => trackState(parsed, tracks), [parsed, JSON.stringify(tracks)]);
  const facts = dc.useMemo(() => parseKnows(knowsText).facts, [knowsText]);
  const split = knowsSplit(facts, state.tracks);
  const open = parsed.questions.filter((q) => q.open);
  if (!text) return <div style={T.muted}>Loading…</div>;
  return (
    <div style={T.wrap}>
      <div style={T.top}>
        <div>
          <span style={T.label}>Phase</span>
          {state.phase ? <Md text={`**${state.phase.value}** · since ${state.phase.label}`} source={path} /> : <span style={T.muted}>no phase line yet</span>}
        </div>
        <div>
          <span style={T.label}>{riskLabel}</span>
          {state.risk ? <Md text={`**${state.risk.value}** · ${state.risk.label}`} source={path} /> : <span style={T.muted}>no risk line yet</span>}
        </div>
        {state.latest ? (
          <div>
            <span style={T.label}>Last entry</span>
            <span>{state.latest.label}</span>
          </div>
        ) : null}
      </div>
      {state.risk?.text ? (
        <div style={{ ...T.muted, marginBottom: "6px" }}>
          <Md text={state.risk.text} source={path} />
        </div>
      ) : null}
      {state.tracks.map((t) => (
        <TrackRow key={t.key} t={t} source={path} />
      ))}
      {knows ? (
        <div style={T.track}>
          {knowsPath ? null : <div style={T.problem}>Knowledge note "{knows}" not found.</div>}
          <FactList title={nowLabel} facts={split.now} source={knowsPath ?? path} open={false} />
          <FactList title="Unlocks next" facts={split.next} source={knowsPath ?? path} open={true} />
        </div>
      ) : null}
      {open.length ? (
        <div style={T.track}>
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
        </div>
      ) : null}
      {parsed.problems.length ? (
        <div style={T.track}>
          {parsed.problems.map((p, i) => (
            <div key={i} style={T.problem}>
              {p.section}: {p.reason} — {p.line}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

return { TrackNow, parseTracker, parseKnows, trackState, knowsSplit };
```
