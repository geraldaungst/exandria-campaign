---
hide_from_related: true
---

**Purpose:** The code behind the Open Issues collector ([[Open Issues Spec]]): reads the `## Open Issues` and `## Seeds Planted` sections of a note into items. This version holds the parser only (build step 2); the context, bands and views are added in later build steps.

**Exports:** `PRIORITY_RE`, `NEAR_MISS_HEADINGS`, `parseOpenItems`

**Depends on:** [[Shared Helpers]] (and [[Hub Config]] through it)

**Used by:** nothing yet

Conventions this module relies on:

- **Sections.** A heading at any level (`#` to `######`) whose text, without regard to case, is `heading_open_issues` or `heading_seeds` in [[Hub Config]]. The section ends at the next heading of any level. Headings inside code fences and inside comments are ignored; so is the note's frontmatter.
- **Items.** A top-level checklist line directly under the heading: `- [ ] text`. Ticked is any character other than a space. Nested lines, and unindented text that follows an item without a blank line, are its `details`. An empty `- [ ]` (the template placeholder), plain text lines (labels) and callout lines are ignored.
- **Priority.** `**Priority` anywhere in the line, without regard to case (`PRIORITY_RE`); the label is taken out of `text`. The label word itself comes from `label_priority` in Hub Config, which is read when the views are built; `PRIORITY_RE` is fixed so a capture at the table needs no syntax.
- **Session link.** When the line ends with a link and `isSession(target)` says the target is a session note, the link is returned as `session` and taken out of `text`.
- **Format problems.** A plain bullet or numbered line directly under either heading, and a near-miss heading (`NEAR_MISS_HEADINGS`: Open issue, Open question(s), Open item(s), Seeds, Seed planted, Loose Threads, Unresolved Elements, and a heading that is the link `[[Seeds Planted]]`). Each is returned in `problems` with its line number.
- **Line numbers.** Comments are blanked with their line breaks kept, so `line` is the line in the note as the editor shows it. (Shared Helpers' `stripComments` removes the breaks and would shift every number after a multi-line comment.)
- **Not read.** The Shard notes' `## Who knows` lines, `## Design To-Dos`, `## Player Theories`, the hook headings and the other headings listed in the spec's section 2.7.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Open Issues Views.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

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

return { PRIORITY_RE, NEAR_MISS_HEADINGS, parseOpenItems };
```
