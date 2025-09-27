---
type: npc
faction: 
  - [[Obsidian Echoforge]]
  - [[Emissaries of the Sunfall]] 
location: [[Port Damali]]
status: active
processed: yes
tags:
  - npc
race: Tiefling
---
# Quick Reference
> [!info] Essential Details
> - Current Location: [[Port Damali]] (The [[Sunset Sail]])
> - Key Motivation: Pursue knowledge of planar magic beyond conventional limits
> - Attitude toward party: Neutral (unaware)
> - Critical Knowledge: Double agent working with [[Dreyara Drimvar]] while posing as [[Obsidian Echoforge]] member
> - Status: Active spy gathering intelligence on [[Aethor Kalisk]]'s movements

# Description
![[calderax-dunhall-token.png|right|200]] A lavender-skinned tiefling with delicate horns that curve back along his skull, Calderax carries himself with a studied sophistication that never quite lands as natural. Despite his impressive height, there's something of the anxious scholar in his posture, especially when he's not actively trying to appear composed. His expensive clothes are clearly chosen to project an image of success and refinement, but they're just slightly out of fashion, suggesting someone who studied what to wear rather than inherently knowing. His tail, which he tries to keep still in formal situations, tends to betray his emotions by twitching or curling when he's excited or nervous.

His face has sharp, aristocratic features that could be striking if not for his tendency to appear slightly uncomfortable in his own skin. When discussing magical theory or arcane research, his careful facade cracks, revealing an eager enthusiasm that transforms him completely - his tail swishes animatedly, his eyes light up, and he speaks with genuine passion rather than affected sophistication.

## Roleplay
- Voice: Carefully modulated to hide any natural accent, speaks with precise diction that occasionally slips when excited
- Mannerisms:
  - Adjusts his clothes constantly when nervous
  - Tail movement betrays his emotions despite his best efforts
  - Uses overly formal language that sometimes feels rehearsed
  - Tends to speak in half-finished sentences when discussing magical theory
  - Frequently checks and adjusts his brass pocket watch
- Notable Traits:
  - Tries too hard to appear sophisticated
  - Genuine enthusiasm for magical theory
  - Obvious attraction to [[Dreyara Drimvar]] that he tries to hide
  - Anxious energy beneath careful composure

# Current Situation
Currently residing above The [[Sunset Sail]] tavern in [[Port Damali]], maintaining his cover as a traveling scholar while serving as [[Dreyara Drimvar]]'s spy. Primary mission is to monitor [[Aethor Kalisk]]'s movements and delay [[Obsidian Echoforge]] attempts to acquire new shards. Possesses a letter containing information about a [[Lorestone of Eryndor|Lorestone Shard]], which has led to the current situation involving the [[Stonefoot Compass]].

# Background
![[calderax-dunhall.jpeg|right|300]] Studied at a small academy in [[Zadash]] before moving to [[Port Zoon]] to pursue independent research on planar anomalies, which eventually led to his recruitment by the [[Obsidian Echoforge]]. Joined the [[Obsidian Echoforge]] about a year ago as a junior researcher in their archives division. Became [[Aelorin Nightshade]]'s mentee approximately 2-3 months ago, presenting himself as an eager scholar interested in specialized magical theory. Shortly after beginning his mentorship with [[Aelorin Nightshade]], he was recruited by [[Dreyara Drimvar]], who recognized his potential value as an informant and manipulated his attraction to her to secure his loyalty.

# Hidden Information
> [!secret]- DM Only
> - Secretly working for [[Dreyara Drimvar]] while pretending to serve the [[Obsidian Echoforge]]
> - Has unrequited romantic feelings for [[Dreyara Drimvar]]
> - His mentorship with [[Aelorin Nightshade]] is a cover for gathering intelligence
> - Currently tracking [[Aethor Kalisk]]'s movements for [[Dreyara Drimvar]]
> - Possible underlying resentment toward some [[Obsidian Echoforge]] members due to subtle prejudice about his tiefling heritage
> 
> ## Personal Effects
> Carries a brass pocket watch with an intricate celestial design that he constantly checks and adjusts. The watch becomes a telling indicator of his stress levels despite his attempts to appear casual about checking it.

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
