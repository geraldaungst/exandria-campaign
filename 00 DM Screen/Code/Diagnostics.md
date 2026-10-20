---
hide_from_related: true
---

**Purpose:** The Hub Logic Check view: shows what the shared logic resolves to (active campaign, sessions, running arc, today in-world) and every note grouped by type, to spot misfiled notes.

**Exports:** `HubLogicCheck`

**Depends on:** [[Shared Helpers]] · [[Campaign State]] · [[Calendar and Timeline]] · [[Note Types]]

**Used by:** [[Hub Logic Check]]

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Diagnostics.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { shortName, isExcluded, todayDay, dayOf, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const { useActiveCampaign, useSessionState, useRunningArc } = await dc.require(dc.headerLink("00 DM Screen/Code/Campaign State.md", "Code"));

const { useCalendarMonths, inGameNow } = await dc.require(dc.headerLink("00 DM Screen/Code/Calendar and Timeline.md", "Code"));

const { NOTE_TYPES, typeRules, noteType } = await dc.require(dc.headerLink("00 DM Screen/Code/Note Types.md", "Code"));

/** Test view for the shared logic, shown on Hub Logic Check. */
function HubLogicCheck() {
  const { campaign } = useActiveCampaign();
  const { played, lastPlayed, next, isTonight } = useSessionState(campaign?.tag);
  const { arc, others } = useRunningArc(campaign?.tag);
  const months = useCalendarMonths(campaign?.calendar);
  const now = inGameNow(lastPlayed, months);
  const all = dc.useQuery("@page");
  const byType = dc.useMemo(() => {
    const groups = new Map(NOTE_TYPES.map((t) => [t, []]));
    const rules = typeRules();
    for (const p of all) if (!isExcluded(p)) groups.get(noteType(p, rules)).push(p);
    return [...groups.entries()]
      .filter(([, list]) => list.length)
      .map(([type, list]) => [type, list.sort((a, b) => a.$name.localeCompare(b.$name))]);
  }, [all]);
  return (
    <div>
      <div style={S.row}>
        <strong>Active campaign:</strong> {campaign ? <dc.Link link={campaign.page.$link} /> : "none"}
        <span style={S.muted}> {campaign ? `${campaign.tag} · ${campaign.calendar ?? "no calendar"} · ${campaign.timelinePath ?? "no timeline"}` : ""}</span>
      </div>
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
        <strong>Note types</strong> <span style={S.muted}>(outside excluded folders; open a group to spot misfiled notes)</span>
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

return { HubLogicCheck };
```
