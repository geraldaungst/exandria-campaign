---
created: 2026-10-19
hide_from_related: true
---

## DM Hubs Design

Design spec for the two hubs. Review once, then build in the order at the bottom. Decisions made here are final unless this note changes.

### The two hubs

| Hub | Job | When |
|---|---|---|
| [[00 DM Screen]] | Campaign overview and long-horizon work: where things stand, then a workbench per activity | Between sessions |
| [[Session Hub]] | Everything about the next session: prep before the game, table references and quick capture during it | Prep night and game night |

- The DM Screen's top screen is the overview. A separate overview page becomes worthwhile only when a second campaign is running; at that point the DM Screen becomes the cross-campaign overview and each campaign gets its own planning hub.
- During play, the Session Hub sits in its own window next to Roll20, with tonight's session note in a second pane. The Session Hub holds what's the same every night; the session note holds tonight.

### Rules every section follows

- Bases first. Datacore 0.1.29 only where Bases can't do the job; each row below says why.
- No section depends on fields updated by hand. Allowed: tags, links, mtime, properties set once at creation, and the one-time after-game entries in the session note.
- Connected notes are listed under every item they relate to, never shown as counts.
- Shared code lives in code notes in `00 DM Screen/Code/` (one module per responsibility: [[Shared Helpers]], [[Campaign State]], [[Calendar and Timeline]], [[Note Types]], [[Arc and Session Views]], [[DM Screen Views]], [[Plot Dashboard Views]], [[Session Hub Views]], [[Session Hub Table]], [[Quick Capture]], [[Reference Lists]], [[Section Picker]], [[Hub Layout]], [[Item Data]], [[Item Finder]], [[Treasure Roll]], [[Trap Roll]], [[Party Card]], [[Diagnostics]], [[NPC Browser]], [[Artifact Pieces]], [[Artifact Hub Views]], [[Artifact Change Form]]) and loads with `dc.require`, so the hubs use the same logic. Every tag, folder, heading, and status name comes from [[Hub Config]] (properties only), which the code notes and templates read.

### Shared logic

| Piece | Rule | Used by |
|---|---|---|
| Last played session | Highest `session_number` with `date` on or before today | Both hubs |
| Next session | Lowest `session_number` with `date` after today; if none, a "Create next session" button | Both hubs |
| Today in-world | Last played session's `fc-end` plus `ingame_time` | Both hubs, quick capture |
| Running arc | Arc with `status: running` (never more than one) | Both hubs |
| Note type | Formula from tags and folder, matching [[Related Notes.base]] | Recent Work, workbenches |

### New conventions

- **Campaign notes** (added 2026-10-20): each campaign folder's folder note is tagged `campaign-hub` plus exactly one `campaign/…` tag (the one its sessions and arcs carry), and holds `calendar`, `timeline`, `status`, and `world` (the name of its folder under `Worlds/`; quick capture uses it for the world tag and the faction folder). The hubs follow the campaign with `status: active`; the Session, Arc, and Close Session templates take the campaign's tag, calendar, and timeline from it; nothing in code names a world or campaign. New campaigns come from the Campaign Template. Anything else on a campaign note is free-form and ignored by the automation.

| Convention | Set by | When |
|---|---|---|
| `fc-date` (in-game start) | Session template copies the previous session's `fc-end` | Note creation |
| `fc-end` (in-game end) | "Close session" picker: Same day (default) · Long rest, next day · More days → number | After the game |
| `ingame_time` | Same picker, second step: Morning · Afternoon · Evening · Night | After the game |
| `fc-calendar`, `fc-category` | Session template | Note creation |
| `improvised` tag, `first_session` link | Quick capture | Note creation |
| PC links in session notes | You, in "Where we left off" (template hint added) | After the game |

- Calendarium needs frontmatter events turned on, with Session Notes (and quick-capture event notes) in its paths. Exact `fc-date` format for the Exandrian calendar to be confirmed at build.
- The "Close session" picker writes only those three date fields, then offers to append events to [[Eryndor Timeline]].
- Campaign events live in [[Eryndor Timeline]] as Calendarium inline events (the note is tagged `inline-events`), one line per event; Close Session and quick capture append to it.

### 00 DM Screen

#### Top screen (no scrolling)

| Section | Shows | Data | Engine |
|---|---|---|---|
| Header strip | Last played (date, in-world date and time), next session (date, link to prep), link to Session Hub | Shared logic | Datacore |
| Where we left off | Embedded section of the last played session | Shared logic | Datacore (Bases can't embed a heading of a computed note) |
| Running arc | Arc, status, unrevealed Fact Map clues; paused and abandoned arcs with what they share | `ArcClues`, `RelatedArcs` in [[Arc and Session Views]] | Datacore (exists) |
| Active plot threads | Active threads, each with its connected NPCs, items, locations, factions, lore | Plot Dashboard logic, moved to a shared component | Datacore |
| Recent work | 15–20 notes by last edit; the view dropdown is the type filter: All · Sessions · Arcs and threads · NPCs · Lore and Keln · Player wiki · Maintenance | mtime, type formula | Bases |

#### Workbenches (callouts below the top screen, folded by default)

| Workbench | Contents | Engine |
|---|---|---|
| Campaign planning | Arcs grouped by status (idea, designing, ready, paused, abandoned); full [[Plot Dashboard]]; [[Seeds Planted]]; open hooks (`hook`, `offscreen` tags); unrevealed clues across all arcs | Bases (arcs, hooks); Datacore (clues across arcs) |
| Characters | Party sheets; recently seen NPCs (linked from the last 3 played sessions); NPCs tagged `needs-work`; improvised backlog grouped by `first_session` | Bases, except recently seen (Datacore: needs links from a computed set of notes) |
| Encounters | [[Encounter Design Guide]], Encounter Template, [[Party Card Data]], [[NPC Stat Block Reference Table]], `Characters/Creatures` | Links and Bases |
| Lore and Keln | `lore` notes; `world/keln` notes by last edit; [[Kanka_Master_Build_List]] | Bases |
| Player wiki | [[Player Wiki/Index\|Player Wiki Index]], [[The World of Exandria]], ledger and scope checklist; wiki drift (DM note edited after its player twin) | Bases; drift in Datacore unless Bases can compare two files |
| Vault maintenance | `needs-work` notes, maintenance backlog (below), [[DM_Vault_Reorganization_Plan]], [[Plugin Migration Status - DM]] | Bases and links |

### Session Hub

#### Prep (before the game)

| Section | Shows | Data | Engine |
|---|---|---|---|
| Next session | Link, play date, in-world start date, arc; "Create next session" button when none exists | Shared logic | Datacore |
| Last time | Embedded "Where we left off" | Shared logic | Datacore |
| World next | "World next" lines from the last 3 played sessions, newest first | Bullet text under "Where we left off", parsed from the note text in [[Session Hub Views]] (so it can be tested) | Datacore |
| Changed at the table | "Changed at the table" lines not yet reconciled into arc docs; a line is reconciled once it is a ticked task (`- [x]`) or struck through | Bullet text, as above | Datacore |
| Spotlight | Each PC tagged `player` but not `player/inactive`: sessions since their note or personal thread was last linked from a played session. A plot note is a PC's personal thread when the PC's note links to it, or it links that PC and no other active PC | Links (`resolvedLinks`) | Datacore |
| Prep progress | Which of prep steps 0–5 in the next session note have content | Section contents | Datacore |
| Arc and clues | Running arc's unrevealed clues | `ArcClues` | Datacore (exists) |

#### At the table

Built 2026-10-20. The table side is a set of cards grouped by what you are doing, under `##` headings that fold with Obsidian's ordinary fold arrows. [[Hub Layout]] places cards in rows that sit side by side on a wide pane and stack on a narrow one; each card keeps its own height.

| Group | Card (layout) | Shows | Data | Engine |
|---|---|---|---|---|
| At a glance | Party (full width) | One row per PC: level, AC, max HP, speed, passive Perception, Insight and Investigation, spell save DC, defenses, languages, dated "From Roll20" | [[Party Card Data]], written by the card | Datacore ([[Party Card]]) |
| At a glance | Where are we (three across) | Notes tied to the party's current location (from the last "Party location" bullet): NPCs here now, NPCs, locations physically inside it (folder, `located_in`, or wiki twin folder), factions, items, plot threads, arcs not complete; a collapsed group for places that only mention it | Links, folders | Datacore ([[Session Hub Table]]) |
| At a glance | Tonight's cast (three across) | Every NPC and location the next session note links to (or the last played one's), each expanding to its "Quick Reference" section; a link to the player wiki page; unresolved links get a kind picker and Create | Links, section embeds | Datacore ([[Session Hub Table]]) |
| At a glance | Quick capture (three across) | Form: kind (NPC, location, shop, item, faction, event), name, one line; creates a stub in the kind's folder (NPCs `Characters/NPCs`, factions `Characters/Factions/<World>`, items `Objects`, locations and shops `Stubs` inside the campaign folder) with the kind's tag, `needs-work`, `improvised`, and `first_session` linking the current session; the body comes from the matching template. Events instead append a line to [[Eryndor Timeline]] with the in-world date and a Calendarium category | Template text read directly (the templates prompt and move files, so they can't run mid-game) | Datacore form ([[Quick Capture]]) |
| Rules | Conditions (about 60%) | One button per condition; sections open one or several at a time | The Conditions note (2024 rules, rewritten 2026-10-20 from SRD 5.2.1, CC BY 4.0) | Datacore ([[Section Picker]]) |
| Rules | Rulings (about 40%) | [[Table Rulings]], [[Table Rules]], [[Reaction Card]], [[Improv Rules Card]], [[Prices Card]], each opening in place | The "Rulings" group in [[Table References]] | Datacore ([[Reference Lists]]) |
| Improvise | People and places (full width) | [[Quick NPCs]], [[Name Bank]], [[NPC Stat Block Reference Table]], [[Fast NPC + Picture]], [[Random Tavern]] (the last two embed a site) | The "People and places" group in [[Table References]] | Datacore ([[Reference Lists]]) |
| Loot and hazards | Treasure roll (two across) | Individual, hoard, gems, or art objects by challenge band; hoards roll the magic items for the party level, each opening to its full text | 5e.tools `loot.json`, 2024 DMG tables | Datacore ([[Treasure Roll]]) |
| Loot and hazards | Trap roll (two across) | Random trap or hazard filtered by kind, tier, threat, "2024 books only", plus a name search | 5e.tools `trapshazards.json` | Datacore ([[Trap Roll]]) |
| Loot and hazards | Item finder (full width) | Name search over magic and mundane items with full text; buttons that open the same search on D&D Beyond; magic item price-by-rarity table beside it | 5e.tools item files; the "Item finder" group in [[Table References]] | Datacore ([[Item Finder]]) |
| Sites and maps | Sites (full width) | One button per heading of [[Table Sites]] (maps, names, generators, rules, audio, D&D Beyond book pages, treasure and trap generators), each opening its links | [[Table Sites]] | Datacore ([[Section Picker]]) |

How the table-side cards get their data:

- **Party card.** Roll20 keeps the sheets, so the card reads a snapshot. A Roll20 API script ([[Roll20 Party Script]], Pro, Mod Script Sandbox 1.5 or newer) reads each PC and whispers `PARTY|` lines; you paste them into the card, which merges them by character name into [[Party Card Data]] (a plain Markdown table with an `as_of` date, path set by `party_card_note` in [[Hub Config]]). The script reads both sheet types: 2014 sheets as attributes, 2024 (Beacon) sheets through `getComputed`. Facts that shaped the design: Roll20 has no public API and scripts can't send data out, so the paste is the transfer; Beacon sheets expose only a fixed list of computed values (316 names), which does not include languages, proficiencies, items, or current class levels, so Beacon characters' languages are typed into the data note once and survive later pastes. HP is max HP only, because current HP would be stale. The script's `DEFAULT_PARTY` list is edited when the party changes.
- **5e.tools data.** Items, loot tables, and traps load from the 5e.tools mirror named by `data_url_5etools` in [[Hub Config]], through [[Item Data]]: the first use downloads a file, which is cached in the browser (IndexedDB database `hub-5etools`). The cache carries over between Obsidian sessions; "Refresh data" downloads again. Entries from the 2024 books (XPHB, XDMG, XMM, EFA) win over same-named older ones. The treasure roller uses the 2024 DMG tables only (individual, hoard coins and item count, gems, art objects, "By Level" rarity, then the Arcana, Armaments, Implements, or Relics table). The data does not say how the book picks among those four, so each item picks one at random unless you pin one.
- **Lists in notes.** [[Table References]] holds the bullet lists behind the reference cards; [[Table Sites]] holds the site links. Both are plain notes, so adding, removing, or reordering an entry is an edit to a bullet. Long reference notes (Conditions, Table Sites) become button rows through [[Section Picker]], which reads the note's own `##` headings.
- **Retired.** Party Combat Profile (its damage estimates and analysis were not kept up; the Party card replaces its purpose), Sources of Maps (merged into Table Sites), and the single "Improv references" list (split into "Rulings" and "People and places").

### Artifact hub (Lorestone Shard Status Tracker)

Built 2026-10-21. One hub per multi-part artifact; the Lorestone's is [[Lorestone Shard Status Tracker]]. Nothing in the code names the Lorestone: the hub's embed blocks name the artifact by slug (`piece="lorestone-of-eryndor"`) and the notes holding its inscription.

**Data: one note per piece.** `Objects/Lorestone of Eryndor - DM Notes/Shards/`, tagged `piece/lorestone-of-eryndor` and `inline-events` (no other properties); the number in the note name sets the order. Sections: Who knows and Pursued by (current state), Open questions (tasks), Properties and rulings, Notes, and History (append-only, one dated line per change as a Calendarium inline event in the Lorestone category). The current holder and location come from History. Format details: [[Artifact Pieces]].

**Inscription.** The lines live only in [[The Prophecy (Original Form)]] and [[The Prophecy (Modern Text)]], each labeled with its shard and position (`4a`, `4b`; a lost shard's surviving modern line in parentheses). A shard's lines count as read once its History has a `lines read` entry.

| Section | Shows | Engine |
|---|---|---|
| Overview | Each holder with the numbers of the shards they hold (embedded in the Lorestone DM note and Assembling the Lorestone) | Datacore ([[Artifact Hub Views]]) |
| Shards | A card per shard: holder, location (the party's location when a PC holds it), who knows, pursued by, line dots (● read, ◐ modern version only, ○ not known); border color: green party holds, accent party knows where, red only the DM knows, gray no holder. More opens history, knowledge, pursuit, lines with their modern versions, open questions, sessions, rulings, notes | Datacore ([[Artifact Hub Views]]) |
| Who knows what | Factions (members folded under them), individuals, and the Party against the shards; shading by level (green with black: 45% knows it exists, 70% knows where, full green holds), gold for a false belief, ↗ pursuing; a person's lines also count for their factions (`faction/…` tags) and, for a PC, the party, unless the line is marked `personal` (the person only) or `shares with [[…]]` (only the factions named); filters for name, faction, place; click a cell for the lines behind it | Datacore ([[Artifact Hub Views]]) |
| Record change | Form on each card: one History line, plus the matching update to Who knows, Pursued by, or Properties and rulings, including whom the person shares it with; defaults to today in-world and the last played session | Datacore ([[Artifact Change Form]]) |

### Content to create

All 2024 rules, checked against the books before writing.

Done (2026-10-20): reaction card, improv rules card, prices card, name bank, quick capture, external reference list ([[Table Sites]]), Conditions rewritten to 2024.

Gaps:

- Services prices: no 2024 book gives them. The Prices Card says to set them by comparison; add a third-party source only if you want one.
- Improvised damage by severity (DMG): linked from [[Table Sites]], not copied.
- Lodging and meal prices: linked, not copied.
- "Close session" script (done earlier as the Close Session template; confirm nothing else is pending).

### Maintenance backlog found during design

- Scan the entire vault for cruft and clutter no longer in active use (stale notes, orphaned attachments, unused templates and code notes, empty folders, retired plugin data), and list candidates for review before anything is removed
- Retire the old folder-note queries in `00 DM Screen/00 DM Screen.md` (replaced by this build)
- Calendarium: 62 existing events, some linked to old `90 Session Notes/...` paths
- Calendarium: Dreyara's Antagonist Plans after 21 Thunsheer (arrives Zadash 4 Unndilar, leaves 7 Unndilar, arrives Rexxentrum 24 Unndilar) never happened; she died 25 Thunsheer 835
- Two links to the removed compendium: Thunderwave (Sessions 1 to 3 - The Skyship), monuments ([[Location Idea Generator]]); point them at D&D Beyond
- Four restored items in `Objects/` carry only `compendium`; retag `artifact`
- Rendspawn notes and Two-Headed Etcheda Monkey now in `Characters/Creatures`
- `z-Mechanics` reference tables are 2014 SRD (Conditions was rewritten to the 2024 rules on 2026-10-20; the others are not)
- About 90 notes use the old `world-exandria` tag instead of `world/exandria`; retag them (Recent Work's World column reads both forms meanwhile)
- "Keln" is no longer a note type (2026-10-20): Recent Work views are by type only, with Campaign and World columns for scope
- Dataview is still enabled; the old screen is one of its last users
- [[Artifact-Item Template]] was stale (found 2026-10-20); rewritten 2026-10-22: tags `artifact` plus `world/…`, files into `Objects/`, uses the shared template helpers
- Add `world: <name>` to any other campaign note; the Campaign Template now asks for it
- Roll20: [[Roll20 Attribute Dump]] was a one-time diagnostic. Delete it once you no longer need it, and remove the old `Attribute dump` script from the game's API Scripts page (the same script slot now runs `!party`)
- [[Encounter Design Guide]] now embeds [[Party Card Data]] where it used to embed the Party Combat Profile
- Table side: the embeds in Fast NPC + Picture and Random Tavern render inside the hub (confirmed 2026-10-20)
- The NPC, Faction, Item, and Location templates treat every folder directly under `Worlds/` as a world, so nothing that isn't a world (such as a stubs folder) can live there

### Settled during review

- Spotlight covers PCs tagged `player`; PCs not currently in the party (former or on hold) are tagged `player/inactive` and left out. Applied to Elby (on hold) and Laucian (former) on 2026-10-19.
- Session Hub file: `00 DM Screen/Session Hub.md`.
- A "Changed at the table" line is reconciled once it is ticked (`- [x]`) or struck through; plain bullets count as open.
- Table-side layout (2026-10-20): cards are clustered by use (at a glance, rules, improvise, loot and hazards, sites and maps) with side-by-side rows where cards are small and full width where content is wide or expands; no hidden or folded cards (the sites picker was folded at first and shown by default on request), since headings already fold.
- Searches worth having on the hub: items, treasure, and traps and hazards. Monsters, spells, and vehicles are not (decided 2026-10-20).
- The party card reads Roll20; nothing in the vault is typed by hand except Beacon characters' languages.
- Quick-capture stubs carry `needs-work` (remove it when developed) and `improvised`; location and shop stubs live in `Stubs` inside the campaign folder, not under `Worlds/`.

### Build order

1. Shared logic (now in [[Campaign State]], [[Calendar and Timeline]], [[Note Types]]): last played, next session, today in-world, type formula
2. Session conventions: Calendarium settings, template changes, "Close session" script; backfill Sessions 49–53 if wanted
3. DM Screen top screen, then its workbenches
4. Session Hub prep side (built 2026-10-20)
5. Quick capture (built 2026-10-20)
6. Session Hub table side and content cards (built 2026-10-20): where are we, tonight's cast, reference lists, item finder, treasure and trap rolls, party card, rules, sites
7. Table-side layout by use (built 2026-10-20): [[Hub Layout]] rows and headings, per the table above

## Parked ideas

- **Shareable version (future maybe, parked 2026-10-20).** Package the system for other GMs as a hybrid: an Obsidian plugin carrying the logic and commands (hubs, Close Session, New Session, Quick Capture, settings tab for vocabulary), plus a one-time "set up a campaign" command that writes starter templates and an example campaign into the user's vault. Prerequisites if revived: all vocabulary in one config (see Hub Config), no use of other plugins' internals, schema versioning for data-model changes, SRD-only content.
