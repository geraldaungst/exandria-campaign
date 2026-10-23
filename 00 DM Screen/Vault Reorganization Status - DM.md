## Vault Reorganization Status: DM Vault

Location: the DM Screen folder, next to [[Plugin Migration Status - DM]]. The plugin migration is complete and its record is closed; this note covers only the reorganization. It holds current state and remaining work, not history. History lives in the four archived documents and in the Phase log below, which starts at the reconciliation.

### How Claude should use this note

- Read all of it before proposing anything. The four archived documents are history only and are not updated; where they disagree with this note, this note wins.
- Verify against the vault before ticking or marking anything. Never tick on assumption.
- The vault syncs to a Claude project through GitHub, and the project copy can lag the vault. Check the vault first.
- Ask one or two questions at a time. Gerald decides; he tells Claude when the vault is closed and commits with Obsidian Git himself.
- Claude cannot delete files. Name the files for Gerald to delete.
- Check every wiki-link resolves before writing it, so no empty placeholder notes get created.
- After each completed item, give a log line (`YYYY-MM-DD | phase | what changed | result`). State what could not be tested in Obsidian.

### Archived documents

Archived to `z_Archive/Vault Reorganization/` on 2026-10-22. Nothing in them is maintained; every open task is tracked here. Because `z_Archive` is excluded from search and Bases, anything still needed is copied into this note.

| Document | Final state |
|---|---|
| [[DM_Vault_Reorganization_Plan]] | Phases 1-7 done. Phase 8 replaced by Revised Phase 8. Final checklist carried into "Final verification" below |
| [[Revised Phase 8]] | Part A done; B and C done per log; D, E, F carried into "Current state" below |
| [[Exandria Vault Reorganization]] | Superseded. 38 of 73 tasks done; the 35 open tasks depend on the retired `processed` property and Dataview blocks |
| [[npc-folder-audit]] | Phases 1-3 done; Phase 4 half done; Phase 5 open, carried into "Remaining work" below |

The Dataview code in these documents is documentation only. Dataview is disabled and will be deleted on or after 2026-10-28. Do not convert it.

### Rules to apply

Carried over from the audit and Phase 8 so the work does not depend on the archived files.

**Where things live:** `Campaigns/<campaign>/` (sessions, arcs, party, plot threads, status), `Characters/NPCs`, `Characters/Adversaries`, `Characters/Factions`, `Characters/Creatures`, `Worlds/<world>/<region>/`, `Objects/`, `00 DM Screen/`, `Player Wiki/` (published), `z_Templates`, `z_Reference`, `z_Archive`. The tag scheme is in [[Plugin Migration Status - DM]] under "Tag scheme".

**NPC tiers**
- **Tier 1, hub plus subnotes:** multiple active storylines, complex hidden agendas, or content serving different use cases (running a scene, planning behind-the-scenes moves, tracking a network). The hub is a concise reference card; each subnote serves a distinct use case, not just a different topic.
- **Tier 2, one comprehensive note:** the NPC Template in `z_Templates`. Quick Reference and roleplay always visible; hidden information, background and stats in default-collapsed callouts (`> [!secret]-`, `> [!note]-`).
- **Tier 3, minimal:** a short note or a row in Quick NPCs.

**Should this be a separate note?** Yes if any apply: (1) it is referenced from two or more unrelated contexts; (2) it is a different use case from the parent; (3) it is long enough (roughly 15 lines with its own headings) to make the parent feel like noise; (4) it is a location, item, event or faction filed as an NPC. Otherwise it belongs in the parent, as a collapsed callout if brief.

**Merge pattern:** single-owner satellites (status, description, "what X knows" fragments) merge into the parent NPC, condensed to scannable bullets. Stat blocks are left out when the NPC is unlikely to fight; combat stats live in Roll20. If it won't help run a scene or plan the NPC's actions, it doesn't belong.

**Tagging:** `npc` means the note is an individual NPC. Atomic notes about NPC topics use `atomic` or content tags, not `npc`. `needs-work` stays on refactored notes until separately reviewed.

**Keep as separate notes (multi-reference):** The Massacre, The Capture of Melthes, Port Damali Murders, Rylan Estevez Frame Job, Gentleman's Organization (since 2026-10-23 the faction note, in `Characters/Factions/Exandria/`), Legacy of the Seekers, Luxon Beacon Integration with Lorestone.

**File triage categories (Part D):** Essential (process with the simplified template), Reference (keep, no further processing), Redundant (delete or merge), Archive (move to `z_Archive`), Stub (delete if empty, flesh out if needed).

### Superseded or changed since the plans were written

| In the plans | In the vault now |
|---|---|
| `processed` property and `#to-process` workflow | Retired. Only the three Rendspawn creature notes and the archived documents still mention them |
| Dataview queries, Connected Elements blocks | Bases (`Related Notes.base`, `Recent Work.base`) and Datacore (hubs, Plot Dashboard, NPC Browser, Lorestone hub, Aveqtaro tracker) |
| `world/faerun` | `world/toril`; 14 notes carry it. The tag survives only in the archived documents |
| `campaign/exandria` | `campaign/eryndor` (138 notes) and `campaign/tyranny` (5) |
| `Characters/Opponents`, `Items`, `Campaigns/Exandria`, `DM Screen` | `Characters/Adversaries`, `Objects`, `Campaigns/Prophecy of Eryndor - DM` (renamed again 2026-10-23), `00 DM Screen` |
| NPC `home_base`, `current_location`, `affiliations` properties | `place/…`, `faction/…`, `region/…`, `world/…` tags (scheme in the migration note) |
| Keep Dataview, Templater, Tag Wrangler | Dataview disabled; Templater and Tag Wrangler kept; Datacore and Bases added |
| `.gitignore` excludes `DM Screen/` | The folder is named `00 DM Screen`, so the pattern does not match it and the folder syncs to the Claude project. Intended; the pattern is stale |

### Current state

#### Reorganization Plan

| # | Phase | Status |
|---|---|---|
| 1-7 | Preparation, Exandria restructure, world content, campaign tags, reference materials, Tyranny import, Keln setup | done (all boxes ticked) |
| 8 | File audit and cleanup | see Revised Phase 8 |
| - | Final verification checklist | 7 items, see "Final verification" below |

#### Revised Phase 8

| Part | What | Status |
|---|---|---|
| A | Property and tag standardization | done; `processed` workflow retired |
| B | Tyranny NPCs | done 2026-10-19 (retagged to `world/toril`, `region/sword-coast`, `campaign/tyranny`; 13 stubs deleted) |
| C | Template simplification | done per the document's completed list; the NPC, Faction, Location and Encounter templates were rewritten 2026-10-21. All templates with code re-audited 2026-10-22 (refactor pass in the Phase log); Plot Thread, Atomic Note and Note Refactor have no code and were not changed |
| D | File triage | open. Only the NPC tag work has happened; no triage by category was recorded |
| E | Verification | partly done: old folder names survive only in documentation; the three `folder-overview` hits are valid (Folder Notes); the only numbered folders are `00 DM Screen` and a session folder named `00-2 Session Zero`. Broken-link check done 2026-10-23 (item 7) |
| F | Vault Health dashboard (optional) | not built. Bases cannot list unresolved links; Janitor covers orphans. Decide: build, or drop |

#### NPC folder audit

| Phase | What | Status |
|---|---|---|
| 1 | Merge satellites into Tier 1 and Tier 2 notes | done |
| 2 | Relocate Aethor Kalisk's Workshop | done |
| 3 | Link cleanup | done |
| 4 | Aveqtaro Thaan as Tier 1 hub | done 2026-10-22: [[Aveqtaro Thaan]] plus [[Aveqtaro Memory Recovery Tracker]] and [[What Aveqtaro Thaan Knows]]. All links in the three notes resolve. The Dynasty Bridge subnote was never created and is not linked |
| 4 | Evaluate Vaud Qalix and Korfel Withrethin as Tier 1 | Vaud Qalix done 2026-10-23: [[Vaud Qalix - DM]] plus [[Qalix's Network]] and [[Vaud Qalix's Plan Outline]]. Korfel done 2026-10-23: [[Korfel Withrethin]] plus [[Korfel's Next Moves]]; [[Characters/Factions/Exandria/Gentleman's Organization]] is now his faction note |
| 5 | Sweep Characters/NPCs for non-NPC notes | in progress 2026-10-23: no non-NPC notes found; Shoagragoth, Valen Elderguard, Eledyr Dephar and Lady Emer (hub plus three documents) moved to Adversaries; Ilya the Sorceress moved from Worlds to Characters/NPCs and renamed [[Ilya the Sorceress - DM]]. Player pages for Ilya and Varnes Dwell created 2026-10-23. Open: list 3 and 4 naming items |
| 5 | Apply the NPC template to remaining NPCs | open, incremental |

### Remaining work

Verified against the vault on 2026-10-22.

**1. Bramwell Bellweather placeholder.** Done 2026-10-22. [[Bramwell Bellweather]] is filled from the Deastok Investigation epilogue, Session 51 and Session 53. Race, age and voice beyond the quoted lines are not set in any source and were left blank. Open decision, yours: whether the Bramwell epilogue closes in the Deastok arc or moves to a later one (a to-do in that arc).

**2. Vaud Qalix and Korfel Withrethin as Tier 1.**
- Vaud Qalix: done 2026-10-23. Hub rebuilt as a reference card; `What does Vaud Qalix want` merged into it (Gerald deletes the file); the Network and Plan Outline stay as subnotes; the two Manifestos are documents. Contradictions found in a vault-wide read of 77 notes were resolved with Gerald.
- Korfel Withrethin: done 2026-10-23. Hub rebuilt as a reference card with no embeds (the old note rendered about 750 lines). New subnote [[Korfel's Next Moves]] (trigger-based moves, escalation, reasons to tolerate him). [[Characters/Factions/Exandria/Gentleman's Organization]] moved to `Characters/Factions/Exandria/` and rebuilt on the Faction Template as the organization's note; the empty stub `Gentleman's Organization` is to be deleted. `Possible ideas for Korfel` folded into the subnote and moved to z_Archive. Origin decided with Gerald: Babenon Dosal was the original Gentleman; Korfel tipped off the Crownsguard and killed him in the crackdown (winter 834–835) and appears undisguised.

**3. Non-NPC sweep of Characters/NPCs.** Six of 90 notes lacked the `npc` tag: the two Aveqtaro subnotes (correct as atomic subnotes) and four Lady Emer notes. The three Emer documents are now in the Emer folder (not NPC notes); the Status note is pending deletion. Recount 2026-10-23, before the antagonist moves: 91 notes in the folder, 84 tagged `npc`; the 7 without are the four atomic subnotes (two Aveqtaro, two Korfel) and the three Emer documents. No non-NPC notes found. Four antagonists then moved to Adversaries, leaving 85 files in Characters/NPCs with Ilya added.

**4. Lady Emer satellites.** Done 2026-10-22. Hub and three documents sit in `Characters/Adversaries/Lady Emer - DM/` (moved there from Characters/NPCs on 2026-10-23). `Lady Emer Status` is merged into the hub; the old file is deleted.

**5. Tag cleanup**
- **Settled 2026-10-22:** the four property and tag decisions are applied (see the rulings in [[Vault Conventions - DM]]). Remaining here: fill `place/` and `region/` on NPCs as they are touched (no bulk pass).
- 37 Exandria NPCs have no place tag (22 of them also lack a faction). The earlier count of 40 came from the NPC Browser and may count differently. Five are in Adversaries or Port Damali notes.
- 19 of the 75 Exandria NPCs have no region tag. Only Radelia Caphax has a place tag, and that place has no region, so nothing can be filled automatically.
- Location notes under Worlds: 33 carry the `location` tag. Two lack a place tag and one lacks a region (Skyship Distances and Xhorhas Landing, deliberately; see [[Vault Conventions - DM]]). All have a world tag.
- Old properties (`affiliations`, `faction`, `current_location`, `location`): only Lady Emer Status still has any (to be deleted). Cleared 2026-10-22.
- The `processed` property and `#to-process` tag no longer appear in any note.

**6. Part D triage and Part F decision.** Triage Essential, Reference, Redundant, Archive and Stub for what the NPC and tag work left over. Decide whether to build the Vault Health note.
- Naming rule set 2026-10-23: a DM note keeps the plain name until a player page exists. Suffix rename done 2026-10-23: 46 notes and 8 folders went from ` - DM Notes` to ` - DM`, with 740 links repointed. The suffix is one setting, `dm_note_suffix` in Hub Config, read by Shared Helpers and `dm_helpers.js`. Changing it later only covers code; file names need `.scripts/rename_dm_suffix.py` (edit OLD and NEW), and `Recent Work.base` line 18 is hard-coded. Links in the Phase log below keep the old names on purpose. New DM notes with an existing player page are named ` - DM` from the start.
- Triage of the five NPC-topic notes in the campaign folder done 2026-10-23 (see the log). Not yet triaged: the rest of what the NPC and tag work left over.
- Stub to fill in later: [[Draconia - DM]] (renamed from Draconia 2026-10-23). It is still the empty Faction Template (tags `organization`, `faction/draconia`, `needs-work`). Fill it in when the Restore Draconia plot thread or Qalix's plan next comes up at the table; delete it only if it never gets used. The player-wiki location page `Draconia` is separate and keeps the plain name.

**7. Unresolved links.** Done 2026-10-23, apart from the planned notes. Check: `.scripts/scan_unresolved_links.py` (read-only; resolves by file name; handles aliases, headings, embeds and escaped pipes; ignores links in code; `--json file` gives detail). Live notes (everything outside Player Wiki, z_Reference, z_Archive and z_Templates): 2,845 links checked, 0 unplanned unresolved links outside code. 34 links to 13 planned notes stay unresolved on purpose, listed in `.scripts/planned_link_targets.txt`: Xanaphia Lothliss, Odessloe, Ilixidor Alo, Illyndra Shadowveil, Cairel Ulthe, Hupperdook, Sunset Sail, Tur-Marethis, Kelmen Ritual Resolution, The Ring, Ruins of Marethis, Watcher's Knee, Varrin. When one of those notes is written, delete its name from the file; if the plan is dropped, strip its links first. Left alone: 33 occurrences inside code blocks (00 DM Screen/Code, DM Hubs Design, Roll20 Script Reference, Table References), and the closed Plugin Migration Status log lines (the scanner skips that file). Not touched, out of scope: Player Wiki (10 unresolved links in 8 notes: Wynandir x2, Varrinthal City x3, Skarnveil x2, Calamity, Dessarin the Ninth, kneestone), z_Archive (57 in 2 notes, including Deastok Investigation OLD) and z_Templates (placeholder text). Decisions, counts and backups are in the log lines of 2026-10-23 (link cleanup batches 1 to 4). Stripped Deastok survey-crew NPCs (Jorun, Aldous, Wenna, Torvald, Brynna, Erma) get their links back if they become notes.

**8. Calendarium shows some Eryndor Timeline events twice.** Found 2026-10-23, not yet diagnosed. Checked from the files: the 21 inline events in [[Eryndor Timeline]] have no duplicate names or dates among themselves, and none repeat the 55 events stored in Calendarium's own data. The eight Lorestone shard notes also hold inline events (18 in all, such as "Shard 6: looted by Qilynn" on 835-04-25) that may mirror timeline events and could be the second copy. Next step: open the calendar and note which events double (name and date), then compare them with the timeline and the shard notes. Fix by deleting one copy or by removing the `inline-events` tag from the shard notes.

**9. Eledyr Dephar: relevance and whereabouts.** Opened 2026-10-23, to discuss with Gerald (not now). His note says Rexxentrum, the player notes of 2025-03-16 say "sent to Zadash", and nothing else about him appears in the player notes after August 2024. The Hidden Chest scene never happened. Decide whether he still matters to the campaign, where he is, and how Qilynn's revenge thread uses him. His note now holds an Operation Notes callout (intelligence, moves, triggers, clues) kept from the retired 3-month plan; its Current Location and Status lines are unchanged until this is decided.

### Final verification

The Plan's final checklist, reworded for the current stack. Gerald confirms the items marked "Obsidian".

| Item | Status |
|---|---|
| Session notes accessible and linked | links done 2026-10-23: no session note has an unplanned unresolved link. Gerald's Obsidian check 2026-10-23: appears to work |
| Bases and Datacore views return expected results | open. Logged as checked: Lorestone hub, NPC Browser, Aveqtaro tracker. No logged check: Session Hub, Recent Work.base, Related Notes.base, 00 DM Screen hub. Obsidian |
| GitHub sync works | local `main` matches `origin/main` at 3e41ee8 (2026-10-22 15:23). Pushes work |
| Claude project can see campaign content | partly: project search returns campaign notes, but its copy of Aveqtaro Thaan is an older version and does not include the newer subnotes. The project lags the vault |
| Links between notes work | done 2026-10-23: 0 unplanned unresolved links in live notes (item 7). Gerald's Obsidian check 2026-10-23: appears to work |
| Tags appear correctly in the tag pane | open. Tag use verified in files; the pane is Obsidian |
| Search scoped to campaign works | open. Test `tag:#campaign/eryndor`, not `campaign/exandria`. Obsidian |

### Recommended next step

Item 8: open the Calendarium and note which Eryndor Timeline events show twice (name and date), then compare them with the timeline and the shard notes. Item 3's open naming items and the Part D/F decisions (item 6) follow.

### Phase log

Newest at the bottom. Format: `YYYY-MM-DD | phase | what changed | result`.

2026-10-22 | reconciliation | Read the four reorganization documents in full and checked each open item against the vault. Created this note. The four documents are unchanged. | Counts: Plan 7 open boxes; Revised Phase 8 0 open (3 ticked, Parts D-F open); Exandria reorganization 35 open and 38 done; npc-folder-audit 5 open. Aveqtaro Phase 4 confirmed done. Nothing tested in Obsidian.

2026-10-22 | reconciliation | Created Vault Reorganization Status - DM.md; four reorganization documents unchanged | Links resolve; not opened in Obsidian

2026-10-22 | NPC audit Phase 5 | Filled Bramwell Bellweather - DM Notes from the Deastok arc, Session 51 and Session 53; no new links to missing notes | Links resolve; not opened in Obsidian. Item 1 done.

2026-10-22 | reference documents | Moved Exandria Vault Reorganization to z_Archive/Vault Reorganization/. The other three stay: they hold open work or reference | Links by name still resolve; not opened in Obsidian.

2026-10-22 | reference documents | Corrected the previous entry: all four documents are superseded by this note, since every open task is tracked here. Added "Rules to apply" (tiers, separate-note test, merge pattern, tagging, triage categories) so nothing depends on the archived files. Moved the remaining three to z_Archive/Vault Reorganization/ | Links by name still resolve; not opened in Obsidian.

2026-10-22 | NPC audit, Lady Emer | Merged Lady Emer Status into the hub, rebuilt the hub around offscreen activity and reappearance, moved hub and three documents into `Characters/NPCs/Lady Emer - DM Notes/`, added the missing Arcanist's Prism paragraph to Research Notes, filled the Lawbearer's Tear holder (Seraphina, dormant) | All wiki-links in the changed notes resolve. Delete `Characters/NPCs/Lady Emer Status.md`. Rendering, folder-note behavior and Related Notes.base not tested in Obsidian.

2026-10-22 | NPC audit, Lady Emer | Merged Status into hub; rebuilt hub for offscreen/reappearance; moved hub + 3 documents into Lady Emer - DM Notes/; added Prism paragraph to Research Notes; filled Lawbearer's Tear holder | Links in changed notes resolve. Delete Lady Emer Status.md. Rendering not tested in Obsidian.

2026-10-22 | conventions | Removed frontmatter from both status notes. Audited 504 notes and wrote [[Vault Conventions - DM]] (rules, tag scheme, properties by note type, six open questions) | Read-only audit; no existing note changed. Open questions in that note feed tag cleanup (item 5).

2026-10-22 | templates | Shared helper block moved to z_Templates/Scripts/dm_helpers.js (Templater user script, includes case-insensitive name-clash fix); NPC, Faction, Location, Encounter and Arc templates now load it with one line; originals in z_Reference/template-backups/2026-10-22 before dm_helpers | Mock harness: 20 old/new runs identical, clash fix confirmed, Quick Capture template reading unchanged. Not yet run in Templater; needs the Script files folder setting..js now tracked by git with addition of `!z_Templates/Scripts/*.js`.

2026-10-22 | Arc Template | Rebuilt by Gerald on the shared helpers: name first, campaign picker with guard, tier asked in the script block, place picker scoped to the campaign's world, tags built as a list (arc, campaign, place), place's location note linked under Locations, header comment | Tested in Obsidian by Gerald (normal, cancels, case clash); mock rerun clean.

2026-10-22 | templates, refactor pass | dm_helpers.js gained the shared code the templates still repeated (settings reader that normalizes tag values, lowercased tags, campaign picker asked only with more than one campaign, campaign world, place note and link, faction checklist, case-insensitive findPath and ensureFolder; safeMove now makes its folder and handles renames). Session, Campaign and Close Session now load it; Session renames through safeMove (it had no name check), Campaign checks names and folders ignoring capitals and no longer deletes the note itself on cancel. Artifact-Item rewritten: name, world only, tags `artifact` and `world/…`, files into `Objects/`. Shared Helpers gained findPath, ensureFolder and availablePath (capitals ignored); Quick Capture and Party Card use them. Faction type tag is now `organization` (Hub Config `tag_faction`, new `faction_tag_prefix`); Faction Template writes it, NPC Browser and Artifact Pieces read the nested root from the new key, Note Types and Recent Work.base test `organization`; 18 faction notes retagged. Backups in z_Reference/template-backups/2026-10-22 before refactor pass | Mock harness against a snapshot of the vault: 7 of 8 templates give the same output as before (Encounter and Arc skip the campaign question with one campaign); Faction adds `organization`. Name clashes by capitals now get a number (NPC, Session, Artifact-Item) or a refusal (Campaign); the old Session and Campaign templates failed. Datacore code blocks parse. Not run in Obsidian.

2026-10-22 | property and tag pass | Applied the four decisions: 5 faction notes got `**Base:**` or `**Relationships:**` links in place of `current_location` and `affiliations`; dropped `settlement-type` and Randmork's `region`; removed `disposition` from 16 non-NPC faction-folder notes; renamed `dm-tools` to `dm-tool` (Hub Config, Shared Helpers, Note Types, Recent Work.base, Encounter Design Guide); retired 17 stray tags (3 notes lost their empty frontmatter); `compendium` became `artifact` on Laucian's Artifact; 6 location notes got world, region or place tags and Callastri became `region/callastri`. Backups in z_Reference/template-backups/2026-10-22 property-tag pass. |

2026-10-22 | faction tag | Dropped the plain `faction` tag from the six non-faction notes in Characters/Factions (two overview notes, two faction-event notes, Aurora's Ascendant, Capture of Melthes); the 11 Player Wiki faction pages now carry `organization` instead of `faction`. publish.css and publish.json do not use tags | Open: Player Wiki Build Conventions (project doc) still lists `faction` as the type tag in its frontmatter template. Not run in Obsidian.

2026-10-23 | NPC audit, Vaud Qalix | Hub rebuilt (Quick Reference, roleplay, Current Situation, resources, hidden information, endgame, subnotes, documents; tags region/xhorhas, place/xarzith-kitril, faction/scars-of-scale-and-tooth added). Merged What does Vaud Qalix want into the hub. Plan Outline: goal table moved in (collapsed, broken prophecy link fixed), stale Dreyara and Celdric steps updated, future steps state their trigger, duplicate patron section removed. Outside the folder: trigger line on Qalix escalates (Luxon Beacon Political Consequences), shard-count lines (Lorestone of Eryndor - DM Notes), Emissaries goal line, Assembling the Lorestone embed. npc tag removed from Manifesto - Brief. Backups in z_Reference/template-backups/2026-10-23 Qalix Tier 1 | All new wiki-links resolve. Delete `What does Vaud Qalix want.md`. disposition left for Gerald. Rendering, embeds and Related Notes.base not tested in Obsidian.

2026-10-23 | NPC audit, Vaud Qalix | Hub rebuilt; What does Vaud Qalix want merged; Plan Outline updated (goal table, stale steps, future triggers); trigger line in Luxon Beacon Political Consequences, shard-count lines in Lorestone hub, Emissaries goal line, Assembling the Lorestone embed; npc tag off Manifesto - Brief | Links resolve. Delete What does Vaud Qalix want.md. Not tested in Obsidian.

2026-10-23 | NPC audit, Korfel Withrethin | Hub rebuilt as a reference card (embeds removed; Babenon alias dropped; disposition left for Gerald). New subnote Korfel's Next Moves. The Gentleman's Criminal Empire moved to Characters/Factions/Exandria and rebuilt on the Faction Template with tags organization and faction/myriad/gentlemans-organization (atomic and campaign tags dropped). Possible ideas for Korfel moved to z_Archive. Line fixes: Hesterian Shyr's Infiltration (Zadash and identity lines, Babenon line, two broken Port Damali Murders links), Hesterian Shyr (Dot) (Zadash line), Cree Deeproots faction tag. Backups in z_Reference/template-backups/2026-10-23 Korfel Tier 1 | All new wiki-links resolve. Delete `Characters/Factions/Exandria/Gentleman's Organization.md`. Cree's employment dates wait for her template pass. Rendering, the #History link and Related Notes.base not tested in Obsidian.

2026-10-23 | NPC audit, Korfel Withrethin | Hub rebuilt; Korfel's Next Moves created; The Gentleman's Criminal Empire moved to Characters/Factions/Exandria as the faction note; Possible ideas archived; line fixes in Infiltration, Hesterian, Cree tag | Links resolve. Delete Gentleman's Organization.md. Not tested in Obsidian.

2026-10-23 | NPC audit, Korfel Withrethin | Meeting design added with Gerald: Cree's interview (Meeting 1), the flooded hall the next day (Meeting 2), arrest instead of death if the party fights. Next Moves gained Meeting him, triggers for Korfel learning of Hesterian first (asking for his name, Cree's report), Melthes and arrest triggers, What he offers (with Rylan terms) and What killing him costs. Hub gained the hall, the merchant alias, clearing the floor and the arrest outcome; faction note History gained the alias. Backups in z_Reference/template-backups/2026-10-23 Korfel Tier 1/pass 2 meetings | Links and heading anchors resolve. Talking with Korfel (dialogue menu) drafted, not yet written. Not tested in Obsidian.

2026-10-23 | NPC audit, Korfel Withrethin | New subnote Talking with Korfel: prewritten lines by table moment (Cree's interview, flooded-hall choreography and recognition branches, private negotiation, offers including Rylan with Xanaphia's bracelet as proof, threats, pushback, attack, cell visit). Hub links it and its surprise line now says the recognition stays mutual even if the party asked after his name; Next Moves triggers revised to match (he probes, gives nothing away) and Rylan terms gained the bracelet. Backups in z_Reference/template-backups/2026-10-23 Korfel Tier 1/pass 3 talking | Links resolve. Not tested in Obsidian.

2026-10-23 | NPC audit, Korfel Withrethin | Tier 1 done: hub card, Korfel's Next Moves, Talking with Korfel; The Gentleman's Criminal Empire moved to Factions as the faction note; Possible ideas archived; origin, meeting design and Rylan terms decided with Gerald; line fixes in Infiltration, Hesterian, Cree tag | Links resolve. Delete Gentleman's Organization.md. Not tested in Obsidian.

2026-10-23 | NPC audit, Korfel Withrethin | Talking with Korfel: every bullet is now a checkbox, so used lines can be ticked off and kept as a record. Backup in z_Reference/template-backups/2026-10-23 Korfel Tier 1/pass 4 checkboxes | Not tested in Obsidian.

2026-10-23 | NPC placement sweep | Moved Shoagragoth, Valen Elderguard, Eledyr Dephar and the Lady Emer - DM Notes folder (hub plus three documents) from Characters/NPCs to Characters/Adversaries; moved Ilya the Sorceress from Worlds/…/Port Damali - DM Notes to Characters/NPCs and renamed her Ilya the Sorceress - DM Notes; repointed the one link in Ilya's Realm Shop - DM Notes; fixed the Gentleman's Organization line under Keep as separate notes. Backups in z_Reference/template-backups/2026-10-23 NPC placement sweep | No duplicate names; moved notes link by name, so no other links changed. vault_inspector_progress.json still lists Characters/NPCs/Eledyr Dephar.md and vault_inspector_lists.json lists Ilya by the old name (left alone). Tags unchanged; Ilya's template pass still open. Not opened in Obsidian.

2026-10-23 | NPC placement sweep, player pages | Created Player Wiki/Exandria/People/Ilya the Sorceress (aliases Ilya, Ilia; tags npc, player-facing, world/exandria, region/menagerie-coast). Renamed Varnes Dwell to Varnes Dwell - DM Notes and repointed 16 links in 9 notes so the player page's [[Varnes Dwell]] stays unresolved until his page is built. Backups in z_Reference/template-backups/2026-10-23 NPC placement sweep | Ilya's links resolve except [[Varnes Dwell]], which is intentional. Not edited: Port Damali People list and Ilya's Realm Shop (add her there when Gerald approves). Not opened in Obsidian; Publish build not run.

2026-10-23 | NPC placement sweep, player pages | Added links to Ilya the Sorceress on the Port Damali People list and Ilya's Realm Shop (approved). Created Player Wiki/Exandria/People/Varnes Dwell (aliases Varnes, Varnus; tags npc, player-facing, world/exandria, region/menagerie-coast; appearance, capture, release by the Third Act, sister Ilya). Left out the Rexxentrum Archive job, torture and memory modification, military service, and stats. Backups of the two edited Player Wiki pages in z_Reference/template-backups/2026-10-23 NPC placement sweep | All links resolve. Port Damali People list does not yet list Varnes (needs approval). Not opened in Obsidian; Publish build not run.

2026-10-23 | NPC placement sweep, naming | Renamed Clasp and Myriad in Characters/Factions/Exandria to Clasp - DM Notes and Myriad - DM Notes (the player pages keep the plain names). Repointed 9 links in 7 DM-side notes (Hesterian Shyr (Dot), Hesterian Shyr's Infiltration, Artifact Pieces example, Korfel Withrethin x2, Gentleman's Organization, Dreyara Drimvar - DM Notes, Vaud Qalix - DM Notes x2) to the DM notes with the old display text. Player Wiki links to [[Clasp]] and [[Myriad]] untouched, so they resolve to the player pages. Added Varnes Dwell to the Port Damali People list. Backups in z_Reference/template-backups/2026-10-23 NPC placement sweep | No other file named Clasp or Myriad outside z_ folders. faction/clasp and faction/myriad tags unchanged..obsidian/copilot-index json still holds the old [[Myriad]] text (cache, left alone). Not opened in Obsidian.

2026-10-23 | NPC placement sweep, naming | Renamed Draconia (empty faction stub) to Draconia - DM Notes and repointed its one DM-side link (Brainstorms about Dechs and the Herbs); Player Wiki [[Draconia]] links untouched; fill-in reminder added under item 6. Renamed the DM campaign hub and its folder to Campaigns/Prophecy of Eryndor - DM Notes/Prophecy of Eryndor - DM Notes.md so Player Wiki [[Prophecy of Eryndor]] links resolve only to Player Wiki/Exandria/Lore. Updated the one DM-side link (NPC Browser), Calendarium note paths, Recent Files, workspace.json and the vault_inspector campaign entries. Left as written: four one-off scripts in.scripts and two z_Reference reports (old paths). Not tested in Obsidian: folder-note behavior for the new name, Calendarium event links, the hub's NPC Browser and Bases embeds, Templater Campaign Template on a new campaign.

2026-10-23 | Calendarium | Logged item 8: some Eryndor Timeline events show twice in the calendar. Not fixed; the files show no exact duplicates, so the cause needs a look at the live calendar | Open

2026-10-23 | NPC placement sweep, naming | Rule set: a DM note keeps the plain name until a player page exists; rename it to - DM Notes when the player page is created. Renamed Bramwell Bellweather - DM Notes and Cobalt Soul Archive in Rexxentrum - DM Notes to their plain names and repointed 14 links in 6 notes (including 5 in the archived Deastok Investigation OLD). Left as written: log lines. | Not opened in Obsidian

2026-10-23 | NPC placement sweep, naming | Renamed The Shrine of Melora - DM Notes to Shrine of Melora - DM Notes to match the player page; repointed 11 links in 10 notes (aliases added where a link had none) | Not opened in Obsidian

2026-10-23 | NPC placement sweep, new note | Created Characters/NPCs/Brother Kelmen - DM (Tier 2, tags npc, world/exandria, region/cyrios-mountains, place/monastery-of-dimensional-harmony; no aliases so the player page Brother Kelmen stays unambiguous). Sources: Monastery DM notes, Kelmen and Popcorn Connections, Eryndor Timeline. Decided not to create DM notes for Olesya Lapidus, Leylas Kryn, Bertrand Dwendal, Marion Lavorre, Percival de Rolo, Vex'ahlia de Rolo until they become relevant | Links checked by name; not opened in Obsidian

2026-10-23 | Part D triage, NPC-topic notes | Aelorin's Reaction merged into Aelorin Nightshade (new "Reaction to the failed heist" section; the stale "hunch it was Yrene" line dropped; the two embeds in 21 Qilynn's Failed Heist and Qilynn Duskwhisper's Revenge repointed). History of Tessa and Sumad-Dekon condensed into a section on each of Tessa Sunwarden and Sumad-Dekon Harrowgate. Keldar Stonefoot Letter to Calderax kept as a Reference handout, `needs-work` removed. The Truth about Eledyr left as is. Backups in z_Reference/template-backups/2026-10-23 NPC placement sweep/Part D triage | Delete `Campaigns/Prophecy of Eryndor - DM Notes/Aelorin's Reaction.md` and `Plot Threads/History of Tessa and Sumad-Dekon.md`; no links to either remain. Embed rendering not tested in Obsidian. Aelorin, Sumad and Tessa still need their template pass.

2026-10-23 | Part D triage, Eledyr | Eledyr's 3-Month Operation Checklist: kept intelligence, moves, triggers and discovery clues in a collapsed Operation Notes callout in Eledyr Dephar, then moved the checklist to z_Archive/Campaigns/Prophecy of Eryndor/Plot Threads. Future Session - The Hidden Chest (scene never happened) moved to z_Archive/.../Session Notes/Planning. Opened item 9 for his relevance and location | No live links to either moved note. Eledyr's Current Location and Status lines left as written. Callout not tested in Obsidian.

2026-10-23 | DM suffix rename | Ran .scripts/rename_dm_suffix.py --apply: 46 notes and 8 folders renamed from " - DM Notes" to " - DM" (Campaigns/Prophecy of Eryndor, Lady Emer, Vaud Qalix, Lorestone of Eryndor, Soulwood, Port Damali, Aelorin's Headquarters, Harmony Hall); 740 wiki-links repointed in 165 files (5 embeds, 189 aliased, 11 with heading, 3 escaped-pipe); 49 path lines fixed in 5 JSON files; Player Wiki untouched | Link check by file name: 194 unresolved before and after, 0 new. Backups in z_Reference/template-backups/2026-10-23 DM suffix rename/; undo with --undo

2026-10-23 | DM suffix constant | Added dm_note_suffix to Hub Config and Shared Helpers CONFIG_DEFAULTS; new helpers dmSuffix and stripDmSuffix; Artifact Pieces, NPC Browser, Plot Dashboard Views, Session Hub Table and z_Templates/Scripts/dm_helpers.js now use them; Recent Work.base line 18 changed by hand (cannot read config) | node --check passes on dm_helpers.js; Datacore JSX diffed against backups but not run

2026-10-23 | link scan | Added .scripts/scan_unresolved_links.py (read-only; resolves by file name like rename_dm_suffix.py; handles aliases, #headings, embeds and escaped pipes; ignores links inside code) and .scripts/planned_link_targets.txt (notes Gerald plans to write; reported separately). The scanner skips the Plugin Migration Status log lines. Scope live notes (not Player Wiki, z_Reference, z_Archive, z_Templates): 2,975 links, 116 targets, 79 notes. 24 targets (30 occurrences, 16 notes in 00 DM Screen/Code, DM Hubs Design, Roll20 Script Reference, Table References) appear only in code and were left alone | Whole-vault count by the rename script's own logic: 193 pairs (194 logged after the rename). Nothing written to the vault notes. Not opened in Obsidian.

2026-10-23 | link cleanup batch 1 | .scripts/fix_links_batch1.py: 84 links in 22 files. Old names retargeted: cloudfang_keep_dm_guide.md (6, now Cloudfang and Monastery DM Guide; colons dropped from the five heading anchors), luxon-beacon-egw (8, now Luxon Beacon Integration with Lorestone), Garden Grounds, Bursar Plaza and Jeweled Gates (12, now Deastok), two Cyrios Mountains Crash links. Stripped to plain text: stone-of-memory (11, text restored to Stone of Memory in 4 notes), Hollow One, Finestria, the six Deastok survey-crew NPCs (Jorun, Aldous, Wenna, Torvald, Brynna, Erma; restore links if they get notes), one outline stub. Backups in z_Reference/template-backups/2026-10-23 link cleanup batch 1 | Unresolved outside code 212 to 128; 0 new. Heading anchors and rendering not tested in Obsidian.

2026-10-23 | link cleanup batch 2 | .scripts/fix_links_batch2.py: 20 link edits in 9 files and one file rename (Lorestone - Rift Closing Mechanics.md.md to Lorestone - Rift Closing Mechanics.md, which resolves the embed). Retargeted Kamordah - DM Notes to Kamordah, Unshaken to The Unshaken, Crownsguard Barracks to Deastok, Crash in Dwendalian Empire to Dwendalian Empire - DM. Stripped: 7 statblock fragments and a stray Untitled line in Tawar Kenley, Lord Gabriel Rymmer (brainstorm), Arghyak Bow, Balasar Azar, Drawg Stormbrew's Dagger. Backups in z_Reference/template-backups/2026-10-23 link cleanup batch 2 | Unresolved outside code 125 to 103 (baseline 125 after the scanner began skipping Plugin Migration Status); 0 new. Embed with heading not tested in Obsidian.

2026-10-23 | link cleanup batch 3 | .scripts/fix_links_batch3.py: 17 edits in 16 files. Retargeted Lady Emer Conversation Progression REVISED, Prophecy (Modern Text), The Port Damali Murders, Session 32, the stale Laucian's Artifact path and kelmen_ritual_resolution. Stripped Feywild, Feydark, session 5.5, skills, The Inkwell, Tiberius Stormwind, Wynandir. Removed four embed lines whose files do not exist (Random NPC Names, Aura_Timber.jpg, Marika.jpeg, varnes-dwell.png). Added Kelmen Ritual Resolution, The Ring, Ruins of Marethis, Watcher's Knee and Varrin to the planned list. Backups in z_Reference/template-backups/2026-10-23 link cleanup batch 3 | Unresolved outside code 103 to 87. The one new pair is kelmen_ritual_resolution retargeted to the planned Kelmen Ritual Resolution. Player Wiki pages Xhorhas and Dwendalian Empire still carry an unresolved Wynandir link. Not opened in Obsidian.

2026-10-23 | link cleanup batch 4 | .scripts/fix_links_batch4.py, compendium-style slugs from the removed DM Compendium plugin: 8 retargeted by name into z_Reference/z-Mechanics (Teleport, Thunderwave, Dispel Magic, Glyph of Warding, Hypnotic Pattern, Sun Blade, Giant Badger (Creature), Giant Weasel (Creature)), 45 stripped to the display text (-tdcsr, -egw, -crcotn, -mpmm items in Character Story Beats and others, Vine Blight, the monument table, the Ceratos self-link). Backups in z_Reference/template-backups/2026-10-23 link cleanup batch 4 | Unresolved outside code 87 to 34; 0 new.

2026-10-23 | item 7, unresolved links | Done. Live notes: 2,845 links checked, 0 unplanned unresolved outside code. Left on purpose: 34 links to 13 planned notes (.scripts/planned_link_targets.txt), 33 occurrences inside code, Plugin Migration Status log lines. Not touched (out of scope): Player Wiki 10 unresolved in 8 notes, z_Archive 57 in 2 notes, z_Templates placeholder text. No files to delete. Undo for any batch: python3 .scripts/fix_links_batchN.py --undo with that batch's backup folder | Checked by file name, not in Obsidian. Not tested: heading anchors without colons, the Rift Closing embed, links into z_Reference/z-Mechanics, graph and backlinks.

2026-10-23 | status note, item 7 closed | Rewrote item 7 (done, planned-notes list, out-of-scope counts), the Part E row, the Session notes and Links between notes rows in Final verification, and the Recommended next step (now item 8) | Gerald checked in Obsidian: appears to work. No other part of the note changed. Backup in z_Reference/template-backups/2026-10-23 link cleanup status note
