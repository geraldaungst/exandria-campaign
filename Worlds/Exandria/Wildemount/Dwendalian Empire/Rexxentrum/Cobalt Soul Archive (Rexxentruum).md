---
tags:
  - location
  - world/exandria
  - region/dwendalian-empire
---

# Quick Reference
**Status:** 
**Significance:** 

# Description
<!-- What does it look/feel like? Add details as needed -->

# What's Happening Now
<!-- Current plot hooks, recent events, immediate concerns -->

# Secrets
<!-- DM-only info, hidden connections -->

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
FROM #item 
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```
## Related Plot Threads
```dataview
LIST
FROM #plot 
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```
