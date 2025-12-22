---
type: npc
location: Port Damali
status: active
processed: yes
aliases:
  - Yara
  - Dreyara
  - Vessa Blackthorn
race: Human
class:
  - Rogue
tags:
  - npc
---
![[dreyara-token.png|right|300]]

# Quick Reference
> [!info] Essential Details
> - Current Location: Port Damali
> - Alias: Vessa Blackthorn
> - Key Motivation: Serve Qalix's interests and maintain her position of power and freedom
> - Attitude toward party: Neutral (has not encountered them)
> - Critical Knowledge: Former Volstrucker agent turned spymaster for Qalix; tasked with stealing shard from Rexxentrum Archive
> - Status: Active, seeking Myriad support for Rexxentrum heist

# Description
A woman in her early thirties with fair skin, her dark brown hair pulled back into a practical braid, revealing a faint scar under her left eye. Her piercing green eyes observe keenly, reflecting a mixture of intensity and hidden depths. She wears a fitted, high-collared tunic in dark green, paired with reinforced leather pants and knee-high boots. Strapped to her arm is her dagger, seemingly intended as an ominous and open threat.

## Roleplay
- Voice: Precise and measured, with a hint of Rexxentrum accent she hasn't fully shed
- Mannerisms:
  - Maintains direct eye contact when speaking
  - Unconsciously touches the scar under her left eye when thinking
  - Keeps her hands visible but near her weapons
  - Moves with deliberate economy, no wasted gestures
- Notable Traits:
  - Projects an aura of controlled danger
  - Speaks with calculated honesty when lying would serve no purpose
  - Shows professional respect for competence
  - Never fully relaxes, always maintaining situational awareness

# Current Situation
Operating in Port Damali, working to secure Myriad support for a planned heist of the Rexxentrum Archive. Maintains her role as Qalix's spymaster while pursuing this specific objective. Current focus is on building the necessary connections and resources for the Archive operation.

# Background
![[dreyara.jpeg|right|300]]

1. Origins & Early Career
	- Born near Rexxentrum
	- Recruited young into the Volstrucker (Cerberus Assembly's secret police)
	- Became one of their top agents, specializing in espionage and assassination

2. Critical Turning Point
	- Empire sent her to assassinate Vaud Qalix
	- Despite careful planning and infiltration, she failed and was captured
	- Instead of executing her, Qalix offered her a position
	- Already disillusioned with Volstrucker's methods and motives
	- Saw opportunity for respect and autonomy in Qalix's organization
	- Made calculated decision based on more than just survival

3. Current Role
	- Serves as Qalix's spymaster
	- Manages a network of spies across Exandria
	- Successfully led multiple covert operations
	- Particularly valuable due to her inside knowledge of Empire/Volstrucker operations

Full details: [[Dreyara Drimvar's Background]]

### Key Contributions and Impact
1. Intelligence Network: Leveraging her extensive training and experience, Dreyara has established a sophisticated network of spies across Exandria, gathering vital information on the movements and plans of their enemies.
2. Strategic Planning: Her ability to think several steps ahead and anticipate potential threats has allowed Qalix to stay one step ahead of his adversaries, including the Dwendalian Empire and the Clasp.
3. Execution of Covert Operations: Under her direction, numerous high-stakes missions have been carried out successfully, including the acquisition of rare artifacts and the elimination of key opposition figures.

# Hidden Information
> [!secret]- DM Only
> - The dagger given to her by Qalix is actually the Blade of Maroth Fenn
> - Still maintains some old Volstrucker contacts who don't know her current allegiance
> - Her loyalty to Qalix, while genuine, is based on respect and opportunity rather than true belief in his cause
> - Her knowledge of Volstrucker operations and methods represents a significant security risk to the Empire

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
