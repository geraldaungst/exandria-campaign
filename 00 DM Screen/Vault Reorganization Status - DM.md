---
cssclasses:
  - wide-page
---

## Vault Reorganization Status: DM Vault

Location: the DM Screen folder. The plugin migration is complete; its note, [[Plugin Migration Status - DM]], was archived to `z_Archive/Plugin Migration/` on 2026-10-29 and its standing rules moved to [[Vault Conventions - DM]]. This note holds current state, the rules for every pass and the remaining work. History is condensed (2026-10-30): the Stage summary at the bottom says what each stage did, and the full Phase log of 2026-10-22 to 2026-10-30 sits in [[Vault Reorganization History 2026-10-22 to 2026-10-30]] in `z_Archive/Vault Reorganization/`. Read the history only when a question needs the exact record of a past change.

### How Claude should use this note

- Read all of it before proposing anything. The archived documents and the history note are not updated; where they disagree with this note, this note wins.
- Start every conversation with the "You are here" marker from the Project map, then follow the Working rules.

### Project map

**Vault reorganization. You are here: note triage, Review of the remaining areas done 2026-10-29 (Worlds and Creatures, Sessions, One-Shots, DM Screen tools and code, and Player Wiki, Checkpoints included); the Duplicates and misfiled-notes pass done 2026-10-29 (survey, batches 1 and 2, Checkpoint); the Secrets-as-checklists pass done 2026-10-29 (batches 1 to 5, Checkpoint, Obsidian checks passed); next: the Open Issues collector design, then the Opus faction pass and Eledyr, then Final verification; this status note condensed 2026-10-30**

**Done**
1. Structure
2. Tags, properties and templates
3. Plugin migration (Omnisearch stays; Gerald's final keep-or-remove decision waits for live use and is outside the project)
4. NPC audit
5. Links and naming
6. Vault Health dashboard
7. Region rule (location properties, the core engine, hubs, templates, checks and migration; 2026-10-28)
8. Note triage and review of every area (2026-10-23 to 2026-10-29; the Stage summary below lists the passes): campaign folder, Plot Threads, Party, Arcs; NPCs (74); Factions, except the three core factions; Objects; Adversaries, except Eledyr Dephar; Worlds (58); Creatures, Sessions (all 54 nights numbered and dated against the player notes) and One-Shots; DM Screen tools and code (58); Player Wiki (118)
9. Duplicates and misfiled-notes pass (2026-10-29; no duplicate notes found)
10. Secrets-as-checklists pass (2026-10-29): templates and Vault Conventions updated, 521 lines in 57 notes converted; Gerald's Obsidian tests pass. Eledyr Dephar's 69 lines wait on his design topic, and the Shard notes' Who knows lines stay as data

**In progress**
- Nothing is running now. Everything under Still to come waits on Gerald or on its own conversation.

**Still to come** (in order; Gerald decided the order 2026-10-29)

*Required before Final verification*
1. **Open Issues collector** (own conversation, Opus): format, templates, rescan, collector code. Done first because the faction pass, Eledyr, Varnes and the clue path all write Open Issues entries. Also decides the Shard notes' `## Open questions` heading
2. **Opus faction pass** (own conversation, Opus), after revising its prompt (Parked work): rebuild Emissaries of the Sunfall - DM, Obsidian Echoforge - DM and Malachite Cord - DM on the Faction Template; bring Legacy of the Seekers, The Massacre, The Capture of Melthes and The Legend of the Aurora's Ascendant onto the Atomic Note template; reconcile Valen Elderguard's role, the Verdant Codex, The Massacre's date and the Lorestone faction-knowledge questions. Their plain bullets convert to checklist lines in the same pass
3. **Eledyr** (own conversation, after step 2 settles Valen's role): whether he still matters, and where he is. His 69 unconverted secret lines convert with his rewrite
4. **Confirmations for Final verification:** the Lore (curated 2026-10-23) and z_Templates (audited 2026-10-22) rows of the item 11 table, then the Vault Conventions counts (last, so they do not go stale again)

**Final verification:** every area reviewed (item 11 table, including the three core factions and Eledyr Dephar). It waits only for steps 1 to 4. After it, the vault sync migration starts in its own conversation (Parked work)

*After Final verification: optional, at Gerald's pace*
- **Lorestone clue path** (Opus, after step 2): how clues route the party to Aveqtaro in Rosohna on the way to the Ebonglass Massif; Ovedo's lens and whether the Empire or Cobalt Soul holds a Luxon Beacon
- **Varnes Dwell - DM rewrite** (Opus)
- **Location auto-fix** (Gerald's idea, 2026-10-27): a DM place note with no parents takes the DM twins of its player twin's parents (the player note itself when a parent has no DM twin); then the **Location plugin** (learning project): wraps the location core in a plugin and adds save-time checks and picker commands; hubs switch over when it passes the core's tests
- **DM Screen workbenches** (Gerald's ruling, 2026-10-29; after the collector): whether to build the six folded workbenches that DM Hubs Design lists as not built (Campaign planning, Characters, Encounters, Lore and Keln, Player wiki, Vault maintenance), what each holds, and which of them Recent Work, Vault Health, the Plot Dashboard and the Session Hub already cover
- **`z-Mechanics` reference tables** are 2014 SRD (only Conditions was rewritten to the 2024 rules; DM Hubs Design, Maintenance backlog); do them sooner if they are used at the table
- **Notes that still need a pass** (Cree Deeproots's dates, place tags on Triotta and Guzezzik, `disposition` on Korvin and Shauna): when Gerald next uses them
- **Kanka list archive:** move the Kanka Master Build List to `z_Archive/` when the Keln build is finished
- **Ceratos stat block, Qalix confrontation level, Shoagragoth encounter:** when those encounters are near

**Running alongside:** parked work list.

Claude updates this map whenever a line changes state, in the same edit as the log line.

### Working rules

Decided with Gerald 2026-10-25. They apply to every conversation on this project. Handoff prompts point here instead of repeating them. Rules about working together in general (questions, one best next step, concrete scenarios, creative calls are Gerald's) live in the project instructions. Rules about note content (tags, properties) live in [[Vault Conventions - DM]].

#### Keeping Gerald oriented

- Start every conversation with the "You are here" marker from the Project map.
- On every now-or-later question, add one line saying where "later" lands.
- Refer to work only by names that appear in the Project map. New work gets a line in the map before it is mentioned.
- Ask one or two questions at a time, and keep asking in later turns until every needed decision is in. Say where you are in the set ("questions 1 and 2 of 5"), and don't act on a decision Gerald hasn't given yet.
- Batch reports: one or two bullets of findings, then the decisions needed. More context only where a decision needs it.
- Claude decides mechanical questions (fix now or park) and reports them at the end of the batch. Claude asks about creative calls and anything that changes how Gerald uses the vault.

#### Fixing a note

- **Fix once.** When a pass works on a note, it does the complete update in that pass: template structure, content, tags and links. A part may be split off only because it waits on a recorded decision, needs Opus, must change together with notes outside the pass, or Gerald chooses to split it. Anything split off goes in the note's Open Issues or the Parked work table.
- **Complete includes current.** Check an important note against every session and planning note that links to it and the latest session summaries; check other notes against the notes that link to them. What can't be settled goes in the note's Open Issues.
- **Open Issues.** A campaign question Gerald can't answer yet goes in the note's `## Open Issues` section. The note then counts as complete.
- **Templates.** A note that doesn't match its template is rewritten to match, unless that creates a worse problem (then raise it). No information is deleted outright: detail that doesn't belong on the note goes into an atomic `lore` note linked from it.
- **Important and minor notes.** Important notes get the full template treatment: anything linked from an active or upcoming plot thread, an arc that isn't complete, or a recent session; the three core factions; Tier 1 and Tier 2 NPCs; anything used at the table; and key places and people for future arcs (for example Molaesmyr, the Ebonglass Massif, Shoagragoth). Minor notes get a light fix to anything broken plus `needs-work`, so Gerald brings them onto the template the next time he uses them. Claude proposes which is which in the batch summary; Gerald confirms. Ask when unclear.
- **Small fixes elsewhere.** A fix to a note outside the current pass stays small and is logged. Before making it, Claude checks the backups and the Phase log. If this would be the second small fix to that note, or the fix shows the note is out of date beyond the line being fixed, Claude says so and recommends the full update now. Gerald decides.

#### Unplanned issues

- A problem in a note in the current pass: fixed in the pass.
- A campaign question: the note's Open Issues.
- A maintenance fix to a note outside the pass, or work spanning several notes: the Parked work table below.
- Every Parked work row names the pass that picks it up. If no planned pass covers it, it gets a line in the Project map then and there.
- Each area pass starts by taking every Parked work row for that area. Each batch report ends with one or two lines on what was parked and where it goes.

#### Keeping earlier work clean

- **After every ruling**, Claude searches the vault the same day for every note it affects. Each hit is fixed as a small fix or parked.
- **Checkpoint at the end of each stage:** rerun the link scan; check tags and properties against Vault Conventions; check that no `.md` file is left under `z_Reference/template-backups` outside a `draft/` folder; look for leftover scripts, temporary notes and empty folders; review the Parked work table for rows without a pass; confirm this note matches the vault. No decisions from Gerald unless something turns up.

#### Facts and canon

- Verify against the vault before marking anything done. The Claude project copy can lag; check the vault first.
- Past conversations are the record of decisions; the vault is the implementation. Search both before creating anything. When it's unclear whether something is deliberate or a leftover, check past conversations before deciding.
- Notes are mostly brainstorms. An idea repeated across notes doesn't win by default; decide on merit.
- Resolve conflicts toward what has happened at the table and the campaign's goals. Only what the party knows is fixed; DM-only material can change. Player-facing material wins over DM notes.
- Check several similar notes for the pattern before treating something as a rule; ask when it's ambiguous.

#### Editing

- Draft before writing; write only after Gerald approves.
- Back up every changed note to a new dated folder under `z_Reference/template-backups/`. Every backup of a note ends in `.bak` (decided by Gerald 2026-10-28; the 1077 earlier backups were renamed), so Obsidian never reads one as a note: Calendarium reads the whole vault, and Publish publishes any note with `publish: true` wherever it sits. To restore a backup, remove the `.bak`.
- Check every wiki-link resolves before writing it. After any change, run `.scripts/scan_unresolved_links.py` and confirm 0 new unresolved links.
- Before moving or renaming a note, check for duplicate file names, because links resolve by name.
- Bulk or destructive changes go through a dry-run script, tested on a copy, after Gerald has committed.
- Test code with a mock harness. Say what couldn't be tested in Obsidian.
- Never write a plugin's settings file unless the plugin documents it.
- Obsidian is closed during edits unless Gerald says otherwise. Say when he should close it and when he can reopen it.
- Claude can't delete files; name them for Gerald.
- Each batch ends with a Phase log line: `YYYY-MM-DD | phase | what changed | result`. Keep lines short: what changed, the result, the backup folder. At each stage's Checkpoint, condense that stage's lines into one row of the Stage summary and move the full lines to the history note in `z_Archive/Vault Reorganization/`, so the next conversation reads a small note.

#### Models and conversations

- Opus for design with lasting effects and for merges that decide which version of a fact is canonical. Sonnet for applying decisions already made.
- When a note or pass needs Opus, say **SWITCH TO OPUS** in bold, name the note and why, and wait. Say when to switch back.
- Start a new conversation when the current one is mostly unrelated tool output or the topic changes. Gerald commits first.
- Handoff prompts point to this note and name the task. They separate what Gerald decided from what Claude proposed.

### Parked work

Every row names the pass that picks it up. Rows are removed when done; the Phase log keeps the record.

| What | Where | Why parked | Picked up by | Found |
|---|---|---|---|---|
| Rebuild Emissaries, Echoforge and Malachite Cord on the Faction Template with everything in the vault; bring Legacy of the Seekers, The Massacre, The Capture of Melthes and The Legend of the Aurora's Ascendant onto the Atomic Note template; new lore notes in `Events/`. Also reconcile Valen Elderguard's role across the Emissaries note (says he began public reconciliation with the Echoforge, and that the Emissaries as a whole have no public tie to him), Factions with interest in the rifts (his cell opposes the partnership) and the Player Wiki (he publicly leads the Emissaries). Also settle the Verdant Codex's speculative sections (Objects, Open Issues entry) and check The Massacre's date: the note says 809 PD, a past chat recorded 785 PD. Also, from Objects batch 3 (Lorestone): (a) does the Cobalt Soul as an order know about the Lorestone? The hub's Known by line no longer lists it, while Shard 5 says the Archive vault is unauthorized and secret and the Cobalt Soul note has an Open Issue; (b) the Malachite Cord note says its Cobalt Soul relationship is "complicated by Lorestone piece possession" but no shard note lists a Cord holder, and the Cord's awareness of Shards 1-4 is recorded only on the shard notes; (c) the Emissaries and Malachite Cord notes do not embed `Lorestone of Eryndor - DM#Faction Knowledge Evolution` (only the Echoforge note, the Shard Status Tracker and The Prophecy do); keep that heading; (d) check the hub's Current Interpretations text (Echoforge, Cord, Emissaries, Qalix) against the rebuilt faction notes; (e) the Emissaries are listed as pursuing Shards 1-4 but no shard note records that they know where the shards are (add it next to the Cord's awareness, item b); (f) Shard 5's who-knows grid credits the Cobalt Soul as holder because Archivist Ovedo carries `faction/cobalt-soul`, which belongs with question (a) | Characters/Factions/Exandria | Needs Opus | Opus faction pass (own conversation, prompt drafted 2026-10-25) | 2026-10-25 |
| Varnes Dwell - DM rewrite: reconcile the pre-play plan (petrified at the Keep, rescue, recovery, travel west) with Sessions 32-35, Cloudfang Keep - DM, Ilya's notes and Rescue Ilya's Brother. Also settle how Lady Emer restored Varnes from stone (Sessions 32-33), the Open Issue in Rescue Ilya's Brother. Tagged `needs-work` | Characters/NPCs | Needs Opus | Design topic: Varnes Dwell - DM rewrite (own conversation, Opus) | 2026-10-23 |
| Location auto-fix: a DM place note with no parents, whose player twin has parents, takes the DM twins of those parents (or the player note when a parent has no DM twin); the Vault Health view "Places with no parent" lists 24 DM notes where the core finds 8 because Bases cannot read twins | Worlds | Gerald's idea 2026-10-27; not designed | Design topic: Location auto-fix (own conversation) | 2026-10-28 |
| Revise the Opus faction pass prompt to point to these Working rules (the 2026-10-25 version lacks the canon rule) | Prompt | The Working rules exist (2026-10-25); the prompt is not yet revised | Before the Opus faction pass starts | 2026-10-25 |
| Eight Shard notes use `## Open questions`, which the Artifact Pieces and Artifact Hub Views code reads (`heading_piece_questions` in Hub Config). Progress Tracks no longer reads that heading (its tracker heading is `## Open Issues` since 2026-10-26) | Objects/Lorestone of Eryndor - DM/Shards | Waits on the item 10 ruling | Open Issues collector design (leave as is until then) | 2026-10-25 |
| The Shard notes' 27 `Who knows` lines (Shards 1 to 7) stay plain bullets because Artifact Pieces reads them as data (`parseKnows`); converting them would break its parser | Objects/Lorestone of Eryndor - DM/Shards | Code reads the lines | Open Issues collector design (decide together with the `## Open questions` heading) | 2026-10-29 |
| Ceratos stat block (unfinished; planning notes recorded in the note), Qalix confrontation level (hub ~18 vs Adaptable Modules 18 with Ceratos 19-20), Shoagragoth encounter and custom stat block | Characters/Adversaries | Years away; Open Issues in each note | None until the encounters are near | 2026-10-25 |
| Empty folders kept on purpose: `Campaigns/Prophecy of Eryndor - DM/Encounters` (now holds Xhorhas Landing; more encounter notes will come) and `Campaigns/Prophecy of Eryndor - DM/Session Notes/Completed Sessions/Arc 6 - Deastok` (empty until Sessions 49-53 move there when the arc ends). Deastok place notes go in `Worlds/Exandria/Places/` | Campaigns | Planned content | Stays until the notes move there | 2026-10-27 |
| Ovedo's Xhorhasian lens: whether it vibrates near a Luxon Beacon (idea), what Ovedo knows, whether the Empire or Cobalt Soul holds a Beacon, and the clue route to Aveqtaro. Recorded as Open Issues on Archivist Ovedo | Characters/NPCs | Gerald's design call | Design topic: Lorestone clue path (Opus) | 2026-10-26 |
| Cree Deeproots's employment dates ("about 2-3 years") and her pass; Triotta and Guzezzik have no place tag (no source places them); Korvin and Shauna lack `disposition` | Characters/NPCs | Waits on a pass | Next pass on these notes (they keep `needs-work`) | 2026-10-26 |
| Vault Conventions counts are stale (NPC 89 vs 74 files, Faction 24 vs 19, Lore 12 vs 13, Player Wiki 116 vs 118, others to recount) | 00 DM Screen/Vault Conventions - DM | Maintenance | Final verification | 2026-10-26 |
| Eledyr Dephar's 69 plain lines in his DM Only, What Eledyr Knows and Operation Notes callouts are not converted | Characters/Adversaries | Gerald (2026-10-29): skip until his relevance and whereabouts are settled | Design topic: Eledyr (convert his lines in the same pass as the rewrite) | 2026-10-29 |
| Kanka Master Build List (`Campaigns/Future Keln Campaign`, temporary note with an underscore name): archive it to `z_Archive/` when the Keln build is finished. Sections D (Tidemark Syndicate, Watcher's Rest Town Council) and E (quests) are not in the Keln notes yet | Campaigns/Future Keln Campaign | Gerald's trigger (Keln build finished); no pass owns it | Gerald, when the Keln build is finished; no pass | 2026-10-29 |
| Vault sync migration: move every Obsidian vault out of iCloud into a normal folder, one private git repo per vault, Obsidian Sync Plus for the phone, images out of git and compressed first. The decisions and the ready-to-use planning prompt are in the Claude conversation [Vault reorganization batch 4](https://claude.ai/chat/83141be4-5987-47db-96df-9e11b953fdc8). When it happens, rewrite the `.gitignore` lines here (the `.gitignore` row in 'Superseded or changed' below) and in Vault Conventions - DM, which describe the Claude-project restriction (see the `.gitignore` row in 'Superseded or changed' below) | Outside the vault; this note and `00 DM Screen/Vault Conventions - DM` | Gerald parked it until the cleanup is done | Separate conversation, started after Final verification | 2026-10-29 |

### Archived documents

Archived to `z_Archive/Vault Reorganization/`. Nothing in them is maintained; every open task is tracked here. Because `z_Archive` is excluded from search and Bases, anything still needed is copied into this note.

| Document | Final state |
|---|---|
| [[Vault Reorganization History 2026-10-22 to 2026-10-30]] | The full Phase log (2026-10-22 to 2026-10-30), the Current state tables and the finished Remaining work items, as they stood on 2026-10-30 |
| [[DM_Vault_Reorganization_Plan]] | Phases 1-7 done. Phase 8 replaced by Revised Phase 8 |
| [[Revised Phase 8]] | Parts A to F done (see Completed plans) |
| [[Exandria Vault Reorganization]] | Superseded. 38 of 73 tasks done; the 35 open tasks depend on the retired `processed` property and Dataview blocks |
| [[npc-folder-audit]] | Phases 1 to 5 done (see Completed plans) |

The Dataview code in these documents is documentation only. Dataview is no longer enabled (2026-10-27). Do not convert it. Other archives from this project: `z_Archive/Scripts/` (old scripts, including `migrate_location.py` and `rename_backups_bak.py`), `z_Archive/Location Migration/`, `z_Archive/NPC Tag Cleanup/`.

### Rules to apply

Carried over from the audit and Phase 8 so the work does not depend on the archived files.

**Where things live:** `Campaigns/<campaign>/` (sessions, arcs, party, plot threads, status, `Lore/` for notes tagged `lore`), `Characters/NPCs`, `Characters/Adversaries`, `Characters/Factions`, `Characters/Creatures`, `Worlds/<world>/<kind>/` (Places, Lore, Tables, plus bundle folders for a note with its own documents; folders say nothing about location), `Objects/`, `00 DM Screen/`, `Player Wiki/` (published), `z_Templates`, `z_Reference`, `z_Archive`. The tag scheme is in [[Vault Conventions - DM]].

**NPC tiers**
- **Tier 1, hub plus subnotes:** multiple active storylines, complex hidden agendas, or content serving different use cases (running a scene, planning behind-the-scenes moves, tracking a network). The hub is a concise reference card; each subnote serves a distinct use case, not just a different topic.
- **Tier 2, one comprehensive note:** the NPC Template in `z_Templates`. Quick Reference and roleplay always visible; hidden information, background and stats in default-collapsed callouts (`> [!secret]-`, `> [!note]-`).
- **Tier 3, minimal:** a short note or a row in Quick NPCs.

**Should this be a separate note?** Yes if any apply: (1) it is referenced from two or more unrelated contexts; (2) it is a different use case from the parent; (3) it is long enough (roughly 15 lines with its own headings) to make the parent feel like noise; (4) it is a location, item, event or faction filed as an NPC. Otherwise it belongs in the parent, as a collapsed callout if brief.

**Merge pattern:** single-owner satellites (status, description, "what X knows" fragments) merge into the parent NPC, condensed to scannable bullets. Stat blocks are left out when the NPC is unlikely to fight; combat stats live in Roll20. If it won't help run a scene or plan the NPC's actions, it doesn't belong.

**Tagging:** `npc` means the note is an individual NPC. Atomic notes about NPC topics use `atomic` or content tags, not `npc`. `needs-work` stays on refactored notes until separately reviewed.

**Keep as separate notes (multi-reference):** The Massacre, The Capture of Melthes, Port Damali Murders, Rylan Estevez Frame Job, Gentleman's Organization (since 2026-10-23 the faction note, in `Characters/Factions/Exandria/`), Legacy of the Seekers, Luxon Beacon Integration with Lorestone.

### Superseded or changed since the plans were written

| In the plans | In the vault now |
|---|---|
| `processed` property and `#to-process` workflow | Retired. Only the archived documents still mention them |
| Dataview queries, Connected Elements blocks | Bases (`Related Notes.base`, `Recent Work.base`) and Datacore (hubs, Plot Dashboard, NPC Browser, Lorestone hub, Aveqtaro tracker) |
| `world/faerun` | `world/toril`. The old tag survives only in the archived documents |
| `campaign/exandria` | `campaign/eryndor` and `campaign/tyranny` |
| `Characters/Opponents`, `Items`, `Campaigns/Exandria`, `DM Screen` | `Characters/Adversaries`, `Objects`, `Campaigns/Prophecy of Eryndor - DM` (renamed again 2026-10-23), `00 DM Screen` |
| NPC `home_base`, `current_location`, `affiliations` properties | `place/…`, `faction/…`, `region/…`, `world/…` tags (scheme in the migration note) |
| Keep Dataview, Templater, Tag Wrangler | Dataview removed (2026-10-27); Templater and Tag Wrangler kept; Datacore and Bases added |
| `.gitignore` excludes `DM Screen/` | The folder is named `00 DM Screen`, so the pattern does not match it and the folder syncs to the Claude project. Intended; the pattern is stale |

### Rulings that shape future passes

Decided with Gerald during the project. Rules about note content (tags, properties, note types) are in [[Vault Conventions - DM]]; the location model is in [[Location Engine Spec]].

- **Templates win.** A note that does not match its established template is rewritten to match, unless that creates a worse problem. Template sections: NPC Quick Reference and roleplay always visible; hidden information, background and stats in default-collapsed callouts.
- **Checklist convention (2026-10-29).** Anything the party may learn, and anything tracked or used in play (dialogue options, triggers, hooks), is `- [ ]`, ticked when it happens. Voice, description, history, reference text and lines that only label a sub-list stay plain. When in doubt, convert: a checkbox on a plain item costs nothing. Code-parsed sections stay plain: the Shard notes' Who knows lines (read by Artifact Pieces) and the headings listed in Hub Config (`heading_*` keys). Eledyr Dephar's 69 lines wait for his rewrite. Templates for NPC, Location, Arc, Plot Thread and Artifact-Item write checklist lines.
- **Backups.** Every backup ends in `.bak`, in a new dated folder under `z_Reference/template-backups/`. Calendarium reads the whole vault and Publish publishes any `publish: true` note wherever it sits, so a `.md` backup of a note with the `inline-events` tag, an `fc-date` property or `publish: true` creates duplicate events or a duplicate page.
- **Naming.** The ` - DM` suffix is used only when a Player Wiki note has the same name; a DM note keeps its plain name until then. The suffix is the `dm_note_suffix` setting in Hub Config (read by Shared Helpers and `dm_helpers.js`); changing it later needs `.scripts/rename_dm_suffix.py` (edit OLD and NEW) for file names, and `Recent Work.base` line 18 is hard-coded.
- **Location model (Region rule, 2026-10-27 and 28).** The `world/` tag is the root, one value per plane; place notes carry `political_region` and `natural_region` link lists (nearest parent first); `whereabouts` places NPCs, faction bases and items; `site` places arcs and encounters; `ties_to` links related notes. The `place/` and `region/` tags are retired. Folders are `Worlds/<world>/<kind>/` (Places, Lore, Tables), with a bundle folder only for one item or place whose lore was split into atomic notes. Player place notes carry player links only; a DM note embeds its player twin collapsed.
- **Faction tags.** Faction notes carry `organization`. The file `Characters/Factions/Exandria/Gentleman's Organization` is the real faction note for Korfel Withrethin; never delete it. Origin decided: Babenon Dosal was the original Gentleman; Korfel tipped off the Crownsguard and killed him in the crackdown (winter 834-835) and appears undisguised.
- **Tier 1 NPC hubs** (reference card plus subnotes that each serve a distinct use): Aveqtaro Thaan (Aveqtaro Memory Recovery Tracker, What Aveqtaro Thaan Knows), Vaud Qalix (Qalix's Network, Vaud Qalix's Plan Outline), Korfel Withrethin (Korfel's Next Moves, Talking with Korfel), and the Lady Emer hub with three documents in `Characters/Adversaries/Lady Emer - DM/`. The Bramwell Bellweather epilogue closes in the Deastok arc.
- **Molaesmyr timeline (Opus retcon, 2026-10-28).** Two crossings, Ilixidor first: about 520 PD Ilixidor Alo anchors the Molaesmyr Fey Crossing (Labyrinth beneath Caes Mosor) with a shard set on the Fey side; about 525-535 PD the monastery uses the separate Savalirwood crossing; about 535 PD the monastery catastrophe; 585 PD the Rupture, and the shard stays Fey-side (Shard 8 is Ilixidor's). Rifts follow ley lines damaged by the Rupture; location follows the lines, size, plane, duration and effects stay random. Shoagragoth holds an accurate eyewitness account but does not know a crossing ruptured.
- **Plugins.** Omnisearch stays; Gerald's final keep-or-remove decision waits for live use and is outside this project. Dataview is removed. Templater and Tag Wrangler stay; Datacore and Bases are in use.
- **DM Screen notes.** DM tools carry `dm-tool` plus `hide_from_related`; Player Wiki Build Conventions has `hide_from_related: true`; Table Rulings and Encounter Design Guide stay without it.

### Undo and recovery

- Restore a note from a backup: remove the `.bak` and copy it over the live note. Dated folders are in `z_Reference/template-backups/`.
- Location migration manifests (with `--undo`): `2026-10-27 Location migration step 1`, `step 2`, `step 3`, `2026-10-28 Location migration step 5`, each with a `manifest.json`. The script is `z_Archive/Scripts/migrate_location.py`; copy it back to `.scripts` to use it. Command shape: `python3 .scripts/migrate_location.py <properties|embeds|folders|tags> --undo "<manifest path>"`.
- Older scripts with `--undo` (`fix_links_batch1` to `4`, `prune_plot_threads` and others, now in `z_Archive/Scripts/`) look for plain `.md` backup names: remove the `.bak` first. `rename_backups_bak.py --undo` reverses the 2026-10-28 `.bak` rename.
- The 16 Calendarium backup renames (2026-10-23) are listed in `z_Reference/template-backups/2026-10-23 calendarium backup copies/rename manifest.json.bak`.

### Link scan baseline

`.scripts/scan_unresolved_links.py` is read-only; it resolves by file name and handles aliases, headings, embeds and escaped pipes, ignores links in code, and `--json file` gives detail. Baseline on 2026-10-29: 3,778 links, 47 unresolved outside code. 43 of them point to 13 planned notes on purpose, listed in `.scripts/planned_link_targets.txt`: Xanaphia Lothliss, Odessloe, Ilixidor Alo, Illyndra Shadowveil, Cairel Ulthe, Hupperdook, Sunset Sail, Tur-Marethis, Kelmen Ritual Resolution, The Ring, Ruins of Molaesmyr, Watcher's Knee, Varrin. When one of those notes is written, delete its name from the file; if the plan is dropped, strip its links first. The other 4 are `[[Player Wiki Ledger]]` and `[[Player Wiki Scope Checklist]]` in Player Wiki Build Conventions (Claude-project documents, not vault notes). Each pass must end at 0 new. Stripped Deastok survey-crew NPCs (Jorun, Aldous, Wenna, Brynna, Erma) get their links back if they become notes.

### Completed plans

- **Reorganization Plan, phases 1-7:** done. **Revised Phase 8:** A (properties and tags; the `processed` workflow retired), B (Tyranny NPCs retagged), C (templates simplified and re-audited 2026-10-22), D (file triage, then the area reviews), E (verification, confirmed in Obsidian 2026-10-23) and F (Vault Health dashboard: `Vault Health.base` with Needs work, NPC gaps and Artifacts without world views, embedded on the 00 DM Screen hub; orphans left to Janitor) are done.
- **NPC folder audit:** satellites merged into Tier 1 and Tier 2 notes; Aveqtaro Thaan, Vaud Qalix and Korfel Withrethin rebuilt as Tier 1 hubs; the NPC-placement sweep found no non-NPC notes in `Characters/NPCs` (four antagonists moved to Adversaries; Ilya the Sorceress moved in and became [[Ilya the Sorceress - DM]]); the NPC template was applied to the second-look list on 2026-10-26. Minor notes keep `needs-work` and move onto the template when Gerald uses them.
- **Bulk fixes:** DM suffix rename (46 notes and 8 folders, 740 links repointed, 2026-10-23); four link-cleanup batches (2026-10-23); Calendarium duplicate events fixed by the `.bak` rule (2026-10-23); Region rule migration (2026-10-27 to 28).

### Open design items

**Eledyr Dephar: relevance and whereabouts.** Opened 2026-10-23 for a separate conversation, date not set. His note says Rexxentrum, the player notes of 2025-03-16 say "sent to Zadash", and nothing else about him appears in the player notes after August 2024. The Hidden Chest scene never happened. Decide whether he still matters, where he is, and how Qilynn's revenge thread uses him. His note holds an Operation Notes callout (intelligence, moves, triggers, clues) kept from the retired 3-month plan; its Current Location and Status lines stay unchanged until this is decided. His 69 plain secret lines convert in the same pass.

**Open Issues section and collector.** Opened 2026-10-23 by Gerald. The design questions are for a separate conversation (Opus), date not set; they gate the build and must be done before the project is called complete. Goal: seeds and threads that were set aside stay in front of Gerald at session planning, found automatically, with no tracking notes to update by hand. The marker is a `## Open Issues` section (decided 2026-10-23; "offstage, to decide" is plain text under it). Gerald suggested extending the existing Datacore code. Already in the vault: the `needs-work` tag (whole notes only), the task lists under the heading that [[Progress Tracks]] reads (`heading_track_questions` in Hub Config, `Open Issues` since 2026-10-26; only the Aveqtaro Memory Recovery Tracker uses it), the Shard notes' `## Open questions` (`heading_piece_questions`), the Plot Dashboard in [[Plot Dashboard Views]] and the Session Hub.

Steps, in order: (1) decide which note types get an Open Issues section (Gerald: potentially any note); (2) add the section to each type's template; (3) rescan the vault for open issues that belong in such a section; (4) build the code that collects every open issue into a Bases list for filtering and sorting; (5) think through anything else this raises for notes, structure or code.

Points to raise (not decided):
- Bases lists notes, not lines. A line-level list needs one note per issue, or a property summarizing each note's issues, or a Datacore table for lines with Bases for notes.
- How an issue is written (task line, tag, callout) and what closes it (ticked, dated, moved).
- How the collector and Progress Tracks avoid double counting, and whether the Shard notes' `## Open questions` is renamed (the Artifact code reads it).
- Sorting and filter fields (source note, note type, arc or plot, session raised, age).
- Whether the heading is in each template or added by Quick Capture and Close Session when needed (empty sections add clutter).
- The collector's home (Session planning template, a dashboard, or both) and the backup and link-scanner rules for new code notes.

### Review coverage (item 11)

Added 2026-10-23 at Gerald's requirement: when every item in the plan is done, no part of the vault may remain unreviewed. The project is not called complete until every row reads reviewed. "Reviewed" means each note was read and confirmed, updated, merged, archived or flagged for deletion. Player Wiki notes count; review them against [[Player Wiki Build Conventions]] and the Publish build rules.

| Area | Notes (recount 2026-10-30) | Status |
|---|---|---|
| Campaign root, Plot Threads, Party and Status, Arcs | 30 | reviewed 2026-10-23; second look 2026-10-25 and 26 |
| Characters/NPCs | 74 | reviewed 2026-10-23; second look and Tier 1 hubs 2026-10-26 |
| Lore | 15 | curated 2026-10-23; **confirm as reviewed** |
| Characters/Factions | 19 | Part D done except the three core factions (Opus faction pass) |
| Objects | 33 | reviewed 2026-10-25 |
| Characters/Adversaries | 14 | reviewed; Eledyr Dephar waits on his design topic |
| Worlds (Exandria, Keln, Planar) | 58 | reviewed 2026-10-29 (batches 1 to 7) |
| Characters/Creatures | 5 | reviewed 2026-10-29 |
| Session Notes | 79 | reviewed 2026-10-29; every session note's number and date matches the player notes (54 nights, 1 to 54, plus the prologues and Session Zero as 0.1 to 0.3 and 0) |
| Future Keln Campaign, One-Shots | 2 | reviewed 2026-10-29 |
| 00 DM Screen notes, tools and code | 58 | reviewed 2026-10-29 (batches 1 to 8) |
| Player Wiki | 118 | reviewed 2026-10-29 (batches A to D) |
| z_Templates | 28 | audited 2026-10-22 (code); **confirm**; the secret-section templates were updated 2026-10-29 |
| z_Reference | | limited check only (stray tagged copies of notes with `inline-events` or `fc-date`, backups without `.bak`, files that belong elsewhere) |
| z_Archive | | out of scope |
| Structure pass (whole vault) | | done 2026-10-29 |

### Final verification

Gerald confirms the items marked Obsidian. Done and confirmed in Obsidian 2026-10-23: session notes linked, Bases and Datacore views (Session Hub, Recent Work.base, Related Notes.base, the 00 DM Screen hub, Lorestone hub, NPC Browser, Aveqtaro tracker), tags in the tag pane, `tag:#campaign/eryndor` search, links between notes, GitHub sync (pushes work).

| Item | Status |
|---|---|
| Claude project can see campaign content | partly: project search returns campaign notes, but its copy of some notes (Aveqtaro Thaan) was older than the vault. The project lags the vault; recheck at Final verification |
| Review coverage (the table above) | open: Lore and z_Templates confirmations, the three core factions (Opus faction pass), Eledyr Dephar |
| Vault Conventions counts | open: stale (NPC 89 vs 74, Faction 24 vs 19, Lore 12 vs 15, Player Wiki 116 vs 118, Encounter row still 0 against 14 tagged notes; others to recount). Do last |
| Link scan | rerun; expect 0 new against the baseline |

### Recommended next step

See the Project map at the top of this note. The step marked "now" is the next step.

### Stage summary

Each stage ended with a Checkpoint: link scan at the baseline (0 new), tags and properties against Vault Conventions, backup endings, leftovers, Parked work rows with a pass. Backups of every change are in dated folders under `z_Reference/template-backups/`. The exact lines are in the history note.

| Stage | Dates | What it did | Result |
|---|---|---|---|
| Reconciliation and setup | 2026-10-22 | Read the four plans against the vault; created this note; archived the plans; audited 504 notes into [[Vault Conventions - DM]]; template refactor (shared code in `z_Templates/Scripts/dm_helpers.js`, Faction type tag `organization`, Arc Template rebuilt); four property and tag decisions applied | Template mock tests passed; not run in Obsidian at the time |
| NPC audit | 2026-10-22 to 23 | Bramwell Bellweather filled; Lady Emer, Vaud Qalix and Korfel Withrethin rebuilt as Tier 1; NPC placement sweep and renames; Brother Kelmen - DM created | Tier 1 hubs done |
| Naming and links | 2026-10-23 | DM suffix rename; link scanner written; link cleanup batches 1 to 4; Calendarium duplicates fixed by renaming 16 backups to `.bak` | 0 unplanned unresolved links; duplicates gone (Gerald confirmed) |
| Part D triage | 2026-10-23 to 26 | Campaign folder, Plot Threads, Party, Arcs, Toril and Exandria NPCs in ten batches, Factions (core three parked for Opus), Objects (Lorestone hub, tracker, eight Shards), four Adversaries; second look at the campaign and NPC folders (active and upcoming threads, arcs, Tier 1 NPCs, parked rows); Vault Health.base built | Obsidian checks passed 2026-10-23 and 2026-10-25 |
| Region rule | 2026-10-26 to 28 | Location model designed (Opus); Location Engine Spec; migration steps 0 to 6 (properties, embeds, folders, templates and helpers, hubs, location checks, tags, documentation); backups renamed to `.bak` | Core tests 50 of 50; Obsidian checks passed |
| Worlds review | 2026-10-26 to 29 | Seven batches (tags and mechanics; Molaesmyr set and Cyrios Mountains; Molaesmyr timeline retcon; missing notes; Dwendalian Empire and Whitestone; Port Damali and Menagerie Coast; Keln, Planar, tables and Draconia) and a Checkpoint | 58 notes reviewed |
| Creatures, Sessions, One-Shots | 2026-10-29 | Seven batches: Creatures, Future Keln Campaign, One-Shots, Sessions 49 to 54, Planning, Arcs 1 to 5 session notes; all 54 nights numbered and dated against the player notes | Reviewed |
| DM Screen tools and code | 2026-10-29 | Eight batches and archive moves (old scripts and NPC tag cleanup files to `z_Archive/`) | 58 notes reviewed; `.scripts` keeps the scanner, planned-targets file, `rename_dm_suffix.py` and `location_core_tests` |
| Player Wiki | 2026-10-29 | Batches A to D against DM twins and Build Conventions | 118 notes: published, player-facing, no secret callouts; 70 have no DM twin by design |
| Duplicates and misfiled notes | 2026-10-29 | Survey of 530 live notes; Xhorhas Landing and The Unshaken moved; `90 Player Preferences` renamed Player Preferences and moved to Party; no duplicate notes | Done; Capture of Melthes stays for the Opus faction pass |
| Secrets-as-checklists | 2026-10-29 | Templates and Vault Conventions updated; 521 lines in 57 notes converted in six batches (each changed line differs from its backup only by the inserted `[ ] `); 7 numbered-list lines converted at the Checkpoint | Gerald's Obsidian tests pass; Eledyr and Shard Who knows lines left on purpose |
| Housekeeping | 2026-10-29 to 30 | Project map rewritten and ordered (Final verification before the optional tasks); delete list verified (nothing left to delete: only `.DS_Store` files and a `.trash` folder holding one; kept on purpose: 55 unreferenced Roll20 tokens in `z_Assets`, the Alt trees in `z-Mechanics`); this note condensed | Done |

### Phase log

Newest at the bottom. Format: `YYYY-MM-DD | phase | what changed | result`. Full detail for 2026-10-22 to 2026-10-30 is in the history note.

2026-10-29 | Checkpoint after the Secrets-as-checklists pass | Link scan, tags and properties, backup endings, leftovers, Parked work and this note checked. Only Eledyr Dephar (69 lines) and label lines keep plain bullets; the 27 Shard Who knows lines stay as data | Link scan 47 outside code (43 planned, 4 known), 0 new. Template tests 40 of 40, core tests 50 of 50. Files for Gerald to delete: none. Backup in z_Reference/template-backups/2026-10-29 Secrets checklists checkpoint/before (.bak)

2026-10-29 | Secrets-as-checklists pass, Obsidian check | Gerald reported his tests pass (converted notes and new template text). Gerald commits the Checkpoint's uncommitted files himself | Status note only

2026-10-29 | Project map rewrite and order | Done, In progress and Still to come rewritten; Final verification moved before the optional tasks (Gerald agreed) | Link scan 0 new. Backups in z_Reference/template-backups/2026-10-29 Project map rewrite and 2026-10-29 Project map order (.bak)

2026-10-29 | Delete list check | Every file named for deletion earlier is gone; kept on purpose: 55 unreferenced Roll20 tokens in z_Assets, the Alt trees in z-Mechanics | Files for Gerald to delete: none

2026-10-30 | Status note condensed (Sonnet) | Gerald asked for a review of the whole note for stale or inaccurate text and a condensed log. Moved the full Phase log (155 KB), Current state and Remaining work to [[Vault Reorganization History 2026-10-22 to 2026-10-30]]; replaced them with Rulings, Undo and recovery, Link scan baseline, Completed plans, Open design items, Review coverage, Final verification and the Stage summary. Fixed stale text: counts in the review table (recounted), the Ruins of Molaesmyr planned target (the old text said Marethis), the 'Known quirks' reference in the Vault sync row, the pre-Region-rule tag counts and the retired 'Remaining work' items; added a Parked row for the Shard Who knows lines | Backup in z_Reference/template-backups/2026-10-30 Status note condense/before (.bak)
