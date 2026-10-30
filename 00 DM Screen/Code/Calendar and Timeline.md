---
hide_from_related: true
---

**Purpose:** Everything in-world: Calendarium month names and category colors, in-world date text and comparison, today in-world from a session, the campaign timeline's events, the event rows, and opening Calendarium on a date.

**Exports:** `DATE_STYLE`, `useCalendar`, `useCalendarMonths`, `dateKey`, `compareDates`, `inWorldText`, `inGameNow`, `useTimeline`, `dot`, `TimelineEvent`, `UpcomingEvents`, `DayEvents`, `openCalendarAt`

**Depends on:** [[Shared Helpers]]

**Used by:** [[DM Screen Views]] · [[Session Hub Views]] · [[Quick Capture]] · [[Artifact Change Form]]

Conventions this module relies on:

- Today in-world: the last played session's `fc-end` (else `fc-date`) and `ingame_time`. These are set by the session template (`fc-date` = previous session's `fc-end`) and the [[Close Session]] template. In-world dates are year-month-day with the month as a number from 1 (`835-04-19` is 19 Thunsheer 835); Calendarium reads them as events on the campaign's calendar.
- The timeline note holds one inline event per line: `<span data-date="835-04-27" data-category="…" data-name="…">Description.</span>`. Only spans with a `data-date` count.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Calendar and Timeline.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { rawText, useNoteText, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

// In-world dates use the theme accent color, which follows light and dark mode.
const DATE_STYLE = { color: "var(--text-accent)" };

/** Month names and category colors for a Calendarium calendar, read from Calendarium's settings file. */
function useCalendar(calendarName) {
  const [cal, setCal] = dc.useState({ months: [], colors: {} });
  dc.useEffect(() => {
    let live = true;
    (async () => {
      try {
        const raw = await app.vault.adapter.read(`${app.vault.configDir}/plugins/calendarium/data.json`);
        const c = calendarName ? JSON.parse(raw).calendars.find((x) => x.name === calendarName) : null;
        const colors = {};
        for (const k of c?.categories ?? []) if (!(k.name in colors)) colors[k.name] = k.color; // first category of a name wins
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

/** "835-04-27" → [835, 4, 27] for comparing in-world dates. */
const dateKey = (s) => String(s ?? "").split("-").map(Number);
const compareDates = (a, b) => {
  const x = dateKey(a);
  const y = dateKey(b);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

/** "835-04-19" → "19 Thunsheer 835" when month names are known; otherwise as stored. */
function inWorldText(date, months = []) {
  const m = String(date).match(/^(\d+)-(\d+)-(\d+)$/);
  if (!m) return String(date);
  const month = months[Number(m[2]) - 1];
  return month ? `${Number(m[3])} ${month} ${Number(m[1])}` : String(date);
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

/** Inline events in the campaign timeline note, oldest first. */
function useTimeline(path) {
  const text = useNoteText(path);
  return dc.useMemo(() => {
    const attr = (tag, name) => (tag.match(new RegExp(`data-${name}="([^"]*)"`)) ?? [])[1] ?? null;
    return [...text.matchAll(/<span\b([^>]*)>([\s\S]*?)<\/span>/g)]
      .map(([, tag, body]) => ({
        date: attr(tag, "date"),
        category: attr(tag, "category"),
        name: attr(tag, "name"),
        text: body.trim(),
      }))
      .filter((e) => e.date && /^\d+-\d+-\d+$/.test(e.date))
      .sort((a, b) => compareDates(a.date, b.date));
  }, [text]);
}

const dot = (color) => ({
  display: "inline-block",
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: color ?? "var(--text-faint)",
  marginRight: "6px",
});

/** Timeline events after today in-world, soonest first. */
function UpcomingEvents({ now, cal, timelinePath, limit = 4 }) {
  const events = useTimeline(timelinePath);
  if (!now) return <div style={S.muted}>No in-world date yet.</div>;
  const upcoming = events.filter((e) => compareDates(e.date, now.date) > 0).slice(0, limit);
  if (!upcoming.length) return <div style={S.muted}>Nothing logged after {now.day}.</div>;
  return (
    <div>
      {upcoming.map((e) => (
        <TimelineEvent key={e.date + e.name} event={e} cal={cal} timelinePath={timelinePath} />
      ))}
    </div>
  );
}

/** Timeline events on the in-world date `now`, in the order they appear in the timeline note. */
function DayEvents({ now, cal, timelinePath }) {
  const events = useTimeline(timelinePath);
  if (!now) return null;
  const today = events.filter((e) => compareDates(e.date, now.date) === 0);
  if (!today.length) return <div style={{ ...S.muted, marginTop: "4px" }}>No events logged for this day.</div>;
  return (
    <div style={{ marginTop: "4px" }}>
      {today.map((e) => (
        <TimelineEvent key={e.date + e.name} event={e} cal={cal} timelinePath={timelinePath} showDate={false} />
      ))}
    </div>
  );
}

/** One timeline event: click the row to show its description and a link to its place in the timeline. */
function TimelineEvent({ event: e, cal, timelinePath, showDate = true }) {
  const [y, m] = dateKey(e.date);
  const monthHeading = cal.months[m - 1] ? `${cal.months[m - 1]} ${y}` : null;
  const desc = e.text.startsWith(`${e.name}:`) ? e.text.slice(e.name.length + 1).trim() : e.text === e.name ? "" : e.text;
  const where = monthHeading && timelinePath ? dc.headerLink(timelinePath, monthHeading) : null;
  return (
    <details style={S.row}>
      <summary style={{ cursor: "pointer" }}>
        <span style={dot(cal.colors[e.category])} />
        {showDate ? <strong style={DATE_STYLE}>{inWorldText(e.date, cal.months).replace(/ \d+$/, "")} </strong> : null}
        {e.name}
      </summary>
      <div style={{ ...S.muted, margin: "2px 0 6px 16px" }}>
        {desc ? <span>{desc} </span> : null}
        <span>({e.category}{where ? " · " : ""}</span>
        {where ? <dc.Link link={where.withDisplay ? where.withDisplay("timeline") : where} /> : null}
        <span>)</span>
      </div>
    </details>
  );
}

/**
 * Open Calendarium's calendar view on an in-world date ("835-04-27") and select that day.
 * Uses Calendarium internals (2.1.0); if they change, it still opens the calendar.
 */
async function openCalendarAt(date) {
  const [year, month, day] = dateKey(date);
  const target = { year, month: month - 1, day };
  const leaves = () => app.workspace.getLeavesOfType("CALENDARIUM");
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  if (!leaves().length) {
    app.commands.executeCommandById("calendarium:open-calendarium");
    for (let i = 0; i < 30 && !leaves().some((l) => l.view?.store); i++) await wait(100);
    await wait(150);
  }
  for (const leaf of leaves()) {
    try {
      const view = leaf.view;
      const eph = view?.store?.getEphemeralStore?.(view.id);
      eph?.displayDate?.(target);
      eph?.viewing?.set?.(target);
    } catch (e) {}
    app.workspace.revealLeaf(leaf);
  }
}

return { DATE_STYLE, useCalendar, useCalendarMonths, dateKey, compareDates, inWorldText, inGameNow, useTimeline, dot, TimelineEvent, UpcomingEvents, DayEvents, openCalendarAt };
```
