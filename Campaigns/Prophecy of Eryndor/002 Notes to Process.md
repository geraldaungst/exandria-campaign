---
processed: yes
tags: []
---
# Notes Without Process Tag

```dataview
LIST
FROM "05 General Plans" OR "10 The Party" OR "19 Factions" OR "21 Opponents" OR "25 NPCs" OR "60 Locations" OR "90 Session Notes"
WHERE !processed OR (contains(processed, "no") AND !contains(tags, "to-process"))
```
# Notes Out of Sync

```dataview
LIST
FROM #to-process 
WHERE contains(processed, "yes")
```
# Notes Unprocessed (Check tag)
```dataview
LIST FROM #plot     
WHERE processed = "no"
```
# Notes needing attention

```dataview
LIST
WHERE processed = "pending"
```
