---
type: location
status: active
region: "Dwendalian Empire", [[Rexxentrum]]
controlling_faction: [[Azel Brightful]]
processed: yes
tags:
  - location
---
# Quick Reference
> [!info] Essential Details
> - Current Status: Open for business
> - Key Feature: Military surplus store
> - Atmosphere:
> - Recent Events:

# Overview
## Physical Description
- External features
- Internal layout
- Notable areas

## Inventory
### General Items
1. Military-grade backpacks and rucksacks
2. Weatherproof tents and camping gear
3. Canteens and water purification tablets
4. Sturdy boots and all-weather clothing
5. Mess kits and field rations
6. Compasses and basic navigation tools
7. Rope, grappling hooks, and climbing gear
8. First aid kits and medical supplies
9. Blankets and sleeping bags
10. Flint and steel fire starters
11. Signal flares and whistles
12. Folding shovels and multi-tools
13. Gas masks and protective gear
14. Camouflage netting and tarps
15. Binoculars and spyglasses
16. Non-magical light sources (lanterns, torches)
17. Leather armor pieces and padding
18. Weapon maintenance kits
19. Surplus ammunition (arrows, bolts, sling bullets)
20. Decommissioned military uniforms and insignia

### Rare Items
#### Chroma Conclave attack (acquired directly by Azel or sought by him):
1. A scale fragment from Vorugal the Frigid Doom, preserved in a small, ornate box.
2. A vial of ash collected from the ruins of Emon immediately after Thordak's initial attack.
3. A broken dragon tooth, believed to be from Umbrasyl the Hope Devourer, mounted on a display stand.
4. A piece of shattered Draconian architecture, etched with frost patterns from Vorugal's breath weapon.
5. A tattered banner of the Draconian military, bearing claw marks and frost damage from the assault.
6. A ceremonial medal of valor, awarded to Draconian soldiers who fought against Vorugal, slightly damaged but still intact. (Close inspection would find the name "Vaud Qalix" engraved on the back.)
#### Magic Items
1. A set of [[Scale Mail of the Frigid Doom]]. It is Dragon Scale Mail made from Vorugal's remains, collected by Azel himelf and commissioned from a master craftsman.
2. Boots of the Winterlands
3. Daern's Instant Fortress
4. Dread Helm
5. Rival Coin
6. Smoldering Armor
7. Sword of Wounding
#### Other unique items
1. A spyglass crafted by gnomish artisans from Hupperdook, featuring intricate  detailing and rangefinding marks engraved on the lenses.
2. A set of bone dice carved from the remains of a young remorhaz, popular among soldiers stationed in Eiselcross.
3. A ceremonial rapier with Kryn Dynasty engravings, likely a trophy from a border skirmish.
4. A small, ornate music box from Whitestone, playing a melancholy tune about the fall of the de Rolo family.
5. A collection of pressed flowers from the Blooming Grove, preserved in a book and said to bring good fortune to travelers.

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
