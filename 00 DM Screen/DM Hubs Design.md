---
hide_from_related: true
created: 2026-10-19
---

# DM Hubs Design

Design spec for the two hubs. Review once, then build in the order at the bottom. Decisions made here are final unless this note changes.

## The two hubs

| Hub | Job | When |
|---|---|---|
| [[00 DM Screen]] | Campaign overview and long-horizon work: where things stand, then a workbench per activity | Between sessions |
| [[Session Hub]] | Everything about the next session: prep before the game, table references and quick capture during it | Prep night and game night |

- The DM Screen's top screen is the overview. A separate overview page becomes worthwhile only when a second campaign is running; at that point the DM Screen becomes the cross-campaign overview and each campaign gets its own planning hub.
- During play, the Session Hub sits in its own window next to Roll20, with tonight's session note in a second pane. The Session Hub holds what's the same every night; the session note holds tonight.

## Rules every section follows

- Bases first. Datacore 0.1.29 only where Bases can't do the job; each row below says why.
- No section depends on fields updated by hand. Allowed: tags, links, mtime, properties set once at creation, and the one-time after-game entries in the session note.
- Connected notes are listed under every item they relate to, never shown as counts.
- Shared code lives in [[Arc Views]] (or a sibling component note) and loads with `dc.require`, so both hubs use the same logic.

## Shared logic

| Piece | Rule | Used by |
|---|---|---|
| Last played session | Highest `session_number` with `date` on or before today | Both hubs |
| Next session | Lowest `session_number` with `date` after today; if none, a "Create next session" button | Both hubs |
| Today in-world | Last played session's `fc-end` plus `ingame_time` | Both hubs, quick capture |
| Running arc | Arc with `status: running` (never more than one) | Both hubs |
| Note type | Formula from tags and folder, matching [[Related Notes.base]] | Recent Work, workbenches |

## New conventions

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

## 00 DM Screen

### Top screen (no scrolling)

| Section | Shows | Data | Engine |
|---|---|---|---|
| Header strip | Last played (date, in-world date and time), next session (date, link to prep), link to Session Hub | Shared logic | Datacore |
| Where we left off | Embedded section of the last played session | Shared logic | Datacore (Bases can't embed a heading of a computed note) |
| Running arc | Arc, status, unrevealed Fact Map clues; paused and abandoned arcs with what they share | `ArcClues`, `RelatedArcs` in Arc Views | Datacore (exists) |
| Active plot threads | Active threads, each with its connected NPCs, items, locations, factions, lore | Plot Dashboard logic, moved to a shared component | Datacore |
| Recent work | 15–20 notes by last edit; the view dropdown is the type filter: All · Sessions · Arcs and threads · NPCs · Lore and Keln · Player wiki · Maintenance | mtime, type formula | Bases |

### Workbenches (callouts below the top screen, folded by default)

| Workbench | Contents | Engine |
|---|---|---|
| Campaign planning | Arcs grouped by status (idea, designing, ready, paused, abandoned); full [[Plot Dashboard]]; [[Seeds Planted]]; open hooks (`hook`, `offscreen` tags); unrevealed clues across all arcs | Bases (arcs, hooks); Datacore (clues across arcs) |
| Characters | Party sheets; recently seen NPCs (linked from the last 3 played sessions); NPCs tagged `needs-work`; improvised backlog grouped by `first_session` | Bases, except recently seen (Datacore: needs links from a computed set of notes) |
| Encounters | [[Encounter Design Guide]], Encounter Template, [[Party Combat Profile]], [[NPC Stat Block Reference Table]], `Characters/Creatures` | Links and Bases |
| Lore and Keln | `lore` notes; `world/keln` notes by last edit; [[Kanka_Master_Build_List]] | Bases |
| Player wiki | [[Player Wiki/Index\|Player Wiki Index]], [[The World of Exandria]], ledger and scope checklist; wiki drift (DM note edited after its player twin) | Bases; drift in Datacore unless Bases can compare two files |
| Vault maintenance | `needs-work` notes, maintenance backlog (below), [[DM_Vault_Reorganization_Plan]], [[Plugin Migration Status - DM]] | Bases and links |

## Session Hub

### Prep (before the game)

| Section | Shows | Data | Engine |
|---|---|---|---|
| Next session | Link, play date, in-world start date, arc; "Create next session" button when none exists | Shared logic | Datacore |
| Last time | Embedded "Where we left off" | Shared logic | Datacore |
| World next | "World next" lines from the last 3 played sessions, newest first | `@list-item` text in session notes | Datacore |
| Changed at the table | "Changed at the table" lines not yet reconciled into arc docs | `@list-item` text in session notes | Datacore |
| Spotlight | Each PC tagged `player` but not `player/inactive`: sessions since their note or personal thread was last linked from a played session | Links | Datacore |
| Prep progress | Which of prep steps 0–5 in the next session note have content | Section contents | Datacore |
| Arc and clues | Running arc's unrevealed clues | `ArcClues` | Datacore (exists) |

### At the table

| Section | Shows | Data | Engine |
|---|---|---|---|
| Quick capture | Button: name, kind (NPC, location, shop, item, faction, event), one line; creates a stub in the kind's folder with `improvised` and `first_session`; events instead append a line to [[Eryndor Timeline]] with the in-world date and a Calendarium category | Templater, run from a Datacore button | Templater + Datacore |
| Tonight's cast | Every NPC and location the next session note links to; each expands to its "Quick Reference" section; unresolved links show "no note yet" with a capture button | Links, section embeds | Datacore |
| Where are we | Notes linking to the party's current location (from the last "Party location" bullet): NPCs, shops, authorities | Links | Datacore |
| Improv references | [[Quick NPCs]], name bank, reaction card, improv rules card, prices card | Notes | Links/embeds |
| Item finder | Search box that opens the query on D&D Beyond and on 5e.tools; magic item price-by-rarity table beside it | URLs (formats to verify) | Datacore |
| Party card | AC, passives, languages, notable items | [[Party Combat Profile]] embed | Embed |
| Rules | [[Table Rulings]], Conditions, Table Rules hub | Notes | Links |
| Generators and sites | [[Random Tavern]], [[Fast NPC + Picture]], [[Sources of Maps]], external sites (list to collect) | Notes, URLs | Links |

## Content to create

All 2024 rules, checked against the books before writing.

- Reaction card: 2024 Influence action, attitudes (Friendly, Indifferent, Hostile) and how each responds to requests
- Improv rules card: DC ladder, improvised damage by severity, object AC and HP, creatures in an area, horde rules
- Prices card: lodging, meals, services, common gear; magic items by rarity (2024 DMG)
- Name bank: spare names by Exandria culture and region, varied per the project's naming principles
- Quick capture template and "Close session" script
- External reference list (from you)

## Maintenance backlog found during design

- Retire the old folder-note queries in `00 DM Screen/00 DM Screen.md` (replaced by this build)
- Session template "After the Game" asks you to update `current_location` by hand; no hub section uses that field, and "Where are we" uses links instead
- Calendarium: 62 existing events, some linked to old `90 Session Notes/...` paths
- Calendarium: Dreyara's Antagonist Plans after 21 Thunsheer (arrives Zadash 4 Unndilar, leaves 7 Unndilar, arrives Rexxentrum 24 Unndilar) never happened; she died 25 Thunsheer 835
- Calendarium's current date (19 Thunsheer) is stale; the party is at 27 Thunsheer 835, evening (end of Session 53). The hubs don't depend on it
- Two links to the removed compendium: Thunderwave (Sessions 1 to 3 - The Skyship), monuments ([[Location Idea Generator]]); point them at D&D Beyond
- Four restored items in `Objects/` carry only `compendium`; retag `artifact`
- Rendspawn notes and Two-Headed Etcheda Monkey now in `Characters/Creatures`
- `z-Mechanics` reference tables are 2014 SRD
- Dataview is still enabled; the old screen is one of its last users

## Settled during review

- Spotlight covers PCs tagged `player`; PCs not currently in the party (former or on hold) are tagged `player/inactive` and left out. Applied to Elby (on hold) and Laucian (former) on 2026-10-19.
- Session Hub file: `00 DM Screen/Session Hub.md`.

## Build order

1. Shared logic in Arc Views: last played, next session, today in-world, type formula
2. Session conventions: Calendarium settings, template changes, "Close session" script; backfill Sessions 49–53 if wanted
3. DM Screen top screen, then its workbenches
4. Session Hub prep side
5. Quick capture
6. Session Hub table side, then the content cards
