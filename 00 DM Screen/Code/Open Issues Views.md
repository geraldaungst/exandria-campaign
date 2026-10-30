---
hide_from_related: true
---

**Purpose:** The code behind the Open Issues collector ([[Open Issues Spec]]): reads the `## Open Issues` and `## Seeds Planted` sections of every DM note into items, puts each item in a priority band from links, tags and properties the vault already keeps, and draws them: an Issues | Seeds switch, five groupings (Priority, Note, Thread, Place, Type), filters, a sort, and the format problems. `OpenIssuesFull` is the full view ([[Open Issues]]). `OpenIssuesCompact` draws the two compact views.

**Exports:** `PRIORITY_RE`, `NEAR_MISS_HEADINGS`, `parseOpenItems`, `bandOf`, `sortEntries`, `filterEntries`, `groupEntries`, `useOpenItems`, `OpenIssuesPanel`, `OpenIssuesFull`, `OpenIssuesCompact`

**Depends on:** [[Hub Layout]] (`Row`, `Cell`) · [[Shared Helpers]] (and [[Hub Config]] through it; its `locations()` loads the location core, [[Location Engine Spec]]) · [[Campaign State]] · [[Note Types]] · [[Plot Dashboard Views]] (`plotConnections`) · [[Session Hub Table]] (`linkTargets`, `partyPlaceOf`) · [[Session Hub Views]] (`sectionText`)

**Used by:** [[Open Issues]] · [[Session Hub]] · [[00 DM Screen]]

Conventions this module relies on:

- **Sections.** A heading at any level (`#` to `######`) whose text, without regard to case, is `heading_open_issues` or `heading_seeds` in [[Hub Config]]. The section ends at the next heading of any level. Headings inside code fences and inside comments are ignored; so is the note's frontmatter.
- **Items.** A top-level checklist line directly under the heading: `- [ ] text`. Ticked is any character other than a space. Nested lines, and unindented text that follows an item without a blank line, are its `details`. An empty `- [ ]` (the template placeholder), plain text lines (labels) and callout lines are ignored.
- **Priority.** `**Priority` anywhere in the line, without regard to case (`PRIORITY_RE`); the label is taken out of `text`. The label word itself comes from `label_priority` in Hub Config, which is read when the views are built; `PRIORITY_RE` is fixed so a capture at the table needs no syntax.
- **Session link.** When the line ends with a link and `isSession(target)` says the target is a session note, the link is returned as `session` and taken out of `text`.
- **Format problems.** A plain bullet or numbered line directly under either heading, and a near-miss heading (`NEAR_MISS_HEADINGS`: Open issue, Open question(s), Open item(s), Seeds, Seed planted, Loose Threads, Unresolved Elements, and a heading that is the link `[[Seeds Planted]]`). Each is returned in `problems` with its line number.
- **Line numbers.** Comments are blanked with their line breaks kept, so `line` is the line in the note as the editor shows it. (Shared Helpers' `stripComments` removes the breaks and would shift every number after a multi-line comment.)
- **Reading the vault.** Pages come from `dc.useQuery("@page")`, minus `z_` folders and `Player Wiki/`. Notes whose headings (Datacore's section index, `$sections`) can hold one of the two sections or a near-miss are read with `app.vault.cachedRead`; if the index is missing or empty, every note is read. Each note's parse is kept in memory while its edit time and the set of session notes are unchanged, so reopening the view reads nothing. The line at the foot of the view says how many notes were read, how long it took and whether the section index narrowed the list.
- **Context.** The running arc and the notes it links to (a link to a player note counts for its DM twin); the links in the last played session's `Where we left off`; the party's place (`partyPlaceOf`); each note's plot threads (`plotConnections`, plus the note itself when it is a thread); its type (`noteType`); its nearest place and whether it is at or inside the party's place (the location core's `whereIs` and `within`).
- **Bands** (`bandOf`, first match wins; spec 2.9). 1 Flagged: the item has the Priority label. 2 Next session: its note is the running arc, is linked from it, is linked from `Where we left off`, or is at or inside the party's place. 3 Active threads: its note connects to a `plot/active` thread or is one. 4 Upcoming: a `plot/upcoming` thread, or an arc whose `status` is in `statuses_paused`. 5 Everything else (collapsed). Bands 2 to 4 show their reason in muted text. In-world deadlines are not read from the text.
- **Groupings.** Priority: the bands. Note: one group per note (name, type, up to two thread names coloured by stage and "+n", nearest place). Thread: one group per plot thread by stage (active, upcoming, seed, paused), then "No thread"; a note on two threads is under both. Place: nearest place, "No place" last. Type: the order of `NOTE_TYPES`. Outside the Note grouping each item shows its note's name in muted text.
- **Items.** The first sentence, with a ★ for a flagged item; a click shows the full text and the details when there are any. A session link at the end of a line shows as "raised in Session N" (issues) or "planted in Session N" (seeds). A group collapses to its header, which shows how many items it holds.
- **Compact view** (`OpenIssuesCompact`, used on the Session Hub under Prep and on the 00 DM Screen hub under Open issues; Gerald's decision 2026-10-30: the two are the same). Issues and Seeds side by side, Priority grouping, bands 1 and 2 only (Flagged and Next session), no switch or filters; a line under each list counts the items in lower bands, and a "Full view" link goes to [[Open Issues]].
- **Filters and sort.** Text (the item and its note's name), type, thread, Running arc (the running arc and notes it links to), Where the party is. Sort inside each group: band first, then the note's last edit (newest first) or its name.
- **Remembered choices.** The Issues | Seeds switch, the grouping and the sort are kept per device with `app.saveLocalStorage` and `app.loadLocalStorage` (wrapped in try/catch; without them the choices last for the session). Never a plugin settings file.
- **Not read.** The Shard notes' `## Who knows` lines, `## Design To-Dos`, `## Player Theories`, the hook headings and the other headings listed in the spec's section 2.7.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Open Issues Views.md", "Code"))`. After editing, reopen any note that uses it. The page cannot be rendered here: `bandOf` and the grouping, filter and sort functions are tested in Node (`.scripts/open_issues_tests/view_logic_tests.js`); the rest is checked in Obsidian. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, isExcluded, hasTag, inFolder, stripDmSuffix, statusOf, useNoteText, locations } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));
const { useActiveCampaign, useSessionState, useRunningArc } = await dc.require(dc.headerLink("00 DM Screen/Code/Campaign State.md", "Code"));
const { noteType, NOTE_TYPES } = await dc.require(dc.headerLink("00 DM Screen/Code/Note Types.md", "Code"));
const { plotConnections } = await dc.require(dc.headerLink("00 DM Screen/Code/Plot Dashboard Views.md", "Code"));
const { linkTargets, partyPlaceOf } = await dc.require(dc.headerLink("00 DM Screen/Code/Session Hub Table.md", "Code"));
const { sectionText } = await dc.require(dc.headerLink("00 DM Screen/Code/Session Hub Views.md", "Code"));
const { Row, Cell } = await dc.require(dc.headerLink("00 DM Screen/Code/Hub Layout.md", "Code"));

/** The priority mark: `**Priority` anywhere in a line, in any case. */
const PRIORITY_RE = /\*\*\s*priority/i;

/** Heading texts (lower case) that look like one of the two sections but are not, listed as format problems. */
const NEAR_MISS_HEADINGS = ["open issue", "open question", "open questions", "open item", "open items", "seeds", "seed planted", "loose threads", "unresolved elements", "[[seeds planted]]"];

const TASK_RE = /^[-*+]\s+\[(.)\]\s*(.*)$/;
const BULLET_RE = /^(?:[-*+]|\d+[.)])\s+\S/;
const HEADING_RE = /^(#{1,6})\s+(.*?)\s*$/;
const FENCE_RE = /^ {0,3}(```|~~~)/;
const LINK_TAIL_RE = /\s*\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\\?\|([^\]]*))?\]\]\s*$/;

/** The text with comments and the frontmatter blanked but every line break kept, so line numbers stay true. */
function blankHidden(text) {
  const keepBreaks = (s) => s.replace(/[^\n]/g, "");
  let t = String(text ?? "").replace(/^---\n[\s\S]*?\n---(?=\n|$)/, keepBreaks);
  return t.replace(/<!--[\s\S]*?-->/g, keepBreaks);
}

/** The line without its priority label, bold markers left balanced. */
function withoutPriority(s) {
  let out = s.replace(/\*\*\s*priority\s*:?\s*(?:\*\*)?\s*:?\s*/i, " ").replace(/\s+/g, " ").trim();
  const marks = [...out.matchAll(/\*\*/g)];
  if (marks.length % 2 === 1) {
    const at = marks[marks.length - 1].index;
    out = (out.slice(0, at) + out.slice(at + 2)).replace(/\s+/g, " ").trim();
  }
  return out;
}

/** Up to and including the first sentence end; links are not split. */
function firstSentence(s) {
  const masked = s.replace(/\[\[[^\]]*\]\]/g, (m) => "x".repeat(m.length));
  const m = masked.match(/[.?!]+["')\]]*(?=\s|$)/);
  return m ? s.slice(0, m.index + m[0].length).trim() : s.trim();
}

function makeItem(mark, rawText, line, isSession) {
  let text = rawText.trim();
  let session = null;
  const tail = text.match(LINK_TAIL_RE);
  if (tail && isSession(tail[1].trim())) {
    session = { target: tail[1].trim(), display: (tail[2] ?? "").trim() || null };
    text = text.slice(0, tail.index).trim();
  }
  const priority = PRIORITY_RE.test(text);
  if (priority) text = withoutPriority(text);
  return { text, first: firstSentence(text), details: [], open: mark === " ", priority, session, raw: rawText.trim(), line };
}

/**
 * A note's text → { issues, seeds, problems }.
 * isSession(target) says whether a link target is a session note. c: the settings (heading_open_issues, heading_seeds).
 * Item: { text, first, details, open, priority, session, raw, line }. Problem: { kind: "plain line" | "near-miss heading", section, text, line }.
 */
function parseOpenItems(text, isSession = () => false, c = cfg()) {
  const issues = [], seeds = [], problems = [];
  const sections = {
    [String(c.heading_open_issues).trim().toLowerCase()]: { name: "Open Issues", list: issues },
    [String(c.heading_seeds).trim().toLowerCase()]: { name: "Seeds Planted", list: seeds },
  };
  const lines = blankHidden(text).split("\n");
  let current = null, item = null, fence = false, gap = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (FENCE_RE.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const h = line.match(HEADING_RE);
    if (h) {
      current = null;
      item = null;
      const key = h[2].toLowerCase();
      if (sections[key]) current = sections[key];
      else if (NEAR_MISS_HEADINGS.includes(key)) problems.push({ kind: "near-miss heading", section: null, text: h[2], line: i + 1 });
      continue;
    }
    if (!current) continue;
    if (!line.trim()) {
      gap = true;
      continue;
    }
    if (/^\s+\S/.test(line)) {
      if (item) item.details.push(line.trim().replace(/^[-*+]\s+/, ""));
      continue;
    }
    if (/^>/.test(line)) continue;
    const task = line.match(TASK_RE);
    if (task) {
      gap = false;
      item = null;
      if (!task[2].trim()) continue;
      item = makeItem(task[1], task[2], i + 1, isSession);
      current.list.push(item);
      continue;
    }
    if (BULLET_RE.test(line)) {
      problems.push({ kind: "plain line", section: current.name, text: line.trim(), line: i + 1 });
      item = null;
      gap = false;
      continue;
    }
    if (item && !gap) item.details.push(line.trim());
    gap = false;
  }
  return { issues, seeds, problems };
}

// ── Bands ─────────────────────────────────────────────────────────

const STAGES = ["active", "upcoming", "seed", "paused"];
const STAGE_COLOR = { active: "green", upcoming: "blue", seed: "purple", paused: "yellow" };
const BAND_NAMES = { 1: "Flagged", 2: "Next session", 3: "Active threads", 4: "Upcoming", 5: "Everything else" };

/** "A (active), B (active) +2" for a list of { name, stage }, at most two named. */
function threadReason(list) {
  const named = list.slice(0, 2).map((t) => `${t.name} (${t.stage})`).join(", ");
  return `thread: ${named}${list.length > 2 ? ` +${list.length - 2}` : ""}`;
}

/**
 * The band of one item and the reason to show (spec 2.9). The first band it qualifies for wins.
 * f: { priority, runningArc, linkedFromArc, inLeftOff, atParty, partyName, pausedArc, threads: [{ name, stage }] }
 * (threads: the plot threads the item's note connects to, or is). Returns { band: 1 to 5, reason }.
 */
function bandOf(f) {
  if (f.priority) return { band: 1, reason: "" };
  const next = [];
  if (f.runningArc) next.push("the running arc");
  if (f.linkedFromArc) next.push("linked from the running arc");
  if (f.inLeftOff) next.push("linked from the last session's Where we left off");
  if (f.atParty) next.push(`at the party's location${f.partyName ? `: ${f.partyName}` : ""}`);
  if (next.length) return { band: 2, reason: next.slice(0, 2).join("; ") };
  const active = f.threads.filter((t) => t.stage === "active");
  if (active.length) return { band: 3, reason: threadReason(active) };
  const upcoming = f.threads.filter((t) => t.stage === "upcoming");
  if (upcoming.length) return { band: 4, reason: threadReason(upcoming) };
  if (f.pausedArc) return { band: 4, reason: "a paused arc" };
  return { band: 5, reason: "" };
}

// ── Sorting, filtering, grouping ──────────────────────────────────
// An entry is { id, kind: "issue" | "seed", item, note, facts, band, reason, session }.
// A note is { path, name, link, type, mtime, place (name or null), threads: [{ path, name, stage }] }.

/** Band first, then the note's last edit (newest first) or its name, then the line in the note. */
function sortEntries(list, sort) {
  const by = sort === "name" ? (a, b) => a.note.name.localeCompare(b.note.name) : (a, b) => b.note.mtime - a.note.mtime;
  return [...list].sort((a, b) => a.band - b.band || by(a, b) || a.note.path.localeCompare(b.note.path) || a.item.line - b.item.line);
}

/** f: { q, type, thread (a thread's path), arc, party }. Empty or false filters let everything through. */
function filterEntries(list, f) {
  const q = String(f.q ?? "").trim().toLowerCase();
  return list.filter((e) => {
    if (q && !`${e.item.raw} ${e.note.name}`.toLowerCase().includes(q)) return false;
    if (f.type && e.note.type !== f.type) return false;
    if (f.thread && !e.note.threads.some((t) => t.path === f.thread)) return false;
    if (f.arc && !(e.facts.runningArc || e.facts.linkedFromArc)) return false;
    if (f.party && !e.facts.atParty) return false;
    return true;
  });
}

/**
 * Entries → groups [{ key, label, band?, note?, thread?, entries, collapsed }] for one of the five groupings.
 * maxBand hides bands above it (the compact views). A note on two threads is under both in the Thread grouping.
 */
function groupEntries(list, grouping, sort = "edit", maxBand = 5) {
  const shown = list.filter((e) => e.band <= maxBand);
  const make = (key, label, entries, extra = {}) => ({ key, label, entries: sortEntries(entries, sort), collapsed: false, ...extra });
  const byKey = (keyOf) => {
    const m = new Map();
    for (const e of shown) for (const k of [].concat(keyOf(e))) (m.get(k.key) ?? m.set(k.key, { ...k, entries: [] }).get(k.key)).entries.push(e);
    return [...m.values()];
  };
  const noteOrder = (a, b) => (sort === "name" ? a.entries[0].note.name.localeCompare(b.entries[0].note.name) : b.entries[0].note.mtime - a.entries[0].note.mtime);
  if (grouping === "priority") {
    return [1, 2, 3, 4, 5]
      .map((b) => make(`band${b}`, BAND_NAMES[b], shown.filter((e) => e.band === b), { band: b, collapsed: b === 5 }))
      .filter((g) => g.entries.length);
  }
  if (grouping === "note") {
    return byKey((e) => ({ key: e.note.path, label: e.note.name, note: e.note }))
      .map((g) => make(g.key, g.label, g.entries, { note: g.note }))
      .sort((a, b) => Math.min(...a.entries.map((e) => e.band)) - Math.min(...b.entries.map((e) => e.band)) || noteOrder(a, b));
  }
  if (grouping === "thread") {
    const rank = (s) => (STAGES.includes(s) ? STAGES.indexOf(s) : STAGES.length);
    return byKey((e) => (e.note.threads.length ? e.note.threads.map((t) => ({ key: t.path, label: t.name, thread: t })) : { key: "~none", label: "No thread", thread: null }))
      .map((g) => make(g.key, g.label, g.entries, { thread: g.thread }))
      .sort((a, b) => (a.thread ? rank(a.thread.stage) : 99) - (b.thread ? rank(b.thread.stage) : 99) || a.label.localeCompare(b.label));
  }
  if (grouping === "place") {
    return byKey((e) => (e.note.place ? { key: e.note.place, label: e.note.place } : { key: "~none", label: "No place" }))
      .map((g) => make(g.key, g.label, g.entries))
      .sort((a, b) => (a.key === "~none") - (b.key === "~none") || a.label.localeCompare(b.label));
  }
  return byKey((e) => ({ key: e.note.type, label: e.note.type }))
    .map((g) => make(g.key, g.label, g.entries))
    .sort((a, b) => NOTE_TYPES.indexOf(a.key) - NOTE_TYPES.indexOf(b.key));
}

// ── Reading the vault ─────────────────────────────────────────────

const PARSED = new Map(); // path → { stamp, sess, result }: parsed sections, kept while a note and the session set are unchanged
const SECTION_HINTS = ["open issue", "open question", "open item", "seed", "loose thread", "unresolved element"];
const stampOf = (p) => (p.$mtime?.toMillis ? p.$mtime.toMillis() : String(p.$mtime ?? ""));
const millisOf = (p) => (p.$mtime?.toMillis ? p.$mtime.toMillis() : new Date(p.$mtime).getTime() || 0);
const fileName = (path) => path.split("/").pop().replace(/\.md$/i, "");

/** Whether Datacore's section index says a note might hold one of the sections (or cannot say). */
function mayHaveSections(p) {
  const sections = p.$sections;
  if (!Array.isArray(sections)) return true;
  return sections.some((s) => {
    const title = String(s.$title ?? "").toLowerCase();
    return SECTION_HINTS.some((h) => title.includes(h));
  });
}

/**
 * Every open item in the vault, with the context that puts it in a band.
 * Returns { loading, entries (open items of both kinds), problems, stats, context }.
 */
function useOpenItems() {
  const c = cfg();
  const all = dc.useQuery("@page");
  const { campaign } = useActiveCampaign();
  const { lastPlayed } = useSessionState(campaign?.tag);
  const { arc } = useRunningArc(campaign?.tag);
  const lastText = useNoteText(lastPlayed?.$path);
  const [parsed, setParsed] = dc.useState(null);
  const [stats, setStats] = dc.useState(null);

  const pages = dc.useMemo(() => all.filter((p) => !isExcluded(p) && !inFolder(p, c.folder_player_wiki)), [all]);
  const sessionPaths = dc.useMemo(() => new Set(pages.filter((p) => hasTag(p, c.tag_session)).map((p) => p.$path)), [pages]);
  const picked = dc.useMemo(() => pages.filter(mayHaveSections), [pages]);
  // If the section index narrowed everything away, it is not trustworthy: read every note.
  const indexUsed = picked.length > 0 && picked.length < pages.length;
  const candidates = picked.length || !pages.length ? picked : pages;
  const sessionKey = String(sessionPaths.size);
  const key = candidates.map((p) => `${p.$path}@${stampOf(p)}`).join("|");

  dc.useEffect(() => {
    let live = true;
    (async () => {
      const t0 = performance.now();
      let reads = 0;
      const out = new Map();
      for (const p of candidates) {
        const stamp = stampOf(p);
        let hit = PARSED.get(p.$path);
        if (!hit || hit.stamp !== stamp || hit.sess !== sessionKey) {
          const file = app.vault.getAbstractFileByPath(p.$path);
          const text = file ? await app.vault.cachedRead(file) : "";
          const isSession = (target) => {
            const f = app.metadataCache.getFirstLinkpathDest?.(target, p.$path);
            return !!f && sessionPaths.has(f.path);
          };
          hit = { stamp, sess: sessionKey, result: parseOpenItems(text, isSession, c) };
          PARSED.set(p.$path, hit);
          reads++;
        }
        out.set(p.$path, hit.result);
      }
      if (live) {
        setParsed(out);
        setStats({ candidates: candidates.length, notes: pages.length, reads, ms: Math.round(performance.now() - t0), indexUsed });
      }
    })();
    return () => {
      live = false;
    };
  }, [key, sessionKey]);

  // The location core, rebuilt when any note changes. Without it, no note is placed and no band comes from the party's place.
  const loc = dc.useMemo(() => {
    try {
      return locations();
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [all]);

  return dc.useMemo(() => {
    if (!parsed) return { loading: true, entries: [], problems: [], stats, context: {} };
    const pageByPath = new Map(pages.map((p) => [p.$path, p]));
    const partyPlace = loc && lastPlayed ? partyPlaceOf(loc, lastText, lastPlayed.$path, c) : null;
    const partyName = partyPlace ? stripDmSuffix(partyPlace.name) : "";
    const fileOf = (target, source) => app.metadataCache.getFirstLinkpathDest?.(String(target).replace(/\.md$/i, ""), source) ?? null;
    // A link to a player note counts for its DM twin as well.
    const canon = (file) => {
      if (!file) return null;
      try {
        return loc ? loc.entityOf(file).file.path : file.path;
      } catch (e) {
        return file.path;
      }
    };
    const arcLinked = new Set();
    for (const l of arc?.$links ?? []) {
      const f = fileOf(l.path, arc.$path);
      if (f) arcLinked.add(f.path).add(canon(f));
    }
    const leftOff = new Set();
    if (lastPlayed) {
      for (const target of linkTargets(sectionText(lastText, c.heading_left_off))) {
        const f = fileOf(target, lastPlayed.$path);
        if (f) leftOff.add(f.path).add(canon(f));
      }
    }
    const { plotsOf } = plotConnections(pages, c);
    const stageOf = (p) => STAGES.find((s) => hasTag(p, `${c.tag_plot}/${s}`)) ?? null;
    const types = noteType; // from Note Types
    const sessionLink = (path, target) => {
      const f = fileOf(target, path);
      const sp = f ? pageByPath.get(f.path) : null;
      if (!sp) return null;
      const n = sp.value?.("session_number");
      const label = n !== undefined && n !== null && n !== "" ? `Session ${n}` : stripDmSuffix(sp.$name);
      return { link: sp.$link?.withDisplay ? sp.$link.withDisplay(label) : sp.$link };
    };

    const notes = new Map();
    const entries = [];
    const problems = [];
    for (const [path, result] of parsed) {
      const page = pageByPath.get(path);
      if (!page) continue;
      for (const pr of result.problems) problems.push({ ...pr, path, page, name: stripDmSuffix(page.$name) });
      if (!result.issues.some((i) => i.open) && !result.seeds.some((i) => i.open)) continue;
      const name = stripDmSuffix(page.$name);
      const threads = (plotsOf.get(path) ?? []).map((p) => ({ path: p.$path, name: stripDmSuffix(p.$name), stage: stageOf(p) }));
      if (hasTag(page, c.tag_plot) && !threads.some((t) => t.path === path)) threads.push({ path, name, stage: stageOf(page) });
      let place = null;
      let atParty = false;
      const file = app.vault.getAbstractFileByPath(path);
      if (loc && file) {
        try {
          const w = loc.whereIs(file, { partyPlace });
          place = w.place ? stripDmSuffix(w.place.name) : null;
          atParty = !!partyPlace && loc.within(file, partyPlace, { partyPlace });
        } catch (e) {
          console.error(e);
        }
      }
      const note = {
        path, name, type: types(page), mtime: millisOf(page), place, threads,
        link: page.$link?.withDisplay ? page.$link.withDisplay(name) : page.$link,
      };
      notes.set(path, note);
      const base = {
        runningArc: !!arc && arc.$path === path,
        linkedFromArc: arcLinked.has(path),
        inLeftOff: leftOff.has(path),
        atParty,
        partyName,
        pausedArc: hasTag(page, c.tag_arc) && c.statuses_paused.includes(statusOf(page)),
        threads: threads.filter((t) => t.stage),
      };
      for (const [kind, list] of [["issue", result.issues], ["seed", result.seeds]]) {
        for (const item of list) {
          if (!item.open) continue;
          const facts = { ...base, priority: item.priority };
          const { band, reason } = bandOf(facts);
          entries.push({ id: `${path}:${item.line}`, kind, item, note, facts, band, reason, session: item.session ? sessionLink(path, item.session.target) : null });
        }
      }
    }
    return {
      loading: false, entries, problems, stats,
      context: { arcName: arc ? stripDmSuffix(arc.$name) : "", partyName, lastPlayedName: lastPlayed ? lastPlayed.$name : "" },
    };
  }, [parsed, stats, loc, pages, arc?.$path, lastPlayed?.$path, lastText]);
}

// ── Views ─────────────────────────────────────────────────────────

const CSS = `
.oi-view a.internal-link { text-decoration: none; color: var(--text-normal); }
.oi-view a.internal-link:hover { color: var(--text-accent); text-decoration: underline; }
.oi-view summary { cursor: pointer; }
.oi-view .oi-item p { margin: 0; display: inline; }
`;

const O = {
  bar: { display: "flex", flexWrap: "wrap", gap: "8px 14px", alignItems: "center", margin: "6px 0 10px" },
  seg: { display: "inline-flex", border: "1px solid var(--background-modifier-border)", borderRadius: "6px", overflow: "hidden" },
  segBtn: { padding: "3px 10px", border: "none", background: "transparent", cursor: "pointer", borderRadius: 0, boxShadow: "none" },
  segOn: { background: "var(--interactive-accent)", color: "var(--text-on-accent)" },
  label: { fontSize: "var(--font-ui-smaller)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" },
  search: { flex: "1 1 200px", minWidth: "160px", padding: "4px 8px", borderRadius: "6px" },
  group: { border: "1px solid var(--background-modifier-border)", borderRadius: "8px", padding: "4px 12px", margin: "8px 0", background: "var(--background-secondary)" },
  groupHead: { fontWeight: 600, padding: "4px 0" },
  count: { fontWeight: 400, color: "var(--text-muted)", fontSize: "var(--font-ui-small)" },
  item: { padding: "3px 0", lineHeight: 1.45, borderTop: "1px solid var(--background-modifier-border-hover)" },
  star: { color: "var(--color-orange)", marginRight: "4px" },
  muted: { color: "var(--text-muted)", fontSize: "var(--font-ui-smaller)" },
  body: { margin: "4px 0 6px 18px" },
  list: { margin: "2px 0 4px", paddingLeft: "18px" },
  problem: { color: "var(--text-error)", fontSize: "var(--font-ui-small)", margin: "2px 0" },
  pill: { fontSize: "var(--font-ui-smaller)", padding: "0 6px", borderRadius: "10px", background: "var(--background-modifier-hover)", marginLeft: "6px" },
};
const stageStyle = (stage) => ({ ...O.pill, background: stage ? `rgba(var(--color-${STAGE_COLOR[stage]}-rgb), 0.25)` : O.pill.background });

const GROUPINGS = [["priority", "Priority"], ["note", "Note"], ["thread", "Thread"], ["place", "Place"], ["type", "Type"]];
const SORTS = [["edit", "Newest edit first"], ["name", "Note name"]];

/** Choices kept per device (Obsidian's local storage); the page works without it. */
const remember = {
  get(storeKey, name, fallback, allowed) {
    try {
      const v = app.loadLocalStorage?.(`open-issues:${storeKey}:${name}`);
      return v && (!allowed || allowed.includes(v)) ? v : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(storeKey, name, value) {
    try {
      app.saveLocalStorage?.(`open-issues:${storeKey}:${name}`, value);
    } catch (e) {}
  },
};

function Md({ text, source }) {
  return text ? <dc.Markdown content={text} inline={true} sourcePath={source} /> : null;
}

function ThreadPills({ threads }) {
  const shown = threads.slice(0, 2);
  return (
    <span>
      {shown.map((t) => (
        <span key={t.path} style={stageStyle(t.stage)} title={t.stage ? `${t.stage} thread` : "thread"}>
          {t.name}
        </span>
      ))}
      {threads.length > 2 ? <span style={O.pill}>{`+${threads.length - 2}`}</span> : null}
    </span>
  );
}

function GroupTitle({ g }) {
  if (g.note) {
    return (
      <span>
        <dc.Link link={g.note.link} />
        <span style={O.pill}>{g.note.type}</span>
        <ThreadPills threads={g.note.threads} />
        {g.note.place ? <span style={O.muted}>{` · ${g.note.place}`}</span> : null}
      </span>
    );
  }
  if (g.thread) {
    return (
      <span>
        {g.label}
        {g.thread.stage ? <span style={stageStyle(g.thread.stage)}>{g.thread.stage}</span> : null}
      </span>
    );
  }
  return <span>{g.label}</span>;
}

function ItemRow({ e, showNote }) {
  const it = e.item;
  const more = it.text !== it.first || it.details.length > 0;
  const line = (
    <span>
      {it.priority ? (
        <span style={O.star} title="Flagged with **Priority">
          ★
        </span>
      ) : null}
      <Md text={it.first} source={e.note.path} />
      {showNote ? (
        <span style={O.muted}>
          {" · "}
          <dc.Link link={e.note.link} />
        </span>
      ) : null}
      {e.reason ? <span style={O.muted}>{` · ${e.reason}`}</span> : null}
      {e.session ? (
        <span style={O.muted}>
          {` · ${e.kind === "seed" ? "planted in" : "raised in"} `}
          <dc.Link link={e.session.link} />
        </span>
      ) : null}
    </span>
  );
  if (!more) return <div className="oi-item" style={O.item}>{line}</div>;
  const rest = it.text.slice(it.first.length).trim();
  return (
    <details className="oi-item" style={O.item}>
      <summary>{line}</summary>
      <div style={O.body}>
        {rest ? <Md text={rest} source={e.note.path} /> : null}
        {it.details.length ? (
          <ul style={O.list}>
            {it.details.map((d, i) => (
              <li key={i}>
                <Md text={d} source={e.note.path} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </details>
  );
}

function Problems({ problems }) {
  if (!problems.length) return null;
  return (
    <div style={{ marginTop: "18px" }}>
      <div style={O.label}>{`Format problems (${problems.length})`}</div>
      <div style={O.muted}>Lines the collector cannot read. Fix them in the note and they appear in the lists above.</div>
      {problems.map((p, i) => (
        <div key={i} style={O.problem}>
          <dc.Link link={p.page.$link.withDisplay ? p.page.$link.withDisplay(p.name) : p.page.$link} />
          {` · line ${p.line} · `}
          {p.kind === "near-miss heading" ? `heading "${p.text}" is not one of the two section headings` : `plain line under ${p.section}, needs "- [ ]": ${p.text.length > 90 ? `${p.text.slice(0, 89)}…` : p.text}`}
        </div>
      ))}
    </div>
  );
}

function FullLink({ name }) {
  return <dc.Markdown content={`[[${name}|Full view]]`} inline={true} sourcePath={dc.currentPath ? dc.currentPath() : ""} />;
}

const FULL = { storeKey: "full", grouping: "priority", maxBand: 5, filters: true, problems: true, stats: true, switchBar: true, groupingBar: true, fixedKind: null };
// The compact view (Session Hub and 00 DM Screen hub): Issues and Seeds side by side, bands 1 and 2.
const SESSION = { ...FULL, storeKey: "session", grouping: "priority", maxBand: 2, filters: false, problems: false, stats: false, switchBar: false, groupingBar: false };

/** The lists, switch, groupings and filters over data from useOpenItems(). options: see FULL. */
function OpenIssuesPanel({ data, options = FULL }) {
  const o = { ...FULL, ...options };
  const [kindState, setKindRaw] = dc.useState(() => remember.get(o.storeKey, "kind", "issue", ["issue", "seed"]));
  const [groupingState, setGroupingRaw] = dc.useState(() => remember.get(o.storeKey, "grouping", o.grouping, GROUPINGS.map((g) => g[0])));
  const kind = o.fixedKind ?? kindState;
  const grouping = o.groupingBar ? groupingState : o.grouping;
  const [sort, setSortRaw] = dc.useState(() => remember.get(o.storeKey, "sort", "edit", SORTS.map((s) => s[0])));
  const [filter, setFilter] = dc.useState({ q: "", type: "", thread: "", arc: false, party: false });
  const setKind = (v) => (setKindRaw(v), remember.set(o.storeKey, "kind", v));
  const setGrouping = (v) => (setGroupingRaw(v), remember.set(o.storeKey, "grouping", v));
  const setSort = (v) => (setSortRaw(v), remember.set(o.storeKey, "sort", v));
  const patch = (p) => setFilter({ ...filter, ...p });

  if (data.loading) return <div style={O.muted}>Reading notes…</div>;
  const ofKind = data.entries.filter((e) => e.kind === kind);
  const shown = filterEntries(ofKind, filter);
  const groups = groupEntries(shown, grouping, sort, o.maxBand);
  const lower = o.maxBand < 5 ? shown.filter((e) => e.band > o.maxBand).length : 0;
  const count = (k) => data.entries.filter((e) => e.kind === k).length;
  const types = [...new Set(ofKind.map((e) => e.note.type))].sort((a, b) => NOTE_TYPES.indexOf(a) - NOTE_TYPES.indexOf(b));
  const threads = [...new Map(ofKind.flatMap((e) => e.note.threads).map((t) => [t.path, t])).values()].sort((a, b) => a.name.localeCompare(b.name));
  const ctx = data.context;
  const seg = (items, value, set) => (
    <span style={O.seg}>
      {items.map(([k, label]) => (
        <button key={k} style={{ ...O.segBtn, ...(value === k ? O.segOn : {}) }} onClick={() => set(k)}>
          {label}
        </button>
      ))}
    </span>
  );
  return (
    <div className="oi-view">
      <style>{CSS}</style>
      {o.switchBar || o.groupingBar ? (
        <div style={O.bar}>
          {o.switchBar ? seg([["issue", `Issues (${count("issue")})`], ["seed", `Seeds (${count("seed")})`]], kind, setKind) : null}
          {o.groupingBar ? seg(GROUPINGS, grouping, setGrouping) : null}
        </div>
      ) : null}
      {o.filters ? (
        <div style={O.bar}>
          <input type="search" placeholder="Search items and notes" value={filter.q} onInput={(e) => patch({ q: e.currentTarget.value })} style={O.search} />
          <select value={filter.type} onChange={(e) => patch({ type: e.currentTarget.value })}>
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select value={filter.thread} onChange={(e) => patch({ thread: e.currentTarget.value })}>
            <option value="">All threads</option>
            {threads.map((t) => (
              <option key={t.path} value={t.path}>{t.name}</option>
            ))}
          </select>
          <label title={ctx.arcName ? `The running arc: ${ctx.arcName}, and notes it links to` : "No running arc"}>
            <input type="checkbox" checked={filter.arc} onChange={(e) => patch({ arc: e.currentTarget.checked })} /> Running arc
          </label>
          <label title={ctx.partyName ? `At or inside ${ctx.partyName}` : "No party location in the last session"}>
            <input type="checkbox" checked={filter.party} onChange={(e) => patch({ party: e.currentTarget.checked })} /> Where the party is
          </label>
          <select value={sort} onChange={(e) => setSort(e.currentTarget.value)} title="Order inside each group, after the band">
            {SORTS.map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
      ) : null}
      {groups.length === 0 ? (
        <div style={O.muted}>
          {ofKind.length
            ? lower
              ? `Nothing flagged or tied to the next session; ${lower} more in the full view.`
              : "Nothing matches the filters."
            : kind === "seed"
            ? "No open seeds yet. Add a ## Seeds Planted section to a note."
            : "No open issues."}
        </div>
      ) : (
        groups.map((g) => (
          <details key={`${kind}:${grouping}:${g.key}`} open={!g.collapsed} style={O.group}>
            <summary style={O.groupHead}>
              <GroupTitle g={g} />
              <span style={O.count}>{` · ${g.entries.length}`}</span>
            </summary>
            <div>
              {g.entries.map((e) => (
                <ItemRow key={e.id} e={e} showNote={grouping !== "note"} />
              ))}
            </div>
          </details>
        ))
      )}
      {groups.length && lower ? <div style={O.muted}>{`${lower} more in lower bands, in the full view.`}</div> : null}
      {o.problems ? <Problems problems={data.problems} /> : null}
      {o.stats && data.stats ? (
        <div style={{ ...O.muted, marginTop: "14px" }}>
          {`Read ${data.stats.reads} of ${data.stats.candidates} candidate notes (${data.stats.notes} in the vault) in ${data.stats.ms} ms${data.stats.indexUsed ? "; Datacore's section index narrowed the list" : "; no section index, every note checked"}.`}
        </div>
      ) : null}
    </div>
  );
}

/** The full view: every band, all five groupings, filters and the format problems. */
function OpenIssuesFull() {
  const data = useOpenItems();
  return <OpenIssuesPanel data={data} options={FULL} />;
}

/**
 * The compact view on the Session Hub and the 00 DM Screen hub: Issues and Seeds side by side, Priority grouping, bands 1 and 2,
 * with a link to the full view.
 */
function OpenIssuesCompact() {
  const data = useOpenItems();
  return (
    <div>
      <div style={{ margin: "0 0 4px" }}>
        <FullLink name="Open Issues" />
      </div>
      <Row>
        <Cell title="Open issues" grow={1} min={320}>
          <OpenIssuesPanel data={data} options={{ ...SESSION, fixedKind: "issue" }} />
        </Cell>
        <Cell title="Seeds planted" grow={1} min={320}>
          <OpenIssuesPanel data={data} options={{ ...SESSION, fixedKind: "seed" }} />
        </Cell>
      </Row>
    </div>
  );
}

return { PRIORITY_RE, NEAR_MISS_HEADINGS, parseOpenItems, bandOf, sortEntries, filterEntries, groupEntries, useOpenItems, OpenIssuesPanel, OpenIssuesFull, OpenIssuesCompact };
```
