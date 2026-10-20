---
hide_from_related: true
---

**Purpose:** The top section of the DM Screen: campaign line, the five status cards, the last session's "Where we left off", open clues, and paused arcs.

**Exports:** `DMScreenTop`

**Depends on:** [[Shared Helpers]] · [[Campaign State]] · [[Calendar and Timeline]] · [[Arc and Session Views]]

**Used by:** [[00 DM Screen]]

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/DM Screen Views.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, linkPath, asList, statusOf, shortName, num, rawText, todayDay, dayOf, daysBetween, useNoteText, bulletValue, numberRanges, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const { useActiveCampaign, useSessionState, useRunningArc, useArcSessions, prepStatus } = await dc.require(dc.headerLink("00 DM Screen/Code/Campaign State.md", "Code"));

const { DATE_STYLE, useCalendar, inGameNow, inWorldText, UpcomingEvents, DayEvents, openCalendarAt } = await dc.require(dc.headerLink("00 DM Screen/Code/Calendar and Timeline.md", "Code"));

const { ArcClues, RelatedArcs } = await dc.require(dc.headerLink("00 DM Screen/Code/Arc and Session Views.md", "Code"));

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
  line: { fontSize: "var(--font-ui-small)", margin: "3px 0", lineHeight: 1.4 },
  warn: { color: "var(--color-orange)", fontSize: "var(--font-ui-smaller)" },
};

/** A small "label value" row inside a hub card. */
function Line({ label, children }) {
  return (
    <div style={H.line}>
      <span style={S.muted}>{label} </span>
      {children}
    </div>
  );
}

/** Top of the DM Screen: session status, in-world date, running arc, coming events, left-off, clues. */
function DMScreenTop() {
  const { campaign, extraActive } = useActiveCampaign();
  const { lastPlayed, next, isTonight } = useSessionState(campaign?.tag);
  const { arc, others } = useRunningArc(campaign?.tag);
  const cal = useCalendar(campaign?.calendar);
  const now = inGameNow(lastPlayed, cal.months);
  const today = todayDay();
  const nextDay = next ? dayOf(next.value("date")) : null;
  const until = nextDay ? daysBetween(today, nextDay) : null;

  // Last played: location and threads from its "Where we left off" bullets
  const lastText = useNoteText(lastPlayed?.$path);
  const lastDay = lastPlayed ? dayOf(lastPlayed.value("date")) : null;
  const ago = lastDay ? daysBetween(lastDay, today) : null;
  const location = bulletValue(lastText, cfg().label_party_location);
  const moved = bulletValue(lastText, cfg().label_threads_moved);

  // Next session: arc change, in-world start, prep steps still empty
  const nextText = useNoteText(next?.$path);
  const nextArcPath = next ? linkPath(next.value("arc")) : null;
  const nextArc = dc.useFile(nextArcPath ?? "");
  const arcChange = nextArcPath && nextArcPath !== arc?.$path ? nextArc : null;
  const nextStart = next ? rawText(next.value("fc-date")) : null;
  const prep = prepStatus(nextText);
  const notStarted = prep ? prep.filter((s) => !s.filled).map((s) => s.name.charAt(0).toLowerCase() + s.name.slice(1)) : [];

  // Running arc: sessions played in it, when it started, threads it advances
  const arcSessions = useArcSessions(arc?.$path ?? "");
  const arcPlayed = arcSessions.filter((s) => (dayOf(s.value("date")) ?? "9999") < today);
  const arcNums = arcPlayed.map((s) => num(s.value("session_number"))).filter((n) => n > -Infinity);
  const arcStart = arcPlayed.map((s) => dayOf(s.value("date"))).filter(Boolean).sort()[0];
  const threadLinks = asList(arc?.value("threads"))
    .map((t) => {
      const p = linkPath(t);
      return p ? `[[${p.replace(/\.md$/, "")}|${p.split("/").pop().replace(/\.md$/, "")}]]` : null;
    })
    .filter(Boolean)
    .join(", ");

  return (
    <div class="dm-top">
      <style>{HUB_CSS}</style>
      <div style={H.line}>
        <span style={S.muted}>Campaign: </span>
        {campaign ? (
          <dc.Link link={campaign.page.$link} />
        ) : (
          <span style={H.warn}>no campaign note has status: active (create one from the Campaign Template)</span>
        )}
        {extraActive.length ? <span style={H.warn}> · also marked active: {extraActive.map(shortName).join(", ")}</span> : null}
        {campaign?.extraTags.length ? (
          <span style={H.warn}> · more than one campaign/… tag; using {campaign.tag}</span>
        ) : null}
      </div>
      <div style={H.strip}>
        <div style={H.card}>
          <div style={H.label}>Last played</div>
          <div style={H.big}>{lastPlayed ? <dc.Link link={lastPlayed.$link} /> : "None yet"}</div>
          <div style={S.muted}>
            {lastDay ? `${lastDay} · ${ago === 0 ? "today" : ago === 1 ? "yesterday" : `${ago} days ago`}` : ""}
          </div>
          {location ? (
            <Line label="Party at:">
              <dc.Markdown content={location} inline={true} sourcePath={lastPlayed.$path} />
            </Line>
          ) : null}
          {moved ? (
            <Line label="Threads moved:">
              <dc.Markdown content={moved} inline={true} sourcePath={lastPlayed.$path} />
            </Line>
          ) : null}
        </div>
        <div style={H.card}>
          <div style={H.label}>Next session</div>
          <div style={H.big}>{next ? <dc.Link link={next.$link} /> : "None scheduled"}</div>
          <div style={S.muted}>
            {next ? `${nextDay} · ${isTonight ? "tonight" : until === 1 ? "tomorrow" : `in ${until} days`}` : "Create it from the Session Template"}
          </div>
          {arcChange ? (
            <Line label={cfg().statuses_paused.includes(statusOf(arcChange)) ? "★ Resumes arc:" : "★ Starts arc:"}>
              <dc.Link link={arcChange.$link} />
            </Line>
          ) : null}
          {nextStart ? <Line label="Starts in-world:">{inWorldText(nextStart, cal.months)}</Line> : null}
          {prep ? (
            <Line label="Prep:">
              {notStarted.length === 0
                ? "all steps started"
                : notStarted.length === prep.length
                ? "not started"
                : `not started: ${notStarted.join(", ")}`}
            </Line>
          ) : null}
        </div>
        <div style={H.card}>
          <div style={H.label}>Today in-world</div>
          <div style={H.big}>
            {now ? (
              <span style={{ ...DATE_STYLE, cursor: "pointer" }} onClick={() => openCalendarAt(now.date)} aria-label="Open in Calendarium">
                {now.day}
              </span>
            ) : (
              "No date yet"
            )}
          </div>
          <div style={S.muted}>{now ? `${now.time ?? ""}${now.time ? " · " : ""}end of ${shortName(now.session)}` : "Run Close Session after the game"}</div>
          <DayEvents now={now} cal={cal} timelinePath={campaign?.timelinePath} />
        </div>
        <div style={H.card}>
          <div style={H.label}>Running arc</div>
          <div style={H.big}>{arc ? <dc.Link link={arc.$link} /> : "None running"}</div>
          {others.length ? <div style={H.warn}>Also marked running: {others.map(shortName).join(", ")}</div> : null}
          {arc ? (
            <Line label={arcNums.length === 1 ? "Session:" : "Sessions:"}>
              {arcNums.length ? numberRanges(arcNums) : "none played yet"}
            </Line>
          ) : null}
          {arcStart ? <Line label="Started:">{arcStart}</Line> : null}
          {threadLinks ? (
            <Line label="Advances:">
              <dc.Markdown content={threadLinks} inline={true} sourcePath={arc.$path} />
            </Line>
          ) : null}
        </div>
        <div style={H.card}>
          <div style={H.label}>Coming up in-world</div>
          <UpcomingEvents now={now} cal={cal} timelinePath={campaign?.timelinePath} />
        </div>
      </div>
      <div style={H.cols}>
        <div>
          <div style={H.heading}>
            Last session{lastPlayed ? ": " : ""}
            {lastPlayed ? <dc.Link link={lastPlayed.$link} /> : null}
          </div>
          {lastPlayed ? (
            <dc.LinkEmbed link={dc.headerLink(lastPlayed.$path, cfg().heading_left_off)} />
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

return { DMScreenTop };
```
