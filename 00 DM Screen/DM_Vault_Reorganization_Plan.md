## DM Vault Reorganization Plan

## NEXT STEP

I am ready to begin Phase 8 of the refactoring plan. I want to do this carefully and deliberately to make sure everything is done completely and correctly. This will likely involve a lot of tedious updates, so I don't want to rush or make errors on my end.

First, analyze the entire phase and the contents of the vault. As part of your analysis, review the "Exandria Vault Reorganization" document to see if any of that applies to this phase of the vault restructuring. Consider the best sequence to do the necessary tasks in this phase and tell me what you recommend completing first.

### Overview

This plan consolidates your DM notes into a single vault that supports multiple campaigns, multiple worlds, and (when needed) multiple game systems—while maintaining clean Claude project separation through selective GitHub syncing.

#### Current State

- **Exandria campaign**—active, weekly, synced to GitHub/Claude project
- **Tyranny of Dragons**—completed, needs archiving
- **Keln**—homebrew world in development
- **Future capacity**—one-shots, side games, additional campaigns

#### Goals

1. Single vault for all DM content
2. Easy filtering to work on one campaign at a time
3. Reusable content (NPCs, locations) that can appear across campaigns
4. Clean Claude project context via selective folder syncing
5. Minimal system-specific tagging (narrative-first approach)
6. Room to grow without restructuring

---

### Target Folder Structure

```
DM Vault/
├── Campaigns/
│   ├── Exandria/
│   │   ├── Session Notes/
│   │   │   ├── Planning/
│   │   │   └── Completed/
│   │   │       ├── Arc 00 - Prologues/
│   │   │       ├── Arc 01 - Skyship & Port Damali/
│   │   │       └── Arc 02 - Menagerie Coast/
│   │   ├── Party/
│   │   │   └── Backstories/
│   │   ├── Plot Threads/
│   │   ├── Status/
│   │   └── Campaign Overview.md
│   ├── Tyranny of Dragons/
│   │   └── [archived structure]
│   ├── Keln/
│   │   ├── Session Notes/
│   │   ├── Worldbuilding/
│   │   └── Campaign Overview.md
│   └── One-Shots/
│       └── [individual one-shot folders]
│
├── Worlds/
│   ├── Exandria/
│   │   ├── Wildemount/
│   │   │   ├── Dwendalian Empire/
│   │   │   ├── Menagerie Coast/
│   │   │   ├── Xorhas/
│   │   │   └── Greying Wildlands/
│   │   └── Tal'Dorei/
│   │       └── Whitestone/
│   ├── Faerun/
│   │   └── [regions as needed]
│   ├── Keln/
│   │   └── [your worldbuilding structure]
│   └── Planar/
│       ├── Astral Plane/
│       ├── Feywild/
│       └── [other planes]
│
├── Characters/
│   ├── NPCs/
│   │   └── [organized by affiliation or alphabetically]
│   ├── Opponents/
│   │   └── [major antagonists]
│   └── Factions/
│       └── [organized by world or type]
│
├── Items/
│   └── [artifacts, vestiges, notable items]
│
├── DM Screen/
│   └── [quick reference, dashboards]
│
├── Templates/
│   └── [your note templates]
│
├── z_Archive/
│   └── [completed campaigns, deprecated content]
│
└── z_Reference/
    ├── Clippings/
    ├── Compendium/
    │   ├── bestiary/
    │   ├── items/
    │   ├── deities/
    │   └── rules/
    ├── Mechanics/
    └── Templates (old)/
```

#### Key Structural Decisions

**Campaign-specific vs. Shared content:**

- `Campaigns/[name]/` holds session notes, party info, plot threads, status docs—things that only matter for that campaign
- `Worlds/` holds locations that persist across campaigns (a tavern in Zadash exists whether or not the current party has visited)
- `Characters/` holds NPCs/factions that could appear in multiple campaigns
- `Items/` holds artifacts that transcend individual campaigns

**Why separate Worlds from Campaigns:**

- Exandria may host multiple campaigns (your current one, future ones, one-shots)
- Locations are world-facts; how the party interacts with them is campaign-specific
- Avoids duplication when running multiple campaigns in the same setting

**The z_ prefix:**

- Keeps archive/reference folders at the bottom
- Signals "not active campaign content"
- Easy to exclude from searches and syncs

---

### Tag Taxonomy

#### Core Content Tags (Keep from current structure)

```
#npc          — any non-player character
#faction      — organizations, groups
#location     — places
#artifact     — items of significance  
#plot         — plot threads and story beats
#player       — player character info
```

#### Campaign Tags (New)

```
#campaign/exandria        — current Exandria campaign
#campaign/tyranny         — Tyranny of Dragons (archived)
#campaign/keln            — Keln campaign (when it launches)
#campaign/oneshot/[name]  — individual one-shots
```

#### World Tags (New)

```
#world/exandria
#world/faerun
#world/keln
#world/planar
```

#### System Tags (Use sparingly)

```
#system/dnd5e        — only for mechanically-specific content
#system/daggerheart  — if/when needed
```

#### Workflow Tags (Keep from current structure)

```
#to-process   — needs attention
#atomic       — standalone note
```

#### Tag Application Rules

1. **Every content note gets:** content tag + campaign tag (if campaign-specific) + world tag (if world-specific)
2. **Session notes:** `#campaign/exandria` only (implicitly campaign-specific)
3. **NPCs that appear in one campaign:** `#npc #campaign/exandria #world/exandria`
4. **NPCs that could appear in multiple campaigns:** `#npc #world/exandria` (no campaign tag)
5. **World locations:** `#location #world/exandria` (add campaign tag only if party has visited)
6. **System tags:** Only on notes with stat blocks or mechanical content that wouldn't translate

#### Example Tag Combinations

|Note|Tags|
|---|---|
|Session 32 prep|`#campaign/exandria`|
|Korfel Withrethin (NPC)|`#npc #campaign/exandria #world/exandria`|
|Zadash (location)|`#location #world/exandria`|
|Zadash in current campaign|`#location #world/exandria #campaign/exandria`|
|Blade of Maroth Fenn|`#artifact #world/exandria`|
|Homebrew monster stat block|`#npc #system/dnd5e`|

#### NPC Location Tracking

Since NPCs move around but you still need to find "who's in Zadash right now," use frontmatter properties rather than folder structure:

```yaml
---
type: npc
tags:
  - npc
  - campaign/exandria
  - world/exandria
home_base: Port Damali
current_location: Zadash
affiliations:
  - The Myriad
  - The Gentleman's Network
locations_visited:
  - Port Damali
  - Nicodranas
  - Zadash
---
```

**Key properties:**

- `home_base`—where they're from (static)
- `current_location`—where they are now (update as campaign progresses)
- `affiliations`—organizations, factions, groups
- `locations_visited`—everywhere they've been (for "who might know this place")

**Querying by location:**

```dataview
TABLE affiliations, current_location
FROM #npc AND #campaign/exandria
WHERE current_location = "Zadash"
```

```dataview
TABLE home_base, current_location
FROM #npc
WHERE contains(locations_visited, "Port Damali")
```

**Quick search approach:** For ad-hoc lookup during sessions, just search: `current_location: Zadash` or use Obsidian's property search in the sidebar.

---

### Migration Sequence

#### Phase 1: Preparation (Before Moving Files)

- [x] **Backup everything**—full copy of current vault
- [x] **Delete confirmed cruft:**
    - `copilot-conversations/` (review first for anything worth saving)
    - `copilot-custom-prompts/`
    - `z_textgenerator/`
    - Root-level `z_compendium/` and `z_Assets/` (you mentioned handling this)
- [x] **Create new folder structure** in current vault (empty folders)
- [x] **Update.gitignore** for new structure:

```gitignore
# Ignore everything by default
*

# Include markdown files
!*.md

# Include directories
!*/

# Exclude non-campaign content
z_*/
Templates/
DM Screen/

# Exclude specific campaigns from this project (adjust per project)
# Campaigns/Tyranny*/
# Campaigns/Keln/
# Campaigns/One-Shots/

# Obsidian configuration
.obsidian/*
.trash/

# System files
.DS_Store
```

#### Phase 2: Restructure Exandria Campaign

This is your active campaign, so we'll be careful.

- [x] **Create `Campaigns/Exandria/`** with subdirectories
- [x] **Move session notes:** `90 Session Notes/` → `Campaigns/Exandria/Session Notes/`
    - Merge `Future Planning/` and `Possible Session Ideas/` → `Planning/`
    - Keep `Completed/` with arc subfolders (can rename to remove number prefixes)
- [x] **Move party content:** `10 The Party/` → `Campaigns/Exandria/Party/`
- [x] **Move plot threads:** `30 Plot Threads/` → `Campaigns/Exandria/Plot Threads/`
- [x] **Move status docs:** `05 General Plans/001 Campaign Status Documents/` → `Campaigns/Exandria/Status/`
- [x] **Move DM Screen:** `00 DM Screen/` → `DM Screen/`

#### Phase 3: Restructure World Content

##### **Verification Tasks**

- [x] Verify Characters/NPCs/, Characters/Adversaries/, Characters/Factions/ folders exist
- [x] Verify Worlds/Exandria/ structure matches geographic organization (Wildemount subfolders: Dwendalian Empire, Menagerie Coast, Xorhas, Greying Wildlands)
- [x] Verify Items/ folder exists

##### **Content Migration Tasks**

- [x] Move items: `40 Artifacts/` → `Items/`
- [x] Move factions: `19 Factions/` → `Characters/Factions/`
- [x] Move NPCs: `25 NPCs/` → `Characters/NPCs/`
- [x] Move adversaries: `21 Opponents/` → `Characters/Adversaries/`
- [x] Move locations: `60 Locations/` → `Worlds/Exandria/` (preserve internal folder structure)

##### **Post-Migration**

- [x] Verify links still work (spot check 5-10 notes across different types)
- [x] Update any hardcoded folder references in Dataview queries
- [x] Delete empty numbered folders once content verified in new locations

#### Phase 4: Add Campaign Tags

Use find-and-replace to add campaign tags to frontmatter:

**For all files in `Campaigns/Exandria/`:**

```
Find: tags:
Replace: tags:\n  - campaign/exandria
```

(Adjust based on your frontmatter format—YAML array vs inline)

**For NPCs/Locations that are campaign-specific:** Manually review and add `#campaign/exandria` to notes that are specific to the current campaign vs. general Exandria lore.

#### Phase 5: Reference Materials

- [x] **Move templates:** `z_Reference/z_Templates/` → `Templates/`
- [x] **Consolidate reference:** Keep `z_Reference/` with Compendium, Mechanics, Clippings
- [x] **Remove Folder Overview plugin code** from notes (optional—can do incrementally)

#### Phase 6: Import Tyranny of Dragons

- [x] **Create `Campaigns/Tyranny of Dragons/`**
- [x] **Move content from old vault** into this folder
- [x] **Tag with `#campaign/tyranny`**
- [x] **Move to `z_Archive/Tyranny of Dragons/`** if you want it out of active view
- [x] **Move any Faerun locations** to `Worlds/Faerun/`

#### Phase 7: Set Up Keln

- [x] **Create `Campaigns/Keln/`** with Session Notes, Worldbuilding, etc.
- [x] **Create `Worlds/Keln/`** for world content
- [x] **Begin building**—new content goes in appropriate locations with `#campaign/keln` and `#world/keln` tags

#### Phase 8: File Audit & Cleanup

You have a backlog of unprocessed files (`processed: no` or `#to-process`). Before spending time processing everything, let's identify what's actually needed.

##### Part A: Frontmatter Audit

**Problem:** Frontmatter that duplicates tags, properties that are never queried, fields that stay empty and add visual noise.

**Step 1: Inventory all frontmatter properties in use**

```dataviewjs
// Find all unique frontmatter keys across the vault
const allKeys = new Set();
dv.pages().forEach(p => {
  Object.keys(p).forEach(key => {
    if (!key.startsWith("file")) allKeys.add(key);
  });
});
dv.list([...allKeys].sort());
```

**Step 2: For each property, ask:**

|Question|If No → Action|
|---|---|
|Is this queried by any Dataview?|Remove property|
|Does this duplicate a tag?|Keep one, delete the other|
|Is this filled in on >50% of notes?|Consider removing or making optional|
|Does this drive any automation?|Remove property|
|Do I actually look at this when using the note?|Remove property|

**Step 3: Identify tag/property duplication**

Common culprits:

- `type: npc` AND `#npc`—pick one (tags are more searchable)
- `campaign: exandria` AND `#campaign/exandria`—use tag only
- `status: active` AND `#active`—pick one

**Recommended minimal frontmatter:**

```yaml
---
tags:
  - npc
  - campaign/exandria
  - world/exandria
aliases:
  - The Gentleman
  - Korfel
current_location: Zadash
affiliations:
  - The Myriad
---
```

Only add properties that:

1. You actually query with Dataview
2. Change over time and need tracking (like `current_location`)
3. Enable linking/aliases

**Reconsider the `processed` workflow:**

The `processed: yes/no/pending` system creates ongoing maintenance. Ask yourself:

- Do you actually query notes by processed status regularly?
- Or is it guilt-driven ("I should process this eventually")?

Alternative approaches:

- **Delete it entirely**—if a note is in the vault and tagged, it's "processed enough"
- **Use a tag instead**—`#inbox` for new notes needing attention, remove tag when done
- **Time-box it**—anything unprocessed after 3 months gets archived or deleted

The goal is reducing friction, not tracking completion status of every note.

##### Part B: Template Simplification

**Principle:** A template should be a *thinking prompt*, not a form to fill out.

**When templates help:**

- Recurring note types where consistency aids lookup (NPCs, locations)
- Notes you'll reference during live play (need predictable structure)
- Content that benefits from a checklist ("did I think about X?")

**When templates hurt:**

- One-off notes or ideas
- Session notes (every session is different)
- Plot threads that evolve unpredictably
- Anything where the structure constrains your thinking

**The Glazing Test:** If you find yourself skipping past a section without thinking, either:

- The section isn't useful → delete it
- The section is poorly framed → rewrite the prompt
- The section is useful but not always → make it a comment you delete if unused

**Current template audit approach:**

For each template, we'll analyze:

1. Which sections actually get filled in (sample 5-10 notes using that template)
2. Which sections stay empty or boilerplate
3. Which Dataview queries depend on template structure
4. What's the minimum viable version

**Template simplification strategies:**

|Problem|Solution|
|---|---|
|Too many sections|Collapse related sections, delete rarely-used ones|
|Sections stay empty|Convert to optional comment blocks or delete|
|Redundant "Connected Elements" queries|Keep one query that catches all, or delete if you use graph view|
|Empty tables waiting to be filled|Delete—create tables only when you have data|
|Boilerplate headings|Use fewer, more meaningful headings|

**Example: NPC Template (Current vs. Simplified)**

Current (based on what I see in your vault):

```markdown
# Quick Reference
> [!info] Essential Details
> - Base of Operations: 
> - Primary Goal: 
> - Current Status: 
> - Party Standing: 
> - Influence Level: 

# Organization
## Leadership Structure
### Current Leadership
### Historical Leadership
| Leader | Era | Notable Achievements | Legacy |
...

## Notable Members
## Size/Scale
## Resources & Assets

# Culture & Methods
## Philosophy/Beliefs
## Traditions/Customs
## Typical Methods
## Known Symbols

# Connected Elements
## NPCs
## Places
## Items
## Related Plot Threads
```

Simplified:

```markdown
---
tags: [npc, campaign/exandria, world/exandria]
aliases: []
current_location: 
affiliations: []
---

# Quick Reference
**Role:** 
**Goal:** 
**Party relationship:** 

# Notes
<!-- What do I need to remember about this character? -->

# Connections
<!-- Key relationships, plot threads, locations - add as relevant -->
```

The simplified version:

- Asks three questions that actually matter for play
- Uses freeform "Notes" instead of prescribed sections
- Lets connections emerge organically rather than forcing empty Dataview tables
- Fits on one screen

##### Part C: File Triage

**Step 1: Generate inventory of unprocessed files**

```dataview
TABLE processed, file.folder, file.size
FROM ""
WHERE processed = "no" OR processed = "pending" OR contains(tags, "to-process")
SORT file.folder ASC
```

**Step 2: Triage categories**

Working together, we'll sort unprocessed files into:

|Category|Action|
|---|---|
|**Essential**|Must process—active plot threads, current NPCs, locations party will visit|
|**Reference**|Keep as-is—useful but doesn't need full template treatment|
|**Redundant**|Delete or merge—duplicates, outdated info, superseded notes|
|**Archive**|Move to z_Archive—completed content, old campaign material|
|**Stub**|Decide: flesh out or delete—placeholder notes that never developed|

**Step 3: Identify redundant/mergeable files**

Run this query to find potential duplicates (similar names or linking to same targets):

```dataview
TABLE file.outlinks AS "Links To", length(file.outlinks) AS "Link Count"
FROM #npc OR #location OR #faction
WHERE processed = "no"
SORT file.name ASC
```

Look for:

- Multiple notes about the same NPC (different name spellings, aliases)
- Location notes that overlap (a region note + town notes that duplicate info)
- Faction notes that could be consolidated

**Step 4: Bulk actions**

**For files that are reference-only (don't need full processing):**

```
Find: processed: no
Replace: processed: reference
```

**For files moving to archive:** Move to `z_Archive/Unprocessed/` and remove from active concerns.

**Step 5: Process remaining essentials**

After triage, the remaining "essential" files get proper attention—but with *simplified* templates, not the elaborate ones.

---

**When to do this phase:**

- After the structural migration is complete
- Before you start actively running sessions in the new structure
- Can be done incrementally over multiple sessions with Claude

---

### Dataview Query Updates

Your existing Dataview queries assume single-campaign structure. Here's how to make them campaign-aware:

#### Current: Task rollup from numbered folders

```dataviewjs
const pages = dv.pages('"05 General Plans"').where(p => p.file.tasks.length > 0);
```

#### Updated: Task rollup from campaign folder

```dataviewjs
const campaign = "Exandria"; // Change per dashboard
const pages = dv.pages(`"Campaigns/${campaign}"`).where(p => p.file.tasks.length > 0);
```

#### Current: NPC list

```dataview
LIST FROM #npc
```

#### Updated: NPCs for specific campaign

```dataview
LIST FROM #npc AND #campaign/exandria
```

#### Updated: All NPCs in a world (any campaign)

```dataview
LIST FROM #npc AND #world/exandria
```

#### Dynamic Campaign Detection

For dashboards that should auto-detect their campaign context:

```dataviewjs
// Detect campaign from current file path
const path = dv.current().file.path;
const campaignMatch = path.match(/Campaigns\/([^\/]+)/);
const campaign = campaignMatch ? campaignMatch[1].toLowerCase() : null;

if (campaign) {
  const npcs = dv.pages(`#npc AND #campaign/${campaign}`);
  dv.table(["NPC", "Affiliations"], 
    npcs.map(p => [p.file.link, p.affiliations])
  );
} else {
  dv.paragraph("Not in a campaign folder");
}
```

#### Connected Elements (Updated)

Your template pattern for connected elements can stay largely the same, but consider adding campaign filtering:

```dataview
LIST
FROM #npc
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```

This still works because it follows links rather than relying on folder structure.

---

### GitHub / Claude Project Strategy

#### Current Project (Exandria)

Your existing GitHub sync continues to work. Update `.gitignore` to exclude other campaigns:

```gitignore
Campaigns/Tyranny*/
Campaigns/Keln/
Campaigns/One-Shots/
Worlds/Faerun/
Worlds/Keln/
```

#### Future Projects

**Option A: Separate repos per campaign**

- Each campaign gets its own GitHub repo
- Each repo syncs to its own Claude project
- Pro: Cleanest separation
- Con: More repos to manage

**Option B: Single repo, branch per campaign**

- Main branch = shared content (Worlds, Characters, Items, Reference)
- Campaign branches include their specific `Campaigns/[name]/` folder
- Pro: Shared content stays in sync
- Con: More git complexity

**Option C: Single repo, selective.gitignore**

- One repo, swap `.gitignore` when switching Claude project focus
- Pro: Simplest git setup
- Con: Manual switching

**Recommendation:** Start with Option A (separate repos). When you launch Keln, create a new repo that includes:

- `Campaigns/Keln/`
- `Worlds/Keln/`
- Shared content you want Claude to reference

---

### Plugin Cleanup

#### Keep

- **Dataview**—essential for your queries
- **Templater**—template automation
- **Tag Wrangler**—tag management (renaming, merging)

#### Remove or Disable

- **Copilot**—replaced by Claude project
- **Text Generator**—not in use
- **Folder Overview**—can be replaced by Dataview queries if needed

#### Consider

- **Workspaces** (core plugin)—for switching campaign contexts
- **Bookmarks** (core plugin)—for quick access to campaign dashboards

---

### Verification Checklist

After migration, verify:

- [ ] All session notes are accessible and linked correctly
- [ ] Dataview queries return expected results
- [ ] GitHub sync still works (push a test change)
- [ ] Claude project can see campaign content
- [ ] Links between notes still work (Obsidian should auto-update most)
- [ ] Tags appear correctly in tag pane
- [ ] Search scoped to campaign works (test `tag:#campaign/exandria`)

---

### Quick Reference: Where Does This Go?

|Content Type|Location|Tags|Key Properties|
|---|---|---|---|
|Session prep/notes|`Campaigns/[name]/Session Notes/`|`#campaign/[name]`|—|
|Plot threads|`Campaigns/[name]/Plot Threads/`|`#plot #campaign/[name]`|`plot_stage`|
|Party/PC info|`Campaigns/[name]/Party/`|`#player #campaign/[name]`|—|
|Campaign status|`Campaigns/[name]/Status/`|`#campaign/[name]`|—|
|NPC (campaign-specific)|`Characters/NPCs/`|`#npc #campaign/[name] #world/[world]`|`current_location`, `home_base`, `affiliations`|
|NPC (reusable)|`Characters/NPCs/`|`#npc #world/[world]`|`current_location`, `home_base`, `affiliations`|
|Location|`Worlds/[world]/[region]/`|`#location #world/[world]`|—|
|Faction|`Characters/Factions/`|`#faction #world/[world]`|—|
|Artifact/Item|`Items/`|`#artifact #world/[world]`|—|
|Stat block (system-specific)|Same as parent note|Add `#system/dnd5e`|—|
|Reference material|`z_Reference/`|None (excluded from searches)|—|
|Completed campaign|`z_Archive/[name]/`|`#campaign/[name]`|—|

---

### Next Steps

1. Review this plan and flag anything that doesn't fit your workflow
2. Back up your vault
3. Start with Phase 1 (cleanup) and Phase 2 (Exandria restructure)
4. Test thoroughly before moving to other phases
5. Import Tyranny of Dragons
6. Begin Keln worldbuilding in new structure
