---
type: location
status: active
region: "Dwendalian Empire"
controlling_faction: none
processed: pending
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
