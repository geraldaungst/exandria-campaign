---
cssclasses:
  - wide-page
---

## Vault Reorganization Status: DM Vault

Location: the Vault Maintenance folder inside the DM Screen folder. The plugin migration is complete; its note, Plugin Migration Status - DM, was archived on 2026-10-29 and its standing rules moved to [[Vault Conventions - DM]]. This note holds current state, the rules for every pass and the remaining work. History is condensed (2026-10-30): the Stage summary at the bottom says what each stage did, and the full Phase log of 2026-10-22 to 2026-10-30 sits in the note Vault Reorganization History 2026-10-22 to 2026-10-30. On 2026-10-30 the finished-pass material (every pass backup, the one-use scripts, the old plans, the history note and Open Issues Review) was moved out of the vault to the Pass Archive, `DM Vault Deprecated Content/2026-10-30 Reorganization/` beside the vault. It keeps the vault paths, so a path below such as `z_Archive/Scripts/…` or `z_Reference/template-backups/…` is read inside the Pass Archive. Read the history only when a question needs the exact record of a past change.

### How Claude should use this note

- Read all of it before proposing anything. The archived documents and the history note are not updated; where they disagree with this note, this note wins.
- Start every conversation with the "You are here" marker from the Project map, then follow the Working rules.

### Project map

**Vault reorganization. You are here: note triage, Review of the remaining areas done 2026-10-29 (Worlds and Creatures, Sessions, One-Shots, DM Screen tools and code, and Player Wiki, Checkpoints included); the Duplicates and misfiled-notes pass done 2026-10-29 (survey, batches 1 and 2, Checkpoint); the Secrets-as-checklists pass done 2026-10-29 (batches 1 to 5, Checkpoint, Obsidian checks passed); the Open Issues collector done 2026-10-30 ([[Open Issues Spec]]; build steps 1 to 8; migration; priority review of the 217 open issues, 19 marked; Checkpoint passed); the Opus faction pass done 2026-10-30 (three core factions rebuilt, four atomic notes, the Artifact Pieces holder fix); the Eledyr pass done 2026-10-30 (Eledyr Dephar rewritten; he is in Zadash); the Open Issues copies cleanup done 2026-10-30 (the 18 Priority issues in batches 1 and 2, non-Priority clusters in batch 3); the Confirmations for Final verification done 2026-10-30 (Lore and z_Templates confirmed, Vault Conventions counts recounted); this status note condensed 2026-10-30; Final verification done 2026-10-30; the Pass Archive move and the DM Screen subfolders done 2026-10-30; next the vault sync migration, in its own conversation**

**Done**
1. Structure
2. Tags, properties and templates
3. Plugin migration (Omnisearch stays; Gerald's final keep-or-remove decision waits for live use and is outside the project)
4. NPC audit
5. Links and naming
6. Vault Health dashboard
7. Region rule (location properties, the core engine, hubs, templates, checks and migration; 2026-10-28)
8. Note triage and review of every area (2026-10-23 to 2026-10-29; the Stage summary below lists the passes): campaign folder, Plot Threads, Party, Arcs; NPCs (74); Factions (the three core factions in the Opus faction pass); Objects; Adversaries (Eledyr Dephar in the Eledyr pass); Worlds (58); Creatures, Sessions (all 54 nights numbered and dated against the player notes) and One-Shots; DM Screen tools and code (58); Player Wiki (118)
9. Duplicates and misfiled-notes pass (2026-10-29; no duplicate notes found)
10. Secrets-as-checklists pass (2026-10-29): templates and Vault Conventions updated, 521 lines in 57 notes converted; Gerald's Obsidian tests pass. Eledyr Dephar's 69 lines were converted in his rewrite (2026-10-30); the Shard notes' Who knows lines stay as data
11. Open Issues collector (2026-10-30; design and priority review Opus, build Sonnet): `## Open Issues` and `## Seeds Planted` sections on any DM note; one Datacore collector with a full view ([[Open Issues]]) and one compact view on both hubs; 217 open issues, 19 marked Priority, 11 open seeds. Rules in [[Vault Conventions - DM]]; design in [[Open Issues Spec]]
12. Opus faction pass (2026-10-30, Opus): Emissaries of the Sunfall - DM, Obsidian Echoforge - DM and Malachite Cord - DM rebuilt on the Faction Template; Legacy of the Seekers, The Massacre (785 PD), The Capture of Melthes (moved to `Events/`) and The Legend of the Aurora's Ascendant on the Atomic Note template; Valen's role, the Cobalt Soul's knowledge of Shard 5, the Ashari and the Verdant Codex settled; Artifact Pieces honours a holder's own `personal` Who knows line
13. Eledyr pass (2026-10-30, Opus): Eledyr Dephar rewritten on the NPC Template and his secret lines converted. He is in Zadash, about a week ahead of the party, on a Clasp posting he asked for (sizing up the Zadash Myriad after the crackdown) and doing prophecy research for Valen's Inkwell under a scholar's cover; Korfel wants him gone and may offer him to Qilynn. Small fixes to the notes that depend on him
14. Open Issues copies cleanup (2026-10-30, Sonnet): an issue raised on several notes now stays open only on the note it concerns; each copy is ticked with `(Open on` and a link to that note. 28 copies ticked across the 18 Priority issues and 9 further clusters; the Consecution's Hope line lists the three notes to revisit when it resolves. 182 open issues remain
15. Confirmations for Final verification (2026-10-30, Sonnet): Lore (`world/exandria` on 10 notes, Prophecy General Info items 6 and 8 brought into line with the faction ruling, one Open Issue added, a template placeholder and a typo fixed); z_Templates (Hub Config gained `tag_encounter`; Note Refactor Template gained the placeholder fix and the two sections); Vault Conventions counts recounted from the vault and the `world/` rule clarified
16. Final verification (2026-10-30, Sonnet): Review coverage and Vault Conventions counts done; link scan 0 new; no retired tags or properties on live notes; no temporary notes, stray scripts or non-`.bak` backups; Gerald's Obsidian check of The Prophecy passed; the Claude project's Player Wiki Build Conventions refreshed from the vault
17. Pass Archive move (2026-10-30, Sonnet): 1,847 files (28 MB) moved out of the vault to `DM Vault Deprecated Content/2026-10-30 Reorganization/`: every pass backup, the one-use scripts, the old plans and history, Open Issues Review. Copied and checksum-verified before the originals were removed; references fixed in five notes. `z_Archive/Campaigns` and `z_Archive/Objects` stay
18. DM Screen subfolders (2026-10-30, Sonnet): the 6 vault maintenance documents moved to `00 DM Screen/Vault Maintenance/` and 14 reference tools to `00 DM Screen/Reference/`. Table References and Prices Card stay in `00 DM Screen/` because Session Hub and Item Finder read their paths. Handoff prompts use the new path `00 DM Screen/Vault Maintenance/Vault Reorganization Status - DM.md`

**In progress**
- Nothing is running now. Everything under Still to come waits on Gerald or on its own conversation.

**Still to come** (in order; Gerald decided the order 2026-10-29 and moved Eledyr ahead of the copies cleanup 2026-10-30)

1. **Vault sync migration** (own conversation; Final verification finished 2026-10-30): see the Parked work row

*After Final verification: optional, at Gerald's pace*
- **Lorestone clue path** (Opus; the faction pass it waited on is done): how clues route the party to Aveqtaro in Rosohna on the way to the Ebonglass Massif; Ovedo's lens and whether the Empire or Cobalt Soul holds a Luxon Beacon
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
- Each batch ends with a Phase log line: `YYYY-MM-DD | phase | what changed | result`. Keep lines short: what changed, the result, the backup folder. At each stage's Checkpoint, condense that stage's lines into one row of the Stage summary and move the full lines to a history note in `z_Archive/Vault Reorganization/` (the 2026-10-22 to 2026-10-30 one is in the Pass Archive), so the next conversation reads a small note.

#### Models and conversations

- Opus for design with lasting effects and for merges that decide which version of a fact is canonical. Sonnet for applying decisions already made.
- When a note or pass needs Opus, say **SWITCH TO OPUS** in bold, name the note and why, and wait. Say when to switch back.
- Start a new conversation when the current one is mostly unrelated tool output or the topic changes. Gerald commits first.
- Handoff prompts point to this note and name the task. They separate what Gerald decided from what Claude proposed.

### Parked work

Every row names the pass that picks it up. Rows are removed when done; the Phase log keeps the record.

| What | Where | Why parked | Picked up by | Found |
|---|---|---|---|---|
| Varnes Dwell - DM rewrite: reconcile the pre-play plan (petrified at the Keep, rescue, recovery, travel west) with Sessions 32-35, Cloudfang Keep - DM, Ilya's notes and Rescue Ilya's Brother. Also settle how Lady Emer restored Varnes from stone (Sessions 32-33), the Open Issue in Rescue Ilya's Brother. Tagged `needs-work` | Characters/NPCs | Needs Opus | Design topic: Varnes Dwell - DM rewrite (own conversation, Opus) | 2026-10-23 |
| Location auto-fix: a DM place note with no parents, whose player twin has parents, takes the DM twins of those parents (or the player note when a parent has no DM twin); the Vault Health view "Places with no parent" lists 24 DM notes where the core finds 8 because Bases cannot read twins | Worlds | Gerald's idea 2026-10-27; not designed | Design topic: Location auto-fix (own conversation) | 2026-10-28 |
| Ceratos stat block (unfinished; planning notes recorded in the note), Qalix confrontation level (hub ~18 vs Adaptable Modules 18 with Ceratos 19-20), Shoagragoth encounter and custom stat block | Characters/Adversaries | Years away; Open Issues in each note | None until the encounters are near | 2026-10-25 |
| Empty folders kept on purpose: `Campaigns/Prophecy of Eryndor - DM/Encounters` (now holds Xhorhas Landing; more encounter notes will come) and `Campaigns/Prophecy of Eryndor - DM/Session Notes/Completed Sessions/Arc 6 - Deastok` (empty until Sessions 49-53 move there when the arc ends). Deastok place notes go in `Worlds/Exandria/Places/` | Campaigns | Planned content | Stays until the notes move there | 2026-10-27 |
| Ovedo's Xhorhasian lens: whether it vibrates near a Luxon Beacon (idea), what Ovedo knows, whether the Empire or Cobalt Soul holds a Beacon, and the clue route to Aveqtaro. Recorded as Open Issues on Archivist Ovedo | Characters/NPCs | Gerald's design call | Design topic: Lorestone clue path (Opus) | 2026-10-26 |
| Cree Deeproots's employment dates ("about 2-3 years") and her pass; Triotta and Guzezzik have no place tag (no source places them); Korvin and Shauna lack `disposition` | Characters/NPCs | Waits on a pass | Next pass on these notes (they keep `needs-work`) | 2026-10-26 |
| Kanka Master Build List (`Campaigns/Future Keln Campaign`, temporary note with an underscore name): archive it to `z_Archive/` when the Keln build is finished. Sections D (Tidemark Syndicate, Watcher's Rest Town Council) and E (quests) are not in the Keln notes yet | Campaigns/Future Keln Campaign | Gerald's trigger (Keln build finished); no pass owns it | Gerald, when the Keln build is finished; no pass | 2026-10-29 |
| Vault sync migration: move every Obsidian vault out of iCloud into a normal folder, one private git repo per vault, Obsidian Sync Plus for the phone, images out of git and compressed first. The decisions and the ready-to-use planning prompt are in the Claude conversation [Vault reorganization batch 4](https://claude.ai/chat/83141be4-5987-47db-96df-9e11b953fdc8). When it happens, rewrite the `.gitignore` lines here (the `.gitignore` row in 'Superseded or changed' below) and in Vault Conventions - DM, which describe the Claude-project restriction (see the `.gitignore` row in 'Superseded or changed' below) | Outside the vault; this note and `00 DM Screen/Vault Maintenance/Vault Conventions - DM` | Gerald parked it until the cleanup was done (Final verification finished 2026-10-30). The vault repo is already removed from the Claude project; campaign content now reaches it by adding the vault folder from Gerald's computer | Next: separate conversation | 2026-10-29 |

### Archived documents

Moved to the Pass Archive on 2026-10-30. Nothing in them is maintained; every open task is tracked here. Because the Pass Archive is outside the vault, anything still needed is copied into this note.

| Document | Final state |
|---|---|
| Vault Reorganization History 2026-10-22 to 2026-10-30 | The full Phase log (2026-10-22 to 2026-10-30), the Current state tables and the finished Remaining work items, as they stood on 2026-10-30 |
| DM_Vault_Reorganization_Plan | Phases 1-7 done. Phase 8 replaced by Revised Phase 8 |
| Revised Phase 8 | Parts A to F done (see Completed plans) |
| Exandria Vault Reorganization | Superseded. 38 of 73 tasks done; the 35 open tasks depend on the retired `processed` property and Dataview blocks |
| npc-folder-audit | Phases 1 to 5 done (see Completed plans) |

The Dataview code in these documents is documentation only. Dataview is no longer enabled (2026-10-27). Do not convert it. Other archives from this project are in the Pass Archive: `z_Archive/Scripts/` (old scripts, including `migrate_location.py` and `rename_backups_bak.py`), `z_Archive/Location Migration/`, `z_Archive/NPC Tag Cleanup/`.

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
- **Checklist convention (2026-10-29).** Anything the party may learn, and anything tracked or used in play (dialogue options, triggers, hooks), is `- []`, ticked when it happens. Voice, description, history, reference text and lines that only label a sub-list stay plain. When in doubt, convert: a checkbox on a plain item costs nothing. Code-parsed sections stay plain: the Shard notes' Who knows lines (read by Artifact Pieces) and the sections named by the other `heading_*` keys in Hub Config; Open Issues and Seeds Planted are checklists. Eledyr Dephar's lines were converted in his rewrite (2026-10-30). Templates for NPC, Location, Arc, Plot Thread and Artifact-Item write checklist lines. Open Issues and Seeds Planted entries follow the same rule; their closing words and the Priority label are in Vault Conventions - DM (2026-10-30).
- **Backups.** Every backup ends in `.bak`, in a new dated folder under `z_Reference/template-backups/`. Calendarium reads the whole vault and Publish publishes any `publish: true` note wherever it sits, so a `.md` backup of a note with the `inline-events` tag, an `fc-date` property or `publish: true` creates duplicate events or a duplicate page.
- **Naming.** The ` - DM` suffix is used only when a Player Wiki note has the same name; a DM note keeps its plain name until then. The suffix is the `dm_note_suffix` setting in Hub Config (read by Shared Helpers and `dm_helpers.js`); changing it later needs `.scripts/rename_dm_suffix.py` (edit OLD and NEW) for file names, and `Recent Work.base` line 18 is hard-coded.
- **Location model (Region rule, 2026-10-27 and 28).** The `world/` tag is the root, one value per plane; place notes carry `political_region` and `natural_region` link lists (nearest parent first); `whereabouts` places NPCs, faction bases and items; `site` places arcs and encounters; `ties_to` links related notes. The `place/` and `region/` tags are retired. Folders are `Worlds/<world>/<kind>/` (Places, Lore, Tables), with a bundle folder only for one item or place whose lore was split into atomic notes. Player place notes carry player links only; a DM note embeds its player twin collapsed.
- **Faction tags.** Faction notes carry `organization`. The file `Characters/Factions/Exandria/Gentleman's Organization` is the real faction note for Korfel Withrethin; never delete it. Origin decided: Babenon Dosal was the original Gentleman; Korfel tipped off the Crownsguard and killed him in the crackdown (winter 834-835) and appears undisguised.
- **Tier 1 NPC hubs** (reference card plus subnotes that each serve a distinct use): Aveqtaro Thaan (Aveqtaro Memory Recovery Tracker, What Aveqtaro Thaan Knows), Vaud Qalix (Qalix's Network, Vaud Qalix's Plan Outline), Korfel Withrethin (Korfel's Next Moves, Talking with Korfel), and the Lady Emer hub with three documents in `Characters/Adversaries/Lady Emer - DM/`. The Bramwell Bellweather epilogue closes in the Deastok arc.
- **Molaesmyr timeline (Opus retcon, 2026-10-28).** Two crossings, Ilixidor first: about 520 PD Ilixidor Alo anchors the Molaesmyr Fey Crossing (Labyrinth beneath Caes Mosor) with a shard set on the Fey side; about 525-535 PD the monastery uses the separate Savalirwood crossing; about 535 PD the monastery catastrophe; 585 PD the Rupture, and the shard stays Fey-side (Shard 8 is Ilixidor's). Rifts follow ley lines damaged by the Rupture; location follows the lines, size, plane, duration and effects stay random. Shoagragoth holds an accurate eyewitness account but does not know a crossing ruptured.
- **Plugins.** Omnisearch stays; Gerald's final keep-or-remove decision waits for live use and is outside this project. Dataview is removed. Templater and Tag Wrangler stay; Datacore and Bases are in use.
- **Core factions (Opus faction pass, 2026-10-30).** The Emissaries' partnership with the Echoforge is the order's sincere policy, begun by the moderates late in Talrek Sunshadow's leadership; Valen Elderguard won the leadership by promising to keep it, keeps it in public, and works against it through the Inkwell (financed by Qalix). Ovedo keeps Shard 5 from the Cobalt Soul; he told Varnes it was sanctioned. Ashari and Cord ties are cordial and situational, between individuals, not an alliance. The Verdant Codex original is at Odessloe (inner circle only); each cell's official copy was copied directly from it by an inner-circle member. The Massacre was in 785 PD.
- **DM Screen notes.** DM tools carry `dm-tool` plus `hide_from_related`; Player Wiki Build Conventions has `hide_from_related: true`; Table Rulings and Encounter Design Guide stay without it.

### Undo and recovery

- Backups, manifests and one-use scripts moved to the Pass Archive on 2026-10-30. Restore from there: copy the file back to its vault path and remove the `.bak`. `z_Reference/template-backups/` is gone from the vault; the next pass creates it again.
- Restore a note from a backup: remove the `.bak` and copy it over the live note. Dated folders are in `z_Reference/template-backups/` (in the Pass Archive).
- Location migration manifests (with `--undo`): `2026-10-27 Location migration step 1`, `step 2`, `step 3`, `2026-10-28 Location migration step 5`, each with a `manifest.json`. The script is `z_Archive/Scripts/migrate_location.py`; copy it back to `.scripts` to use it. Command shape: `python3.scripts/migrate_location.py <properties|embeds|folders|tags> --undo "<manifest path>"`.
- Older scripts with `--undo` (`fix_links_batch1` to `4`, `prune_plot_threads` and others, now in `z_Archive/Scripts/`) look for plain `.md` backup names: remove the `.bak` first. `rename_backups_bak.py --undo` reverses the 2026-10-28 `.bak` rename.
- The 16 Calendarium backup renames (2026-10-23) are listed in `z_Reference/template-backups/2026-10-23 calendarium backup copies/rename manifest.json.bak`.
- Open Issues collector (2026-10-30): backups are in the dated `z_Reference/template-backups/2026-10-30 Open Issues …` folders, one per batch. The one-use scripts (`migrate_step2.py`, `migrate_step3.py`, `migrate_step4.py`, `mark_priority.py`) are in `z_Archive/Scripts/`. They have no `--undo`: restore from the backups (remove the `.bak`).

### Link scan baseline

`.scripts/scan_unresolved_links.py` is read-only; it resolves by file name and handles aliases, headings, embeds and escaped pipes, ignores links in code, and `--json file` gives detail. Baseline on 2026-10-29: 3,778 links, 47 unresolved outside code. 43 of them point to 13 planned notes on purpose, listed in `.scripts/planned_link_targets.txt`: Xanaphia Lothliss, Odessloe, Ilixidor Alo, Illyndra Shadowveil, Cairel Ulthe, Hupperdook, Sunset Sail, Tur-Marethis, Kelmen Ritual Resolution, The Ring, Ruins of Molaesmyr, Watcher's Knee, Varrin. When one of those notes is written, delete its name from the file; if the plan is dropped, strip its links first. The other 4 are `[[Player Wiki Ledger]]` and `[[Player Wiki Scope Checklist]]` in Player Wiki Build Conventions (Claude-project documents, not vault notes). Each pass must end at 0 new. Stripped Deastok survey-crew NPCs (Jorun, Aldous, Wenna, Brynna, Erma) get their links back if they become notes.

### Completed plans

- **Reorganization Plan, phases 1-7:** done. **Revised Phase 8:** A (properties and tags; the `processed` workflow retired), B (Tyranny NPCs retagged), C (templates simplified and re-audited 2026-10-22), D (file triage, then the area reviews), E (verification, confirmed in Obsidian 2026-10-23) and F (Vault Health dashboard: `Vault Health.base` with Needs work, NPC gaps and Artifacts without world views, embedded on the 00 DM Screen hub; orphans left to Janitor) are done.
- **NPC folder audit:** satellites merged into Tier 1 and Tier 2 notes; Aveqtaro Thaan, Vaud Qalix and Korfel Withrethin rebuilt as Tier 1 hubs; the NPC-placement sweep found no non-NPC notes in `Characters/NPCs` (four antagonists moved to Adversaries; Ilya the Sorceress moved in and became [[Ilya the Sorceress - DM]]); the NPC template was applied to the second-look list on 2026-10-26. Minor notes keep `needs-work` and move onto the template when Gerald uses them.
- **Bulk fixes:** DM suffix rename (46 notes and 8 folders, 740 links repointed, 2026-10-23); four link-cleanup batches (2026-10-23); Calendarium duplicate events fixed by the `.bak` rule (2026-10-23); Region rule migration (2026-10-27 to 28).

### Open design items

None open. Eledyr Dephar's relevance and whereabouts were settled in the Eledyr pass (2026-10-30).

### Review coverage

Added 2026-10-23 at Gerald's requirement: when every item in the plan is done, no part of the vault may remain unreviewed. The project is not called complete until every row reads reviewed. "Reviewed" means each note was read and confirmed, updated, merged, archived or flagged for deletion. Player Wiki notes count; review them against [[Player Wiki Build Conventions]] and the Publish build rules.

| Area | Notes (recount 2026-10-30) | Status |
|---|---|---|
| Campaign root, Plot Threads, Party and Status, Arcs | 30 | reviewed 2026-10-23; second look 2026-10-25 and 26 |
| Characters/NPCs | 74 | reviewed 2026-10-23; second look and Tier 1 hubs 2026-10-26 |
| Lore | 15 | reviewed 2026-10-30 (curated 2026-10-23) |
| Characters/Factions | 19 | reviewed; the three core factions rebuilt 2026-10-30 (Opus faction pass) |
| Objects | 33 | reviewed 2026-10-25 |
| Characters/Adversaries | 14 | reviewed; Eledyr Dephar rewritten 2026-10-30 (Eledyr pass) |
| Worlds (Exandria, Keln, Planar) | 58 | reviewed 2026-10-29 (batches 1 to 7) |
| Characters/Creatures | 5 | reviewed 2026-10-29 |
| Session Notes | 79 | reviewed 2026-10-29; every session note's number and date matches the player notes (54 nights, 1 to 54, plus the prologues and Session Zero as 0.1 to 0.3 and 0) |
| Future Keln Campaign, One-Shots | 2 | reviewed 2026-10-29 |
| 00 DM Screen notes, tools and code | 58 | reviewed 2026-10-29 (batches 1 to 8) |
| Player Wiki | 118 | reviewed 2026-10-29 (batches A to D) |
| z_Templates | 28 | reviewed 2026-10-30 (code audited 2026-10-22; secret and Open Issues sections checked against Vault Conventions; all test suites pass); the secret-section templates were updated 2026-10-29 |
| z_Reference | | limited check only (stray tagged copies of notes with `inline-events` or `fc-date`, backups without `.bak`, files that belong elsewhere) |
| z_Archive | | out of scope |
| Structure pass (whole vault) | | done 2026-10-29 |

### Final verification

Gerald confirms the items marked Obsidian. Done and confirmed in Obsidian 2026-10-23: session notes linked, Bases and Datacore views (Session Hub, Recent Work.base, Related Notes.base, the 00 DM Screen hub, Lorestone hub, NPC Browser, Aveqtaro tracker), tags in the tag pane, `tag:#campaign/eryndor` search, links between notes, GitHub sync (pushes work).

| Item | Status |
|---|---|
| Claude project can see campaign content | done 2026-10-30: the vault repo was removed from the project by Gerald; campaign content now reaches the project by adding the vault folder from his computer (a different mechanism, same access). The project's Player Wiki Build Conventions was refreshed from the vault. Its other 41 documents are standalone; `encounter-template.md` is an older version of the Encounter Template and was left as is |
| Review coverage (the table above) | done 2026-10-30: every row reviewed |
| Vault Conventions counts | done 2026-10-30: every count recounted from the vault |
| Link scan | done 2026-10-30: 47 outside code (43 planned, 4 known), 0 new |

Final verification complete 2026-10-30.

### Recommended next step

See the Project map at the top of this note. The step marked "now" is the next step.

### Stage summary

Each stage ended with a Checkpoint: link scan at the baseline (0 new), tags and properties against Vault Conventions, backup endings, leftovers, Parked work rows with a pass. Backups of every change are in dated folders under `z_Reference/template-backups/` (in the Pass Archive since 2026-10-30). The exact lines are in the history note.

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
| Secrets-as-checklists | 2026-10-29 | Templates and Vault Conventions updated; 521 lines in 57 notes converted in six batches (each changed line differs from its backup only by the inserted `[] `); 7 numbered-list lines converted at the Checkpoint | Gerald's Obsidian tests pass; Eledyr and Shard Who knows lines left on purpose |
| Housekeeping | 2026-10-29 to 30 | Project map rewritten and ordered (Final verification before the optional tasks); delete list verified (nothing left to delete: only `.DS_Store` files and a `.trash` folder holding one; kept on purpose: 55 unreferenced Roll20 tokens in `z_Assets`, the Alt trees in `z-Mechanics`); this note condensed | Done |
| Open Issues collector | 2026-10-30 | Design (ten decisions); build steps 1 to 8: Hub Config keys and Shard heading, parser and tests, `plotConnections` and `partyPlaceOf` exported, full view, one compact view on both hubs, eight templates plus two Session template lines, documentation; migration (15 plain bullets to tasks, seeds into Seeds Planted sections, the Seeds Planted note archived, four questions found outside the sections); priority review (19 marked) | 217 open issues, 11 open seeds, 0 format problems; Gerald's Obsidian checks passed; Checkpoint: link scan 0 new, all test suites pass |
| Opus faction pass | 2026-10-30 | Emissaries, Echoforge and Malachite Cord rebuilt on the Faction Template; Legacy of the Seekers, The Massacre, The Capture of Melthes (moved to `Events/`) and The Legend of the Aurora's Ascendant on the Atomic Note template; rulings in Rulings (Core factions); 7 Open Issues ticked with their copies, 2 added, 3 seeds added; small fixes to 17 linked notes; Artifact Pieces: a holder's own `personal` Who knows line keeps the hold off their factions (new grid test) | Link scan 0 new; all test suites pass (artifact pieces 10); Open Issues 212 open, 18 priority, 0 format problems |
| Eledyr pass | 2026-10-30 | Eledyr Dephar rewritten on the NPC Template (Opus); 69 secret lines converted; small fixes to nine notes that depend on him | Link scan 0 new; Open Issues 210 open, 13 closed, 18 priority, 0 format problems |
| Open Issues copies cleanup | 2026-10-30 | Gerald chose the pointer format (a copy is ticked with `(Open on` and a link to the home note); the 18 Priority issues scanned for copies by meaning (13 copies ticked in batches 1 and 2), then the scope widened to non-Priority issues (batch 3: 9 more clusters, 15 copies, homes agreed with Gerald) | Link scan 0 new; Open Issues 182 open, 41 closed, 18 priority, 14 open seeds, 0 problems |
| Confirmations for Final verification | 2026-10-30 | Lore: `world/exandria` on 10 notes, Prophecy General Info items 6 and 8 and a new Open Issue, a template placeholder and a typo. z_Templates: `tag_encounter` in Hub Config; Note Refactor Template placeholder and the two sections. Vault Conventions: every count recounted, `world/` rule clarified | Link scan 0 new; all test suites pass; Open Issues 183 open, 41 closed, 18 priority, 14 open seeds, 0 problems |
| Final verification | 2026-10-30 | Link scan; retired tags and properties; leftovers (temporary notes, scripts, empty folders, backup endings); Claude project check (vault repo removed by Gerald, campaign content now added by folder; Player Wiki Build Conventions refreshed); Gerald's Obsidian check of The Prophecy | Link scan 0 new; no retired tags or properties on live notes; Arc 6 - Deastok is the only empty folder (kept on purpose) |
| Pass Archive move | 2026-10-30 | Gerald asked for files not part of the active vault to be collected outside it. Scan; script `move_out.py` (dry run, tested on a copy, copy with checksums, remove); references fixed in this note, DM Hubs Design, Open Issues Spec, Location Engine Spec and Vault Conventions | 1,847 files (28 MB) moved; link scan 0 new |
| DM Screen subfolders | 2026-10-30 | Gerald asked which files in `00 DM Screen` are used at prep or in a session. Scan by inbound links, hub cards and code paths; `move_dm_screen.py` (dry run, tested on a copy, manifest for undo); four path edits (this note, `rename_dm_suffix.py`, `location_core.js`) | 20 notes moved; link scan 0 new |

### Phase log

Newest at the bottom. Format: `YYYY-MM-DD | phase | what changed | result`. Full detail for 2026-10-22 to 2026-10-30 is in the history note.

2026-10-29 | Checkpoint after the Secrets-as-checklists pass | Link scan, tags and properties, backup endings, leftovers, Parked work and this note checked. Only Eledyr Dephar (69 lines) and label lines keep plain bullets; the 27 Shard Who knows lines stay as data | Link scan 47 outside code (43 planned, 4 known), 0 new. Template tests 40 of 40, core tests 50 of 50. Files for Gerald to delete: none. Backup in z_Reference/template-backups/2026-10-29 Secrets checklists checkpoint/before (.bak)

2026-10-29 | Secrets-as-checklists pass, Obsidian check | Gerald reported his tests pass (converted notes and new template text). Gerald commits the Checkpoint's uncommitted files himself | Status note only

2026-10-29 | Project map rewrite and order | Done, In progress and Still to come rewritten; Final verification moved before the optional tasks (Gerald agreed) | Link scan 0 new. Backups in z_Reference/template-backups/2026-10-29 Project map rewrite and 2026-10-29 Project map order (.bak)

2026-10-29 | Delete list check | Every file named for deletion earlier is gone; kept on purpose: 55 unreferenced Roll20 tokens in z_Assets, the Alt trees in z-Mechanics | Files for Gerald to delete: none

2026-10-30 | Status note condensed (Sonnet) | Gerald asked for a review of the whole note for stale or inaccurate text and a condensed log. Moved the full Phase log (155 KB), Current state and Remaining work to Vault Reorganization History 2026-10-22 to 2026-10-30 (now in the Pass Archive); replaced them with Rulings, Undo and recovery, Link scan baseline, Completed plans, Open design items, Review coverage, Final verification and the Stage summary. Fixed stale text: counts in the review table (recounted), the Ruins of Molaesmyr planned target (the old text said Marethis), the 'Known quirks' reference in the Vault sync row, the pre-Region-rule tag counts and the retired 'Remaining work' items; added a Parked row for the Shard Who knows lines | Backup in z_Reference/template-backups/2026-10-30 Status note condense/before (.bak)

2026-10-30 | Open Issues build step 8 of 8 (Sonnet) | Documentation, each draft approved by Gerald: Vault Conventions (the two sections, closing words, Priority label, hooks versus seeds, Who knows lines as a permanent exception), Hub Config prose, DM Hubs Design (module, collector section, both hub tables, Campaign planning row), Open Issues Spec (status, as-built record in section 6), Open Issues Review (what happened). Gnurlsotten's Nosh & Nip - DM: the splurge-items hook merged into its seed (Session 48 link); the Gnurlsotten arc's Seeds Planted line (banked trial ideas, never shown to the players, already a hook on the place note) removed. This note: Project map, Done item 11, Still to come (new item 2, Open Issues copies cleanup), Shard Who knows Parked row removed, Stage summary; the 13 collector Phase log lines moved to the history note; migrate_step2/3/4.py and mark_priority.py moved to z_Archive/Scripts | Full-vault run: 217 open issues, 2 closed, 19 priority, 11 open seeds (1 closed) in 8 notes, 0 format problems. Backup in z_Reference/template-backups/2026-10-30 Open Issues build step 8/before (.bak)

2026-10-30 | Checkpoint after the Open Issues collector | Link scan, tests, tags and properties, backup endings, leftovers, Parked work and this note checked. Link scan 47 outside code (43 planned, 4 known), 0 new. Tests all pass: collector 14, 8, 3 and 9; location core 50, templates 40, session hub 5, artifact pieces 9, hub views 5, location checks 7, NPC browser 9, change form 8, close session 6. No.md under template-backups outside draft/. Leftover scripts: the four one-use scripts moved; the collector tests stay in.scripts/open_issues_tests. Empty folders: only Arc 6 - Deastok (kept on purpose). Every Parked row names a pass or a trigger. Files for Gerald to delete: none | Obsidian check passed 2026-10-30 (Gerald: Open Issues, the Session Hub and Gnurlsotten's Nosh & Nip - DM render as expected; all tests pass)
2026-10-30 | Opus faction pass prompt revised | The prompt now points to this note instead of repeating it. The findings and rulings that were only in the 2026-10-25 prompt (Cord members, Ashari, Cord awareness of the Emissaries, Echoforge Party Standing, Scroll and Scribe, Qalix's alliances, The Inkwell, Draconia stub) added to the first Parked row; the prompt-revision Parked row removed; Still to come item 1 updated | Backup in z_Reference/template-backups/2026-10-30 Opus faction pass prompt/before (.bak)

2026-10-30 | Opus faction pass (Opus) | Rebuilt Emissaries of the Sunfall - DM, Obsidian Echoforge - DM and Malachite Cord - DM on the Faction Template, and Legacy of the Seekers, The Massacre (785 PD, Gerald's date of 2025-10-12), The Capture of Melthes (moved to Events/) and The Legend of the Aurora's Ascendant on the Atomic Note template; each draft approved by Gerald. Rulings (Gerald): the Emissaries' partnership with the Echoforge is sincere and Valen subverts it; Ovedo keeps Shard 5 from the Cobalt Soul; Ashari and Cord ties are individual and situational; Verdant Codex original and official copies; tick every Open Issue settled in this conversation, with its copies. Ticked: Valen, Cobalt Soul (Priority) with copies on Archivist Ovedo and Cobalt Soul Archive in Rexxentrum, Ashari Riftguard, Verdant Codex, Scroll and Scribe. Small fixes: Factions with interest in the rifts, Shards 1 to 5 (Emissaries Who knows and Pursued by lines; Ovedo's personal line on Shard 5), Veyda, Lyren, Rinneth, Aethor Kalisk's Secret Mission (status paused, unfulfilled). Artifact Pieces: buildGrid honours the holder's own Who knows sharing field; doc line updated; new test | Link scan 47 outside code (43 planned, 4 known), 0 new. Tests all pass (artifact pieces 10, the new test fails on the old code). Open Issues full run: 212 open, 9 closed, 18 priority, 14 open seeds, 0 problems. Files for Gerald to delete: none. Backup in z_Reference/template-backups/2026-10-30 Opus faction pass/before (.bak)

2026-10-30 | Who knows what grid order (Opus, Gerald's request) | Artifact Hub Views: the grid lists the party first, then a "Factions" divider and the factions A to Z, then an "Individuals not in a faction" divider and those people A to Z; a divider shows only when its block has rows. Ordering moved into gridGroups; new test in hub_views_tests.js | All test suites pass (hub views 6); edited JSX parses; link scan 0 new. Obsidian check passed (Gerald, 2026-10-30: renders as expected). Files for Gerald to delete: none. Backup in z_Reference/template-backups/2026-10-30 Who knows grid order/before (.bak)

2026-10-30 | Still to come order (Gerald) | Eledyr moved ahead of the Open Issues copies cleanup: his rewrite settles the Priority issue on Qilynn Duskwhisper's Revenge and the Eledyr issues on Valen Elderguard, the Emissaries note and the plot thread, so the cleanup then works on a stable set; Opus work first, then Sonnet for the cleanup and the Confirmations. Project map updated | Backup in z_Reference/template-backups/2026-10-30 Still to come order/before (.bak)

2026-10-30 | Eledyr pass (Opus) | Decisions (Gerald): Eledyr still matters, mainly as Qilynn's antagonist; he is in Zadash, about a week ahead of the party, on a Clasp posting he asked for (how weak the Zadash Myriad is after the crackdown, whether the Clasp can push in), with prophecy research at the Valley Archive as his cover and real work for Valen; he works for the Inkwell; he has never seen Korfel and does not suspect a new Gentleman; he does not know Yrene named him; Korfel wants him gone and may offer him to Qilynn, otherwise he flees to Rexxentrum; the drow line about more shards dropped. Rewrote Eledyr Dephar on the NPC Template (one Hidden Information callout, Background and Stats callouts, Open Issues; `faction/clasp` and `ties_to` added; whereabouts Zadash - DM; retired-plan lines dropped, still in the archived checklist). Qilynn Duskwhisper's Revenge: three issues ticked (time-sensitive research settled; promise and justice-or-confrontation left to play), the Priority issue reworded and left open (Gerald: not ticked until the encounter is planned or happens), What's Happening and Next Move updated. Valen Elderguard: Eledyr issue ticked, Current Situation fixed. Small fixes: Emissaries of the Sunfall - DM, Korfel's Next Moves, Zadash - DM, Clasp - DM, Aelorin Nightshade, Scroll and Scribe, Rexxentrum - DM, Vault Conventions. This note: map, Done 13, Still to come, Rulings, Parked row removed, Open design items, Review coverage, Stage summary | Link scan 47 outside code (43 planned, 4 known), 0 new. Open Issues full run: 210 open, 13 closed, 18 priority, 14 open seeds, 0 problems. Not opened in Obsidian. Eledyr's portrait embed (eledyr-dephar.jpeg) points to no file, as before. Files for Gerald to delete: none. Backup in z_Reference/template-backups/2026-10-30 Eledyr pass/before (.bak)

2026-10-30 | Open Issues copies cleanup, batch 1 (Sonnet) | Gerald chose the pointer format: a copy is ticked with the words `(Open on` and a link to the home note, the home note keeps the issue and its Priority label. Qalix response and Rexxentrum heist issues (Qalix's Network L55, L56): 6 copies ticked on Vaud Qalix - DM (3), Korfel's Next Moves, Cobalt Soul Archive in Rexxentrum, Rexxentrum - DM. Left open by ruling or because the question differs: Valen Elderguard L65, Aveqtaro tracker L40, Restore Draconia L35, Calderax Dunhall L53. L54 (Dreyara report) has no open copies | Link scan 47 outside code (43 planned, 4 known), 0 new. Open Issues full run: 204 open, 19 closed, 18 priority, 14 open seeds, 0 problems. Not opened in Obsidian. Backup in z_Reference/template-backups/2026-10-30 Open Issues copies batch 1/before (.bak)

2026-10-30 | Open Issues copies cleanup, batch 2 (Sonnet) | Same pointer format. Scanned the 13 remaining Priority issues (not the Qalix cluster, Lady Emer's, or Eledyr's) for copies by meaning. 7 copies ticked: Shard 5 - Rexxentrum Shard (Lady Emer's Shard 5 question), Deastok - DM (Aldous and Truscans, one line covering both), Harmony Hall - DM (Rylan), Ceratos and Rendspawn (first Rendspawn encounter, stat block redesign), Rexxentrum - DM (Cobalt Soul leader), Ilya the Sorceress - DM (Drawg's commissions; the at-cost half stays open on Ilya's Realm Shop - DM). No copies: Hesterian's approach to the Myriad, Ovedo revealing Shard 5, Rexxentrum Archive layout, the Assembly facility, Zadash outside the Myriad. Left open as different questions: Korfel's Next Moves L93 and Hesterian's Infiltration L42 (Dechs's herbs). The Eledyr Priority issue and its copies stay open by ruling | Link scan 47 outside code (43 planned, 4 known), 0 new. Open Issues full run: 197 open, 26 closed, 18 priority, 14 open seeds, 0 problems. Test suites pass. Not opened in Obsidian. Backup in z_Reference/template-backups/2026-10-30 Open Issues copies batch 2/before (.bak)

2026-10-30 | Open Issues copies cleanup, batch 3 (Sonnet) | Gerald widened the scope to non-Priority issues. Nine clusters, homes approved by Gerald: Lady Emer's next move (home Lady Emer - DM; copies on Qalix's Network and Cloudfang Keep - DM), Echoforge and Shard 6 (Shard 6 - Marquet Shard; Assembling the Lorestone), Aveqtaro stage placements (the tracker; What Aveqtaro Thaan Knows, Aveqtaro Thaan), Melthes's status (Melthes; Rescue Melthes), Dreyara's agents (Qalix's Network; Dreyara Drimvar - DM), Ilixidor and the crossing (Shard 8 - Feywild Shard; two lines on Rupture of the Molaesmyr Fey Crossing), Port Zoon (Port Zoon - DM; Search for the Stonefoot Compass), Calderax's lost shard (Calderax Dunhall; Aelorin Nightshade), Scale Mail history (Scale Mail of the Frigid Doom; Veteran's Victory Vault). Cluster 10, Kryn expedition versus Drow ship: home Consecution's Hope, whose line now says to revisit Rotthold Evidence of Shoagragoth and Malastryx, Shoagragoth, The Acid Crown and Xagonstar when it resolves; their three copies ticked. 15 copies ticked in 15 notes; Lady Emer - DM lost its "same item as" parenthetical. Not copies, left open: Valen Elderguard L65 (ruling), the herb-contact lines, Celunor and Celdric lines | Link scan 47 outside code (43 planned, 4 known), 0 new. Open Issues full run: 182 open, 41 closed, 18 priority, 14 open seeds, 0 problems. Test suites pass. Not opened in Obsidian. Backup in z_Reference/template-backups/2026-10-30 Open Issues copies batch 3/before (.bak)

2026-10-30 | Confirmations for Final verification (Sonnet) | Gerald approved each draft. Lore row: `world/exandria` added to 10 notes (script tested on a copy); Prophecy General Info items 6 and 8 rewritten to the faction ruling and an Open Issue added (do the Emissaries know the Cord exists); Modern Text placeholder and Original Form typo fixed. z_Templates row: Hub Config gained `tag_encounter: encounter`; Note Refactor Template placeholder replaced and Open Issues and Seeds Planted added. Vault Conventions: counts recounted (world, unplaced, campaign, needs-work, NPC, Faction, Location, Artifact, Lore, Atomic, Encounter, DM Screen tools) and the `world/` rule clarified. Gerald deleted Arcs/Untitled.md (an empty plot thread stub). Review coverage and Final verification rows updated; the stale-counts Parked row removed | Link scan 47 outside code (43 planned, 4 known), 0 new. All test suites pass. Open Issues 183 open, 41 closed, 18 priority, 14 open seeds, 0 problems. Not opened in Obsidian. Files for Gerald to delete: none. Backups in z_Reference/template-backups/2026-10-30 Lore confirmation, 2026-10-30 z_Templates confirmation, 2026-10-30 Vault Conventions counts and 2026-10-30 Confirmations status note (.bak)

2026-10-30 | Final verification (Sonnet) | Link scan, retired tags and properties on live notes, leftovers (temporary notes, scripts, empty folders, backup endings), Review coverage and Vault Conventions counts checked. Claude project: Gerald removed the vault repo; campaign content now reaches the project by adding the vault folder from his computer. The project's Player Wiki Build Conventions (stale: it still told Claude to add region/ tags) was replaced with the vault copy; its other documents are standalone and left as they are. Gerald's Obsidian check of The Prophecy passed (items 6 and 8 read correctly, no Open Issues section in the embed). Project map, Done 16, Still to come, Final verification table, Parked work row and Stage summary updated | Link scan 47 outside code (43 planned, 4 known), 0 new. No retired tags or properties on live notes. Only empty folder: Arc 6 - Deastok (kept on purpose). Files for Gerald to delete: none. Backup in z_Reference/template-backups/2026-10-30 Final verification status note/before (.bak)

2026-10-30 | Pass Archive move (Sonnet) | Gerald approved the scope (template-backups, the old-procedure folders in z_Archive, Open Issues Review) and the destination `DM Vault Deprecated Content/2026-10-30 Reorganization/`. `.DS_Store` files left alone (Finder recreates them). `move_out.py` tested on a copy, then run on the vault: 1,847 files copied and checksum-verified, originals removed with Gerald's delete permission. Manifest and script saved in the Pass Archive. Kept in the vault: z_Archive/Campaigns and Objects, z_Templates, .scripts, z-Mechanics, z_Assets. References fixed in this note, DM Hubs Design, Open Issues Spec, Location Engine Spec and Vault Conventions (wikilinks to the moved notes became plain names) | Link scan 47 outside code (43 planned, 4 known), 0 new. Only empty folder: Arc 6 - Deastok (kept on purpose). Files for Gerald to delete: none. Backup of the five notes in z_Reference/template-backups/2026-10-30 Pass Archive move/before (.bak)

2026-10-30 | DM Screen subfolders (Sonnet) | Gerald approved the move list. Vault Maintenance (6): this note, Vault Conventions - DM, DM Hubs Design, Location Engine Spec, Open Issues Spec, Player Wiki Build Conventions. Reference (14): Climate Chart, Far Realm Effects, Fast NPC + Picture, Improv Rules Card, Location Idea Generator, NPC Stat Block Reference Table, Name Bank, Quick NPCs, Random Tavern, Reaction Card, Roll20 Script Reference, Session Rewards Reference, Table Rulings, Table Sites. Table References and Prices Card stay (Session Hub and Item Finder read their paths); Code stays (every Datacore block spells its path). Path edits: this note (Location line and the sync migration row), `.scripts/rename_dm_suffix.py` (LOG_FILES), `z_Templates/Scripts/location_core.js` (comment). Obsidian's recent-files list shows stale entries for the moved notes (plugin file, not edited). Handoff prompts need the new path `00 DM Screen/Vault Maintenance/Vault Reorganization Status - DM.md` | Link scan 47 outside code (43 planned, 4 known), 0 new. Tests pass. Open Issues 183 open, 41 closed, 18 priority, 14 open seeds, 0 problems. Not opened in Obsidian. Files for Gerald to delete: none. Undo: manifest in z_Reference/template-backups/2026-10-30 DM Screen subfolders; backups there and in 2026-10-30 DM Screen subfolders housekeeping (.bak)
