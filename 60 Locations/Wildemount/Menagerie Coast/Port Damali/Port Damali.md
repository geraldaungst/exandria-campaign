---
processed: pending
tags:
  - location
type: location
status: active/inactive
region: 
controlling_faction:
---

# Quick Reference
> [!info] Essential Details
> - Current Status:
> - Key Feature:
> - Atmosphere:
> - Recent Events:

# Locations
```folder-overview
id: 54d32e28-6d77-409d-a6a0-c7269069d6b6
folderPath: ""
title: "{{folderName}} overview"
showTitle: false
depth: 3
style: list
includeTypes:
  - folder
  - markdown
disableFileTag: false
sortBy: name
sortByAsc: true
showEmptyFolders: false
onlyIncludeSubfolders: false
storeFolderCondition: true
showFolderNotes: false
```

# Overview
## Physical Description
- External features
- Internal layout
- Notable areas

## Current State
> [!note] Active Elements
> - Present situation
> - Recent changes
> - Immediate concerns

# Hidden Elements
> [!secret]- DM Only
> - Concealed features
> - Unknown connections
> - Future developments

# NPC Matters
- [ ] [[Aethor Kalisk]] will be looking for [[Calderax Dunhall]] to get the shard.
- [x] [[Radelia Caphax]] will follow Aethor, but is unlikely to be spotted by him. Players may notice they keep running into her if they are spending time with Aethor. Radelia will leave PD to return to [[Odessloe]] when she finds out that Aethor did not actually get the shard. She will report on information that she finds out about the [[Letter to Calderax]].
- [x] [[Durnvolk Durmir]] will head directly to the site of the new temple which is in the northwest end of the Crescents, not far from the skyport. He will discover problems at the site of the [[New Temple of Moradin]] and ask the players for help (if they are around him).
- [ ] Bachan Briarfell is the Zhelezo who takes over the scene of the ship.

# Connected Elements
## NPCs
```dataview
LIST
FROM #npc
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```
## Places
```dataview
LIST
FROM #location
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```
## Items
```dataview
LIST
FROM #artifact 
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```
## Related Plot Threads
```dataview
LIST
FROM #plot 
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```
