---
type: note
faction: "[[Malachite Cord]]"
location: "[[The Shrine of Melora]]"
status: active
processed: no
tags:
  - atomic
  - to-process
---

> [!info]- Essential Details
> - Location: [[The Shrine of Melora]]
> - Current Goal: Share [[What Radelia Knows|what she has learned]] with [[Rinneth Starsong]]
> - Last Updated: `$= moment(dv.current().file.mtime.toString()).format("MMM D, YYYY") + " (" + moment(dv.current().file.mtime.toString()).fromNow() + ")"`

# Current Activities
- Recently returned from Whitestone festival via the [[Sessions 1 to 3 - The Skyship|Unshaken]]
- Was selling exotic Cithrel Textiles fabrics and garments at the festival
- Followed [[Aethor Kalisk]] around [[Port Damali]]
- Now stationed at [[The Shrine of Melora]] to report to the [[Malachite Cord]]

# Immediate Plans
- Recover [[Radelia's Leather Satchel]]
- Return home to Odessloe

# Goals
- Primary: Support [[Rinneth Starsong]] in opposing the [[Obsidian Echoforge]]
- Secondary: Maintain and grow her textile business as cover for [[Malachite Cord]] activities

# Relationships
- Member of the [[Malachite Cord]] (high-ranking)
- Works closely with [[Rinneth Starsong]]
- Recently observed [[Aethor Kalisk]]

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