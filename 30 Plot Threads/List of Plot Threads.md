---
tags:
  - plot
  - to-process
  - exclude
processed: no
---

# Main Campaign Threads
1. **[[Restore Draconia]]**
2. **[[Assembling the Lorestone]]**
3. **[[Understanding the Rifts]]**
4. [[01 The Prophecy]]

# Side Quests
1. **[[Aethor Kalisk's Secret Mission]]**
2. **[[Cleanse the Savalirwood]]**
3. [[Search for the Stonefoot Compass]]
4. [[Rescue Ilya's Brother]]

# Character-Specific Goals
1. **[[Drawg Stormbrew's Dagger]]**
2. **[[Hesterian Shyr's Infiltration]]**
3. **[[Qilynn Duskwhisper's Revenge]]**
4. [[Delivering the Herbs]]

# Faction Activities
1. [[Obsidian Echoforge's Fragment Recovery]]
2. Malachite Chord: [[Preventing the Assembly of the Lorestone]]
3. Emissaries of the Sunfall: [[Create a Permanent Gate to the Far Realm]]

See also: [[Plot Thread Template]]

# All other Related Files
```dataview
TABLE 
  file.ctime as "Created",
  file.mtime as "Modified"
FROM 
  (#plot OR "30 Plot Threads") AND -#exclude
WHERE 
  !contains(this.file.outlinks, file.link)
SORT file.mtime DESC
```
