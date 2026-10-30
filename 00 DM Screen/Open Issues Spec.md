---
hide_from_related: true
---

## Open Issues Spec

Build spec for the Open Issues collector in Gerald's DM vault: the two note sections it reads (Open Issues and Seeds Planted), the code that collects them into one view with priority bands, the compact views on both hubs, the template changes and the rescan of existing notes. Written 2026-10-30 (Opus) so that a conversation with no access to the design conversation can build from it. Decisions here are final; anything not decided is under "Ask Gerald". Where this note and [[Vault Conventions - DM]] disagree, raise it with Gerald before building.

**Status (2026-10-30):** designed; build steps 1 to 4 of 8 done (config keys and Shard heading; parser, tests, review file; shared pieces exported; full view), step 4 Obsidian check pending. Sentences in section 1 that name `heading_track_questions`, `heading_piece_questions` or `## Open questions` describe the vault before step 1.

**Goal (Gerald, 2026-10-23):** seeds and threads that were set aside stay in front of Gerald at session planning, found automatically, with no tracking note updated by hand.

### 1. Context for a new reader

Read section 1 of [[Location Engine Spec]] first: it describes the vault, the plugins (Datacore 0.1.29, Templater, Bases, Calendarium, Linter), where code lives (`00 DM Screen/Code/`, loaded with `dc.require(dc.headerLink(…, "Code"))`), [[Hub Config]] and [[Shared Helpers]], twins, campaign state and the working rules. Then read the Working rules in [[Vault Reorganization Status - DM]] in full. This build follows them: draft before writing, backups ending in `.bak`, link scan at 0 new, mock tests, Obsidian closed during edits, a Phase log line per batch.

What exists today and is reused:
- [[Progress Tracks]] reads a tracker's `## Open Issues` tasks (`heading_track_questions`); only the Aveqtaro Memory Recovery Tracker uses it.
- [[Artifact Pieces]] reads each Shard note's `## Open questions` tasks (`heading_piece_questions`), shown by [[Artifact Hub Views]]. It also reads the `## Who knows` lines as data (`parseKnows`).
- [[Plot Dashboard Views]] works out which notes connect to each plot thread (the note links to the thread, or the thread links to it).
- [[Session Hub Table]] works out the party's place (the `Party location` label under "Where we left off" in the last played session, resolved by the location core).
- [[Campaign State]] gives the running arc (`useRunningArc`); [[Note Types]] gives a note's type (`noteType`).
- [[Hub Layout]] gives the `Row` and `Cell` used on both hubs.

The vault on 2026-10-30: 75 notes have an Open Issues section (69 at `##`, 6 at `###`), plus the 8 Shard notes' `## Open questions`. They hold 198 open tasks, 2 ticked tasks and 15 plain bullets (in Deastok Investigation, Rescue Ilya's Brother, Search for the Stonefoot Compass, Character Story Beats and [[Understanding the Rifts]]). No template has the section.

### 2. Data model (decided)

Gerald's decisions of 2026-10-30, numbered as in the design conversation.

#### 2.1 The two sections

- **Open Issues** (`heading_open_issues`): campaign questions Gerald hasn't decided yet. The marker was decided 2026-10-23; "Offstage, to decide." and similar plain text under it is a label.
- **Seeds Planted** (`heading_seeds`): things put in front of the players that they may or may not take up (decision 7b). They are not decisions and are never mixed into the issue list. Many will never resolve, and that is expected.
- **Hooks and seeds:** a hook (the hook menus on place and faction notes) is an option the players haven't seen. Once Gerald uses a hook at the table, it becomes a seed on that note.
- **Where they go:** on the note the issue or seed concerns, on any note type (decision 1 of the brief; Gerald: "potentially any note"). Notes in folders starting with `z_` and in `Player Wiki/` are not read.
- **Heading:** any level (`##` or `###`), heading text matched without regard to case. The section ends at the next heading of any level, so a `### Reference Notes` below a `## Open Issues` is not part of it.

#### 2.2 Items (decision 1)

- An item is a top-level checklist line, `- [ ] text`, directly under the heading. Nested lines under it are its details.
- Plain text lines (labels such as "Offstage, to decide.") and HTML comments are ignored. An empty `- [ ]` (the template placeholder) is ignored.
- A plain bullet or a numbered line directly under either heading is a **format problem** (2.6), listed on the full view so nothing disappears.

#### 2.3 Closing (decisions 1, 2, 7b and Gerald's additions)

- Ticked (`[x]`, any character other than a space) means closed. The answer goes after the question in the same line: "Yes, from 26–27 Thunsheer 835; see [[Qalix's Network]]". Closed lines stay in the note as the record; the collector does not show them.
- An issue Gerald drops: tick it and add `(Dropped.)`.
- A question Gerald decides to leave for play and player theories to settle (decision 2): tick it and add `(Left to play.)`. There is no separate kind for these.
- A seed is ticked when the party takes it up (it may turn into an issue, a thread or an arc) or when it can no longer be taken up (the NPC died, the window closed), with `(Dropped.)`. A seed is never ticked because time passed.
- These words are for Gerald; the code reads only the tick.

#### 2.4 Priority (decision 9)

- One manual level: any item whose text contains `**Priority` (the regular expression `/\*\*\s*priority/i`), anywhere in the line. The closing `**` can sit before or after the colon or at the end of the line, and the label can start or end the line. Gerald must not have to think about the syntax while capturing at the table.
- The word is `label_priority` in Hub Config. The view shows a priority mark and leaves the label out of the displayed text.
- Works on seeds too.
- Not a tag: an inline tag would make Obsidian treat the whole note as tagged (search, tag pane, Bases), would stay on the note after the issue closed, and would use up the name `#priority` for the vault.
- A second level, if ever needed, is a second label (for example `**Priority 2`), added later.

#### 2.5 Session link

- An item whose last field is a link to a note tagged `session` shows it as "raised in Session N" (issues) or "planted in Session N" (seeds), as [[Artifact Pieces]] already does for Shard questions. Optional, never required.

#### 2.6 Format problems

Listed at the bottom of the full view, each with its note:
- a plain bullet or numbered line directly under Open Issues or Seeds Planted;
- a near-miss heading: `Open issue`, `Open question(s)`, `Open item(s)`, `Seeds`, `Seed planted`, `Loose Threads`, `Unresolved Elements`, `[[Seeds Planted]]` (a heading that is a link). Constants in the code module, listed in its documentation.

#### 2.7 What the collector does not read

- The Shard notes' `## Who knows` lines (decision 3). They record what someone knows now; [[Artifact Change Form]] rewrites them, so a tick would mean nothing. They stay plain bullets for good, as a permanent exception to the checklist convention in Vault Conventions.
- The Arc template's `## Design To-Dos` (work on the arc document, not campaign questions; decision 7).
- `## Player Theories`, the hook headings (`Potential Plot Hooks`, `Adventure Hooks`, `Hooks`, `Plot Hooks`), `Future Developments`, `Future Plans`, `Future Role in Campaign`, the PC theme headings and `Next Move` (decision 7 follow-up).

#### 2.8 Views (decisions 4, 5, 8 and 10)

- **Datacore only.** Bases cannot read note text, so it cannot tell which notes have open items. There is no Bases view. What Gerald gives up: Bases' column menus and saved views. The Datacore view supplies the groupings, filters and sorts below.
- **Two lists:** an **Issues | Seeds** switch. Seeds use the same groupings, filters and bands.
- **Groupings** (switch, remembered per device): Priority, Note, Thread, Place, Type.
  - **Priority:** the bands in 2.9.
  - **Note:** one group per note. Header line: the note name (link), a short type label, up to two thread names coloured by stage and "+n" for more, and the nearest place name only ("Deastok", not the whole trail). Under it, the note's items.
  - **Thread:** one group per plot thread, by stage (active, upcoming, seed, paused, then "No thread"). A note connected to two threads is under both (Gerald's rule: a connected note is listed under every item it relates to, never as a count).
  - **Place:** by nearest place; "No place" last.
  - **Type:** NPC, Location, Arc and so on, from [[Note Types]].
  - Outside the Note grouping, each item shows its note's name in muted text.
- **Items** show their first sentence; a click shows the full text and the details. A group can collapse to its header, which then shows how many items it holds.
- **Filters:** text search, type, thread, "Running arc", "Where the party is".
- **Sort** inside each group: band first, then the note's last edit (newest first), or the note's name.

#### 2.9 Priority bands (decision 10)

Each item goes in the first band it qualifies for. Every rule uses links, tags and properties the vault already keeps; nothing is filled in by hand except the Priority label.

1. **Flagged:** the item has the Priority label.
2. **Next session:** its note is the running arc; or a note the running arc links to; or a note linked from the last played session's "Where we left off" section; or a note whose place is the party's place or inside it (the location core's `within`, with `partyPlace`; place notes count as their own place).
3. **Active threads:** its note connects to a `plot/active` thread, or is one.
4. **Upcoming:** its note connects to a `plot/upcoming` thread, or is one, or is an arc whose `status` is in `statuses_paused`.
5. **Everything else:** collapsed by default, one click to open.

Bands 2 to 4 show the reason in muted text: "linked from the running arc", "at the party's location: Deastok", "thread: Understanding the Rifts (active)". Not built: reading in-world deadlines from item text (Gerald flags those by hand).

#### 2.10 Where the views live (decision 8, with Gerald's change)

- **Full view:** a new note, `00 DM Screen/Open Issues.md`. Opens on Priority, every band shown, "Everything else" collapsed, the format problems at the bottom.
- **Compact view on the Session Hub** (under `## Prep`, after the Prep block): Priority grouping, bands 1 and 2, Issues and Seeds side by side.
- **Compact view on the 00 DM Screen hub** (a new `## Open issues` section after `## Active plot threads`): Thread grouping, active and upcoming threads, sorted by band, with the Issues | Seeds switch.
- Both compact views carry a "Full view" link to the full view in their header. The 00 DM Screen hub also gets a plain link to it.
- Not in the Session template: an embedded live list would show today's issues in every old session note.

#### 2.11 Templates (decision 6, and 7 and 7b)

- NPC, Location, Faction, Artifact-Item, Plot Thread, Arc, Encounter and Atomic Note templates get, just above `## Connected Elements` (at the end where there is none), at the same heading level as Connected Elements:
  ```
  ## Open Issues

  - [ ]

  ## Seeds Planted

  - [ ]
  ```
- Arc template: `## Loose Threads` is removed (its lines are seeds); its comment ("what this arc leaves open for later arcs") moves under Seeds Planted. `## Design To-Dos` stays.
- Session and Campaign templates get no section. The Session template's "After the Game" list gets two lines: `- [ ] Move open questions from the session log to their notes' Open Issues` and `- [ ] Add tonight's seeds to their notes' Seeds Planted, with the session link`.
- Existing notes get a section only when they get an item, or when a pass rewrites them to their template. No bulk addition.
- Quick Capture stubs take their body from the templates ([[Quick Capture]] `templateBody`), so stubs get both sections.

### 3. Hub Config and shared changes

- **Add** to Hub Config and to Shared Helpers' `CONFIG_DEFAULTS`: `heading_open_issues: Open Issues`, `heading_seeds: Seeds Planted`, `label_priority: Priority`. Describe them in Hub Config's "What each group means".
- **Retire** `heading_track_questions` and `heading_piece_questions`. [[Progress Tracks]], [[Artifact Pieces]] and [[Artifact Hub Views]] read `heading_open_issues` instead. Their displayed section title becomes "Open Issues". Their task readers already treat ticked as closed; leave them otherwise unchanged.
- **Plot connections:** move the connection logic out of `PlotDashboard` into an exported function in [[Plot Dashboard Views]] (for example `plotConnections(pages, c)`, returning each plot's connected pages and each page's plots). The dashboard uses it unchanged; the collector uses the same function. No copy.
- **Party place:** export the party-place rule from [[Session Hub Table]] (it is computed inside `WhereAreWe` today) as one function, used by the collector. Switch the existing callers to it only where that changes nothing.
- No new frontmatter properties and no new tags.

### 4. The code module

`00 DM Screen/Code/Open Issues Views.md` (the name keeps it apart from the view note `Open Issues`; links resolve by name). Same layout as the other code notes: Purpose, Exports, Depends on, Used by, Conventions, then one `jsx` block under `## Code`.

- **Reading:** pages from `dc.useQuery("@page")`, minus excluded folders and `Player Wiki/`. Note text read with `app.vault.cachedRead` in an effect, as `usePieces` in [[Artifact Pieces]] does, cached by path and mtime. If Datacore 0.1.29's section index can narrow the notes to those with a matching or near-miss heading, use it; probe it first and say what was found. Measure the full read on the real vault and report the time.
- **Parser** (pure, testable): `parseOpenItems(text)` → `{ issues, seeds, problems }`. Each item: `text` (label removed), `first` (first sentence), `details`, `open`, `priority`, `session`, `raw`, `line`. Uses `stripComments` from Shared Helpers.
- **Context:** running arc and its links, last played session's "Where we left off" links, party place, thread connections with stages, note type, nearest place (location core `whereIs`, then the place name).
- **Exports:** `parseOpenItems`, `bandOf`, `useOpenItems`, `OpenIssuesFull`, `OpenIssuesCompact` (props: `preset` of `"session"` or `"screen"`).
- **Remembered choices:** the grouping and the Issues | Seeds switch are saved per device with `app.saveLocalStorage` / `app.loadLocalStorage` when they exist (wrapped in try/catch); otherwise they last for the session. Never a plugin settings file.

### 5. Documentation

- [[Vault Conventions - DM]], Ruled: the two sections and what goes in each; closing with the tick, `(Dropped.)` and `(Left to play.)`; the Priority label; hooks versus seeds; the Who knows lines as a permanent exception (rewrite the checklist line that now calls them pass-related).
- [[Hub Config]] prose for the new and retired keys.
- [[DM Hubs Design]]: the module in the code list, a short section for the collector, and the two compact views in the hub tables.
- The Purpose and Conventions text of every changed code note.
- [[Vault Reorganization Status - DM]]: Project map, Phase log, Parked rows.

### 6. Migration (the rescan)

Each step is a batch: dry-run script, backups, Gerald's approval, link scan, Phase log line.

0. **Inventory** (read-only, from the parser in step 2 of the build order): every section, its items and problems, near-miss headings, and the candidates in steps 3 and 4. Written to `z_Reference/Open Issues Review.md` (no frontmatter) as tables Gerald can edit, with a proposed action per line.
1. **Shard heading:** rename `## Open questions` to `## Open Issues` in the 8 Shard notes, in the same batch as the Hub Config change (build step 1), so the Lorestone hub never loses its questions.
2. **Format fixes:** the 15 plain bullets become tasks. Understanding the Rifts' plain questions under the comment "Deliberately undecided. Let play, and player theories, settle these" become `- [x] … (Left to play.)` where Gerald confirms in the review file, and the comment goes. The Rendspawn line's `**Top priority:**` becomes `**Priority:**`.
3. **Seeds:** the Seeds Planted note's lines, Session 17's "Unresolved Elements" line about Radelia Caphax, and the Loose Threads of Deastok Investigation and Gnurlsotten's Nosh and Nip Arc move into Seeds Planted sections on the notes they concern (proposed per line in the review file; the arc itself where no better note exists), with a session link where the review file names one. Then remove the 5 empty `## [[Seeds Planted]]` headings (Aethor Kalisk's Secret Mission, Session 6 and the three prologues) and move the Seeds Planted note to `z_Archive/`.
4. **Questions outside the sections:** search DM notes for unanswered campaign questions and seeds outside these sections (lines with a question mark, "undecided", "TBD", "not decided", "unknown", "to decide", "if the party ever"), skipping dialogue menus, boxed text, Track These and other play material, and completed session notes for seeds never followed up. Gerald decides per line, in batches, which become items and on which note.
5. **Checkpoint** per the status note's rules.

### 7. Ask Gerald (not decided)

- The per-line decisions in migration steps 2 to 4.
- The wording of the two "After the Game" lines, if they read badly.
- Anything this spec does not cover.

### 8. Testing

**Mock harness** (Node, kept in `.scripts/open_issues_tests/`):
- **Parser cases:** `##` and `###` headings in any case; the section ending at a heading of any level; labels and comments ignored; empty task ignored; nested details; ticked lines with `(Dropped.)`; the Priority label at the start, at the end, with `**Priority:**`, `**Priority**:`, `**priority`, and inside other text; a trailing session link; plain and numbered lines as problems; each near-miss heading; a Seeds Planted section next to an Open Issues section; a note with neither.
- **Band cases** on synthetic pages: each rule in 2.9, an item that meets several (first band wins), a paused arc, a note on two threads, a note with no place.
- **Full-vault run** (read-only): counts of sections, open and closed items, problems, and the time taken. Run it before and after the migration.

**Only testable in Obsidian:** Datacore rendering, the remembered grouping, the hub embeds, Templater output, Quick Capture stubs. Say so in each batch report.

### 9. Build order and Gerald's checks

1. **Config and Shard heading:** Hub Config and Shared Helpers keys; [[Progress Tracks]], [[Artifact Pieces]] and [[Artifact Hub Views]] switched to `heading_open_issues`; the 8 Shard headings renamed (migration step 1). Gerald opens the Lorestone Shard Status Tracker (Shard 6's open question shows under Open Issues) and the Aveqtaro Memory Recovery Tracker.
2. **Parser and mock tests; full-vault run;** the review file (migration step 0).
3. **Shared pieces:** plot connections and party place exported, nothing else changed. Gerald opens the Plot Dashboard and the Session Hub and sees no change.
4. **Full view:** the module and `00 DM Screen/Open Issues.md`. Gerald checks each grouping, the Issues | Seeds switch, the filters, the bands and their reasons, the format problems, and that the grouping is remembered after reopening.
5. **Compact views** on the Session Hub and the 00 DM Screen hub, with the "Full view" links.
6. **Templates:** the eight templates, the Arc template's Loose Threads, the Session template's two lines. Gerald runs each changed template once in a scratch folder and makes one Quick Capture NPC stub.
7. **Migration** steps 2 to 4, one batch each.
8. **Documentation** (section 5) and the Checkpoint.

### 10. Later (not in this build)

- In-world deadlines read from item text.
- A second priority level (2.4).
- If the location plugin is built (Gerald's learning project), the collector's reading could move into it.
