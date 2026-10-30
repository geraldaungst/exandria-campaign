---
calendar_category_pieces: Lorestone
calendar_category_sessions: Sessions
campaign_tag_prefix: campaign/
data_url_5etools: https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data
dm_note_suffix: " - DM"
excluded_folder_prefix: z_
faction_tag_prefix: faction
folder_campaigns: Campaigns
folder_characters: Characters
folder_code: 00 DM Screen/Code
folder_creatures: Characters/Creatures
folder_dm_screen: 00 DM Screen
folder_kind_lore: Lore
folder_kind_places: Places
folder_kind_tables: Tables
folder_factions: Characters/Factions
folder_npcs: Characters/NPCs
folder_objects: Objects
folder_player_wiki: Player Wiki
folder_session_notes: Session Notes
folder_stubs: Stubs
folder_worlds: Worlds
heading_fact_map: Fact Map
heading_left_off: Where we left off
heading_piece_history: History
heading_piece_knows: Who knows
heading_piece_lines: Prophecy lines
heading_piece_notes: Notes
heading_piece_pursuit: Pursued by
heading_piece_questions: Open questions
heading_piece_rulings: Properties and rulings
heading_prep: Prep
heading_track_history: History
heading_track_questions: Open Issues
hide_from_related: true
label_changed_at_table: Changed at the table
label_player_only: player note only
label_party: Party
label_party_location: Party location
label_threads_moved: Threads moved
label_world_next: World next
party_card_note: 00 DM Screen/Party Card Data.md
piece_tag_prefix: piece
prop_natural_region: natural_region
prop_political_region: political_region
prop_site: site
prop_ties_to: ties_to
prop_whereabouts: whereabouts
status_running: running
statuses_paused:
  - paused
  - abandoned
tag_arc: arc
tag_campaign_note: campaign-hub
tag_deceased: deceased
tag_faction: organization
tag_improvised: improvised
tag_item: artifact
tag_location: location
tag_lore: lore
tag_needs_work: needs-work
tag_npc: npc
tag_pc: player
tag_plot: plot
tag_session: session
tag_timeline: inline-events
tag_unplaced: unplaced
tags_dm_tools:
  - dm-tool
template_faction: Faction Template
template_item: Artifact-Item Template
template_location: Location Template
template_npc: NPC Template
template_session: Session Template
---

**Purpose:** Every tag, folder, heading, and status name the hubs and templates rely on. Change a value here (in the Properties panel) instead of in code. The code notes read these through [[Shared Helpers]]; the templates read them through `z_Templates/Scripts/dm_helpers.js`. Any property left blank falls back to the built-in value in Shared Helpers (hubs) or in each template's call (templates).

**When changes apply:** the templates use the new value the next time they run. Hub views use it when you reopen the note that shows them.

## What each group means

- **`tag_…`**: tags without `#`. Tags nest, so `plot` also matches `plot/active`. Plot stages are always `<tag_plot>/active`, `/upcoming`, `/seed`, `/paused`.
- **`tag_faction` and `faction_tag_prefix`**: a faction's own note carries the type tag `tag_faction` (`organization`) plus its own `<faction_tag_prefix>/<slug>` tag (`faction/cerberus-assembly`). NPCs and encounters carry only the `faction/…` tag, so a search for `faction/cerberus-assembly` finds the faction and everyone tied to it, while `organization` finds only faction notes.
- **`campaign_tag_prefix`**: the start of each campaign's own tag (`campaign/eryndor`). A campaign note (tagged `tag_campaign_note`) carries exactly one such tag, and so does every session and arc of that campaign.
- **`folder_…`**: vault paths without a trailing slash. Notes with no type tag fall back to a type by folder (Session Notes → Session, Objects → Artifact, Characters → NPC, Worlds → World, Campaigns → Campaign).
- **`excluded_folder_prefix`**: folders whose names start with this are ignored everywhere (archives, templates, reference).
- **`heading_…` and `label_…`**: the exact heading and bullet-label text in session and arc notes. `label_world_next` and `label_changed_at_table` are the "Where we left off" bullets the Session Hub reads.
- **`template_…`**: the name of a template note (without `.md`), looked up in Templater's template folder. `template_session` is run by the Session Hub's "Create next session" button. The NPC, location, faction, and item templates supply the body of quick-capture stubs ([[Quick Capture]]).
- **Quick-capture stubs**: `folder_npcs`, `folder_factions` (stubs go in a subfolder named for the campaign's `world`), and `folder_objects` hold NPC, faction, and item stubs. `folder_stubs` is the name of a folder inside each campaign's folder that holds location and shop stubs. `tag_improvised` marks every stub.
- **Player characters**: `tag_pc` marks active PCs. A PC who is on hold or gone is tagged `<tag_pc>/inactive` (always that form, like the plot stages) and is left out of the Session Hub's Spotlight.
- **`status_running` and `statuses_paused`**: arc `status` values for the arc being played and for arcs set aside.
- **`data_url_5etools`**: the folder address of a 5e.tools data mirror, without a trailing slash. [[Item Data]] downloads `items.json`, `items-base.json`, and `magicvariants.json` from it for the item search.
- **`dm_note_suffix`**: the suffix of a DM note that has a Player Wiki twin of the plain name (`Rexxentrum - DM` next to `Rexxentrum`), with the space, hyphen and space included. The hubs (through `stripDmSuffix` in [[Shared Helpers]]) and the templates (`dm_helpers.js`) remove it when they build display names, tags and twin lookups. Changing it does not rename any note: run `.scripts/rename_dm_suffix.py` (set OLD and NEW at the top) to rename the notes, folders and links. `Recent Work.base` has the suffix written in its formula and must be edited by hand.
- **Location** ([[Location Engine Spec]]): `prop_political_region`, `prop_natural_region`, `prop_whereabouts`, `prop_site` and `prop_ties_to` are the property names the location core reads (place parents, where something is, where an arc or encounter happens, and what it is tied to). `tag_unplaced` marks an entity with no known or decided location and `tag_deceased` one that needs no whereabouts. `folder_kind_places`, `folder_kind_lore` and `folder_kind_tables` are the kind folders under `Worlds/<World>/`; new places go in `folder_kind_places`. `label_player_only` is the mark shown beside a Player Wiki note that has no DM twin. The core file is `z_Templates/Scripts/location_core.js`; the templates reach it through `dm_helpers.js` and the hubs through [[Shared Helpers]].
- **`calendar_category_sessions`**: the Calendarium category for session notes (left out of Close Session's event categories).
- **Artifact pieces** ([[Artifact Pieces]]): notes tagged `<piece_tag_prefix>/<artifact slug>` are the pieces of one artifact (`piece/lorestone-of-eryndor`). The `heading_piece_…` values are the `##` headings inside each piece note. `calendar_category_pieces` is the Calendarium category the hub's change form writes. `label_party` is the plain word that stands for the whole party in a piece's lines.
- **Progress trackers** ([[Progress Tracks]]): `heading_track_history` and `heading_track_questions` are the `##` headings of a tracker's History and Open Issues sections.

## What this note can't change

- **Where the code lives.** Each note's loader block names its code note by path (`00 DM Screen/Code/...`), because it has to find the code before it can read this note. `folder_code` records the location for reference only. Moving the Code folder means updating those loader blocks.
- **Bases formulas.** Bases can't read another note's properties. The type rules in [[Recent Work.base|Recent Work]] and the arc and session lists on each campaign note use their own copies of the tag and folder names, as does the `Type` formula in [[Related Notes.base]]. If you rename a tag or folder here, update those too ([[Note Types]] holds the matching formula).
- **Template text.** The headings and bullet labels written into new session and arc notes are fixed text in the templates. Rename one here and in the template together.
- **Arc statuses `complete`, `idea`, `designing`, `ready`.** These are plain values in the arc template and the session template's arc list, not settings.
