---
type: npc
faction: [[Emissaries of the Sunfall]], [[Scars of Scale and Tooth]]
location: [[Cloudfang Keep]]
status: active
processed: no
tags:
  - npc
---
# Quick Reference
> [!info] Essential Details
> - Current Location: 
> - Key Motivation: 
> - Attitude toward party: 
> - Critical Knowledge: Link to knowledge note
> - Status: Link to status note

# Description
Transclude description note here

## Roleplay
- Voice:
- Mannerisms:
- Notable Traits:

# Current Situation
Transclude Status Note here

# Background
Transclude Background note here
- Key history points
- Important events

# Hidden Information
> [!secret]- DM Only
> - Secret motivations
> - Unknown connections
> - Future plans

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
