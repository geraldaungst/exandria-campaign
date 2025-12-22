# Vault Reorganization Tasks

## High Priority

### Create Lorestone Shard Status Tracker

- [x] **Create new note:** `40 Artifacts/Lorestone Shard Status Tracker.md`
- [x] **Add YAML frontmatter:** Set `processed: yes`, `tags: atomic`, `type: artifact`
- [x] **Create Shard 1 section:** Document current location (Lyren Willowwhisper), known by (Obsidian Echoforge), pursued by (list factions)
- [x] **Create Shard 2 section:** Same structure as Shard 1
- [x] **Create Shard 3 section:** Same structure as Shard 1
- [x] **Create Shard 4 section:** Same structure as Shard 1
- [x] **Create Shard 5 section:** Document location (Archivist Ovedo, Rexxentrum), who knows (Cobalt Soul, but not Obsidian Echoforge), key detail (Ovedo is keeping it secret from Echoforge)
- [x] **Create Shard 6 section:** Document location (Dreyara Drimvar), recently sought by (Celdric Ambril), discovered in (Marquet)
- [x] **Create Shard 7 section:** Document journey (Consecution's Hope → Xhorhas), map holder (Keldar Stonefoot), current possessor (Shoagragoth, The Acid Crown), challenge level (12-14)
- [x] **Create Shard 8 section:** Mark as TBD, note planned level range (15-17)
- [x] **Add dataview block:** List all NPCs linked to this note
- [x] **Add dataview block:** List all factions linked to this note
- [x] **Add dataview block:** List all plot threads linked to this note
- [x] **Update main Lorestone note:** Add link to new tracker in "Known Locations" section
- [x] **Update Assembling the Lorestone plot:** Add link to tracker

### Session Notes Folder Structure

- [x] **Create folder:** `90 Session Notes/Completed Sessions/`
- [x] **Create folder:** `90 Session Notes/Future Planning/`
- [x] **Move completed sessions:** Review query below, move each session with `processed: yes` to Completed folder

```dataview
TABLE date, processed
FROM "90 Session Notes"
WHERE processed = "yes" AND !contains(file.folder, "99 Completed Sessions")
SORT date ASC
```

- [x] **Move planning sessions:** Review query below, move each session with `processed: no` to Future Planning folder

```dataview
TABLE date, processed
FROM "90 Session Notes"
WHERE processed = "no"
SORT date ASC
```

- [x] **Verify folder contents:** Confirm "99 Old Sessions" contains only archived material

## Tag and Property Cleanup

### Resolve Tag/Property Redundancy

**Decision needed:** Determine whether to keep `#to-process` tag, `processed: no` property, or both. Consider:

- `processed` property allows three states: yes/no/pending
    
- `#to-process` tag is visible in graph view and easier to search
    
- Having both may be redundant unless you need the pending state
    
- [x] **Make decision:** Choose to keep tag only, property only, or both with clear use cases
    
- [x] **Document decision:** Add note to this file explaining the system
    
- [x] **Apply decision:** Use queries below to standardize
    

### Notes with Conflicting Status

```dataview
TABLE tags, processed
FROM #to-process 
WHERE processed = "yes"
LIMIT 10
```

**For each note above:**

- [x] Review note content to determine actual status
- [x] Remove `#to-process` tag OR change `processed` to `no`

### Notes Missing Tags

```dataview
TABLE processed, file.folder
FROM "05 General Plans" OR "10 The Party" OR "19 Factions" OR "21 Opponents" OR "25 NPCs" OR "60 Locations"
WHERE !processed OR processed = "no"
WHERE !contains(tags, "to-process")
LIMIT 10
```

**For each note above:**

- [ ] Review if work is incomplete
- [ ] Add `#to-process` tag if incomplete OR set `processed: yes` if complete

### Process Notes Tagged To-Process

```dataview
TABLE file.folder, processed
FROM #to-process
WHERE processed = "no" OR !processed
LIMIT 10
```

**For each note above:**

- [x] Open note and review content
- [x] Decide: Complete the note OR delete if no longer needed
- [x] If completed: Set `processed: yes` and remove `#to-process` tag
- [x] If deleted: Remove file

## Location Cleanup

### Empty Location Templates

```dataview
TABLE processed, status, controlling_faction
FROM "60 Locations"
WHERE processed = "no" OR !processed
WHERE !status OR status = ""
LIMIT 5
```

**For each location above:**

- [ ] Review if location is relevant to campaign
- [ ] If relevant: Populate Quick Reference (status, key feature, atmosphere)
- [ ] If relevant: Add at least one paragraph to Description section
- [ ] If relevant: Set `processed: yes`
- [ ] If not relevant: Delete file

### Locations Needing Description

```dataview
TABLE processed, status
FROM "60 Locations"
WHERE processed = "yes"
WHERE !contains(string(file), "# Description")
LIMIT 5
```

**For each location above:**

- [ ] Add Description section with external and internal details
- [ ] Add Current Situation section
- [ ] Consider if Secrets & Clues section needs content

## Faction Events Consolidation

### Identify Duplicate Event Descriptions

- [x] **Search vault:** Look for mentions of "The Massacre" across faction files
- [x] **List duplicate files:** Note which faction files describe the same event
- [x] **Create atomic note:** `19 Factions/Events/The Massacre.md` with canonical description
- [x] **Add YAML:** Set `processed: yes`, `tags: atomic`, `type: note`, `kind: fact/relationship`
- [x] **Write Core Information:** Single authoritative description of the event
- [x] **Document factions affected:** List which factions were involved or impacted
- [x] **Add date/timeline:** When the event occurred
- [x] **Update faction files:** Replace full descriptions with link to atomic note
- [x] **Verify links:** Ensure all faction files link to new atomic note

### Additional Faction Events

```dataview
TABLE file.folder
FROM "19 Factions"
WHERE processed = "no" OR !processed
LIMIT 5
```

**For each faction file:**

- [ ] Review for historical events described in detail
- [ ] Note if event is mentioned in multiple faction files
- [ ] If duplicated: Create atomic note for event (following structure above)
- [ ] If unique: Leave in faction file or create atomic note for reference

## NPC Status Updates

### NPCs Marked To-Process

```dataview
TABLE affiliations, status, location
FROM "25 NPCs"
WHERE processed = "no" OR !processed
LIMIT 8
```

**For each NPC:**

- [ ] Verify affiliations are current and linked
- [ ] Confirm status (active/inactive/deceased/unknown) is accurate
- [ ] Verify location is current
- [ ] Add any missing roleplay details (voice, mannerisms, appearance)
- [ ] Ensure Connected Elements dataview blocks are present
- [ ] Set `processed: yes` when complete

## Opponent Files

### Opponents Needing Processing

```dataview
TABLE race, class, affiliations
FROM "21 Opponents"
WHERE processed = "no" OR !processed
LIMIT 5
```

**For each opponent:**

- [ ] Complete OGAS (Occupation, Goal, Attitude, Stakes)
- [ ] Add description and roleplay guidance
- [ ] Document current situation and location
- [ ] Add background section
- [ ] Complete Hidden Information section (DM only)
- [ ] Add Connected Elements dataview blocks
- [ ] Set `processed: yes` when complete

## Plot Thread Maintenance

### Incomplete Plot Threads

```dataview
TABLE plot_stage, priority
FROM "30 Plot Threads"
WHERE processed = "no" OR !processed
LIMIT 5
```

**For each plot thread:**

- [ ] Complete Quick Reference section (stage, priority, timeline, key players)
- [ ] Write Overview section
- [ ] Document Current State (recent events, active elements, blocking issues)
- [ ] Fill Player Knowledge section (what they know vs. don't know)
- [ ] Define Plot Hierarchy (parent plot, subplots)
- [ ] Add Development Stages (seeds, planned developments)
- [ ] Ensure Connected Elements dataview blocks are present
- [ ] Set `processed: yes` when complete