---
type: note
faction: [[Emissaries of the Sunfall]]
location: [[Cloudfang Keep]]
status: active
processed: no
tags:
  - atomic
---
> [!info]- Essential Details
> - Location: [[Cloudfang Keep]] Library (Area E6)
> - Current Goal: Complete analysis of Luxon Beacon's temporal resonance properties and their connection to Lorestone shard patterns
> - Last Updated: `$= moment(dv.current().file.mtime.toString()).format("MMM D, YYYY") + " (" + moment(dv.current().file.mtime.toString()).fromNow() + ")"`

# Other Important Locations Seen
- Various planar rift sites across Wildemount (Molaesmyr, Savalirwood, Barbed Fields)
- Previous Emissaries of the Sunfall operational areas (as a scout)

# Immediate Plans
- Finalize temporal resonance analysis before [[Dreyara Drimvar|Dreyara's]] expected arrival
- Prepare secure workspace for "specimens requiring immediate attention" that Dreyara will bring
- Continue documenting how the [[luxon-beacon-egw|Luxon Beacon]] (her "Temporal Resonance Crystal") interacts with planar rift energy
- Map the connections between beacon properties and Lorestone fragment resonance patterns

# Goals
- Master planar magic through comprehensive understanding of rift energy mechanics
- Unlock the secrets of the Lorestone shards and their relationship to planar rifts
- Prove her theories about controlled planar energy manipulation
- Deliver results that satisfy [[Vaud Qalix]]'s escalating demands for progress
- Maintain her position as Qalix's primary planar research specialist

# Relationships

**[[Vaud Qalix]]** (Employer, Never Met): Her patron and funding source. All communication occurs through letters and [[Dreyara Drimvar|Dreyara's]] visits. She views him as a powerful figure who recognizes her brilliance and provides resources she couldn't acquire independently. Recently he's been applying more pressure for results on the Lorestone research. She has no knowledge of his true nature or connection to [[Ceratos]].

**[[Dreyara Drimvar]]** (Qalix's Agent): Regular visitor who delivers specimens, inspects research progress, and serves as intermediary with Qalix. Emer treats her professionally but views these inspections as necessary inconveniences. Expected to arrive soon for examination of the beacon research findings.

**[[Varnes Dwell]]** (Prisoner): Petrified captive stored in the stone garden. Delivered by Dreyara for interrogation regarding his knowledge, but proved unable or unwilling to provide useful information. Emer considers him simply inventory—an object awaiting Qalix's personal attention, nothing more. No emotional investment whatsoever.

**Stone Garden "Collection"**: Various petrified individuals who failed her standards—incompetent assistants, thieves, trespassers. She views them as both security system fuel (for her Stone Sacrifice ability) and examples of proper consequences for failure.

**Her Guardians** (Wyvern, Basilisks, etc.): Trained creatures serving as security. She maintains them efficiently but without particular affection—they're tools, not pets.

# Current Pressures

The research has reached a critical juncture. The [[Luxon Beacon]]'s temporal properties suggest profound connections to the Lorestone fragments that she hasn't fully mapped yet, and Qalix has made it explicitly clear this work takes priority above all other projects. The pressure to deliver breakthrough results has made her more irritable and impatient than usual—her already low tolerance for incompetence has dropped to near zero.


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
