---
type: location
status: active
region: Port Damali
controlling_faction: Myriad
processed: no
tags:
  - location
  - to-process
---
# Quick Reference
> [!info] Essential Details
> - Current Status: Active
> - Key Feature: Tailor shop with hidden basement; new rift to the Plane of Earth
> - Atmosphere:
> - Recent Events: [[Aelorin Nightshade]] [[Dreyara Drimvar]]

# Overview
## Physical Description
- External features
- Internal layout
	- [[Aelorin's HQ Ground Floor Text|Ground Floor]]
	- [[Aelorin's HQ Basement Text|Basement]]

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
