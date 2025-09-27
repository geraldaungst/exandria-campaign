---
processed: no
tags:
  - location
  - to-process
type: location
aliases: 
status: 
region: 
controlling_faction: 

notable_npcs: 
key_items: 
plot_significance: 
last_visited: [[Session 11]]
first_appeared: [[Session 9]]
---

# Location Name

## Quick Reference
> [!info] Essential Details
> - Current Status:
> - Key Feature:
> - Atmosphere:

## Description
### External
Atop a hill east of Port Damali, the shrine is a mix of ancient reverence and recent alterations. Weathered stone pillars, etched with vines and flowing water, form a circle around a central granite altar. Among the natural carvings, new celestial symbols—stars, crescents, and a sunburst—have been added. A faint shimmer distorts the air near the shrine’s edge, a small rift monitored by robed figures from the Malachite Cord, who move between the pillars, performing quiet rituals. A soft, flickering green light emanates from a silver lantern hanging at the entrance, casting long shadows in the daylight.

## Notable Features
- Celestial symbols
- [[Rift Size Table|Small Rift]] (reduced in size via [[Soulwood Riftcage|Riftcage]]) to the Elemental Plane of Fire

## Current Situation

## Secrets & Clues
> [!secret]- DM Only
> 

## Connected Elements
### NPCs
```dataview
LIST
FROM #npc
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```
### Places
```dataview
LIST
FROM #location
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```
### Items
```dataview
LIST
FROM #artifact 
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```
### Related Plot Threads
```dataview
LIST
FROM #plot 
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```


[[Radelia's Leather Satchel]]
# Simplified Description:

The shrine to Melora has recently seen new additions made by the Malachite Cord, a group blending natural and celestial symbolism. The ancient stone pillars, carved with symbols of nature, now also bear celestial engravings. At the shrine's edge, a small, expanding rift is monitored closely by the Cord’s members, who conduct rituals to stabilize it. They aim to cleanse the site while rededicating it to their patron, the Aurora’s Ascendant.

# Key Features:
- **Stone Circle**: Half the pillars remain adorned with nature-based carvings of vines and animals. The others now bear celestial motifs like stars and a rising sun. 
- **Rift Monitoring**: A small rift, marked by shimmering air, is surrounded by arcane wards (runes on stone). The Malachite Cord is attempting to siphon the rift energy into a [[Soulwood Riftcage]].
- **Celestial Additions**: A new stone plinth near the altar bears an image of Seraphina Amaris, the Cord’s celestial icon, alongside a softly glowing lantern.
- ![[malachite-cord.png]]

# NPCs Present
Malachite Cord members present here:
[[Rinneth Starsong]]
[[Radelia Caphax]]
[[Kael Dren'eth]]

## Others:
1. Quorri Galesong (Aarakocra Scout):
	A former messenger for a sky city, Quorri joined the Malachite Cord after witnessing the corruption's effects on their ancestral nesting grounds. They are observant and cautious, often serving as the group's eyes in the sky. Interestingly, Quorri once delivered a message to a reclusive archmage that inadvertently prevented a magical catastrophe, though they remain unaware of this fact.
	Roleplaying Note: When playing Quorri, emphasize their restlessness on the ground. Have them constantly shifting, looking upward, or perching on high points whenever possible.
2. Lirael Brightriver (Female Human Scout):
	Lirael is a former city guard from Rexxentrum who became disillusioned with urban life and found solace in nature. She's pragmatic and level-headed, often serving as a voice of reason in tense situations. Recently, she's been spending more time with Samir, finding his intellectual curiosity a refreshing change from her former life. Unknown to most, Lirael comes from a long line of monster hunters and still carries her great-grandmother's silver dagger.
	Roleplaying Note: Have Lirael occasionally fall back on city guard protocols or jargon, then catch herself and rephrase in more casual terms.
3. Vren Kosselheim (Male Goliath Scout):
	Once a nomadic herder, Vren joined the Malachite Cord after his clan's grazing lands were tainted by strange energies. He's stoic and protective, using his intimidating presence to safeguard his companions. Vren has a hidden talent for intricate needlework, a skill he learned from his clan's storyteller to help record their oral histories in tapestries.
	Roleplaying Note: When Vren speaks, use short, direct sentences. In moments of stress or emotion, have him unconsciously reach for a small pouch where he keeps his needlework supplies.
4. Samir Nasim (Male Human Scout):
	A scholar turned adventurer, Samir was drawn to the Malachite Cord by the mystery of the rifts. He's curious and analytical, always eager to learn more about the phenomena they encounter. Lately, he's been finding excuses to partner with Lirael on scouting missions, drawn to her practical wisdom and fresh perspective on the natural world. As a child, Samir once stumbled upon a hidden library in [[Zadash]], where he read a single page from a book of prophecies before being discovered and escorted out.
	Roleplaying Note: Have Samir frequently use academic analogies or references in conversation, often needing to explain them to the rest of the group.
5. Elias Thornheart (Male Firbolg Druid):
	Elias is a long-time member of the Malachite Cord, having known Rinneth before the group's formation. He's wise and patient, often serving as a mentor to newer members and a confidant to Rinneth. In his youth, Elias once communed with a dying treant, gaining profound insights into the long memory of the forest that he's still processing to this day.
	Roleplaying Note: When Elias speaks, describe how nearby plants seem to lean towards him. Have him occasionally pause mid-sentence, as if listening to something only he can hear.
6. Poppy Underhill (Female Halfling Druid):
	Poppy is a cheerful and optimistic herbalist who joined the group after her village was affected by strange plant growths. She's nurturing and resourceful, always ready with a healing poultice or encouraging word. Poppy has a unique ability to communicate with fungi, a gift she discovered by accident while foraging as a child, which has proven unexpectedly useful in the group's missions.
	Roleplaying Note: Have Poppy habitually check the ground for interesting fungi wherever the group goes. When she's thinking, describe her absent-mindedly twirling a mushroom between her fingers.

---

# Encounter

Scouts will most likely see the party first. They will approach with caution but are not aggressive. "You are seen, stranger; tread with care, for the land remembers. What is your purpose here?"

## At the Shrine

The shrine is a mix of ancient and new: natural carvings of Melora’s symbols alongside newly added celestial motifs. The **green lights** swirl around a small rift near the shrine, where the **Malachite Cord** performs rituals in an attempt to stabilize it.
## Immediate Scene (Boxed Text)
> "Amidst the weathered stone pillars, robed figures chant softly. Some sprinkle herbs and blessed water around the stone circle, while others trace new celestial symbols into the pillars. At one edge of the shrine, a faint, shimmering green light distorts the air around it."

---

## **Options for Player Interaction**

1. **Observe from Afar**
   - **Stealth Check** (DC 15) to observe undetected.
   - The party sees **Radelia** speaking urgently with a Cord leader. She appears anxious but doesn’t notice the party. 
     - **Insight Check** (DC 14): Radelia is hiding something, but it’s unclear if she’s fully aligned with the group.
     - The Cord members’ **rituals seem strained**; the rift pulses unnervingly.

2. **Confront Radelia**
   - The party can approach openly and confront Radelia, who acts surprised to see them. She explains she’s trying to "restore balance" to the shrine, claiming it’s for the greater good.
   - **Persuasion/Deception Check** (DC 12) allows her to convince them to stay and observe. Failure raises their suspicions—her association with the Cord feels questionable.

3. **Examine the Rift**
   - **Arcana Check** (DC 15) reveals that the Cord’s rituals are unstable and may **backfire**.
   - The rift shimmers dangerously, and the runes used by the Cord seem improperly placed.
     - If the party gets close, they sense something **otherworldly** from beyond the rift.

---

## **Randomized Events and Complications**

Use these events to adjust the encounter's tension. Roll a d6 every 10 minutes of game time or after a key player action.

#### 1. Rift Creature Emergence  
A creature **slips through the rift** as the stabilization falters:
- **Small aberration** or **fey creature** appears, confused and hostile (pick CR suitable for your group).
  - Cord members scramble to contain it. The party can help or hinder.
  
#### 2. Ritual Failure  
One of the Cord members miscasts a stabilizing spell, causing the rift to **surge violently**, throwing everyone back. 
- **Dex Save** (DC 13) to avoid injury.
  - The party may need to step in to **prevent a full rift collapse** using their own magic or ingenuity.

#### 3. Natural Chaos  
The unnatural weather intensifies—**lightning strikes the shrine**, or a **gust of wind** tears through the area, disrupting the ritual.
  - The party can try to stabilize the shrine (Survival/Nature checks) or leave as the Cord’s control unravels.

#### 4. Cord Leader Conflict  
A **disagreement** erupts between Cord members about how to proceed with the ritual. Some seem uncertain about continuing. This opens an opportunity for the party to **intervene** and sway the group’s decision.

#### 5. Faint Whispering Through the Rift  
The rift begins to emit **eerie whispers** that only those with high Arcana or Insight can hear. The party may sense it’s linked to the Obsidian Echoforge’s warnings about dangerous magic.
  - If they investigate further, they might learn clues about the Cord's **true intentions**.

#### 6. Temporary Rift Stabilization  
The Cord’s ritual **succeeds temporarily**, and the rift’s light dims. However, the party feels a deep sense of unease—it’s unclear if the rift is truly safe. The Cord invites them to leave, but the party may **press for answers** or offer their own help.

---

## **Ending Options**

- **If the Party Aids the Cord**: They help stabilize the rift or protect the shrine, potentially forging a temporary alliance. However, their unease remains, and Radelia’s connection to the group raises questions.
- **If the Party Opposes or Distrusts the Cord**: They could disrupt the ritual or confront Radelia, leading to a fight or heated argument. The Cord might retreat, leaving the rift unstable.
- **If the Rift Destabilizes**: A larger **rift event** occurs, leading to chaos as more creatures pour through or the shrine begins to collapse. The party must decide whether to save the shrine or leave the Cord to their fate.

