---
type: location
status: active/inactive
region: 
controlling_faction: 
processed: yes
tags:
  - location
---
# Quick Reference
> [!info] Essential Details
> - Current Status:
> - Key Feature:
> - Atmosphere:
> - Recent Events:

# Overview
## Physical Description
- External features
- Internal layout
- Notable areas

## Current State
> [!note] Active Elements
> - Present situation
> 	- [[Eidechse (Amanda Jeane)|Dechs]] needs to find her contact to deliver her herbs
> - Recent changes
> - Immediate concerns

# Hidden Elements
> [!secret]- DM Only
> - Concealed features
> - Unknown connections:
> 	- [[Hesterian Shyr (Dot)|Hesterian]]'s murderer is now a powerful crime boss in Zadash who goes by "[[Korfel Withrethin|The Gentleman]]".
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
