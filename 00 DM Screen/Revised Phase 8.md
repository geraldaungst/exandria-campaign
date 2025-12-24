## Revised Phase 8: File Audit & Cleanup

### Key Context from Previous Phases

Decisions that shape this phase:

- **Property vs tag rule established:** Tags for categorical data (world, region, campaign associations); properties for specific filterable values (home_city, rarity, status)
- **NPCs use specific regions:** Menagerie Coast, Dwendalian Empire, Xorhas, Greying Wildlands—not continent-level
- **World content doesn't need campaign tags:** NPCs/locations/factions are world content; campaign tags only mark narrative-specific content
- **Template philosophy:** Thinking prompts, not forms

### Part A: Property/Tag Standardization

This was deferred to Phase 8 to see patterns across the full vault.

- [x] Step 1: Inventory all properties
- [x] **Step 2: Apply the property/tag rule**
- [x] **Step 3: Decide on `processed` workflow**
### Part B: Tyranny NPCs Processing

Before general file triage, handle the archived Tyranny content:

1. Review NPCs in `z_Archive/Tyranny of Dragons/`
2. For reusable Faerun NPCs:
    - Add `region: Sword Coast` property
    - Add `#world/faerun` tag
    - Move to `Characters/NPCs/`
3. Keep campaign-specific NPCs in archive with `#campaign/tyranny`

### Part C: Template Simplification

**Audit each template in z_Templates/:**

1. Sample 5-10 notes using it
2. Which sections stay empty?
3. Which Dataview queries depend on it?
4. Create simplified version per the "thinking prompt" philosophy

**Target structure for simplified templates:**

markdown

```markdown
---
tags: []
aliases: []
---

# Quick Reference
**[2-3 key fields relevant to this type]**

# Notes
<!-- Freeform content -->

# Connections
<!-- Add links as relevant -->
```

Completed templates:
- [[NPC Template]]
- [[Location Template]]
- [[Artifact-Item Template]]
- [[Plot Thread Template]]
- [[Atomic Note]]
- [[Faction Template]]


Not yet simplified:
- [[Session Template]]

### Part D: File Triage

**Step 1: Inventory unprocessed files**

dataview

```dataview
TABLE file.folder, file.size
FROM ""
WHERE processed = "no" OR processed = "pending" OR contains(tags, "to-process") OR contains(tags, "inbox")
SORT file.folder ASC
```

**Step 2: Triage into categories**

|Category|Action|
|---|---|
|Essential|Process with simplified template|
|Reference|Mark complete, no further processing|
|Redundant|Delete or merge|
|Archive|Move to z_Archive/|
|Stub|Delete if empty, flesh out if needed|

### Part E: Verification & Cleanup

**Run these checks:**

bash

```bash
# Old folder references in Dataview queries
grep -r "05 General Plans\|90 Session Notes\|25 NPCs\|60 Locations\|21 Opponents\|19 Factions\|40 Artifacts" *.md

# Folder Overview plugin remnants
grep -r "folder-overview" *.md

# Lingering numbered folders
find . -type d -name "[0-9][0-9]*"
```

### Part F: Vault Health Dashboard (Optional)

Create `00 DM Screen/Vault Health.md` with queries for:

- Files missing required properties
- Broken links
- Orphaned files
- Tag consistency issues

---

### Execution Order

1. Property inventory & standardization decisions
2. `processed` workflow decision
3. Tyranny NPC processing
4. Template audit (one template at a time)
5. File triage (can be incremental)
6. Verification checks
7. Health dashboard (if desired)