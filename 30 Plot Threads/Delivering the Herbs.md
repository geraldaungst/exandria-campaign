---
type: plot
plot_type: personal
plot_stage: active
processed: no
tags:
  - plot
  - to-process
---
# Quick Reference
> [!info] Essential Details
> - Stage: Active
> - Priority: Medium
> - Key Players: [[Eidechse (Amanda Jeane)|Dechs]]
> - Last Session: 
> - Next Steps: Travel to Zadash to deliver the herbs

# Overview

# Current State
## Recent Events
(last major development)
## Active Elements
(what's currently in motion)
## Blocking Issues
(what's preventing progress)

# Player Knowledge
- What they know:
- What they think they know:
- What they don't know:

# Plot Hierarchy
- Parent Plot: 
- Subplots: 

# Development Stages
## Seeds
- [ ] Seed description
- [ ] Expected trigger: (event/condition/timing)
- [ ] Potential implications

## Planned Developments
- [ ] Immediate actions
- [ ] Timing constraints
- [ ] Required preparation

## Long-term Plans
- Major plot points
- Possible branches

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
