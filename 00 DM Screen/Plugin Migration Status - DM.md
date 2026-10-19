---
created: 2026-10-18
description: Working record for the Obsidian plugin cleanup of the D&D DM vault. Findings, settled decisions, phase checklist. Read first when resuming.
name: plugin-migration-status
status: active
type: system-doc
updated: 2026-10-18
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

MetaEdit (both vaults), Note Refactor (after Advanced Note Composer is in), Admonition (only if F3 and F4 clear), Dataview (last, when zero queries remain).

#### Candidate additions (pending findings or preference)

Advanced Note Composer, Tag Wrangler (likely), Omnisearch (optional). Optional trials: Iconic, Notebook Navigator, Strong Start, The DM Compendium, Advanced Multi Column.

### Phase plan (DM vault)

| # | Phase | Depends on | Model | Status |
|---|---|---|---|---|
| D0 | Checkpoint: commit a clean git state | none | Sonnet | not started |
| D1 | Inventory (Findings below) | D0 | Sonnet for counts. Opus for classifying the full Dataview inventory (F2) | not started |
| D2 | Disable then delete confirmed-unused plugins (MetaEdit if F5 clear) | D1 | Sonnet | not started |
| D3 | Install Advanced Note Composer, move any Note Refactor hotkeys, retire Note Refactor | F6 | Sonnet | not started |
| D4 | Admonition decision | F3, F4, F7 | Sonnet | not started |
| D5 | Dataview triage: label each query Bases, Datacore, or keep for now | F2, F4 | Opus (holistic pass over the whole inventory, one folder at a time) | not started |
| D6 | Convert in batches, one commit per batch. Simple queries to Bases | D5 | Sonnet for simple Bases conversions. Opus for dataviewjs and complex queries to Datacore JSX | not started |
| D7 | Install Tag Wrangler and any chosen additions | D6 | Sonnet | not started |
| D8 | Retire Dataview when no queries remain; final audit of the plugin list against this note | D6, D7 | Sonnet | not started |

### Findings to collect (D1)

Record each answer under its heading. Leave blank until checked.

- **F1. Obsidian version.** Settings → About. The current Admonition listing requires 1.13.0 or later.
  - Answer: 1.14.4
- **F2. Dataview inventory.** Count `dataview` and `dataviewjs` code blocks and inline queries, per file. For each: table or list from frontmatter only, or something complex (GROUP BY, FLATTEN, task queries, dataviewjs). A short read-only Python script that outputs a CSV is one option; Gerald decides whether to use it.
  - Answer:
- **F3. Admonition use.** Count notes using `ad-` code blocks, list the distinct types, and check the plugin's custom types in `.obsidian/plugins/obsidian-admonition/data.json`. Native callouts (`> [!note]`) do not count.
  - Answer:
- **F4. Published folder.** List which notes in the published folder contain `ad-` blocks, Dataview queries, statblock blocks, or Calendarium syntax.
  - Answer: Confirmed 2026-10-18: the Publish folder is one folder inside the DM vault, and Publish publishes only that folder's contents. Folder name and the list of affected notes still to collect.
- **F5. MetaEdit use.** Check `.obsidian/hotkeys.json`, Templater scripts, and the DM Vault Inspector for `metaedit`. List matches, or write "none".
  - Answer:
- **F6. Note Refactor use.** Which commands and hotkeys are in use. Is the core Note Composer enabled.
  - Answer:
- **F7. Linter configuration.** Which rules are on, any excluded folders, and whether a YAML timestamp rule is enabled. Confirm Linter does not rewrite published notes in ways that break them.
  - Answer:
- **F8. Plugins with unknown or low use.** One line each: Mononote (confirm what it is used for), Janitor, Recent Files, Force note view mode, Kanban (count of boards).
  - Answer:

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

2026-10-18 | D0-D3 summary | Git checkpoint committed. DELETED: QuickAdd, Contextual Typography. DISABLED (delete on or after 2026-10-25 if nothing breaks): MetaEdit, Kanban, Sort and Permute, Buttons, original Note Refactor. KEPT: Mononote, Janitor (Bases orphan view tested, backlinks only work as a formula property), Admonition. Note Refactor Plus installed in place of Advanced Note Composer, with the extraction template saved as a .md file in z_Templates; old hotkey works with it; test extraction passed. Janitor test folder and Orphan Check base deleted. Next for this vault: Linter setup, then the Dataview migration (D5/D6).

### Resume prompt

Paste into a new conversation along with this note and the personal vault note:

> Resume the Obsidian plugin migration. Read the attached status notes first. Check them against the Findings. Continue from the first unfinished phase, asking one or two questions at a time.
