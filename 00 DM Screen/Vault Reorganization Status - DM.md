---
created: 2026-10-22
description: Current state and remaining work for the DM vault reorganization. Replaces the four reorganization documents as the working record; they stay as reference. Read first when resuming.
name: vault-reorganization-status
status: active
type: system-doc
updated: 2026-10-22
---

## Vault Reorganization Status: DM Vault

Location: the DM Screen folder, next to [[Plugin Migration Status - DM]]. The plugin migration is complete and its record is closed; this note covers only the reorganization. It holds current state and remaining work, not history. History lives in the four reference documents and in the Phase log below, which starts at the reconciliation.

### How Claude should use this note

- Read all of it before proposing anything. The four reference documents are context only; where they disagree with this note, this note wins.
- Verify against the vault before ticking or marking anything. Never tick on assumption.
- The vault syncs to a Claude project through GitHub, and the project copy can lag the vault. Check the vault first.
- Ask one or two questions at a time. Gerald decides; he tells Claude when the vault is closed and commits with Obsidian Git himself.
- Claude cannot delete files. Name the files for Gerald to delete.
- Check every wiki-link resolves before writing it, so no empty placeholder notes get created.
- After each completed item, give a log line (`YYYY-MM-DD | phase | what changed | result`). State what could not be tested in Obsidian.

### Reference documents

| Document | Status | Still useful for |
|---|---|---|
| [[DM_Vault_Reorganization_Plan]] | Phases 1-7 done. Phase 8 text replaced by [[Revised Phase 8]]. Final checklist reworded below | Target folder tree, tag taxonomy, "where does this go" table |
| [[Revised Phase 8]] | Part A done; Parts B and C done per log; D, E, F tracked below | Triage categories, verification checks |
| [[Exandria Vault Reorganization]] | Superseded. 38 of 73 tasks done; the 35 open tasks depend on the retired `processed` property and Dataview blocks | Nothing active |
| [[npc-folder-audit]] | Phases 1-3 done; Phase 4 half done; Phase 5 open | Tier definitions, NPC template, "Should this be a separate note?" test |

The Dataview code in these four documents is documentation only. Dataview is disabled and will be deleted on or after 2026-10-28. Do not convert it.

### Superseded or changed since the plans were written

| In the plans | In the vault now |
|---|---|
| `processed` property and `#to-process` workflow | Retired. Only the three Rendspawn creature notes and the reference documents still mention them |
| Dataview queries, Connected Elements blocks | Bases (`Related Notes.base`, `Recent Work.base`) and Datacore (hubs, Plot Dashboard, NPC Browser, Lorestone hub, Aveqtaro tracker) |
| `world/faerun` | `world/toril`; 14 notes carry it. The tag survives only in the reference documents |
| `campaign/exandria` | `campaign/eryndor` (138 notes) and `campaign/tyranny` (5) |
| `Characters/Opponents`, `Items`, `Campaigns/Exandria`, `DM Screen` | `Characters/Adversaries`, `Objects`, `Campaigns/Prophecy of Eryndor`, `00 DM Screen` |
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
| C | Template simplification | done per the document's completed list; the NPC, Faction, Location and Encounter templates were rewritten 2026-10-21. The other templates were not re-audited |
| D | File triage | open. Only the NPC tag work has happened; no triage by category was recorded |
| E | Verification | partly done: old folder names survive only in documentation; the three `folder-overview` hits are valid (Folder Notes); the only numbered folders are `00 DM Screen` and a session folder named `00-2 Session Zero`. Not done: the broken-link check (83 notes have unresolved links, see below) |
| F | Vault Health dashboard (optional) | not built. Bases cannot list unresolved links; Janitor covers orphans. Decide: build, or drop |

#### NPC folder audit

| Phase | What | Status |
|---|---|---|
| 1 | Merge satellites into Tier 1 and Tier 2 notes | done |
| 2 | Relocate Aethor Kalisk's Workshop | done |
| 3 | Link cleanup | done |
| 4 | Aveqtaro Thaan as Tier 1 hub | done 2026-10-22: [[Aveqtaro Thaan]] plus [[Aveqtaro Memory Recovery Tracker]] and [[What Aveqtaro Thaan Knows]]. All links in the three notes resolve. The Dynasty Bridge subnote was never created and is not linked |
| 4 | Evaluate Vaud Qalix and Korfel Withrethin as Tier 1 | open |
| 5 | Sweep Characters/NPCs for non-NPC notes | open |
| 5 | Apply the NPC template to remaining NPCs | open, incremental |

### Remaining work

Verified against the vault on 2026-10-22.

**1. Bramwell Bellweather placeholder.** [[Bramwell Bellweather - DM Notes]] is the unfilled template (tags only). It cannot be deleted: Session 51 and the Deastok Investigation arc link to it, and the party has met him. The material is in the arc's "Epilogue Thread - Bramwell" section and the two Deastok tables. Fill it from there.

**2. Vaud Qalix and Korfel Withrethin as Tier 1.**
- [[Vaud Qalix - DM Notes]] already sits in a folder with three subnotes (`Qalix's Network`, `Vaud Qalix's Plan Outline`, `What does Vaud Qalix want`). The question is whether those subnotes each serve a distinct use case, not whether to create a hub.
- [[Korfel Withrethin]] is one 148-line note with Current Operations and Hidden Information sections. Apply the audit's test: does a section serve a different use case (running a scene versus planning moves)?
- A planning note, `Possible ideas for Korfel`, sits in Session Notes/Planning and is outside the NPC folder.

**3. Non-NPC sweep of Characters/NPCs.** Six of 90 notes lack the `npc` tag: the two Aveqtaro subnotes (correct as atomic subnotes) and four Lady Emer notes.

**4. Lady Emer satellites.** [[Lady Emer - DM Notes]] is the NPC note. Satellites: [[Lady Emer Status]] (50 lines, atomic; still carries `faction` and `location` properties), [[Lady Emer's Notes]] (121), [[Lady Emer's Poems]] (279), [[Lady Emer's Research Notes]] (261). Apply the audit rules to each: merge, keep as a linked note, or relocate. Poems and Research Notes are long enough to pass the "own use case" test; Status is the clear merge candidate, as Aethor's and Radelia's were.

**5. Tag cleanup**
- 37 Exandria NPCs have no place tag (22 of them also lack a faction). The earlier count of 40 came from the NPC Browser and may count differently. Five are in Adversaries or Port Damali notes.
- 14 NPC-tagged notes have no region tag.
- Location notes: 21 of 52 notes under Worlds have no place tag. Many are lore, table or Keln notes that may not need one; only two notes tagged `location` lack it. 5 `location` notes have no region and 3 have no world.
- Old properties (`affiliations`, `faction`, `current_location`, `location`) remain in 20 notes: 9 faction notes, 5 arc notes, 4 location or item notes, Lady Emer Status, and one NPC-tagged note.
- The `processed` property or `#to-process` tag remains in three Rendspawn creature notes.

**6. Part D triage and Part F decision.** Triage Essential, Reference, Redundant, Archive and Stub for what the NPC and tag work left over. Decide whether to build the Vault Health note.

**7. Unresolved links.** 83 notes have wiki-links that point to no note (3,503 links checked outside z_ folders). Examples: `Xanaphia Lothliss`, `Odessloe`, `Garden Grounds`, `Hollow One`, plus compendium-style links ending in `-tdcsr`. 14 are in session notes. Not categorized yet: some may be intended future notes or compendium links.

### Final verification

The Plan's final checklist, reworded for the current stack. Gerald confirms the items marked "Obsidian".

| Item | Status |
|---|---|
| Session notes accessible and linked | open; 14 session notes have unresolved links (item 7). Obsidian |
| Bases and Datacore views return expected results | open. Logged as checked: Lorestone hub, NPC Browser, Aveqtaro tracker. No logged check: Session Hub, Recent Work.base, Related Notes.base, 00 DM Screen hub. Obsidian |
| GitHub sync works | local `main` matches `origin/main` at 3e41ee8 (2026-10-22 15:23). Pushes work |
| Claude project can see campaign content | partly: project search returns campaign notes, but its copy of Aveqtaro Thaan is an older version and does not include the newer subnotes. The project lags the vault |
| Links between notes work | open; see item 7 |
| Tags appear correctly in the tag pane | open. Tag use verified in files; the pane is Obsidian |
| Search scoped to campaign works | open. Test `tag:#campaign/eryndor`, not `campaign/exandria`. Obsidian |

### Recommended next step

Item 1, Bramwell Bellweather. Deastok is the active arc, the party has met him, and the source material already exists in the arc note. It is one note and removes the only empty placeholder with live links.

### Phase log

Newest at the bottom. Format: `YYYY-MM-DD | phase | what changed | result`.

2026-10-22 | reconciliation | Read the four reorganization documents in full and checked each open item against the vault. Created this note. The four documents are unchanged. | Counts: Plan 7 open boxes; Revised Phase 8 0 open (3 ticked, Parts D-F open); Exandria reorganization 35 open and 38 done; npc-folder-audit 5 open. Aveqtaro Phase 4 confirmed done. Nothing tested in Obsidian.
