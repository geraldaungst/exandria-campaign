---
hide_from_related: true
---

Shared Datacore views for arc documents and the hub. Arc notes load them with `dc.require`; edit here and every arc updates (reopen the arc note to refresh). The block below is plain `jsx`, so it does not render on this page.

Conventions these views rely on:

- Arc notes carry the `arc` tag and a `status` property: idea, designing, ready, running, paused, abandoned, complete.
- Arc notes list the plot threads they advance in `threads` (links).
- Session notes carry the `session` tag, `session_number`, `date`, and an `arc` property linking to their arc.
- Session notes have a `## Where we left off` heading, filled in after play.

## Views

```jsx
const LEFT_OFF = "Where we left off";
const OPEN_STATUSES = ["paused", "abandoned"];

const linkPath = (v) => {
  if (!v) return null;
  if (typeof v === "object" && v.path) return v.path;
  const text = String(v).replace(/^\[\[/, "").replace(/\]\]$/, "").replace(/\|.*$/, "").replace(/#.*$/, "");
  return text ? dc.resolvePath(text) : null;
};
const asList = (v) => (v === null || v === undefined || v === "" ? [] : Array.isArray(v) ? v : [v]);
const statusOf = (p) => String(p.value("status") ?? "").toLowerCase();
const shortName = (p) => p.$name.replace(/ - DM Notes$/, "");
const num = (v) => (v === null || v === undefined || v === "" ? -Infinity : Number(v));
const dateText = (v) => {
  if (!v) return "";
  if (v.toFormat) return v.toFormat("d MMM yyyy");
  return String(v);
};

const S = {
  muted: { color: "var(--text-muted)", fontSize: "var(--font-ui-smaller)" },
  row: { margin: "4px 0" },
  sessionHead: { fontWeight: 600, cursor: "pointer" },
  embed: { margin: "4px 0 10px 14px" },
  pill: {
    fontSize: "var(--font-ui-smaller)",
    padding: "1px 6px",
    borderRadius: "10px",
    background: "var(--background-modifier-hover)",
    marginLeft: "6px",
  },
  shared: { color: "var(--text-accent)", fontSize: "var(--font-ui-smaller)", marginLeft: "6px" },
};

/** Sessions whose `arc` property points at the given arc path, newest first. */
function useArcSessions(arcPath) {
  const sessions = dc.useQuery("@page and #session");
  return dc.useMemo(
    () =>
      sessions
        .filter((s) => linkPath(s.value("arc")) === arcPath)
        .sort((a, b) => num(b.value("session_number")) - num(a.value("session_number")) || b.$mtime - a.$mtime),
    [sessions, arcPath]
  );
}

function SessionEntry({ session, open }) {
  return (
    <details open={open ? true : undefined}>
      <summary style={S.sessionHead}>
        <dc.Link link={session.$link} />
        <span style={S.muted}> {dateText(session.value("date"))}</span>
      </summary>
      <div style={S.embed}>
        <dc.LinkEmbed link={dc.headerLink(session.$path, LEFT_OFF)} />
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
            <dc.LinkEmbed link={dc.headerLink(last.$path, LEFT_OFF)} />
          </div>
        </details>
      ) : (
        <div style={S.muted}>Never played</div>
      )}
    </div>
  );
}

/** Every paused or abandoned arc; ones sharing a plot thread with the current arc come first. */
function RelatedArcs() {
  const self = dc.useCurrentFile();
  const arcs = dc.useQuery("@page and #arc");
  const myThreads = asList(self?.value("threads")).map(linkPath).filter(Boolean);
  const rows = arcs
    .filter((a) => a.$path !== self?.$path && OPEN_STATUSES.includes(statusOf(a)))
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
  const section = arc?.$sections?.find((s) => s.$title === "Fact Map");
  if (!arc) return <div style={S.muted}>Arc note not found.</div>;
  if (!section) return <div style={S.muted}>This arc has no "Fact Map" heading.</div>;
  const { start, end } = section.$position;
  const open = tasks
    .filter((t) => t.$file === arcPath && t.$position.start > start && t.$position.start < end)
    .filter((t) => !["x", "X"].includes(t.$status) && String(t.$text ?? "").trim() !== "")
    .sort((a, b) => a.$position.start - b.$position.start);
  return (
    <div>
      <div style={S.muted}>
        {open.length} unrevealed in <dc.Link link={dc.headerLink(arcPath, "Fact Map")} /> (tick them there)
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

return { ArcHistory, RelatedArcs, ArcClues, SessionArc, useArcSessions, linkPath, statusOf };
```
