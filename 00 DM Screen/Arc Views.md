---
hide_from_related: true
---

Shared Datacore views and logic for arc documents, session notes, and the hubs ([[00 DM Screen]], [[Session Hub]]). Notes load them with `dc.require`; edit here and every note updates (reopen the note to refresh). The block below is plain `jsx`, so it does not render on this page. Design: [[DM Hubs Design]].

Conventions these views rely on:

- Arc notes carry the `arc` tag and a `status` property: idea, designing, ready, running, paused, abandoned, complete. Only one arc is `running` at a time.
- Arc notes list the plot threads they advance in `threads` (links).
- Session notes carry the `session` tag, `session_number`, `date`, and an `arc` property linking to their arc.
- Session notes have a `## Where we left off` heading, filled in after play.
- Last played session: the highest-numbered session dated before today. Next session: the earliest dated today or later (on game day it is tonight's session, not the last played one). Notes in `z_` folders and session notes without a number or date are ignored.
- Today in-world: the last played session's `fc-end` (else `fc-date`) and `ingame_time`. These are set by the session template (`fc-date` = previous session's `fc-end`) and the [[Close Session]] template. In-world dates are year-month-day with the month as a number from 1 (`835-04-19` is 19 Thunsheer 835); Calendarium reads them as events on the Exandrian Calendar.
- Note types for the hubs come from `noteType` below: tag rules first, then folder fallbacks for untagged notes (Session Notes, Objects, Characters, Worlds, Campaigns). Bases views use this formula, which must be kept in step with `TYPE_RULES`:

```
if(file.inFolder("Player Wiki"), "Player wiki", if(file.hasTag("session"), "Session", if(file.hasTag("arc"), "Arc", if(file.hasTag("plot", "plot/active", "plot/upcoming", "plot/seed", "plot/paused"), "Plot thread", if(file.hasTag("lore"), "Lore", if(file.hasTag("world/keln"), "Keln", if(file.hasTag("player", "player/inactive"), "PC", if(file.hasTag("npc"), "NPC", if(file.inFolder("Characters/Creatures"), "Creature", if(file.hasTag("location"), "Location", if(file.hasTag("faction"), "Faction", if(file.hasTag("artifact"), "Item", if(file.inFolder("00 DM Screen") || file.hasTag("dm-tool", "dm-tools"), "DM tools", if(file.path.contains("Session Notes/"), "Session", if(file.inFolder("Objects"), "Item", if(file.inFolder("Characters"), "NPC", if(file.inFolder("Worlds"), "World", if(file.inFolder("Campaigns"), "Campaign", "Other"))))))))))))))))))
```

To check the logic, open [[Hub Logic Check]].

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

/**
 * Every paused or abandoned arc; ones sharing a plot thread with the arc come first.
 * The arc is the current note, or `arcPath` when given (as on the hub).
 */
function RelatedArcs({ arcPath } = {}) {
  const current = dc.useCurrentFile();
  const given = dc.useFile(arcPath ?? "");
  const self = arcPath ? given : current;
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

// ── Shared hub logic ─────────────────────────────────────────────

const pad = (n) => String(n).padStart(2, "0");
/** Today's real-world date as yyyy-MM-dd, local time. */
const todayDay = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
/** A date property as yyyy-MM-dd, or null. */
const dayOf = (v) => {
  if (!v) return null;
  if (v.toFormat) return v.toFormat("yyyy-MM-dd");
  const m = String(v).match(/\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : null;
};
/** A property value as plain text (in-world dates are shown as stored). */
const rawText = (v) => {
  if (v === null || v === undefined || v === "") return null;
  if (v.toFormat) return v.toFormat("yyyy-MM-dd");
  return String(v);
};
const inZFolder = (p) => p.$path.split("/").some((part) => part.startsWith("z_"));
const tagsOf = (p) => (p.$tags ?? []).map((t) => String(t).replace(/^#/, "").toLowerCase());
const hasTag = (p, tag) => tagsOf(p).some((t) => t === tag || t.startsWith(tag + "/"));
const inFolder = (p, folder) => p.$path.startsWith(folder + "/");

/** Numbered, dated session notes outside z_ folders, lowest number first. */
function useDatedSessions() {
  const sessions = dc.useQuery("@page and #session");
  return dc.useMemo(
    () =>
      sessions
        .filter((s) => !inZFolder(s) && num(s.value("session_number")) > -Infinity && dayOf(s.value("date")))
        .sort((a, b) => num(a.value("session_number")) - num(b.value("session_number"))),
    [sessions]
  );
}

/**
 * Where the campaign stands in real time.
 * lastPlayed: highest-numbered session dated before today.
 * next: earliest session dated today or later; isTonight when that date is today.
 */
function useSessionState() {
  const sessions = useDatedSessions();
  const today = todayDay();
  const played = sessions.filter((s) => dayOf(s.value("date")) < today);
  const upcoming = sessions
    .filter((s) => dayOf(s.value("date")) >= today)
    .sort(
      (a, b) =>
        dayOf(a.value("date")).localeCompare(dayOf(b.value("date"))) ||
        num(a.value("session_number")) - num(b.value("session_number"))
    );
  const next = upcoming[0] ?? null;
  return {
    played,
    lastPlayed: played.length ? played[played.length - 1] : null,
    next,
    isTonight: !!next && dayOf(next.value("date")) === today,
  };
}

/** In-world date and time at the end of a session: fc-end (else fc-date) and ingame_time. */
function inGameNow(session, months = []) {
  if (!session) return null;
  const date = rawText(session.value("fc-end")) ?? rawText(session.value("fc-date"));
  if (!date) return null;
  const time = rawText(session.value("ingame_time"));
  const day = inWorldText(date, months);
  return { date, day, text: time ? `${day}, ${time}` : day, time, session };
}

/** Month names and category colors for a Calendarium calendar, read from Calendarium's settings file. */
function useCalendar(calendarName = "Exandrian Calendar") {
  const [cal, setCal] = dc.useState({ months: [], colors: {} });
  dc.useEffect(() => {
    let live = true;
    (async () => {
      try {
        const raw = await app.vault.adapter.read(`${app.vault.configDir}/plugins/calendarium/data.json`);
        const c = JSON.parse(raw).calendars.find((x) => x.name === calendarName);
        const colors = Object.fromEntries((c?.categories ?? []).map((k) => [k.name, k.color]));
        if (live) setCal({ months: (c?.static?.months ?? []).map((m) => m.name), colors });
      } catch (e) {}
    })();
    return () => {
      live = false;
    };
  }, [calendarName]);
  return cal;
}
const useCalendarMonths = (calendarName) => useCalendar(calendarName).months;

const TIMELINE_PATH = "Campaigns/Prophecy of Eryndor/Eryndor Timeline.md";
/** "835-04-27" → [835, 4, 27] for comparing in-world dates. */
const dateKey = (s) => String(s ?? "").split("-").map(Number);
const compareDates = (a, b) => {
  const x = dateKey(a);
  const y = dateKey(b);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

/** Inline events in the campaign timeline note, oldest first; re-read whenever the note changes. */
function useTimeline(path = TIMELINE_PATH) {
  const page = dc.useFile(path);
  const stamp = page?.$mtime?.toMillis ? page.$mtime.toMillis() : String(page?.$mtime ?? "");
  const [events, setEvents] = dc.useState([]);
  dc.useEffect(() => {
    let live = true;
    (async () => {
      const file = app.vault.getAbstractFileByPath(path);
      if (!file) return live && setEvents([]);
      const text = await app.vault.cachedRead(file);
      const attr = (tag, name) => (tag.match(new RegExp(`data-${name}="([^"]*)"`)) ?? [])[1] ?? null;
      const found = [...text.matchAll(/<span\b([^>]*)>([\s\S]*?)<\/span>/g)]
        .map(([, tag, body]) => ({
          date: attr(tag, "date"),
          category: attr(tag, "category"),
          name: attr(tag, "name"),
          text: body.trim(),
        }))
        .filter((e) => e.date && /^\d+-\d+-\d+$/.test(e.date))
        .sort((a, b) => compareDates(a.date, b.date));
      if (live) setEvents(found);
    })();
    return () => {
      live = false;
    };
  }, [path, stamp]);
  return events;
}

/** "835-04-19" → "19 Thunsheer 835" when month names are known; otherwise as stored. */
function inWorldText(date, months = []) {
  const m = String(date).match(/^(\d+)-(\d+)-(\d+)$/);
  if (!m) return String(date);
  const month = months[Number(m[2]) - 1];
  return month ? `${Number(m[3])} ${month} ${Number(m[1])}` : String(date);
}

/** The running arc; `others` lists any extra arcs wrongly marked running. */
function useRunningArc() {
  const arcs = dc.useQuery("@page and #arc");
  const running = arcs
    .filter((a) => !inZFolder(a) && statusOf(a) === "running")
    .sort((a, b) => a.$name.localeCompare(b.$name));
  return { arc: running[0] ?? null, others: running.slice(1) };
}

/** First matching rule names the type. Keep in step with the Bases formula above. */
const TYPE_RULES = [
  ["Player wiki", (p) => inFolder(p, "Player Wiki")],
  ["Session", (p) => hasTag(p, "session")],
  ["Arc", (p) => hasTag(p, "arc")],
  ["Plot thread", (p) => hasTag(p, "plot")],
  ["Lore", (p) => hasTag(p, "lore")],
  ["Keln", (p) => tagsOf(p).includes("world/keln")],
  ["PC", (p) => hasTag(p, "player")],
  ["NPC", (p) => hasTag(p, "npc")],
  ["Creature", (p) => inFolder(p, "Characters/Creatures")],
  ["Location", (p) => hasTag(p, "location")],
  ["Faction", (p) => hasTag(p, "faction")],
  ["Item", (p) => hasTag(p, "artifact")],
  ["DM tools", (p) => inFolder(p, "00 DM Screen") || tagsOf(p).includes("dm-tool") || tagsOf(p).includes("dm-tools")],
  // Folder fallbacks for notes with no type tag
  ["Session", (p) => p.$path.includes("Session Notes/")],
  ["Item", (p) => inFolder(p, "Objects")],
  ["NPC", (p) => inFolder(p, "Characters")],
  ["World", (p) => inFolder(p, "Worlds")],
  ["Campaign", (p) => inFolder(p, "Campaigns")],
];
const NOTE_TYPES = [...new Set([...TYPE_RULES.map(([name]) => name), "Other"])];
function noteType(p) {
  const rule = TYPE_RULES.find(([, test]) => test(p));
  return rule ? rule[0] : "Other";
}

// ── DM Screen top screen ─────────────────────────────────────────

const daysBetween = (a, b) => Math.round((Date.parse(`${b}T00:00:00`) - Date.parse(`${a}T00:00:00`)) / 86400000);

const HUB_CSS = `
.dm-top a.internal-link { text-decoration: none; }
.dm-top a.internal-link:hover { text-decoration: underline; }
`;
const H = {
  strip: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", margin: "4px 0 16px" },
  card: {
    border: "1px solid var(--background-modifier-border)",
    borderRadius: "8px",
    padding: "8px 12px",
    background: "var(--background-secondary)",
  },
  label: {
    fontSize: "var(--font-ui-smaller)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--text-muted)",
    marginBottom: "2px",
  },
  big: { fontSize: "1.1em", fontWeight: 600, margin: "2px 0" },
  cols: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "18px", alignItems: "start" },
  heading: { fontSize: "1.15em", fontWeight: 600, margin: "4px 0 6px" },
  warn: { color: "var(--color-orange)", fontSize: "var(--font-ui-smaller)" },
};
const dot = (color) => ({
  display: "inline-block",
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: color ?? "var(--text-faint)",
  marginRight: "6px",
});

/** Timeline events after today in-world, soonest first. */
function UpcomingEvents({ now, cal, limit = 4 }) {
  const events = useTimeline();
  if (!now) return <div style={S.muted}>No in-world date yet.</div>;
  const upcoming = events.filter((e) => compareDates(e.date, now.date) > 0).slice(0, limit);
  if (!upcoming.length) return <div style={S.muted}>Nothing logged after {now.day}.</div>;
  return (
    <div>
      {upcoming.map((e) => (
        <div key={e.date + e.name} style={S.row} title={e.text}>
          <span style={dot(cal.colors[e.category])} />
          <strong>{inWorldText(e.date, cal.months).replace(/ \d+$/, "")}</strong> {e.name}
        </div>
      ))}
    </div>
  );
}

/** Top of the DM Screen: session status, in-world date, running arc, coming events, left-off, clues. */
function DMScreenTop() {
  const { lastPlayed, next, isTonight } = useSessionState();
  const { arc, others } = useRunningArc();
  const cal = useCalendar();
  const now = inGameNow(lastPlayed, cal.months);
  const nextDay = next ? dayOf(next.value("date")) : null;
  const until = nextDay ? daysBetween(todayDay(), nextDay) : null;
  return (
    <div class="dm-top">
      <style>{HUB_CSS}</style>
      <div style={H.strip}>
        <div style={H.card}>
          <div style={H.label}>Last played</div>
          <div style={H.big}>{lastPlayed ? <dc.Link link={lastPlayed.$link} /> : "None yet"}</div>
          <div style={S.muted}>{lastPlayed ? dayOf(lastPlayed.value("date")) : ""}</div>
        </div>
        <div style={H.card}>
          <div style={H.label}>Next session</div>
          <div style={H.big}>{next ? <dc.Link link={next.$link} /> : "None scheduled"}</div>
          <div style={S.muted}>
            {next ? `${nextDay} · ${isTonight ? "tonight" : until === 1 ? "tomorrow" : `in ${until} days`}` : "Create it from the Session Template"}
          </div>
        </div>
        <div style={H.card}>
          <div style={H.label}>Today in-world</div>
          <div style={H.big}>{now ? now.day : "No date yet"}</div>
          <div style={S.muted}>{now ? `${now.time ?? ""}${now.time ? " · " : ""}end of ${shortName(now.session)}` : "Run Close Session after the game"}</div>
        </div>
        <div style={H.card}>
          <div style={H.label}>Running arc</div>
          <div style={H.big}>{arc ? <dc.Link link={arc.$link} /> : "None running"}</div>
          {others.length ? <div style={H.warn}>Also marked running: {others.map(shortName).join(", ")}</div> : null}
        </div>
        <div style={H.card}>
          <div style={H.label}>Coming up in-world</div>
          <UpcomingEvents now={now} cal={cal} />
        </div>
      </div>
      <div style={H.cols}>
        <div>
          <div style={H.heading}>Where we left off</div>
          {lastPlayed ? (
            <dc.LinkEmbed link={dc.headerLink(lastPlayed.$path, LEFT_OFF)} />
          ) : (
            <div style={S.muted}>No session played yet.</div>
          )}
        </div>
        <div>
          <div style={H.heading}>Open clues</div>
          {arc ? <ArcClues arcPath={arc.$path} /> : <div style={S.muted}>No running arc.</div>}
          <div style={{ ...H.heading, marginTop: "14px" }}>Paused and abandoned arcs</div>
          <RelatedArcs arcPath={arc?.$path} />
        </div>
      </div>
    </div>
  );
}

/** Test view for the shared logic, shown on Hub Logic Check. */
function HubLogicCheck() {
  const { played, lastPlayed, next, isTonight } = useSessionState();
  const { arc, others } = useRunningArc();
  const months = useCalendarMonths();
  const now = inGameNow(lastPlayed, months);
  const all = dc.useQuery("@page");
  const byType = dc.useMemo(() => {
    const groups = new Map(NOTE_TYPES.map((t) => [t, []]));
    for (const p of all) if (!inZFolder(p)) groups.get(noteType(p)).push(p);
    return [...groups.entries()]
      .filter(([, list]) => list.length)
      .map(([type, list]) => [type, list.sort((a, b) => a.$name.localeCompare(b.$name))]);
  }, [all]);
  return (
    <div>
      <div style={S.row}>
        <strong>Today:</strong> {todayDay()}
      </div>
      <div style={S.row}>
        <strong>Last played:</strong> {lastPlayed ? <dc.Link link={lastPlayed.$link} /> : "none"}
        <span style={S.muted}>
          {" "}
          {lastPlayed ? dayOf(lastPlayed.value("date")) : ""} ({played.length} dated sessions played)
        </span>
      </div>
      <div style={S.row}>
        <strong>Next session:</strong> {next ? <dc.Link link={next.$link} /> : "none"}
        <span style={S.muted}> {next ? dayOf(next.value("date")) : ""}</span>
        {isTonight ? <span style={S.pill}>tonight</span> : null}
      </div>
      <div style={S.row}>
        <strong>Today in-world:</strong>{" "}
        {now ? (
          <span>
            {now.text} <span style={S.muted}>(from {shortName(now.session)})</span>
          </span>
        ) : (
          <span style={S.muted}>no date yet (needs fc-end on the last played session)</span>
        )}
      </div>
      <div style={S.row}>
        <strong>Running arc:</strong> {arc ? <dc.Link link={arc.$link} /> : "none"}
        {others.length ? <span style={S.shared}>also marked running: {others.map(shortName).join(", ")}</span> : null}
      </div>
      <div style={{ ...S.row, marginTop: "12px" }}>
        <strong>Note types</strong> <span style={S.muted}>(outside z_ folders; open a group to spot misfiled notes)</span>
      </div>
      {byType.map(([type, list]) => (
        <details key={type}>
          <summary style={S.sessionHead}>
            {type} <span style={S.muted}>{list.length}</span>
          </summary>
          <div style={S.embed}>
            {list.map((p) => (
              <div key={p.$path}>
                <dc.Link link={p.$link} /> <span style={S.muted}>{p.$path.split("/").slice(0, -1).join("/")}</span>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

return {
  ArcHistory,
  RelatedArcs,
  ArcClues,
  SessionArc,
  useArcSessions,
  linkPath,
  statusOf,
  shortName,
  useSessionState,
  useRunningArc,
  inGameNow,
  useCalendar,
  useCalendarMonths,
  useTimeline,
  compareDates,
  inWorldText,
  DMScreenTop,
  noteType,
  NOTE_TYPES,
  hasTag,
  inZFolder,
  dayOf,
  todayDay,
  HubLogicCheck,
};
```
