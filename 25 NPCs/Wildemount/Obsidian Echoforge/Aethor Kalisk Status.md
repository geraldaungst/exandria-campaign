---
type: note
faction: Obsidian Echoforge
location: Port Damali
status: active
processed: no
tags:
  - atomic
  - to-process
---
> [!info]- Essential Details
> - Location: [[Port Damali]]
> - Current Goal: Meet with [[Calderax Dunhall]] regarding [[Lorestone of Eryndor#Individual Shard Powers|Lorestone shard]]
> - Last Updated: `$= moment(dv.current().file.mtime.toString()).format("MMM D, YYYY") + " (" + moment(dv.current().file.mtime.toString()).fromNow() + ")"`

# Other Important Locations Seen
- Hupperdook (Previous base of operations)

# Immediate Plans
- Meet with Calderax Dunhall
- Investigate lead on [[Lorestone of Eryndor|Lorestone]] shard
- Continue development of arcane refraction device

# Goals
1. Locate and secure the Lorestone Shard
2. Perfect the arcane refraction technique
3. Assist in assembling the complete Lorestone
4. Prevent misuse of Lorestone fragments

# Relationships
- [[Lyren Willowwhisper]]: Trusted ally and recruiter
- [[Calderax Dunhall]]: Potential informant
- [[Valen Elderguard]]: Unknown enemy
- [[Obsidian Echoforge]]: Key researcher

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