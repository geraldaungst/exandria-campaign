---
created: 2026-10-18
description: Working record for the Obsidian plugin cleanup of the D&D DM vault. Findings, settled decisions, phase checklist. Read first when resuming.
name: plugin-migration-status
status: active
type: system-doc
updated: 2026-10-21
---

## Plugin Migration Status: DM Vault

Location: the DM Screen folder (decided 2026-10-18). The Reference folder was ruled out because it is excluded from the git sync, so the Claude project could not see the note here. The note must never sit inside the folder published to Obsidian Publish. A companion note exists in the personal vault. Decisions in the "Shared decisions" section apply to both.

### How Claude should use this note

- Read all of it before proposing anything. Treat "Shared decisions" as settled; do not re-open them or recommend anything listed as rejected.
- A blank Finding blocks every step that depends on it. Ask Gerald to run that check; do not assume the answer.
- Verify current state before creating anything (Gerald's standing rule). This vault syncs to a Claude project through GitHub, so project search can answer some checks directly.
- Ask one or two questions at a time. Present options; Gerald decides.
- At the end of each phase, give Gerald an "Append to status note" block he can paste into the Phase log. He does not edit this note by hand, so keep each block short and complete.
- Default model is Sonnet. Step-level Opus recommendations are in the phase table.

### Working rules for the migration

1. Commit a clean git state before each phase and before each batch of conversions. Use `git checkout.` to revert a failed test.
2. Disable a plugin first. Delete it after a week of normal use with no errors or missing behavior.
3. One change at a time. Record it in the Phase log before the next.
4. Any change to a note in the published folder is checked against what Publish can render.

### Shared decisions (2026-10-18)

| Decision | Reason |
|---|---|
| Plan runs as a skeleton plus one phase at a time, not a single all-branches guide | Early findings decide later steps |
| One conversation plus this status note in each vault; no dedicated Claude project | State lives in the notes. DM-side checks can run from the existing DM project |
| Do not install Obsidian Git in the personal vault | Vault is not git-synced by design. DM vault uses git only to share with a Claude project |
| Initiative Tracker rejected | Combat is never run from the vault. Vaults hold session notes and prep. The player-facing wiki uses Obsidian Publish on one folder |
| Smart Connections rejected | Copilot plus Miyo already handles related notes |
| Frontmatter Operator and Vaultman rejected | The Python vault auditor and fixer is the Cluster 2 learning project |
| Obsidian Publish does not run community plugins | Any published note using plugin-rendered syntax (Admonition `ad-` blocks, Dataview, statblocks) will not render. Whether Bases renders on Publish is unverified. Verify before converting published queries |
| Simple queries go to Bases, complex ones to Datacore, remaining Dataview stays until converted | Consistent with the existing "Bases for trivial queries" policy |
| Calendar Plus is the preferred replacement for Calendar plus Periodic Notes (personal vault only). Calendarium is unaffected | Calendar and Periodic Notes are unmaintained |

#### Candidate retirements (pending findings)

MetaEdit (both vaults), Note Refactor (after Advanced Note Composer is in), Admonition (only if F3 and F4 clear), Dataview (last, when zero queries remain). Outcome 2026-10-21: MetaEdit and Dataview disabled, Note Refactor replaced by Note Refactor Plus, Admonition kept.

#### Candidate additions (pending findings or preference)

Advanced Note Composer, Tag Wrangler (likely), Omnisearch (optional). Optional trials: Iconic, Notebook Navigator, Strong Start, The DM Compendium, Advanced Multi Column.

### Phase plan (DM vault)

| #   | Phase                                                                                    | Depends on | Model                                                                                        | Status                                                                    |
| --- | ---------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| D0  | Checkpoint: commit a clean git state                                                     | none       | Sonnet                                                                                       | done 2026-10-18                                                           |
| D1  | Inventory (Findings below)                                                               | D0         | Sonnet for counts. Opus for classifying the full Dataview inventory (F2)                     | done 2026-10-18                                                           |
| D2  | Disable then delete confirmed-unused plugins (MetaEdit if F5 clear)                      | D1         | Sonnet                                                                                       | done; deletion of disabled plugins due on or after 2026-10-25             |
| D3  | Install Advanced Note Composer, move any Note Refactor hotkeys, retire Note Refactor     | F6         | Sonnet                                                                                       | done; Note Refactor Plus used instead of Advanced Note Composer           |
| D4  | Admonition decision                                                                      | F3, F4, F7 | Sonnet                                                                                       | done; keep Admonition                                                     |
| D5  | Dataview triage: label each query Bases, Datacore, or keep for now                       | F2, F4     | Opus (holistic pass over the whole inventory, one folder at a time)                          | done 2026-10-21         |
| D6  | Convert in batches, one commit per batch. Simple queries to Bases | D5 | Sonnet for simple Bases conversions. Opus for dataviewjs and complex queries to Datacore JSX | done 2026-10-21 |
| D7  | Install Tag Wrangler and any chosen additions                                            | D6         | Sonnet                                                                                       | Tag Wrangler installed; no other additions chosen                         |
| D8  | Retire Dataview when no queries remain; final audit of the plugin list against this note | D6, D7 | Sonnet | done 2026-10-21; Dataview disabled, delete on or after 2026-10-28 |

### Findings to collect (D1)

Record each answer under its heading. Leave blank until checked.

- **F1. Obsidian version.** Settings → About. The current Admonition listing requires 1.13.0 or later.
  - Answer: 1.14.4
- **F2. Dataview inventory.** Count `dataview` and `dataviewjs` code blocks and inline queries, per file. For each: table or list from frontmatter only, or something complex (GROUP BY, FLATTEN, task queries, dataviewjs). A short read-only Python script that outputs a CSV is one option; Gerald decides whether to use it.
  - Answer: Done 2026-10-18: 486 items in 114 files; 433 were the one related-notes query. Fresh count 2026-10-20 is in the Phase log.
- **F3. Admonition use.** Count notes using `ad-` code blocks, list the distinct types, and check the plugin's custom types in `.obsidian/plugins/obsidian-admonition/data.json`. Native callouts (`> [!note]`) do not count.
  - Answer: 1,587 ad-statblock blocks, all in z_Reference; 10 custom types. Keep Admonition.
- **F4. Published folder.** List which notes in the published folder contain `ad-` blocks, Dataview queries, statblock blocks, or Calendarium syntax.
  - Answer: Confirmed 2026-10-18: the Publish folder is one folder inside the DM vault, and Publish publishes only that folder's contents. The folder is Player Wiki; it contains no Dataview, ad- blocks, statblocks, or Calendarium syntax (checked 2026-10-18).
- **F5. MetaEdit use.** Check `.obsidian/hotkeys.json`, Templater scripts, and the DM Vault Inspector for `metaedit`. List matches, or write "none".
  - Answer: None. MetaEdit disabled; delete on or after 2026-10-25.
- **F6. Note Refactor use.** Which commands and hotkeys are in use. Is the core Note Composer enabled.
  - Answer: No references or hotkeys. Replaced by Note Refactor Plus.
- **F7. Linter configuration.** Which rules are on, any excluded folders, and whether a YAML timestamp rule is enabled. Confirm Linter does not rewrite published notes in ways that break them.
  - Answer: Linter 1.33.0 configured 2026-10-18 (45 rules on, yaml-timestamp off); ignores z_ folders.
- **F8. Plugins with unknown or low use.** One line each: Mononote (confirm what it is used for), Janitor, Recent Files, Force note view mode, Kanban (count of boards).
  - Answer: Resolved 2026-10-18: keep Janitor and Mononote; Kanban, Buttons, Sort and Permute disabled; Contextual Typography and QuickAdd deleted. 2026-10-21: Recent Files kept; Force note view mode deleted (0 notes used it, no rules set).

### Phase log

Newest at the bottom. Format: `YYYY-MM-DD | phase | what changed | result`.

2026-10-18 | planning | status note created, decisions recorded | no vault changes yet

2026-10-18 | D1 inventory | Ran inventory + config audit | Findings:

- F1: Obsidian >= 1.13.0 (Linter/Templater/QuickAdd min app). Sufficient.
- F2: 486 Dataview items in 114 files (472 blocks, 12 dataviewjs, 2 inline). 433 are ONE related-notes LIST query (tags npc/location/artifact/plot/atomic) stamped from 5 templates into 106 notes. ~35 items sit in two stale reorg docs (use retired `processed`). Real remaining work: 002 Incomplete To-Dos (8 identical dataviewjs), Plot Dashboard (8), ~7 oddballs.
- F3: 1,587 ad-statblock blocks, all in z_Reference. 10 custom Admonition types. DECISION: keep Admonition.
- F4: pending. Run was missing --published. 116 notes carry a `publish` property.
- F5: MetaEdit has 0 refs, 0 hotkeys. DECISION: disable, delete after a week.
- F6: Note Refactor has 0 refs, 0 hotkeys. Core Note Composer on. Pending: what it is used for.
- F7: Linter 1.33.0, 51 rules, yaml-timestamp OFF, foldersToIgnore has an empty-string entry.
- F8: Kanban 0 boards (removal candidate). Tag Wrangler already installed (drop from additions). QuickAdd installed but OFF. Pending usage answers: Mononote, Janitor, Buttons, QuickAdd, Contextual Typography, Sort and Permute Lines.

2026-10-18 | D1 follow-up | Published folder is "Player Wiki": no Dataview, adblocks, statblocks or Calendarium in it (F4 closed for those; callouts/Buttons pending rerun).

Decisions: delete QuickAdd now. Disable MetaEdit, Kanban, Sort and Permute Lines, Mononote, Contextual Typography, Janitor; delete after a week if nothing breaks. Replace Note Refactor with Advanced Note Composer (hotkey + test first). Janitor replacement options A/B/C pending (Bases no-backlinks view / Graph orphans / Python auditor). Buttons pending audit. Next: rerun inventory (scripts updated), then test an embedded Base with a `this`-based link filter before choosing Bases vs Datacore for the related-notes query.

2026-10-18 | D1 close | Dispositions settled. KEEP: Janitor (tested a Bases orphan view; backlinks work only as a formula property `file.backlinks.length`, the filter picker doesn't offer them, and Janitor suits better), Mononote (needs "Always focus new tabs"), Admonition (1,587 ad-statblock blocks). DISABLE then delete after a week: MetaEdit, Kanban (0 boards), Sort and Permute, Buttons (0 blocks), Contextual Typography (purpose unknown). DELETE now: QuickAdd (unused). REPLACE: Note Refactor with Advanced Note Composer (bind the extract-selection hotkey and test it before disabling). Publish folder (Player Wiki) has no plugin syntax. Obsidian 1.14.4. Custom callouts are not Admonition types, so no action.

2026-10-18 | D0, D2 | Git checkpoint committed. QuickAdd deleted. Contextual Typography deleted (skipped the disable trial). MetaEdit, Kanban, Sort and Permute, Buttons disabled. Delete these four on or after 2026-10-25 if nothing breaks.

2026-10-18 | D3 | Replaced Note Refactor with Note Refactor Plus instead of Advanced Note Composer (ANC's template and variable docs could not be verified; NRP has a Note Refactor importer and a note link template). Template saved as a.md file in z_Templates (Linter ignores it). Edits: {{new_note_content}} -> {{content}}; Source Note link -> {{source_link}} (brackets come with it); `created` value rewritten so Obsidian no longer converts it to a nested mapping. Test extraction passed: frontmatter, Core Information heading, embed, and all five dataview blocks survive. ANC is NOT being installed. Note Refactor disabled; delete on or after 2026-10-25 if nothing breaks. When the related-notes queries are converted (D6), update the template's five dataview blocks too.

2026-10-18 | D0-D3 summary | Git checkpoint committed. DELETED: QuickAdd, Contextual Typography. DISABLED (delete on or after 2026-10-25 if nothing breaks): MetaEdit, Kanban, Sort and Permute, Buttons, original Note Refactor. KEPT: Mononote, Janitor (Bases orphan view tested, backlinks only work as a formula property), Admonition. Note Refactor Plus installed in place of Advanced Note Composer, with the extraction template saved as a.md file in z_Templates; old hotkey works with it; test extraction passed. Janitor test folder and Orphan Check base deleted. Next for this vault: Linter setup, then the Dataview migration (D5/D6).

2026-10-18 | Linter (DM vault) | Linter configured deliberately; final audit confirms 45 enabled rules (51 before). OFF: proper-ellipsis, proper-ellipsis-on-paste, remove-hyphenated-line-breaks, remove-hyphens-on-paste, paragraph-blank-lines, move-tags-to-yaml. Decisions: YAML keys sorted alphabetically, tags as block lists with duplicates removed, empty lists written as [], blank line after frontmatter; header-increment with start-at-H2 (shifts H1->H2 and keeps nesting); straight quotes in body only (frontmatter and fenced blocks untouched); ordered lists renumbered ascending, keeping the starting number; spaces removed around em/en dashes (hyphens untouched); trailing spaces removed (Strict line breaks is off); 6 paste rules kept. yaml-timestamp stays off. Linter ignores z_Templates, z_compendium, z_Archive, z_Reference (the empty-string ignore entry is harmless). No inline #tags in this vault (regex search found only the reorg plan and two #FFFFFF hex colors). Also: original Note Refactor is fully uninstalled; Tag Wrangler installed and on; Buttons disabled (delete on or after 2026-10-25).

2026-10-18 | Dataview triage: related notes | Created "Related Notes.base" (00 DM Screen): shows every note linking to or from the current note, grouped by type (NPC, Location, Artifact, Plot thread, Atomic note, Other), with list/table/cards/Kanban views. Excludes z_Templates, non-markdown files, the current note itself, and any note with the checkbox property hide_from_related. Replaced 433 old queries: 92 notes by script (one git commit), 3 by hand (second commit), 6 templates plus Atomic Note template, 3 Rendspawn notes and Arghyak Bow in ignored folders. Turned off Backlink in document. | Done. Remaining by design: custom NPC table in Lorestone Shard Status Tracker (convert later); Reorganization Plan documents the old pattern (archive decision pending).

2026-10-19 | D5/D6 resume | Datacore not yet installed in DM vault (install just before the Plot Dashboard conversion, after a git commit). The vault reorganization plan (DM_Vault_Reorganization_Plan.md, Revised Phase 8.md, Exandria Vault Reorganization.md, npc-folder-audit.md) is still in progress: retain all of it, archive nothing. Open item 1 (archive stale reorg docs) is replaced by: review the reorg plan and decide whether its remaining phases change the Dataview conversion order. The "24 items" count did not match the folder listing (20 files). Dataview counts per file in 00 DM Screen still to collect.

2026-10-19 | D6 Plot Dashboard + reorg cleanup | Deleted 002 Notes to Process and 002 Incomplete To-Dos (dead: retired `processed` property and old numbered folders). Retagged Tyranny/Faerun NPCs: world/faerun -> world/toril (standard), all get npc + region/sword-coast, campaign/tyranny kept; 13 thin stubs deleted (Characters/NPCs 102 -> 89). Datacore 0.1.29 installed. Plot Dashboard.md rebuilt in Datacore after a Bases test failed (Bases cannot stack a list of links in one cell): cards grouped by stage, stage-colored headers, staleness from file mtime (amber 14 days, red 45), every connected note listed on every plot it touches (both link directions, deduplicated), filter box. Plot Dashboard.base deleted. hide_from_related added to List of Plot Threads and 00 DM Screen. | Done. Rule confirmed: Bases first; Datacore only where Bases cannot show what is needed. Folder Notes `folder-overview` blocks are valid and stay (Revised Phase 8 Part E grep flags them falsely). Remaining Dataview: 00 DM Screen.md (4, all broken), Campaign Overview (3, depend on missing properties), List of Plot Threads, Lorestone Shard Status Tracker, Unused Ideas, Lady Emer Status inline.

2026-10-20 | Status sync, hubs, reorg | Review of the reorg plan against the Dataview order is settled (10-19): no change to the conversion order. The 24 Dataview blocks in the reorg docs are documentation only; both 002 notes were deleted as dead. Remaining Dataview to convert: Campaign Overview (3), Lorestone Shard Status Tracker (1), Unused Ideas (1), Lady Emer Status inline. 00 DM Screen.md has none left; List of Plot Threads moved to z_Archive. Built on Datacore 0.1.29 (Bases first, Datacore only where Bases can't): Plot Dashboard, Recent Work.base, and the two hubs (00 DM Screen, Session Hub) with shared code notes in 00 DM Screen/Code/ and settings in Hub Config. Design and build state: DM Hubs Design.md. Roll20 party data comes from the!party script into Party Card Data. Reorg still open: npc-folder-audit Phases 4-5 (Aveqtaro Thaan hub restructure, her missing subnotes, Qalix and Korfel candidates, Lady Emer satellites, non-NPC sweep), Phase 8 Parts D-F, plan docs update (world/faerun to world/toril, new folder names), final verification checklist. Maintenance backlog item added: scan the vault for cruft. Due on or after 2026-10-25: delete disabled MetaEdit, Kanban, Sort and Permute, Buttons.

2026-10-21 | D6 NPC tag cleanup | Wrote npc_tag_cleanup.py, npc_tag_apply.py and npc_tag_rules.yaml (z_Reference, Git-ignored). Report was edited by hand (Tag map Final column), then applied: 196 tags added to 134 notes (world/, region/, place/, faction/ with nesting, needs-work where a tag could not be set automatically), 8 faction stubs created (Clasp, Myriad, Draconia, Gentleman's Organization, 4 Ashari tribes). Parent tags dropped when a child is present. Nothing removed; old properties (affiliations, faction, current_location, home_city, location) untouched. Nested tags verified in Bases (hasTag matches children) and search. Note: z_Reference is in Excluded files, so Bases cannot see notes there. | Done. Open: update NPC, Faction and Location templates to write tags; retire old properties after tags are checked; remove npc tag from Harmonic Planar Conduit; build NPC browser in the campaign folder note; 62 NPCs flagged needs-work (no place data, no region, dropped faction values) need manual review.

2026-10-21 | D6 templates | NPC, Faction and Location templates now write tags instead of properties: NPC asks for place (place/…, nested to any depth, picks from tags already in the world or types a new one) and factions (faction/…, repeatable); Faction writes its own faction/<name> or faction/<parent>/<name> tag; Location writes a place tag (folder-based default, nest under existing, type, or none). Parent tags dropped when a child is present; needs-work added when no place. Settings read from Hub Config; slugs strip apostrophes and " - DM Notes". Originals in z_Reference/template-backups. Tested in a Node harness against real vault data; not run inside Templater. | Done. Open: Quick Capture still writes current_location and affiliations on NPC stubs; retire old properties; NPC browser; Lorestone tracker.

2026-10-21 | D6 templates | Retest fixes to NPC, Faction and Location templates. NPC now asks for the name first when the note is "Untitled"; Faction and Location already did. A blank or cancelled name cancels the note, so faction/untitled can't recur. Illegal filename characters become hyphens. Moves go through a safe move: skipped when the note is already at its target, and a number is added if the name is taken (Notice shown); this was my best guess for the "Destination file already exists!" error and it passed your retest. Cancel and Esc no longer delete the note from the template. Templater 2.26.0 deletes it itself when a template returns nothing, and the double delete caused the ENOENT unlink error. Location place picker redesigned: lists existing places in the world (applied as-is), "No place tag" (adds needs-work), or "Generate new place tag", which defaults to the normalized note name and then asks top level or inside an existing place. This replaces the folder-based, nest, type and none modes. Mock-harness tests pass; your retest passed except Esc at NPC pickers, and the final cancel fix is installed but not yet retested in Obsidian. | Installed; Esc/Cancel retest pending. Open: ZZ Test notes and folders to delete; Calendarium "Must specify a valid year: NaN" errors on every Obsidian launch (separate troubleshooting session); Quick Capture still writes current_location and affiliations on NPC stubs; retire old properties; add world/region tags to 30 location notes; NPC browser; Lorestone tracker.

2026-10-21 | D6 Quick Capture | NPC stubs no longer write current_location or affiliations (doc line updated). Found: Session Hub Table and Plot Dashboard Views still read current_location. | Done (untested in Obsidian). Open: move those hubs to place tags before retiring old properties.

2026-10-21 | D6 hubs | "NPCs here now" (Session Hub Table) and the NPC detail on Plot Dashboard cards now use place/… tags (own tag or nested under it; name fallback when the place note has no tag) instead of current_location. Rule checked against real vault tags (Port Damali: 13 NPCs); not run in Obsidian. | Done. Open: remove current_location checkbox from Session Template; retire old properties after checking the 14 notes with dropped faction values; world/region tags on 30 location notes; NPC browser; Lorestone tracker; Calendarium NaN session.

2026-10-21 | D6 hubs | Removed the current_location checkbox from Session Template "After the Game"; removed the now-outdated note about it from DM Hubs Design. | Done. Open: retire old properties (affiliations, faction, current_location, home_city, location) after checking the 14 notes with dropped faction values; world/region tags on 30 location notes; NPC browser; Lorestone tracker; Calendarium NaN session.

2026-10-21 | D6 old properties | Resolved the 14 NPCs whose faction/affiliation values had no tag: Gilxel Valthyra gets place/candlekeep, Laugu Nalakekali gets place/whitestone (needs-work removed on both); Unshaken/Skyship (8 NPCs), Celunor's Collection, The Inkwell, Bahamut, Xarzith Kitril intentionally dropped. | Done. Open: grep for readers of the old properties, then retire them (dry run first); world/region tags on 30 location notes; NPC browser; Lorestone tracker; Calendarium NaN session.

2026-10-21 | D6 old properties | Retired affiliations, faction, current_location, home_city and location from the front matter of 62 NPC notes (Characters/, tagged npc). Venue-level current_location values on 11 notes were dropped by decision. Non-NPC notes and note-body text left alone. Only live reader was the Lorestone tracker (deferred). | Done. Open: world/region tags on 30 location notes; NPC browser in the campaign folder note; Lorestone tracker; Unused Ideas and Lady Emer items; Calendarium NaN session; non-NPC notes still carrying the old properties (8 factions, a few locations/items, 5 campaign notes).

2026-10-21 | D6 location tags | Added world/ and/or region/ tags (from folder path) to 27 location notes under Worlds/; 3 skipped (Skyship Distances and Travel Times, Callastri, The Single Swig Saloon). Place tags and needs-work not touched. | Done. Open: NPC browser in the campaign folder note (drop the [[Campaign Overview]] link; you delete Campaign Overview.md); Lorestone tracker; Unused Ideas and Lady Emer items; Calendarium NaN session; remove npc tag from Harmonic Planar Conduit (yours); non-NPC notes still carrying old properties; delete disabled plugins on or after 2026-10-25.

2026-10-21 | D6 NPC browser | New Datacore note 00 DM Screen/Code/NPC Browser.md, embedded in Prophecy of Eryndor.md under "NPCs". Scopes by the campaign note's world property; filters for name, place, region, faction (nested tags include children), disposition, plus No place / No faction / Needs work toggles; rows show name, disposition, factions, place. Removed [[Campaign Overview]] from Key notes. Logic tested in a Datacore mock on real vault tags; not rendered in Obsidian. | Done pending a check in Obsidian. Open: delete Campaign Overview.md (yours); remove the npc tag from the five non-NPC notes; Lorestone tracker; Unused Ideas and Lady Emer items; Calendarium NaN session; non-NPC notes still carrying old properties; delete disabled plugins on or after 2026-10-25.

2026-10-21 | D6 last small queries | Lady Emer Status: removed the inline Dataview "Last Updated" line (Recent Work.base shows modified dates). Unused Ideas: removed the Dataview orphan-list block (Janitor covers it). Vault search for remaining Dataview code finds only Campaign Overview.md (to be deleted) and Lorestone Shard Status Tracker.md. | Done. Open: Lorestone tracker design discussion; delete Campaign Overview.md; D8.

2026-10-21 | D6 Lorestone stage 1 | Eight shard notes (Objects/Lorestone of Eryndor - DM Notes/Shards/) with Who knows, Pursued by, Prophecy lines, Open questions, Properties and rulings, and an append-only History of Calendarium inline events (category Lorestone), built from the tracker, session notes, the timeline and the players' notes; new code note Artifact Pieces (reads shards by piece/lorestone-of-eryndor, current holder and location, who-knows-what grid with faction and party roll-up); nine piece settings in Shared Helpers and Hub Config; repointed links in Lyren Willowwhisper, The Prophecy (Original Form), Current Status Document 2025-10-12. Tested in a mock harness on real vault tags; not run in Obsidian. | Done. Open: delete Shard of Willow's Legacy.md, create Palma Flora stub and Lorestone Calendarium category (yours); confirm Calendarium shows shard events; stage 2 (hub and shard grid, removes the last Dataview block).

2026-10-21 | D6 Lorestone stage 2 | Lorestone Shard Status Tracker rebuilt as the artifact hub: Overview (holders with their shard numbers, embeddable), Shards (a card per shard: holder, location, who knows, pursued by, lines read/unread; More opens history, knowledge, pursuit, lines, open questions, sessions, and embedded rulings and notes), Faction knowledge evolution embed. New code note Artifact Hub Views; Artifact Pieces links a place-tag location to its location note; heading_piece_notes added to Shared Helpers and Hub Config. The tracker's Dataview block is gone. Rendered in a Preact mock harness; not run in Obsidian. | Done pending a check in Obsidian. Open: check the hub and the two #Overview embeds; replace the =this.location inline field in Encounter Template before D8; stage 3 (who-knows-what grid); stage 4 (record-a-change form).

2026-10-21 | D6 Lorestone stage 2 revision | Prophecy (Original Form) and (Modern Text): every line labeled with its shard and position (4a, 4b…); modern labels corrected by wording and rhyme (Stars drawn close = 4b, A hidden path = 3b; lost-shard survivors (6b), (7a)). Hub reads lines from the two prophecy notes; dots show three states (● read, from a "lines read" History entry; ◐ modern version only; ○ not known); detail panel shows each line with its modern version. Card borders: green party holds, accent party knows where, red only the DM knows, gray no holder; Party badge keyed on the holder; color key under the cards. Prophecy lines sections removed from the shard notes. Mock-tested; not run in Obsidian. | Done pending a check in Obsidian. Open: replace the =this.location inline field in Encounter Template before D8; stage 3 (who-knows-what grid); stage 4 (record-a-change form).

2026-10-21 | D6 Lorestone stage 3 revision | Who knows what grid redrawn: letters replaced by cell shading (light/mid/full green = knows it exists / knows where / holds; gold = believes something false), ↗ for pursuing, accessible labels and tooltips; factions and Party folded by default (▸ to open; filters open matching groups); hovered column outlined; color key under the grid. Theme colors (--color-green, --color-yellow). Render-tested; not run in Obsidian. | Done pending a check in Obsidian. Open: review tag-driven roll-ups; replace the =this.location inline field in Encounter Template before D8; stage 4 (record-a-change form).

2026-10-21 | D6 Lorestone stage 3 revision | Grid folding: a folded group's whole name cell opens its members (name shown as plain text); once open, the name links to its note and a larger ▾ folds it again; triangle enlarged; key updated. Render-tested; not run in Obsidian. | Done pending a check in Obsidian. Open: review tag-driven roll-ups; replace the =this.location inline field in Encounter Template before D8; stage 4 (record-a-change form).

2026-10-21 | D6 Lorestone stage 3 revision | Grid colors finalized: opaque brightness ramp (knows it exists = green 45% with black, knows where = 70% with black, holds = full green), believes something false = opaque gold (yellow with 15% orange); arrows white on darker greens, dark on full green and gold. Version 4 (55% / 78%) looked right in the preview but too close together in the vault, so the hub uses version 3. Render-tested; checked in Obsidian. | Done. Open: review tag-driven roll-ups; replace the =this.location inline field in Encounter Template before D8; stage 4 (record-a-change form).

2026-10-21 | D6 Lorestone stage 4 | Record-a-change form (new code note Artifact Change Form; Record change button on each card and in the panel): kind, Who/At with name suggestions, description, in-world date (defaults to today in-world; No in-world date gives a label instead), session (defaults to last played), Calendarium category (Lorestone) and event name. Writes one History line (Calendarium inline event); knows/wrong kinds replace the person's Who knows line, pursuing/stopped replace or remove their Pursued by line, ruling adds to Properties and rulings. Mock-tested against real shard notes; not run in Obsidian. | Done pending a test save in Obsidian. Open: review tag-driven roll-ups; replace the =this.location inline field in Encounter Template before D8; record the hub in DM Hubs Design.

2026-10-21 | D6 Lorestone stage 3 fix | Who knows what grid: shard numbers sat one column left because the empty top-left header cell was hidden by the Blank Table Headers.css snippet; that cell now reads "Factions and individuals". Tests check the header and per-row cell counts. | Done pending check in Obsidian.

2026-10-21 | D6 Lorestone | DM Hubs Design: added "Artifact hub (Lorestone Shard Status Tracker)" (data model, inscription labels, sections table); code-note list now includes NPC Browser, Artifact Pieces, Artifact Hub Views, Artifact Change Form. Lorestone Shard Status Tracker redesign complete; the last Dataview block is gone. | Done. Open: replace the =this.location inline field in Encounter Template, then D8 (retire Dataview, final plugin audit).

2026-10-21 | D6 Encounter Template | Rewritten to current template conventions: name prompt, campaign from campaign notes (active first; world tag from its world property), place picker (existing in that world, new nested, or none), region copied from the place's location note, faction checklist; Location line auto-links the place note. Removed the location and session properties and the =this.location Dataview field; uses the shared helper block (Hub Config, safe move, cancel without double delete); no longer reads vault_inspector_config.json. Simulated in a Templater harness against real notes; not run in Templater. | Done pending a test run. No live Dataview left (only the three reorg docs and one archived note). Open: D8.

2026-10-21 | D6 Encounter Template fix | Location line linked a place inside the chosen city (first location note carrying the city's place tag); now links the place's own note, the one whose name matches the tag's last part, or stays blank when none matches. Same rule applied to the shard hub's place-tag fallback in Artifact Pieces. Simulation and hub tests pass. | Done pending a retest.

2026-10-21 | D8 | Dataview disabled (delete on or after 2026-10-28). Final plugin audit: 18 enabled, 5 disabled (Buttons, MetaEdit, Kanban, Sort and Permute, Dataview), no syntax for any disabled plugin. Live Dataview only in the three reorg docs and one archived note. Original Note Refactor already uninstalled (drop it from housekeeping); Linter now 1.34.2. Undecided: Force note view mode (unused: 0 notes, no rules), Recent Files. Leftovers: orphan hotkeys for Text Generator and QuickAdd, two stale snippet entries, conversion script and reports in the vault root. | Done pending those two decisions.

2026-10-21 | D8 close | Force note view mode deleted (unused); Recent Files kept. Removed orphan hotkeys for Text Generator and QuickAdd. Status note: D6 and D8 marked done, Open items and housekeeping updated (Dataview delete on or after 2026-10-28). | Done.

2026-10-21 | D6 NPC browser check | Checked in Obsidian: loads, dropdowns fill, table reads well. | Done. Next up item 1 closed.

2026-10-21 | D6 Lorestone roll-up | Who knows and Pursued by lines take an optional sharing field: personal (person only) or "shares with [[…]]" (only the factions named); default unchanged. Grid, detail lists and cell details show it; change form adds "Shares it with" (their factions / no one / only some), defaulting to the person's current line. Qalix (knows 1–6, pursuit 1–5) and Varnes (5) marked personal; Draconia and Dwendalian Empire rows gone. Docs in the three code notes and DM Hubs Design updated. Harness tests pass; not run in Obsidian. | Done pending Calderax's lines and a check in Obsidian.

2026-10-21 | D6 Lorestone roll-up | Aelorin's Shard 6 line changed from exists to a false belief (thinks it was a rare relic, not a shard); the Clasp shows gold on 6. Removed a stray "œ" line from the tracker note (typed in Obsidian; Option+Q on a Mac). Harness tests pass. | Done. Roll-up review complete.

2026-10-21 | Calendarium NaN | data.json: 8 links repointed (+#36, #37), 1 link cleared, 7 events removed (4 duplicates/stray, 3 post-death Dreyara), 2 categories set; backup data.json.bak-2026-10-21 | verified by re-read; not yet opened in Obsidian

2026-10-21 | Janitor | Excluded-files entries are regular expressions, not globs: vault_inspector_*.json failed, ^vault_inspector_.*\.json$ works; publish.css already excluded. aveqtaro.rtf was deleted in Finder and restored (untracked in git; keep until the Aveqtaro reorg). etcheda-monkey-token.png is no longer an orphan because Gerald linked it from its note | Orphans 13 → 7; the remaining 7 are the migration scripts and reports, held for the vault-root cleanup.

2026-10-21 | Calendarium NaN | Confirmed in Obsidian: no console errors, calendar and linked events correct. debug turned off, data.json backup deleted. Standing setting: "Parse note titles for event dates" stays OFF (cause of the NaN errors: every note with frontmatter and no fc-date had its title parsed as a date). Only notes with fc-date (Sessions) and notes tagged inline-events create events. | Done. Closes the Calendarium separate session.

2026-10-21 | D6 verification | Gerald tested in Obsidian and the results were not logged at the time: Lorestone hub and both #Overview embeds (Lorestone DM note, Assembling the Lorestone) render; stage 4 Record change test save; Encounter Template test run and retest; NPC, Faction and Location template Esc/Cancel retest; place-tag changes to NPCs here now and the Plot Dashboard cards; Quick Capture NPC stubs; Calderax's lines. | Closed. Lorestone hub work complete.

## Open items (as of 2026-10-21)

Next up (Suggest the best next step of these, but Gerald will have final say):
1. Housekeeping deletions on their dates (below).
2. Aveqtaro Thaan reorg (npc-folder-audit Phases 4-5): restructure her as a Tier 1 hub with subnotes; fill or retire the two empty placeholders (What Aveqtaro Thaan Knows, Bramwell Bellweather - DM Notes); use Characters/NPCs/aveqtaro.rtf as source (untracked in git, keep until this is done); then evaluate Vaud Qalix and Korfel Withrethin as Tier 1 hubs, the non-NPC sweep of Characters/NPCs, and the Lady Emer satellites.

Gerald's own tasks:
- Remove the npc tag from three notes that show in the NPC Browser: Manifesto - Brief and Manifesto - Reclaiming the Glory of Draconia (Characters/Adversaries/Vaud Qalix - DM Notes), and Keldar Stonefoot Letter to Calderax (Plot Threads). "History of Tessa and Sumad-Dekon, Eryndor" was not found by that name; check whether it was renamed or deleted. Harmonic Planar Conduit is done.
- Vault root cleanup (the seven orphans Janitor lists): move replace_related_blocks.py out of the vault and delete the six *_dryrun.txt and *_applied.txt reports.
- Lawbearer's Tear.md is empty and three notes link to it: fill it in or leave it.
- Optional: .obsidian/appearance.json lists two snippets that no longer exist (blank_table_headers, readable-typography-inter). Harmless; Claude can remove them with the vault closed.

Reorganization docs (update when convenient):
- DM_Vault_Reorganization_Plan: final checklist has 7 open boxes. Reword "Dataview queries return expected results" for Bases and Datacore, and change world/faerun to world/toril.
- Exandria Vault Reorganization: the 35 open per-note tasks use the retired processed property and Dataview Connected Elements blocks. Mark them superseded, not complete.
- Revised Phase 8: shows 3 of 3 boxes checked, but the log lists Parts D-F as open. Reconcile.
- npc-folder-audit: the 5 open items are real work (see Next up 2).

Data cleanup (not blocking D8):
- 40 Exandria NPCs have no place tag (the NPC Browser's "No place" filter lists them); 33 of them also lack a faction.
- Location notes: place tags are still missing on many of them; 3 location notes have no region (Skyship Distances and Travel Times, Callastri, The Single Swig Saloon).
- Non-NPC notes still carry old properties: current_location on 8 faction notes, affiliations on a few faction, location and item notes, location on 5 campaign notes. Plain-text lines such as `home_city: Zadash` remain in some NPC note bodies.

Tag scheme (settled 2026-10-21):
- world/<slug>, region/<slug>, place/<nested path>, faction/<nested path> (sub-factions under the parent, e.g. faction/ashari/terrah), needs-work when no place could be set. Parent tags are dropped when a child is present; file.hasTag("a") matches a/b.
- Slug rule: strip " - DM Notes", remove diacritics, lowercase, & becomes "and", drop apostrophes, other characters become hyphens.
- Bases and search skip folders in Settings > Files & links > Excluded files (z_ folders, Isolated One-Shots).
- NPC, Faction and Location templates write these tags; Quick Capture NPC stubs no longer write current_location or affiliations.
- Scripts and reports: z_Reference holds npc_tag_cleanup.py, npc_tag_apply.py, npc_tag_rules.yaml, the Cleanup Report, the Apply Plan, and template-backups (original templates). The retire-properties and location-tag scripts were run from Claude's working folder and are not in the vault.

Calendarium and Janitor rules:
- Calendarium: "Parse note titles for event dates" stays OFF. Events come only from notes with fc-date (Sessions) and notes tagged inline-events (shard History, Eryndor Timeline). A note with frontmatter and no fc-date is ignored while the setting is off.
- Janitor: excluded-files entries are regular expressions matched against the vault-relative path, not globs. Use ^name_.*\.json$, not name_*.json.

Related Notes.base reference:
- Lives in 00 DM Screen. Embed with ![[Related Notes.base]] under "## Connected Elements" at the end of a note.
- To hide a note from every related list, add the checkbox property hide_from_related (type Checkbox, value true, no quotes). Folder z_Templates is excluded in the base filter.
- Kanban view uses columnWidth: 200 and overflows the note width. List is the default view.
- New notes from the entity templates and the Atomic Note template already carry the embed.

Repo facts:
- .gitignore excludes z_*/ (templates, reference, archive) by design, so edits there never show in git.
- Scripts used for the conversion: connected_elements_audit.py, connected_elements_audit2.py, replace_related_blocks.py (supports --templates, --folder, --apply; dry run by default). Gerald holds copies; they are untracked. Move them out of the vault root, and delete the report.txt files there.

Housekeeping on or after 2026-10-25:
- DM vault: delete disabled plugins MetaEdit, Kanban, Sort and Permute, Buttons. The original Note Refactor is already uninstalled.
- DM vault, on or after 2026-10-28: delete Dataview.
- Personal vault: delete disabled MetaEdit.
- Delete the Desktop copy of obsidian-folder-notes (folder-notes/data.json.bak is already gone).

Still open in the personal vault: P6 final audit (update plugin lists in "8 - System Infrastructure/Obsidian System Context.md", line 114 mentions MetaEdit, and plugins.txt). The Related Notes pattern is DM-vault only; the personal vault has no equivalent yet.

Gerald's working style: one step at a time, never assume a step was done, ask before moving on.

### Resume prompt

Paste into a new conversation along with this note and the personal vault note:

> Resume the Obsidian plugin migration. Read the attached status notes first. Check them against the Findings. Review prior conversations about this migration plan for additional context. Continue from the first unfinished phase, asking one or two questions at a time.
