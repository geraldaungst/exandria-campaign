---
aliases:
  - Yara
  - Dreyara
  - Vessa Blackthorn
location: Port Damali
tags:
  - npc
  - needs-work
---

![[dreyara-token.png|right|300]]

## Quick Reference

> [!info] Essential Details
> - Current Location: Port Damali
> - Alias: Vessa Blackthorn
> - Key Motivation: Serve Qalix's interests and maintain her position of power and freedom
> - Attitude toward party: Neutral (has not encountered them)
> - Critical Knowledge: Former Volstrucker agent turned spymaster for Qalix; tasked with stealing shard from Rexxentrum Archive
> - Status: Active, seeking Myriad support for Rexxentrum heist

## Description

A woman in her early thirties with fair skin, her dark brown hair pulled back into a practical braid, revealing a faint scar under her left eye. Her piercing green eyes observe keenly, reflecting a mixture of intensity and hidden depths. She wears a fitted, high-collared tunic in dark green, paired with reinforced leather pants and knee-high boots. Strapped to her arm is her dagger, seemingly intended as an ominous and open threat.

### Roleplay

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

## Current Situation

Operating in Port Damali, working to secure Myriad support for a planned heist of the Rexxentrum Archive. Maintains her role as Qalix's spymaster while pursuing this specific objective. Current focus is on building the necessary connections and resources for the Archive operation.

### Key Contributions and Impact

1. Intelligence Network: Leveraging her extensive training and experience, Dreyara has established a sophisticated network of spies across Exandria, gathering vital information on the movements and plans of their enemies.
2. Strategic Planning: Her ability to think several steps ahead and anticipate potential threats has allowed Qalix to stay one step ahead of his adversaries, including the Dwendalian Empire and the Clasp.
3. Execution of Covert Operations: Under her direction, numerous high-stakes missions have been carried out successfully, including the acquisition of rare artifacts and the elimination of key opposition figures.

> [!note]- Myriad Contacts in Port Damali
> Dreyara is cultivating alliances with the [[Myriad]] in [[Port Damali]] on Qalix's behalf. Key targets:
> - **[[Father Dwondaff Pierce]]**—head of the Pearl Shrine, contact for [[Korfel Withrethin|the Gentleman]]. Can provide safe havens, moral/social influence, and access to religious community resources.
> - **Lord Gabriel Rymmer**—manager of the Exalted Collection Auction House, Rymmer family. Can provide financial resources and black market access for rare artifacts.
> 
> Approach: offers tangible proof of Qalix's resources (enchanted items, gold), demonstrates commitment by orchestrating operations against rival factions.

## Hidden Information

> [!secret]- DM Only
> - The dagger given to her by Qalix is actually the Blade of Maroth Fenn
> - Still maintains some old Volstrucker contacts who don't know her current allegiance
> - Her loyalty to Qalix, while genuine, is based on respect and opportunity rather than true belief in his cause
> - Her knowledge of Volstrucker operations and methods represents a significant security risk to the Empire

> [!note]- Background
> Born near Rexxentrum. Recruited young into the Volstrucker (Cerberus Assembly's secret police); became one of their top agents specializing in espionage and assassination. Growing disillusionment set in as she discovered missions served political vendettas rather than Empire security—the final straw was learning one of her successful assassinations was orchestrated to cover Assembly corruption.
>
> Tasked with assassinating [[Vaud Qalix]]. Spent months infiltrating his organization, but was captured during the attempt. Qalix offered her a position instead of execution. During her surveillance she'd observed how he treated followers—with respect, clear purpose, and genuine recognition. She saw the offer as an opportunity for the autonomy the Volstrucker never provided. Her loyalty is genuine but pragmatic: based on respect and opportunity, not true belief in his cause.
>
> ![[dreyara.jpeg|right|300]]

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
