---
type: location
status: active
region: Menagerie Coast, Tyodan River
controlling_faction: Disputed Territory
processed: yes
tags:
 - location
---

# Quick Reference
> [!info] Essential Details
> - Current Status: Open crossing
> - Key Feature: Bridge spanning Tyodan River waterfall
> - Atmosphere: Naturally scenic coastal river overlook
> - Recent Events: Site of recent territorial dispute
> - Location: Northeast of Port Damali on the Menagerie Coast

# Overview
## Physical Description
### External
- Stone bridge crossing over dramatic Tyodan River waterfall
- Part of the coastal trade route northeast of Port Damali
- Natural rocky outcroppings on both banks
- Multiple elevated vantage points surrounding the bridge
- Dense vegetation providing natural cover near approaches

### Internal
- Single span bridge wide enough for wagon traffic
- Worn but stable walking surface
- Natural cavities behind waterfall
- Deep pool at base of falls

## Notable Features
- Strategic chokepoint for travel
- Multiple hidden observation points
- Treacherous but accessible area beneath bridge
- Natural acoustics from waterfall mask nearby sounds
- Sheltered spaces behind water curtain
- Deep pool at base suitable for concealing items

## Current Situation
- Bridge remains structurally sound
- Territory frequently contested due to strategic value
- Local wildlife avoids area due to regular traffic
- Water level varies seasonally affecting passage below
- Recent events:
	- [[session 5.5]]

## Secrets & Clues
> [!secret]- DM Only
> - Hidden caves behind waterfall
> - Deep pool beneath bridge often collects valuable debris
> - Several natural sniper positions in surrounding rocks
> - Seasonal water levels affect access to lower areas

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
