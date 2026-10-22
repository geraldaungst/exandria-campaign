## Vault Conventions: DM Vault

How notes are tagged and what frontmatter they carry. Derived on 2026-10-22 from an audit of the vault's notes outside `z_` folders, the templates and code notes, and a review of past conversations. Rules under **Ruled** come from Gerald; the dates show when he decided. The rest describes what the vault does now. Items under "Open" need his decision before they become rules. This note has no frontmatter.

Related notes: [[DM Hubs Design]] (hub rules, campaign notes, session date fields), [[Vault Reorganization Status - DM]] (where things live, NPC tiers, the separate-note test, merge pattern), [[Plugin Migration Status - DM]] (Linter, Calendarium and Janitor settings), [[Hub Config]] (every tag, folder and heading name the code uses).

### Ruled

**Properties and records**
- Notes in the DM system use as few custom properties as possible. Classification is by tag (2026-10-21, 2026-10-22).
- Tags come from the existing set. A new tag is created only when necessary and logical within the system, and Claude asks first (2026-10-22).
- Claude adds no frontmatter property without asking.
- Temporary working notes meant for the archive, such as status notes, carry no frontmatter (2026-10-22).
- Record keeping is automated and plain text in the note body as much as possible. Frontmatter properties are kept to a minimum, and tags are preferred to custom properties (2026-10-21).
- Hubs and dashboards depend only on tags, links, file modified time, properties set once at creation, and the after-game entries in the session note. Never on a field Gerald has to keep current by hand (2026-10-19, 2026-10-20).
- Properties that nothing reads are removed rather than kept for later (2026-10-22). Removed that day: `created`, `context`, `epoch`, `started`, empty one-offs, arc `location`, and the old `affiliations`, `current_location`, `possession`, `proprietor`, `species`, `type` and similar values whose content was already in the note body or tags. The Note Refactor Template and [[Quick Capture]] no longer write `created` or `context`.
- No hub, template or script names a world or campaign. Those values come from the campaign note and [[Hub Config]] (2026-10-20).

**Tags**
- `world/toril` is the world tag for the Forgotten Realms. `world/faerun` is retired; Faerûn is a region-level name (2026-10-19).
- `place/…` nests to any depth and means where an NPC is typically found. Deeper levels are added only to the NPCs that need them: `place/zadash` for everyone in Zadash, `place/zadash/evening-nip` for the regulars there. A search for the parent finds the children. `region/…` is the coarsest location tag; place and region can be the same (2026-10-21).
- Location notes also carry their own `place/…` tag, so a place's tag lists the location and everyone found there (2026-10-21).
- A group an NPC belongs to gets a `faction/<slug>` tag and a stub note from the Faction Template, even when it had no note before. Sub-factions nest under the parent: `faction/ashari/terrah` (2026-10-21).
- `artifact` is the tag for every item note (folder `Objects/`), including mundane notable items. `item` is retired; a note, template or query that still uses it is out of date (2026-10-04).
- PCs not in the party, former or on hold, use `player/inactive`, not `player` (2026-10-19).
- `lore` marks reference notes that support a plot thread without being one, such as The Prophecy (2026-10-19).
- Keln location region tags follow the kingdom or confederation: `region/varrinthal`, `region/ringhold` (2026-10-04).

**Note types**
- Plot thread: a campaign-scale question spanning many arcs. Tagged with one stage: `plot/active`, `plot/upcoming`, `plot/seed`, `plot/paused` (2026-10-19).
- Arc: a playable module of 1 to 6 sessions. Tagged `arc` plus the campaign tag. Property `status` (idea, designing, ready, running, paused, abandoned, complete) and `threads` (links to the plot threads it advances). Only one arc runs at a time (2026-10-19).
- Arcs carry no `location` property. The place is a `place/…` tag plus a link to the place's note in the body, as for encounters (2026-10-22; applied to all five arcs and the Arc Template).
- Session: one game night, tagged `session` plus the campaign tag, with `session_number`, `date`, `arc`, `previous_session`. Its "Where we left off" section is the record of campaign state; there is no separate Status Document (2026-10-19).
- Campaign note: one per campaign, the campaign folder's folder note, tagged `campaign-hub` plus exactly one `campaign/…` tag, with `calendar`, `timeline`, `status` and `world` (2026-10-20).
- Encounter: tagged `encounter`, `campaign/…`, `world/…`, and where they apply `place/…`, `region/…` and `faction/…`. No `location` or `session` property; the body's Location line links the place (2026-10-21).
- Quick-capture stubs carry `needs-work`. NPC, faction and item stubs go straight to their normal folders; location and shop stubs go to the `Stubs` folder inside the campaign folder (2026-10-20).

**Naming and events**
- A DM note gets the " - DM Notes" suffix only when a player-facing note on the same subject exists; the player note takes the plain name. Note titles avoid parentheses and underscores (2026-10-04).
- Calendarium events come only from notes with `fc-date` (sessions) and notes tagged `inline-events`. "Parse note titles for event dates" stays off (2026-10-21).

### Tag scheme (what the vault does)

| Tag | Use |
|---|---|
| `world/<slug>` | Every campaign-content note. In use: `exandria` (233), `keln` (20), `toril` (13), `planar` (2) |
| `region/<slug>` | Coarsest location tag. 14 values (menagerie-coast, dwendalian-empire, taldorei, xhorhas, cyrios-mountains, sword-coast, and others) |
| `place/<slug>` | Nests to any depth. On NPCs, locations, encounters |
| `faction/<slug>` | Nests: `faction/myriad/gentlemans-organization`. On NPCs, encounters and the faction note itself |
| `campaign/<slug>` | `campaign/eryndor` (139), `campaign/tyranny` (5) |
| `piece/<artifact>` | Pieces of a multi-part artifact: `piece/lorestone-of-eryndor` on the eight shard notes (prefix in [[Hub Config]]) |
| Type tag | `npc`, `location`, `faction`, `artifact`, `session`, `arc`, `plot/…`, `player`, `player/inactive`, `atomic`, `lore`, `encounter`, `campaign-hub` |
| `needs-work` | Stub or incomplete (110 notes) |
| `improvised` | Stubs made by [[Quick Capture]] |
| `inline-events` | Notes holding Calendarium inline events (timeline, shard notes) |
| `dm-tool` | DM Screen tools ([[Hub Config]] also accepts `dm-tools`) |
| `player-facing`, `table-rules` | Player Wiki only |
| In use, no ruling | `hook` (7), `deceased` (6), `offscreen` (5), `compendium` (5), `copilot-conversation` (4), `reference`, `vehicle`, `dm-only`, `dm-document`, `faction-event`, `status`, `wildemount` (2 each), `antagonist`, `historical`, `filler`, `pending`, `npc-database`, `encounters`, `combat`, `item`, `2` (1 each) |

### By note type

Counts are notes outside the Player Wiki carrying the type tag.

| Type | Tags | Properties |
|---|---|---|
| NPC (89) | `npc`, `world/`, `region/`, `place/`, `faction/` | `disposition` (friendly, indifferent, hostile; the NPC template asks for it), `aliases` |
| Faction (24 notes in `Characters/Factions`) | Two patterns: 16 older notes carry `faction`, `world/`, sometimes `region/` and their own `faction/<slug>` (10 of 16); the 8 stubs from 2026-10-21 carry only `world/`, `region/` and `faction/<slug>`, as the Faction Template writes | Template: `aliases`. Older notes also carry `disposition` (16), `current_location` (3), `affiliations` (2) |
| Location (36) | `location`, `world/`, `region/`, `place/` | `aliases` |
| Artifact (29) | `artifact`; `campaign/` on 17, `world/` on 8 | `aliases` |
| Atomic (42; 31 with no other type tag) | `atomic`, usually `campaign/` | None |
| Session (27) | `session`, `campaign/` | Session Template writes at creation: `arc`, `date`, `previous_session`, `session_number`, `fc-calendar`, `fc-date`, `fc-end`, `ingame_time`, `fc-display-name`, `fc-category`. Close Session fills `fc-end` and `ingame_time`. `next_session` on 18 old notes; nothing writes or reads it |
| Arc (5) | `arc`, `campaign/` | `status`, `threads`, `tier`; place as a `place/…` tag |
| Plot thread (7) | One stage tag (`plot/active` and so on) | None |
| Campaign note (1) | `campaign-hub`, one `campaign/…` | `calendar`, `timeline`, `status`, `world` |
| Encounter (0 so far) | As ruled above | None |
| Player (8) | `player` or `player/inactive`, `campaign/` | `aliases`, `modifier` |
| DM Screen tools | `dm-tool` | `hide_from_related` (checkbox; 39 notes), `cssclasses` |
| Player Wiki (116) | `player-facing`, `world/`, `region/`, type tag | `publish`, `aliases`, `cssclasses`. Separate system; do not touch without checking the Publish build rules |

**Read by code** (hubs, Bases, templates): `session_number`, `date`, `arc`, `fc-date`, `fc-end`, `fc-calendar`, `ingame_time`, `status`, `threads`, `world`, `calendar`, `timeline`, `disposition`, `first_session`, `located_in`, `hide_from_related`. **Read by nothing:** `tier`, `previous_session`, `next_session` (kept: arc and session fields).

Registered property types (`.obsidian/types.json`): `aliases`, `cssclasses`, `tags`, `class`, `connections`, `knowledge`, `locations`, `hide_from_related`, `Processed`.

### Open (Gerald decides)

1. **Old properties held back.** Their values appear nowhere else in the note, so removing them would lose information: `affiliations` on Ring of Three (Dwendalian Empire) and Scars of Scale and Tooth (Emissaries of the Sunfall); `current_location` on Cerberus Assembly and Dwendalian Empire (Rexxentrum) and Kryn Dynasty (Rosohna); `settlement-type: roadside tavern` on Gnurlsotten's Nosh & Nip; `region: "Tal'Dorei"` on Randmork Stringsaw, which contradicts his `region/dwendalian-empire` and `place/zadash` tags. Move each value into the body or a tag, or drop it?
2. **`disposition`.** It stays on NPCs: the NPC Browser filters and shows it, and Gerald asked for it there (2026-10-21). Fill in the 46 NPCs without it? Drop it from the 16 faction notes and 2 atomic event notes, where nothing reads it?
3. **Faction type tag.** Keep the bare `faction` tag on faction notes (older pattern) or rely on each note's own `faction/<slug>` (template pattern)?
4. **Tags with no ruling** (last row of the tag table). `item` is already retired. Which of the others stay?
5. **Arc `status`.** A property Gerald changes by hand, while the rules prefer tags (Gerald first proposed `arc/running`-style tags on 2026-10-19). Keep the property, or move to tags?
6. **Missing tags.** 37 Exandria NPCs lack `place/`; 19 NPC-tagged notes lack `region/`. Tracked as item 5 in the reorganization status note.
