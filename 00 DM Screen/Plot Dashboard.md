---
cssclasses:
  - wide-page
---

## Plot Manager

### Active Plots

```dataview
TABLE WITHOUT ID
file.link as "Plot",
filter(file.outlinks, (l) => contains(l.file.tags, "npc")) as "Connected NPCs",
filter(file.outlinks, (l) => contains(l.file.tags, "artifact")) as "Connected Items",
dateformat(file.mtime, "MM/dd/yyyy") as "Last Updated"
FROM #plot/active
SORT file.mtime DESC
```

### Paused Plots

```dataview
TABLE WITHOUT ID
file.link as "Plot",
filter(file.outlinks, (l) => contains(l.file.tags, "npc")) as "Connected NPCs",
filter(file.outlinks, (l) => contains(l.file.tags, "artifact")) as "Connected Items",
dateformat(file.mtime, "MM/dd/yyyy") as "Last Updated"
FROM #plot/paused
SORT file.mtime DESC
```

### Seeded but Undeveloped Plots

```dataview
TABLE WITHOUT ID
file.link as "Plot",
filter(file.outlinks, (l) => contains(l.file.tags, "npc")) as "Connected NPCs",
filter(file.outlinks, (l) => contains(l.file.tags, "artifact")) as "Connected Items",
dateformat(file.mtime, "MM/dd/yyyy") as "Last Updated"
FROM #plot/seed
```

### Upcoming Plots

```dataview
TABLE WITHOUT ID
file.link as "Plot",
filter(file.outlinks, (l) => contains(l.file.tags, "npc")) as "Connected NPCs",
filter(file.outlinks, (l) => contains(l.file.tags, "artifact")) as "Connected Items",
dateformat(file.mtime, "MM/dd/yyyy") as "Last Updated"
FROM #plot/upcoming 
```

### Plot Notes Needing Tag Updates

```dataview
LIST
FROM "/"
WHERE econtains(file.etags, "#plot")
   OR type = "plot"
   OR (contains(file.tags, "plot/") AND contains(file.tags, "needs-work"))
```

### Plot Connections

#### NPCs Involved in Active Plots

```dataview
LIST
FROM #npc
WHERE any(file.inlinks, (l) => contains(l.file.tags, "plot/active"))
```

#### Active Locations

```dataview
LIST
FROM #location
WHERE any(file.inlinks, (l) => contains(l.file.tags, "plot/active"))
```

#### Active Items

```dataview
LIST
FROM #item
WHERE any(file.inlinks, (l) => contains(l.file.tags, "plot/active"))
```
