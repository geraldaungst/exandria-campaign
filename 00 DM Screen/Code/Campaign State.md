---
hide_from_related: true
---

**Purpose:** Where the active campaign stands: which campaign is active, its sessions (last played, next), its running arc, the sessions played in an arc, and reading a session note's prep steps.

**Exports:** `campaignTagsOf`, `useActiveCampaign`, `useDatedSessions`, `useSessionState`, `useArcSessions`, `useRunningArc`, `prepStatus`

**Depends on:** [[Shared Helpers]] (and [[Hub Config]] through it)

**Used by:** [[Arc and Session Views]] · [[DM Screen Views]] · [[Session Hub Views]] · [[Quick Capture]] · [[Session Hub Table]] · [[Artifact Change Form]] · [[Artifact Hub Views]]

Conventions this module relies on:

- Arc notes carry the `arc` tag and a `status` property: idea, designing, ready, running, paused, abandoned, complete. Only one arc is `running` at a time.
- Arc notes list the plot threads they advance in `threads` (links).
- Session notes carry the `session` tag, `session_number`, `date`, and an `arc` property linking to their arc.
- Session notes have a `## Where we left off` heading, filled in after play.
- Campaign notes (tag `campaign-hub`, the folder note of each campaign folder) carry exactly one `campaign/…` tag (the tag every session and arc of that campaign carries) and hold `calendar` (a Calendarium calendar name), `timeline` (link to the campaign timeline note), `status`, and `world` (the name of the campaign's folder under `Worlds/`, read by [[Quick Capture]]). The hubs follow the one with `status: active`; sessions and arcs belong to a campaign through its tag. Other properties and content on a campaign note are ignored here.
- Last played session: the highest-numbered session of the active campaign dated before today. Next session: the earliest dated today or later (on game day it is tonight's session, not the last played one). Notes in `z_` folders and session notes without a number or date are ignored.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Campaign State.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, linkPath, statusOf, num, rawText, isExcluded, tagsOf, hasTag, todayDay, dayOf, stripComments, escapeRe } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));


/** A note's campaign/… tags (a campaign note should have exactly one). */
const campaignTagsOf = (p) => tagsOf(p).filter((t) => t.startsWith(cfg().campaign_tag_prefix));

/**
 * The active campaign: the campaign note (tag `campaign-hub`) with `status: active`.
 * Its campaign/… tag ties sessions and arcs to it; its properties name its Calendarium calendar and timeline note.
 * `extraActive` lists any other campaign notes also marked active.
 */
function useActiveCampaign() {
  const notes = dc.useQuery(`@page and #${cfg().tag_campaign_note}`);
  return dc.useMemo(() => {
    const active = notes
      .filter((p) => !isExcluded(p) && campaignTagsOf(p).length && String(p.value("status") ?? "").toLowerCase() === "active")
      .sort((a, b) => a.$name.localeCompare(b.$name));
    const page = active[0];
    const campaign = page
      ? {
          page,
          tag: campaignTagsOf(page)[0],
          extraTags: campaignTagsOf(page).slice(1),
          calendar: rawText(page.value("calendar")),
          timelinePath: linkPath(page.value("timeline")),
        }
      : null;
    return { campaign, extraActive: active.slice(1) };
  }, [notes]);
}

/** Numbered, dated session notes outside excluded folders (only the campaign's, when a tag is given), lowest number first. */
function useDatedSessions(campaignTag) {
  const sessions = dc.useQuery(`@page and #${cfg().tag_session}`);
  return dc.useMemo(
    () =>
      sessions
        .filter((s) => !isExcluded(s) && (!campaignTag || hasTag(s, campaignTag)))
        .filter((s) => num(s.value("session_number")) > -Infinity && dayOf(s.value("date")))
        .sort((a, b) => num(a.value("session_number")) - num(b.value("session_number"))),
    [sessions, campaignTag]
  );
}

/**
 * Where the campaign stands in real time.
 * lastPlayed: highest-numbered session dated before today.
 * next: earliest session dated today or later; isTonight when that date is today.
 */
function useSessionState(campaignTag) {
  const sessions = useDatedSessions(campaignTag);
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

/** Sessions whose `arc` property points at the given arc path, newest first. */
function useArcSessions(arcPath) {
  const sessions = dc.useQuery(`@page and #${cfg().tag_session}`);
  return dc.useMemo(
    () =>
      sessions
        .filter((s) => linkPath(s.value("arc")) === arcPath)
        .sort((a, b) => num(b.value("session_number")) - num(a.value("session_number")) || b.$mtime - a.$mtime),
    [sessions, arcPath]
  );
}

/** The campaign's running arc; `others` lists any extra arcs wrongly marked running. */
function useRunningArc(campaignTag) {
  const arcs = dc.useQuery(`@page and #${cfg().tag_arc}`);
  const running = arcs
    .filter((a) => !isExcluded(a) && (!campaignTag || hasTag(a, campaignTag)) && statusOf(a) === cfg().status_running)
    .sort((a, b) => a.$name.localeCompare(b.$name));
  return { arc: running[0] ?? null, others: running.slice(1) };
}

/** Prep steps ("### 0. …" to "### 5. …" under "## Prep") and whether each has real content yet. */
function prepStatus(text) {
  const body = stripComments(text);
  const start = body.search(new RegExp(`^## ${escapeRe(cfg().heading_prep)}\\s*$`, "m"));
  if (start < 0) return null;
  const rest = body.slice(start).split("\n").slice(1);
  const end = rest.findIndex((l) => /^## /.test(l));
  const lines = end < 0 ? rest : rest.slice(0, end);
  const steps = [];
  for (const line of lines) {
    const h = line.match(/^###\s+\d+\.\s+(.*)$/);
    if (h) steps.push({ name: h[1].trim(), filled: false });
    else if (steps.length && line.trim() && !/^(-|\*|\d+\.|- \[ \]|---)\s*$/.test(line.trim())) steps[steps.length - 1].filled = true;
  }
  return steps.length ? steps : null;
}

return { campaignTagsOf, useActiveCampaign, useDatedSessions, useSessionState, useArcSessions, useRunningArc, prepStatus };
```
