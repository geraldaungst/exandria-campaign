---
type: plot
plot_type: main
plot_stage: active
tags:
  - plot
processed: no
---
# Quick Reference
> [!info] Essential Details
> - Stage: Active
> - Priority: High
> - Timeline: Unknown
> - Key Players: [[Vaud Qalix]], [[Obsidian Echoforge]], [[Malachite Cord]], [[Emissaries of the Sunfall]]
> - Parent Plot: [[01 The Prophecy]]
> - Last Session: 
> - Next Steps: Locate and track movement of Lorestone shards

# Overview
A three-way conflict over the [[Lorestone of Eryndor]], with competing factions seeking to either assemble, protect, or exploit the artifact for different purposes.

# Current State
- Recent Events: None recorded yet
- Active Elements: 
    - Multiple shards of the Lorestone scattered across the region
    - ![[Lorestone of Eryndor#Known Locations]]
- Blocking Issues: 
    - Current locations of many shards unknown
    - Multiple competing factions involved

# Player Knowledge
- What they know: The Obsidian Echoforge are seeking a shard of this artifact
- What they think they know: 
- What they don't know: The existence of competing factions and their goals, the true purpose of assembling the Lorestone

# Plot Hierarchy
- Parent Plot: [[01 The Prophecy]]
- Subplots: [TBD]

# Development Stages
## Seeds
> [!seed]- Active Seeds
> - [ ] [[Obsidian Echoforge]] seeks to assemble the Lorestone to fulfill the prophecy
> - [ ] [[Malachite Cord]] aims to prevent assembly, fearing a repeat of the [[Ruins of Molaesmyr]] disaster
> - [ ] [[Emissaries of the Sunfall]] plan to create a permanent gate using the Lorestone's power

## Planned Developments
> [!todo]- Next Steps
> - [ ] Track current locations of Lorestone shards
> - [ ] ![[Vaud Qalix#Plan Outline]]
> - [ ] ![[Lorestone of Eryndor#Assembling the Lorestone]]

## Long-term Plans
> [!plan]- Future Direction
> - Potential assembly of the Lorestone
> - Possible catastrophic event similar to Molaesmyr
> - Creation of a permanent gate by the Emissaries

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