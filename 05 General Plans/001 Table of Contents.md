---
processed: yes
tags: 
---
## Characters
```dataview
TABLE WITHOUT ID
  file.link as "Character Name",
  player as "Player",
  hp as "HP",
  ac as "AC",
  pasperc as "Passive Perception",
  race as "Race",
  class as "Class"
FROM #player 
where (status = "Active")
```

## NPCs

[[00 NPC Map.canvas|Click Here for graphic NPC Map]]
```dataview
LIST rows.Summary
FROM #npc
FLATTEN affiliations
FLATTEN file.link + " (" + race + " " + class + ")" as Summary
SORT affiliations, Name
GROUP BY affiliations
```
## NPCs by Profession
```dataview
LIST rows.Summary
FROM #npc
FLATTEN class
FLATTEN file.link + " (" + race + ", " + affiliations + ")" as Summary
SORT class, Name
GROUP BY class
```

# Vestiges of Divergence
(checked items have been found)

![[20 Character Story Beats#Vestiges Found]]