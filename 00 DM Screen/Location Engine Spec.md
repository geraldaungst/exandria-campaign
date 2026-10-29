---
hide_from_related: true
---

## Location Engine Spec

Build spec for the location engine in Gerald's DM vault: a core module, the changes to every template, hub and Base that uses location, the Player Wiki changes, and the migration from `place/…` and `region/…` tags. Written 2026-10-27 (Opus) so that a Claude project with no access to the design conversation can build from it. Decisions here are final; anything not decided is under "Ask Gerald". Where this note and [[Vault Conventions - DM]] disagree, raise it with Gerald before building.

**Status (2026-10-28):** Stage 1 is built and the migration is finished (steps 0 to 5 applied; step 6 is the documentation). Sentences below that say "today" or list what the code reads describe the vault on 2026-10-27, before the build. Stage 2 (the plugin) has not started.

Two stages:
- **Stage 1 (this build, Sonnet):** the core module as a plain script loaded by Datacore and Templater, every consumer rewritten to use it, the migration, and the documentation updates.
- **Stage 2 (later, Gerald's learning project, no deadline):** an Obsidian plugin that wraps the same core file and adds what only a plugin can do. Not published. See the last section.

### 1. Context for a new reader

**The vault.** One Obsidian vault for a D&D campaign (Prophecy of Eryndor, set in Exandria) plus a second world (Keln). It holds DM notes and, in `Player Wiki/`, the player-facing wiki published with Obsidian Publish (only that folder is published). Synced to GitHub (`geraldaungst/exandria-campaign`). Folders: `Campaigns/<campaign>/`, `Characters/` (NPCs, Adversaries, Factions, Creatures), `Worlds/`, `Objects/`, `00 DM Screen/` (hubs, tools, `Code/`), `Player Wiki/`, `z_Templates`, `z_Reference`, `z_Archive`. Folders starting with `z_` are ignored by all code.

**Plugins in use** (versions on 2026-10-27): Datacore 0.1.29 (all hubs and dashboards), Templater 2.26.0 (templates and Close Session), Bases (core), Calendarium 2.1.0, Linter 1.34.2, Folder Notes, Janitor, Tag Wrangler, Obsidian Git. Dataview is no longer enabled (its leftover folder `.obsidian/plugins/dataview` is for Gerald to delete); never use it.

**Where code lives.**
- Hub code: Datacore code notes in `00 DM Screen/Code/`. Each holds one `jsx` block under `## Code` and is loaded with `dc.require(dc.headerLink("00 DM Screen/Code/<Note>.md", "Code"))`. The block ends with `return { … }`. [[Shared Helpers]] is the common module; [[Hub Config]] holds every tag, folder, heading and label name as frontmatter properties, read through `cfg()` in Shared Helpers.
- Template code: Templater templates in `z_Templates/`. Shared template code is the Templater user script `z_Templates/Scripts/dm_helpers.js`, called as `tp.user.dm_helpers(tp, Notice)`. It reads Hub Config through `C(key, default)`.
- Datacore code cannot load Templater helpers and the reverse; [[Quick Capture]] and [[Close Session]] carry a duplicated line format for that reason. The location core removes that problem for location (section 3.1).

**Twins.** A subject can have a DM note and a player note. The player note takes the plain name; the DM note takes the suffix `dm_note_suffix` (" - DM") only when a player note of the same name exists. Otherwise a DM note has the plain name. Shared Helpers has `stripDmSuffix`; the [[Session Hub Table]] already resolves twins for its cast list.

**Campaign state.** The campaign note (tag `campaign-hub`) carries `world` (for example `Exandria`). The party's position is the link in the `Party location` bullet under `## Where we left off` in the last played session note; [[Session Hub Table]] and [[Artifact Hub Views]] already read it.

**Working rules the build must follow** (from [[Vault Reorganization Status - DM]], Working rules; read that section in full):
- Draft before writing; write only after Gerald approves. Ask one or two questions at a time and say where you are in the set.
- Obsidian is closed during edits unless Gerald says otherwise. Say when to close it and when to reopen.
- Back up every changed note to a new dated folder under `z_Reference/template-backups/`. A backup of a note with the `inline-events` tag or an `fc-date` property ends in `.bak` (Calendarium reads the whole vault).
- Check every wiki-link resolves before writing it. After any change run `.scripts/scan_unresolved_links.py` and confirm 0 new unresolved links. Before moving or renaming a note, check for duplicate file names.
- Bulk or destructive changes go through a dry-run script, tested on a copy, after Gerald has committed.
- Test code with a mock harness. Say what could not be tested in Obsidian.
- Never write a plugin's settings file. Claude cannot delete files; name them for Gerald.
- Each batch ends with a Phase log line in the status note: `YYYY-MM-DD | phase | what changed | result`. Update the Project map and the Region rule row in Parked work in the same edit.
- Claude adds no frontmatter property or tag beyond what this spec names without asking.

### 2. Data model (decided)

The rules are in [[Vault Conventions - DM]] under **Location**. In short:

| Field | Kind | On | Meaning |
|---|---|---|---|
| `world/<slug>` | tag | every campaign-content note | the setting; one value per plane (`world/feywild`). `world/planar` is retired |
| `political_region` | list of links | place notes (tag `location`), DM and player | nearest political parent(s); first entry is the main one, shown in trails |
| `natural_region` | list of links | same | nearest natural parent(s); first entry main |
| `whereabouts` | one link | NPCs, factions (their base), items (a place or the person holding them; an item the party holds names the PC who carries it) | where it is now |
| `site` | one link | arcs, encounters | where it happens |
| `ties_to` | list of links | any entity | places, cultures or factions it comes from or is tied to; a tie to a place counts for everything that place sits inside |
| `unplaced` | tag | any entity | no known or decided location |

- A place at the top of its setting carries neither parent. NPCs tagged `deceased` need no `whereabouts`.
- Player place notes link only to player notes. Player NPC, faction and item notes carry no location properties (the wiki is evergreen).
- A place with a DM note and a player note is one place. The DM note's parents apply when it has any, otherwise the player note's.
- Links from DM notes point to the DM note when one exists, otherwise to the player note. Code treats either as the same place.
- A Player Wiki note with no DM twin is the only record of its subject: every view, list and check includes it, marked "player note only".
- Every DM note with a player twin embeds it directly under Quick Reference:
  ```markdown
  > [!quote]- What players know
  > ![[<player note>]]
  ```
- Folders under `Worlds/` are `Worlds/<world>/<kind>/` (Places, Lore, Tables), with a bundle folder for a note that has its own sub-documents. A folder says nothing about location.
- Properties are written as quoted wiki-links (`"[[Zadash - DM]]"`), lists as YAML lists. Write with `app.fileManager.processFrontMatter` in Obsidian code.
- Gerald sets the Linter's Sort YAML Array Values rule to ignore `political_region` and `natural_region` (order matters).

### 3. The core module

#### 3.1 File and loading

`z_Templates/Scripts/location_core.js`, one file loaded by both runtimes:

```js
// location_core.js: the only code that reads location properties or resolves twins.
function createLocationIndex(app, cfg) { /* … */ return api; }
if (typeof module !== "undefined") module.exports = createLocationIndex; // Templater user script
return createLocationIndex; // Datacore dc.require
```

Both loaders wrap the file in a function, so the final `return` is legal in both (checked in Templater's and Datacore's source on 2026-10-27). Templater also exposes it as `tp.user.location_core`; that is harmless.

- Templates reach it only through `dm_helpers.js`, which exports `locations()` returning `createLocationIndex(app, cfgObject)`.
- Hubs reach it only through [[Shared Helpers]], which exports `locations()` the same way (loading the file with `dc.require("z_Templates/Scripts/location_core.js")`).
- No other note loads the file. Stage 2 swaps these two loaders and nothing else.

**First build step (smoke test):** a version of the file that only returns `{ version: "0.0.1" }`, a scratch Templater template that shows it in a Notice, and a scratch Datacore block that renders it. Gerald confirms both in Obsidian before anything else is written. If either loader refuses the file, stop and redesign the loading with Gerald.

#### 3.2 Rules the core must keep (so Stage 2 can reuse it unchanged)

1. No `dc.` or `tp.` calls. Input is `app` (Obsidian's App) and a plain `cfg` object; output is plain data and `TFile` objects.
2. One file, a fixed list of exports (3.4). Adding an export is fine; renaming or changing one needs Gerald's OK and an update here.
3. Every consumer reaches it through the two loaders above.
4. Picker logic (which choices, in what order, which excluded) lives in the core. Templater suggesters and Datacore selects only display what the core returns.

#### 3.3 Places and twins

A **place** is the identity behind any link to a location. `placeOf(link, sourcePath)`:
- resolves the link with `app.metadataCache.getFirstLinkpathDest`;
- pairs a DM note with its player twin by name (plain name in `Player Wiki/` ↔ `<name><dm_note_suffix>` or the same name outside `Player Wiki/`; same rule as Shared Helpers' `stripDmSuffix`);
- returns `{ key, name, dm: TFile|null, wiki: TFile|null, unresolved: boolean }`, where `key` is the DM note's path when it exists, else the player note's path, else `"unresolved:" + linktext`.

Four cases, all tested: DM only, player only, both, unresolved. A link to either twin gives the same `key`. Effective parents of a place: the DM note's list when non-empty, else the player note's. All twin handling is in `placeOf`; consumers compare `key`s only.

An entity (NPC, faction, item, arc, encounter) is a note. `entityOf(file)` maps a player note with a DM twin to the DM note, and marks a player note with no twin `playerOnly: true`.

#### 3.4 API

`createLocationIndex(app, cfg)` scans markdown files outside `z_` folders once and returns:

| Export | Returns |
|---|---|
| `placeOf(link, sourcePath)` | place (3.3) |
| `entityOf(file)` | `{ file, playerOnly }` |
| `parents(place, h)` | places; `h` is `"political"`, `"natural"` or `"both"` |
| `trail(place, h)` | main-parent chain upward (first entries only), cycle-safe |
| `ancestors(place, h)` | every place above, all entries, cycle-safe |
| `descendants(place, h)` | every place below |
| `whereIs(file, { partyPlace })` | `{ place, via, source }`: follows `whereabouts` (item → holder → holder's whereabouts), `site`, a PC holder (tag `player`) or the party → `partyPlace`; a place note is its own place. `source` is `"whereabouts"`, `"site"`, `"party"`, `"self"`, `"unplaced"`, `"deceased"`, `"none"` or `"loop"` |
| `within(file, place, { h = "both", ties = false, partyPlace })` | true when `whereIs(file).place` is `place` or below it; with `ties`, also when any `ties_to` place is `place` or below it, or `ties_to` names `place` directly |
| `entitiesWithin(place, { kinds, ties, partyPlace })` | files, for kinds `npc`, `organization`, `artifact`, `location`, `arc`, `encounter` (Hub Config tag names) |
| `pickerChoices({ field, forFile, world })` | `[{ label, place|file, link }]` for `political_region`, `natural_region`, `whereabouts`, `site`, `ties_to`: places in the world (one entry per place, labelled with its trail: "Evening Nip · Zadash · Dwendalian Empire"), people for an item's `whereabouts`, places plus faction and lore notes for `ties_to`. Leaves out the note itself and, for parent fields, its descendants in that hierarchy, so a loop cannot be picked |
| `linkFor(target, sourcePath)` | the link text to write, by the link rule (DM note when one exists), path-qualified when the name is ambiguous (the [[Artifact Change Form]] already does this) |
| `isPlayerOnly(file)` | boolean |
| `checks({ only, files })` | `[{ check, file, detail }]` from the registered checks (section 4); `only` limits it to some check ids, `files` to problems involving those notes |
| `checkList` | the registered checks: `[{ id, label, kind: "error" \| "review" }]` |
| `version` | string |

`partyPlace` is passed in by the caller (the hubs already compute it); the core does not read session notes. Walks keep a visited set and stop on a repeat; a loop yields `source: "loop"` and appears in `checks()`.

**Performance:** build per Datacore render is acceptable if it stays under 50 ms on the real vault (about 600 notes). Measure on the full-vault test (section 9) and report the figure. If it is slower, cache by `app.metadataCache` change events, still inside the core.

#### 3.5 Hub Config additions

`prop_political_region`, `prop_natural_region`, `prop_whereabouts`, `prop_site`, `prop_ties_to` (the property names), `tag_unplaced: unplaced`, `tag_deceased: deceased`, `folder_kind_places: Places`, `folder_kind_lore: Lore`, `folder_kind_tables: Tables`, `label_player_only: player note only`. Add each to Shared Helpers' `CONFIG_DEFAULTS` and describe it in Hub Config's "What each group means". The core reads property names only from `cfg`.

### 4. Checks

Each check is its own small function in a list inside the core (a registry, the usual pattern for linters): `{ id, label, kind, run(index) }`, where `kind` is `error` or `review`. `checks()` only runs the registered checks and collects their results; `checks({ only, files })` runs a subset or limits results to some notes, which is what the Stage 2 plugin uses after a save. Adding a check means adding one entry. Each check has its own tests.

1. Place with no parent in either hierarchy. Listed for review, not as an error: only top places (continents, planes' top places) should appear.
2. Loop in a parent hierarchy, or in a `whereabouts` chain (item held by an item held by the first).
3. Broken link in a location property: unresolved, or resolving to the wrong kind (a parent that is not a place; `site` not a place; `whereabouts` not a place or person; an NPC's `whereabouts` not a place).
4. Note with both `unplaced` and `whereabouts` or `site`.
5. NPC (not `deceased`), faction or item with neither `whereabouts` nor `unplaced`. Player-only notes are not errors here; they go under check 11.
6. Parent in a different `world/` tag than the child.
7. Player note whose location property links outside `Player Wiki/` (a leak).
8. Player place note whose `Part of` link (Quick Reference) differs from its first parent.
9. DM note with a player twin and no "What players know" embed of it; or a player note that embeds a DM note.
10. Artifact piece (tag `piece/…`) whose last History holder or `at` differs from its `whereabouts`. The parsing stays in [[Artifact Pieces]], which reports this check alongside the core's.
11. Player notes with no DM twin, listed (not an error) so they are never forgotten.
12. Any remaining `place/…` or `region/…` tag (after the migration's last step).

**Where they show:** a new Datacore code note `00 DM Screen/Code/Location Checks.md`, embedded on the 00 DM Screen hub under `## Vault health`, next to the Vault Health base. One collapsible group per check with a count, each row a link plus the detail. Hub views that hit a loop show a one-line warning naming the note.

Prevention comes first: pickers offer only existing notes and never a note's descendants. The checks catch hand edits in the Properties panel and deletions.

### 5. Consumers

Every file in this list reads `place/…`, `region/…`, folder depth or `located_in` today. Grep for those strings again before starting; anything not listed here is reported to Gerald.

| Consumer | Required behavior |
|---|---|
| Location Template | Title; world (choices: `world/` tag values in use plus folders under `Worlds/`); then `political_region` and `natural_region` pickers (each allows "none: top of setting" and several entries, first is main). File goes to `Worlds/<World>/Places/`. No place or region tags. Remove the folder-depth logic and the "add folder" flow |
| NPC Template | World, disposition, `whereabouts` picker (or "unplaced"), `ties_to` multi-pick, factions as today. Remove `worldRegionEntries` and the place tag step. Adds the player-twin embed when a player note of that name exists |
| Faction Template | `whereabouts` (base) or unplaced, `ties_to`; embed rule as above |
| Artifact-Item Template | `whereabouts`: a place or a person, or unplaced; embed rule |
| Arc Template, Encounter Template | `site` picker. Remove the place tag and region copy (`placeNoteFor`) |
| Location embed rule | Location, NPC, Faction and Artifact-Item templates all add the "What players know" callout when a player note of the same name exists |
| Set Location command (new) | New template `z_Templates/Set Location.md`, run on the open note through a Templater template hotkey (Gerald binds the key). Offers the field for the note's type: parents on a place, `whereabouts` on NPC, faction, item, `site` on arc, encounter, plus `ties_to` on any. Uses `pickerChoices`; writes with `processFrontMatter` and `linkFor`; removes `unplaced` when a location is set. Writes nothing into the note body |
| Close Session | New last step. Entities: NPC and item notes linked from the session note body (comments and embeds excluded, as the Session Hub does) plus notes whose `first_session` is this session. Skips PCs and player-only notes. For each, one suggester: first "Unchanged (<current trail or unplaced>)", second "All remaining unchanged: done", then the place choices (and people, for items), then "Unplaced". Writes only changed values |
| Quick Capture | NPC, faction, item, location and shop stubs get `unplaced` (no prompt). Close Session then offers them, through `first_session` |
| `dm_helpers.js` | Add `locations()`. Remove `worldRegionEntries`, `placeNoteFor` and the place parts of `vocabulary`/`pickTag` once nothing uses them |
| Shared Helpers | Add `locations()` and the new config defaults |
| NPC Browser | NPCs of the campaign's world, including player-only NPC notes (marked). Filters: name, a "Where" picker (any place, including everything inside it, both hierarchies), "Include ties" toggle, faction, disposition, needs-work, and a status choice (any / no whereabouts / unplaced / player note only). Rows: name, disposition, factions, `whereabouts` trail. Remove the place and region tag filters |
| Session Hub Table | Tonight's cast: a player-only note is listed, marked (today it is left out). Where are we: `partyPlace = placeOf(Party location link)`. Here now: NPCs `within` it. Locations here: places whose ancestors include it. Then items and factions within it, arcs and encounters whose `site` is within it, then notes that only mention it (existing link logic). Remove `folderOfPlace` and `located_in` |
| Artifact Pieces | A piece's location is `whereIs(piece, { partyPlace })`; History still gives the holder line for display and history. During the migration a piece without `whereabouts` falls back to the History rule. Reports check 10 |
| Artifact Change Form | On holder and moved changes, also sets the piece's `whereabouts` (a person, or the place in `at`) with `processFrontMatter`. When the holder is the party (`label_party`), the form asks which PC carries the piece and writes that PC; `whereIs` then gives the party's location |
| Artifact Hub Views | The place filter on people uses `within` with the core's place choices |
| Plot Dashboard Views | NPC detail shows the `whereabouts` trail instead of place tags |
| Location Checks (new) | Section 4 |
| Vault Health.base | NPC gaps: `npc`, not `deceased`, not `unplaced`, no `whereabouts`. New view "Places with no parent": `location`, no `political_region`, no `natural_region`. Keep "Artifacts without world" |
| Recent Work.base | Replace the Region column with "Where": the first of `political_region`, `whereabouts`, `site` (display only) |
| Related Notes.base | No change |
| Campaign Template, Session Template | Audit only; they reference `world`, not place or region |

Code notes keep their header format (Purpose, Exports, Depends on, Used by, then `## Code`). Update each Purpose text and [[DM Hubs Design]] where they describe place or region tags.

### 6. Player Wiki

- Remove `region/…` from the 65 player notes that carry it. Nothing reads them.
- Player place notes (tag `location`, 49 notes) get `political_region` and `natural_region`, linking only to player notes. Values come from the existing `Part of` line (43 notes have one); Gerald confirms the political or natural split from a review list. The six without `Part of` go on the same list.
- `Part of` stays a written line in the Quick Reference callout and matches the first parent. `Found in` on people stays a written stable home.
- Publish hides frontmatter by default and `publish.css` does not show it; property links are not clickable on Publish. Values are still in the page source, which is why player properties name only player notes. Gerald checks one published page after the migration.
- Rewrite [[Player Wiki Build Conventions]]: drop the `region/<slug>` key and its rules; location notes carry the two parent properties (player links only) and `Part of` matches the first; when the wiki build creates a player twin of an existing DM note, it lists "add the What players know embed to <DM note>" under "Vault notes to fix". Show Gerald the rewrite before writing; another Claude project builds wiki notes from it.

### 7. Migration

One script, `.scripts/migrate_location.py`, with `--dry-run` (default), `--apply` and `--undo <manifest>`. It edits only the frontmatter keys and tags named here and leaves every other line as it is. Steps run in this order, each as its own batch with Gerald's approval, on a copy first.

0. **Inventory and review file.** List every `place/…` and `region/…` value (36 distinct DM values on 2026-10-27; 47 NPCs, 34 location notes and 4 arcs carry `place/`; 68 NPCs, 35 location notes, 8 factions, 4 lore notes, 1 artifact and 5 other notes carry `region/`) and every note carrying them, with a proposed mapping. Write it to `z_Reference/Location Migration Review.md` (no frontmatter) as tables Gerald can edit:
   - each tag value → the place note it means (by slug, as `placeNoteFor` does), or "no note";
   - location notes: nested place tag and region tag → `political_region` or `natural_region` entries;
   - NPCs: place tag → `whereabouts` or `ties_to` (proposal: `whereabouts`); region only → `ties_to` or `whereabouts` (proposal: ask per note); neither and not deceased → `unplaced`;
   - factions: region → `whereabouts` (base) or `ties_to`;
   - arcs: place tag → `site`;
   - lore, artifact and other notes with a region tag → `ties_to`, or drop;
   - player place notes: `Part of` → political or natural;
   - values with no note anywhere: create a note, use the nearest existing parent, or add to `.scripts/planned_link_targets.txt` (Gerald decides; no stubs by default);
   - `world/planar` on 2 notes → per-plane tags.
1. **Write properties** from the approved review file, DM notes and player notes. Tags stay.
2. **Embeds:** add the "What players know" callout to every DM note with a player twin that lacks it (about 45).
3. **Folders:** move `Worlds/` notes to `Worlds/<world>/<kind>/` with bundle folders, from a move list Gerald approves. Check duplicate names; rewrite path-qualified links to moved notes. Empty folders are named for Gerald to delete; update the "empty folders kept on purpose" row in Parked work.
4. **Code switch:** install the core and the consumer changes (section 5). Gerald checks in Obsidian (section 10).
5. **Remove tags:** only after Gerald confirms, remove `place/…` and `region/…` from every note, `world/planar` per step 0, and retire `located_in`. The manifest proves every old value was mapped or dropped by decision; nothing is removed that is not in it.
6. **Documentation:** Vault Conventions tag table and "By note type" rows; Hub Config prose; DM Hubs Design; the Reorganization status note.

Every step: backups (with `.bak` where required), link scan, Phase log line.

### 8. Ask Gerald (not decided)

- The review-file decisions in step 0.
- Label format in pickers and trails, if "Evening Nip · Zadash · Dwendalian Empire" reads badly.
- Anything this spec does not cover.

Gerald does these himself: bind the Set Location hotkey, set the Linter rule, delete empty folders, check a published page.

### 9. Testing

**Mock harness** (Node, in the build workspace, kept with the code in `.scripts/location_core_tests/`):
- A fake `app` with `vault.getMarkdownFiles()`, `metadataCache.getFileCache(file).frontmatter` and `.tags`, and `metadataCache.getFirstLinkpathDest(linktext, source)` (Obsidian's shortest-path rule).
- A synthetic world covering: each twin case (DM only, player only, both, unresolved); a place with two political parents; a DM note whose parent is a player-only note; a player parent chain reaching a place that has a DM twin; loops in both hierarchies and in a `whereabouts` chain; an item held by an NPC; an item held by a PC with `partyPlace`; `ties_to` above and below; `unplaced` with `whereabouts`; a deceased NPC; a player note linking a DM note; a cross-world parent.
- One test per check in section 4, one per API export.
- **Full-vault run:** build `app` from the vault's own frontmatter (parse YAML from a checkout) and report index time, check counts and a sample of trails. Run it before and after the migration.
- Pure functions in consumers (row building, filters) are tested the same way where they exist.

**Only testable in Obsidian:** both loaders (the smoke test), Datacore rendering, Templater suggesters and `processFrontMatter` writes, Close Session's flow, the hotkey, Calendarium after backups, Publish display. Say so in each batch report.

### 10. Build order and Gerald's checks

1. Smoke test of the loaders (3.1). Gerald confirms.
2. Core and mock tests; full-vault run on current data (expect most notes in check 5 and many in check 1 before the migration).
3. Migration steps 0 to 3, one batch each.
4. Consumers and templates (section 5); Location Checks; Bases. Gerald opens: the 00 DM Screen hub, the Session Hub, the campaign note's NPC Browser, the Lorestone hub, the Plot Dashboard; runs each changed template once in a scratch folder and Close Session on a copy of a session note; uses the hotkey on one NPC.
5. Migration step 5 after Gerald's OK; checkpoint per the status note's rules.
6. Documentation (step 6) and the Player Wiki Build Conventions rewrite.

### 11. Stage 2: the plugin (later)

Gerald's learning project: the build explains each step so he can do as much of it himself as he wants. Built in a test vault, kept in its own GitHub repository, installed by copying `main.js` and `manifest.json` into `.obsidian/plugins/<id>/` (or with BRAT). Not published.

- **Same core:** the plugin imports `location_core.js` unchanged (TypeScript accepts the JavaScript; adding types is optional). The mock tests become its tests.
- **Live index:** rebuilt or patched on `metadataCache` `changed`, `resolved`, `rename` and `delete` events.
- **API:** `app.plugins.plugins["<id>"].api` exposes the core's exports bound to the live index. The two loaders (Shared Helpers, `dm_helpers.js`) try the plugin first and fall back to the file; that is the whole switch-over.
- **Checks on save:** after a change to a note, run `checks({ files })` for it and its neighbours and show a Notice for any new problem.
- **Commands:** Set location (a fuzzy `SuggestModal` over `pickerChoices`), Show location checks (a view listing `checks()`).
- **Settings:** the path of Hub Config only; names come from Hub Config as now.
- **Optional:** a Bases view of a place tree. Not planned: a path property written into notes (it would change notes Gerald is not editing).
- **Switch-over test:** the plugin passes the same mock tests and the full-vault run gives the same results as the file.
