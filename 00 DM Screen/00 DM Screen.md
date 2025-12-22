---
processed: yes
cssclasses: wide
tags: []
---

> [!info] Active Plot Threads
> Click here for entire [[Plot Dashboard]]
> ```dataview
TABLE WITHOUT ID
file.link as "Plot",
filter(file.outlinks, (l) => contains(l.file.tags, "npc")) as "Connected NPCs",
filter(file.outlinks, (l) => contains(l.file.tags, "artifact")) as "Connected Items",
dateformat(file.mtime, "MM/dd/yyyy") as "Last Updated"
FROM #plot 
WHERE plot_stage = "active"
SORT file.mtime DESC
> ```

> [!warning] Urgent Campaign Elements
> ```dataview
> LIST FROM #urgent
> ```

> [!note] Recent NPCs
>```dataview
> TABLE location, lastSeen
> FROM #npc
> SORT lastSeen desc
> LIMIT 5

> [!attention] Needs Review
> ```dataview
> LIST FROM #to-process 
> LIMIT 10
> ```

- [ ] [[Fast NPC + Picture]]
- [ ] [[Random Tavern]]
- [ ] [[Sources of Maps]]