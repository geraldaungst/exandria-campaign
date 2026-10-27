## Vault Conventions: DM Vault

How notes are tagged and what frontmatter they carry. Derived on 2026-10-22 from an audit of the vault's notes outside `z_` folders, the templates and code notes, and a review of past conversations. Rules under **Ruled** come from Gerald; the dates show when he decided. The rest describes what the vault does now. Items under "Open" need his decision before they become rules. This note has no frontmatter.

Related notes: [[DM Hubs Design]] (hub rules, campaign notes, session date fields), [[Vault Reorganization Status - DM]] (where things live, NPC tiers, the separate-note test, merge pattern), [[Plugin Migration Status - DM]] (Linter, Calendarium and Janitor settings), [[Hub Config]] (every tag, folder and heading name the code uses).

### Ruled

**Properties and records**
- Notes in the DM system use as few custom properties as possible. Classification is by tag (2026-10-21, 2026-10-22).
- Tags come from the existing set. A new tag is created only when necessary and logical within the system, and Claude asks first (2026-10-22).
- Claude adds no frontmatter property without asking.
- Temporary working notes meant for the archive, such as status notes, carry no frontmatter (2026-10-22).
- Record keeping is automated and plain text in the note body as much as possible (2026-10-21).
- New properties are added only after deliberate consideration, and Claude asks first. A tag is the default. A property is justified only when (a) it does something a tag does poorly: it points to another note (Obsidian keeps links current on rename, and tags it doesn't), or it holds an ordered list, a number or a date; (b) code or a Base reads it; and (c) it applies to a whole note type, not one note. One-off properties are not added (2026-10-27; refines the 2026-10-21 ruling).
- Hubs and dashboards depend only on tags, links, file modified time, properties set once at creation, and the after-game entries in the session note. Never on a field Gerald has to keep current by hand (2026-10-19, 2026-10-20). The location fields are the exception: they change when something moves, and Gerald edits them while he has the note open; scripts may prompt him, as Close Session does. Still ruled out: regular upkeep across notes he isn't otherwise touching (2026-10-27).
- Properties that nothing reads are removed rather than kept for later (2026-10-22). Removed that day: `created`, `context`, `epoch`, `started`, empty one-offs, arc `location`, and the old `affiliations`, `current_location`, `possession`, `proprietor`, `species`, `type` and similar values whose content was already in the note body or tags. The Note Refactor Template and [[Quick Capture]] no longer write `created` or `context`.
- No hub, template or script names a world or campaign. Those values come from the campaign note and [[Hub Config]] (2026-10-20).

**Tags**
- `world/toril` is the world tag for the Forgotten Realms. `world/faerun` is retired; Faerûn is a region-level name (2026-10-19).
- A group an NPC belongs to gets a `faction/<slug>` tag and a stub note from the Faction Template, even when it had no note before. Sub-factions nest under the parent: `faction/ashari/terrah` (2026-10-21).
- A faction's own note carries the type tag `organization` plus its own `faction/<slug>` tag; NPCs and encounters carry only `faction/…`. The plain `faction` tag is retired as a type tag: it is the root of the nested tags, and a note never carries a parent tag with its child (2026-10-22). Applied to the 18 faction notes, the 11 Player Wiki faction pages and the Faction Template; the plain tag was dropped from the six non-faction notes in `Characters/Factions` that carried it; Hub Config's `tag_faction` is `organization`, and `faction_tag_prefix` holds the nested root.
- `artifact` is the tag for every item note (folder `Objects/`), including mundane notable items. `item` is retired; a note, template or query that still uses it is out of date (2026-10-04).
- PCs not in the party, former or on hold, use `player/inactive`, not `player` (2026-10-19).
- `lore` marks reference notes that support a plot thread without being one, such as The Prophecy (2026-10-19).

**Location (2026-10-27; replaces the `place/…` and `region/…` tags)**
- `world/<slug>` is the setting: a world, or a plane with one value per plane (`world/feywild`, `world/far-realm`). `world/planar` is retired. Every campaign-content note carries one, and it is the root of every location hierarchy.
- Place notes (tag `location`) carry their parents as links: `political_region` (who governs it) and `natural_region` (the land it sits on). Both are lists naming the nearest parent only. The first entry is the main parent, shown in trails; lookups use every entry. A place at the top of its setting carries neither.
- `whereabouts`: one link to where something is now, on anything that moves or could move. NPCs: where they are found. Factions: their base. Items: a place, or the person holding them (a PC holder means the party's location).
- `site`: one link to where an arc or encounter happens.
- `ties_to`: a list of links to places, cultures or factions an entity comes from or is tied to, wherever it is now. A tie to a place also counts for everything that place sits inside.
- `unplaced`: a tag for any entity with no known or decided location. NPCs tagged `deceased` need no `whereabouts`. Era goes in the note text.
- Folders under `Worlds/` are `Worlds/<world>/<kind>/` (Places, Lore, Tables). A note with its own sub-documents gets a bundle folder. A note's folder says nothing about where it is.
- Properties are snake_case; tags are lowercase with hyphens.
- The Linter's Sort YAML Array Values rule ignores `political_region` and `natural_region` (Gerald sets this in the Linter settings).
- Player Wiki place notes (tag `location`) carry `political_region` and `natural_region` too, linking only to Player Wiki notes. `Part of` matches the first entry. Other player notes carry no location properties (2026-10-27).
- A place with a DM note and a player note is one place. The DM note's parents apply when it has any, otherwise the player note's. A DM note sets its own parents only to add a secret or more precise parent (2026-10-27).
- A Player Wiki note with no DM twin is the only record of its subject, so every hub view, list and check includes it like a DM note, marked "player note only". A player note with a DM twin is reached through the DM note (2026-10-27).
- A link to a place from a DM note points to the DM note when one exists, otherwise to the player note. Code treats a link to either note as the same place (2026-10-27).
- Every DM note with a player twin embeds it in a collapsed callout directly under Quick Reference: `> [!quote]- What players know` then `> ![[<player note>]]`. Embeds go from DM to player only (2026-10-27).
- Artifact pieces: the hub's Record a change form sets `whereabouts` when it writes a holder or moved line. History stays the record (2026-10-27).
- Engine: one core module, `z_Templates/Scripts/location_core.js`, loaded by the templates through `dm_helpers.js` and by the hubs through Shared Helpers. It holds all twin handling (`placeOf`) and every parent walk; no other code reads the location properties directly. Spec: [[Location Engine Spec]] (2026-10-27).

**Note types**
- Plot thread: a campaign-scale question spanning many arcs. Tagged with one stage: `plot/active`, `plot/upcoming`, `plot/seed`, `plot/paused` (2026-10-19).
- Arc: a playable module of 1 to 6 sessions. Tagged `arc` plus the campaign tag. Property `status` (idea, designing, ready, running, paused, abandoned, complete) and `threads` (links to the plot threads it advances). Only one arc runs at a time (2026-10-19). `status` stays a property: swapping an `arc/…` tag is no less hand work, and Bases groups by a property (2026-10-22).
- Arcs carry no `location` property. The place is a `site` link (2026-10-27; it was a `place/…` tag from 2026-10-22).
- Session: one game night, tagged `session` plus the campaign tag, with `session_number`, `date`, `arc`, `previous_session`. Its "Where we left off" section is the record of campaign state; there is no separate Status Document (2026-10-19).
- Campaign note: one per campaign, the campaign folder's folder note, tagged `campaign-hub` plus exactly one `campaign/…` tag, with `calendar`, `timeline`, `status` and `world` (2026-10-20).
- Encounter: tagged `encounter`, `campaign/…`, `world/…`, and where it applies `faction/…`, with a `site` link to where it happens (2026-10-27). No `location` or `session` property (2026-10-21).
- Lore: campaign lore and reference documents (in-world facts, history and procedures a thread draws on, such as The Prophecy and its texts, Kelmen and Popcorn Connections, Port Damali Murders) live in `Campaigns/<campaign>/Lore/` and carry the `lore` tag. Dashboards read the tag; the folder is for browsing. Planning notes, table-meta notes and tools stay out; world and faction event notes stay with their owners (2026-10-23).
- Quick-capture stubs carry `needs-work`. NPC, faction and item stubs go straight to their normal folders; location and shop stubs go to the `Stubs` folder inside the campaign folder (2026-10-20).

**Naming and events**
- A DM note gets the " - DM" suffix only when a player-facing note on the same subject exists; the player note takes the plain name. Note titles avoid parentheses and underscores (2026-10-04).
- Calendarium events come only from notes with `fc-date` (sessions) and notes tagged `inline-events`. "Parse note titles for event dates" stays off (2026-10-21).

### Tag scheme (what the vault does)

| Tag | Use |
|---|---|
| `world/<slug>` | Every campaign-content note. In use: `exandria` (233), `keln` (20), `toril` (13, all archived in `z_Archive/Campaigns/Tyranny of Dragons/NPCs`), `planar` (2) |
| `region/<slug>` | Coarsest location tag. 14 values (menagerie-coast, dwendalian-empire, taldorei, xhorhas, cyrios-mountains, sword-coast, and others) |
| `place/<slug>` | Nests to any depth. On NPCs, locations, encounters |
| `faction/<slug>` | Nests: `faction/myriad/gentlemans-organization`. On NPCs, encounters and the faction note itself |
| `campaign/<slug>` | `campaign/eryndor` (139), `campaign/tyranny` (13 in the archive, 5 other) |
| `piece/<artifact>` | Pieces of a multi-part artifact: `piece/lorestone-of-eryndor` on the eight shard notes (prefix in [[Hub Config]]) |
| Type tag | `npc`, `location`, `organization` (faction notes), `artifact`, `session`, `arc`, `plot/…`, `player`, `player/inactive`, `atomic`, `lore`, `encounter`, `campaign-hub` |
| `needs-work` | Stub or incomplete (110 notes) |
| `improvised` | Stubs made by [[Quick Capture]] |
| `inline-events` | Notes holding Calendarium inline events (timeline, shard notes) |
| `dm-tool` | DM Screen tools |
| `player-facing`, `table-rules` | Player Wiki only |
| Kept, ruled 2026-10-22 | `hook`, `offscreen`, `deceased` (state flags), `copilot-conversation` (marks AI chats; ignored otherwise), `artifact` (items, including Laucian's Artifact) |
| Retired 2026-10-22 | `dm-tools` (use `dm-tool`), `compendium`, `dm-document`, `status`, `2`, `pending`, `npc-database`, `encounters`, `combat`, `historical`, `antagonist`, `filler` (the arc's `tier` property says it), `wildemount`, `vehicle`, `reference`, `dm-only`, `faction-event` |

### By note type

Counts are notes outside the Player Wiki carrying the type tag.

| Type | Tags | Properties |
|---|---|---|
| NPC (89) | `npc`, `world/`, `region/`, `place/`, `faction/` | `disposition` (friendly, indifferent, hostile; the NPC template asks for it), `aliases` |
| Faction (24 notes in `Characters/Factions`) | `organization`, `world/`, sometimes `region/`, and the note's own `faction/<slug>` (18 notes, retagged 2026-10-22; the other 6 are event, overview and hook notes without it) | Template: `aliases`. Older notes also carry `disposition` (16), `current_location` (3), `affiliations` (2) |
| Location (36) | `location`, `world/`, `region/`, `place/` | `aliases` |
| Artifact (29) | `artifact`; `campaign/` on 17, `world/` on 8 | `aliases` |
| Lore (12: 9 in `Campaigns/Prophecy of Eryndor - DM/Lore`; The Massacre, The Capture of Melthes and The Truth about Eledyr carry the tag in place) | `lore`, usually `atomic`, `campaign/` | None |
| Atomic (42; 31 with no other type tag) | `atomic`, usually `campaign/` | None |
| Session (27) | `session`, `campaign/` | Session Template writes at creation: `arc`, `date`, `previous_session`, `session_number`, `fc-calendar`, `fc-date`, `fc-end`, `ingame_time`, `fc-display-name`, `fc-category`. Close Session fills `fc-end` and `ingame_time`. `next_session` on 18 old notes; nothing writes or reads it |
| Arc (5) | `arc`, `campaign/` | `status`, `threads`, `tier`; place as a `place/…` tag |
| Plot thread (7) | One stage tag (`plot/active` and so on) | None |
| Campaign note (1) | `campaign-hub`, one `campaign/…` | `calendar`, `timeline`, `status`, `world` |
| Encounter (0 so far) | As ruled above | None |
| Player (8) | `player` or `player/inactive`, `campaign/` | `aliases` (`modifier` removed 2026-10-23: leftover from tracking stats in notes; nothing read it) |
| DM Screen tools | `dm-tool` | `hide_from_related` (checkbox; 39 notes), `cssclasses` |
| Player Wiki (116) | `player-facing`, `world/`, `region/`, type tag | `publish`, `aliases`, `cssclasses`. Separate system; do not touch without checking the Publish build rules |

**Read by code** (hubs, Bases, templates): `session_number`, `date`, `arc`, `fc-date`, `fc-end`, `fc-calendar`, `ingame_time`, `status`, `threads`, `world`, `calendar`, `timeline`, `disposition`, `first_session`, `located_in`, `hide_from_related`. **Read by nothing:** `tier`, `previous_session`, `next_session` (kept: arc and session fields).

Registered property types (`.obsidian/types.json`): `aliases`, `cssclasses`, `tags`, `class`, `connections`, `knowledge`, `locations`, `hide_from_related`, `Processed`.

### Rulings of 2026-10-22 (property and tag decisions)

1. **Old properties.** `current_location` became a `**Base:**` link (Cerberus Assembly, Dwendalian Empire, Kryn Dynasty); `affiliations` became a `**Relationships:**` link (Ring of Three, Scars of Scale and Tooth). No nested faction tags. `settlement-type` (Gnurlsotten's Nosh & Nip) and the `region` property on Randmork Stringsaw were dropped.
2. **`disposition`.** Stays on NPCs and is removed from the 16 non-NPC notes in `Characters/Factions`. NPCs without a value are filled in as they are touched.
3. **Tags.** See the Kept and Retired rows in the tag table.
4. **Missing tags** (superseded 2026-10-27 by Location). Continents are `region/` tags with no `place/` tag (`region/taldorei`, `region/callastri`). A `location` note gets `world/`, `region/` and, where it is a place, `place/`. Nine location notes were fixed; Xhorhas Landing (an encounter that never happened) and Skyship Distances (a world-wide table) get no place or region. NPC `region/` is not inferred: only one of the 19 Exandria NPCs without it has a place tag, and that place has no region. Fill both as NPCs are touched; no bulk pass.
