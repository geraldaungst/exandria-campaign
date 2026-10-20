---
hide_from_related: true
---

**Purpose:** Views shown inside arc and session notes: an arc's play history, paused and abandoned arcs, an arc's unrevealed clues, and a session's arc panel.

**Exports:** `ArcHistory`, `RelatedArcs`, `ArcClues`, `SessionArc`

**Depends on:** [[Shared Helpers]] · [[Campaign State]]

**Used by:** arc notes (Arc Template) · session notes (Session Template) · [[DM Screen Views]] · [[Session Hub Views]]

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Arc and Session Views.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, linkPath, asList, statusOf, shortName, dateText, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const { useArcSessions } = await dc.require(dc.headerLink("00 DM Screen/Code/Campaign State.md", "Code"));

function SessionEntry({ session, open }) {
  return (
    <details open={open ? true : undefined}>
      <summary style={S.sessionHead}>
        <dc.Link link={session.$link} />
        <span style={S.muted}> {dateText(session.value("date"))}</span>
      </summary>
      <div style={S.embed}>
        <dc.LinkEmbed link={dc.headerLink(session.$path, cfg().heading_left_off)} />
      </div>
    </details>
  );
}

/** Play history for the current arc: each session's "Where we left off", newest open. */
function ArcHistory() {
  const sessions = useArcSessions(dc.currentPath());
  if (sessions.length === 0) return <div style={S.muted}>No sessions played in this arc yet.</div>;
  return (
    <div>
      <div style={S.muted}>
        {sessions.length} {sessions.length === 1 ? "session" : "sessions"} played
      </div>
      {sessions.map((s, i) => (
        <SessionEntry key={s.$path} session={s} open={i === 0} />
      ))}
    </div>
  );
}

function PausedArc({ arc, sharedThreads }) {
  const sessions = useArcSessions(arc.$path);
  const last = sessions[0];
  return (
    <div style={S.row}>
      <dc.Link link={arc.$link} />
      <span style={S.pill}>{statusOf(arc)}</span>
      {sharedThreads.length ? <span style={S.shared}>shares: {sharedThreads.join(", ")}</span> : null}
      {last ? (
        <details>
          <summary style={S.muted}>Last played: {shortName(last)}</summary>
          <div style={S.embed}>
            <dc.LinkEmbed link={dc.headerLink(last.$path, cfg().heading_left_off)} />
          </div>
        </details>
      ) : (
        <div style={S.muted}>Never played</div>
      )}
    </div>
  );
}

/**
 * Every paused or abandoned arc; ones sharing a plot thread with the arc come first.
 * The arc is the current note, or `arcPath` when given (as on the hub).
 */
function RelatedArcs({ arcPath } = {}) {
  const current = dc.useCurrentFile();
  const given = dc.useFile(arcPath ?? "");
  const self = arcPath ? given : current;
  const arcs = dc.useQuery(`@page and #${cfg().tag_arc}`);
  const myThreads = asList(self?.value("threads")).map(linkPath).filter(Boolean);
  const rows = arcs
    .filter((a) => a.$path !== self?.$path && cfg().statuses_paused.includes(statusOf(a)))
    .map((a) => {
      const shared = asList(a.value("threads"))
        .map(linkPath)
        .filter((p) => p && myThreads.includes(p))
        .map((p) => p.split("/").pop().replace(/\.md$/, ""));
      return { arc: a, shared };
    })
    .sort((x, y) => y.shared.length - x.shared.length || shortName(x.arc).localeCompare(shortName(y.arc)));
  if (rows.length === 0) return <div style={S.muted}>No paused or abandoned arcs.</div>;
  return (
    <div>
      {rows.map((r) => (
        <PausedArc key={r.arc.$path} arc={r.arc} sharedThreads={r.shared} />
      ))}
    </div>
  );
}

/** Unrevealed clues: unchecked tasks under the arc's "Fact Map" heading. */
function ArcClues({ arcPath }) {
  const arc = dc.useFile(arcPath);
  const tasks = dc.useQuery("@task");
  const factMap = cfg().heading_fact_map;
  const section = arc?.$sections?.find((s) => s.$title === factMap);
  if (!arc) return <div style={S.muted}>Arc note not found.</div>;
  if (!section) return <div style={S.muted}>This arc has no "{factMap}" heading.</div>;
  const { start, end } = section.$position;
  const open = tasks
    .filter((t) => t.$file === arcPath && t.$position.start > start && t.$position.start < end)
    .filter((t) => !["x", "X"].includes(t.$status) && String(t.$text ?? "").trim() !== "")
    .sort((a, b) => a.$position.start - b.$position.start);
  return (
    <div>
      <div style={S.muted}>
        {open.length} unrevealed in <dc.Link link={dc.headerLink(arcPath, factMap)} /> (tick them there)
      </div>
      <ul>
        {open.map((t) => (
          <li key={t.$id}>
            <dc.Markdown content={t.$text} inline={true} sourcePath={arcPath} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** For a session note: its arc, the arc's status, and the arc's unrevealed clues. */
function SessionArc() {
  const self = dc.useCurrentFile();
  const arcPath = linkPath(self?.value("arc"));
  const arc = dc.useFile(arcPath ?? "");
  if (!arcPath || !arc) return <div style={S.muted}>No arc set. Add an `arc` link in this note's properties.</div>;
  return (
    <div>
      <div style={S.row}>
        <strong>Arc:</strong> <dc.Link link={arc.$link} />
        <span style={S.pill}>{statusOf(arc) || "no status"}</span>
      </div>
      <ArcClues arcPath={arcPath} />
    </div>
  );
}

return { ArcHistory, RelatedArcs, ArcClues, SessionArc };
```
