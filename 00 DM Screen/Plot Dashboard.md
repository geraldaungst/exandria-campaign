---
cssclasses:
  - wide-page
---
# Plot Manager

## Active Plots
```dataview
TABLE WITHOUT ID
file.link as "Plot",
filter(file.outlinks, (l) => contains(l.file.tags, "npc")) as "Connected NPCs",
filter(file.outlinks, (l) => contains(l.file.tags, "artifact")) as "Connected Items",
dateformat(file.mtime, "MM/dd/yyyy") as "Last Updated"
FROM #plot
WHERE plot_stage = "active"
SORT file.mtime DESC
```

## Paused Plots
```dataview
TABLE WITHOUT ID
file.link as "Plot",
filter(file.outlinks, (l) => contains(l.file.tags, "npc")) as "Connected NPCs",
filter(file.outlinks, (l) => contains(l.file.tags, "artifact")) as "Connected Items",
dateformat(file.mtime, "MM/dd/yyyy") as "Last Updated"
FROM #plot
WHERE plot_stage = "paused"
SORT file.mtime DESC
```

## Upcoming Plots
```dataview
TABLE WITHOUT ID
file.link as "Plot",
filter(file.outlinks, (l) => contains(l.file.tags, "npc")) as "Connected NPCs",
filter(file.outlinks, (l) => contains(l.file.tags, "artifact")) as "Connected Items",
dateformat(file.mtime, "MM/dd/yyyy") as "Last Updated"
FROM #plot
WHERE plot_stage = "upcoming"
```

## Plot Notes Needing Tag Updates
```dataview
LIST
FROM "/"
WHERE (contains(string(file.tags), "plot") OR type = "plot")
AND !plot_stage
```

## Plot Connections
### NPCs Involved in Active Plots
```dataview
LIST
FROM #npc
WHERE any(file.inlinks, (l) => l.type = "plot" and l.status = "active")
```

### Active Locations
```dataview
LIST
FROM #location
WHERE any(file.inlinks, (l) => l.type = "plot" and l.status = "active")
```

### Active Items
```dataview
LIST
FROM #artifact
WHERE any(file.inlinks, (l) => l.type = "plot" and l.status = "active")
```
