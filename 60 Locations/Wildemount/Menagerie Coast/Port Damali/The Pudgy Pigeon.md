---
type: location
status: active
region: Beaded Alley, Port Damali
controlling_faction: Ryn Zethergyll and Carlon Talandro
processed: yes
tags:
 - location
---
# Quick Reference
> [!info] Essential Details
> - Current Status: Active tavern of comfortable quality
> - Key Feature: Historic tavern with roots in local trading history
> - Atmosphere: Unsettlingly unfriendly clientele
> - Recent Events: Typical night sees around ten patrons, some singing drinking songs

# Overview
## Physical Description
- External features
  - Two-story stone and timber building with a weather-worn facade
  - Painted sign featuring a plump gray pigeon perched on a tankard
  - Wide front entrance with double doors, suitable for merchant traffic
  - Small covered porch with benches for outdoor seating
  - Side entrance leading to the rooms upstairs
  
- Internal layout
  - Ground floor
    - Main taproom with bar along one wall
    - Several wooden tables and chairs scattered throughout
    - Small raised platform for occasional entertainment
    - Kitchen area behind the bar
    - Storage cellar accessed through a trapdoor behind the bar
  - Upper floor
    - Three tiny, dingy rental rooms
    - Shared washroom facility
    - Owner's private quarters
    
- Notable areas
  - Bar area personally tended by one of the owners
  - Private booth in the darkest corner, favored by locals
  - Small alcove near the entrance with historical memorabilia
  - Cellar with extensive wine and spirits storage

## Current State
> [!note] Active Elements
> - Present situation: Operating tavern with full food and drink menu
> - Recent changes: Currently has three rooms available for rent
> - Immediate concerns: Questionable quality of the herb-crusted venison (meat has gone bad)

# Hidden Elements
> [!secret]- DM Only
> - Concealed features: Hidden storage space beneath the cellar
> - Unknown connections: Old smuggling tunnel (now collapsed) in the cellar
> - Future developments: Local merchant guild showing interest in purchasing the property

# Proprietors
## Ownership
- Ryn Zethergyll and Carlon Talandro (unmarried, business partners)
- One previously worked at the tavern under old ownership
- The other came from a merchant background

## The Bartender
- One owner (Ryn) tends bar personally
- Described as disturbingly curmudgeonly
- Appearance: Powerfully average looking, bronzed skin, long tangled red hair
- Build: Meaty

# Services
## Accommodations
- Room Cost: 8 sp, 3 cp per night
- Quality: Quite tiny and dingy
- Availability: Three rooms currently vacant

![[Pudgy Pigeon Menu#Core Information]]

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
