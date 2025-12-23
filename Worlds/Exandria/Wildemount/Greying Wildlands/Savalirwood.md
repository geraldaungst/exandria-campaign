---
aliases: 
tags:
  - location

processed: no
---
# Quick Reference
> [!info] Essential Details
> - Current Status:
> - Key Feature:
> - Atmosphere:

# Description
## External

## Internal

# Notable Features
- 

# Current Situation

# Secrets & Clues
> [!secret]- DM Only
> 

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
