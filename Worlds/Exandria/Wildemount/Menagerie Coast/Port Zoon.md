---
type: location
status: active
region: "Menagerie Coast"
controlling_faction: Zhelezo, "Crafting Guilds"
processed: yes
tags:
  - location
---
# Quick Reference
> [!info] Essential Details
> - Current Status: Active
> - Key Feature: 
> 	- Artisan and crafting guilds are abundant and powerful
> 	- Industrial areas prominent
> - Atmosphere:
> 	- Industrial, mechanical, smoke and smog
> - Recent Events:

# Overview
## Physical Description
- External features
- Internal layout
- Notable areas

## Current State
> [!note] Active Elements
> - Present situation:
> 	- [[Keldar Stonefoot]], chief cartographer, has a [[Consecution's Hope|map]] to a shard of the [[Lorestone of Eryndor]]. [[Calderax Dunhall]]has agreed to give him the [[Stonefoot Compass]] in exchange for the map. (See [[Search for the Stonefoot Compass]])
> - Recent changes
> - Immediate concerns

# Hidden Elements
> [!secret]- DM Only
> - Concealed features
> - Unknown connections
> - Future developments

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
