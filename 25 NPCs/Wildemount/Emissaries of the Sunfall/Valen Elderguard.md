---
processed: yes
tags:
  - npc
  - antagonist
type: npc
location: Rexxentrum
race: Half-elf
class:
  - Sorcerer
  - Paladin
affiliations:
  - "[[Emissaries of the Sunfall]]"
  - "[[The Inkwell]]"
aliases:
  - valen
status: active
---
# Quick Reference
> [!info] Essential Details
> - Current Location: Scroll and Scribe, Rexxentrum
> - Key Motivation: Seize control of the shards through any means necessary; restore the Emissaries to their former aggressive approach
> - Attitude toward party: Neutral (unaware of party)
> - Critical Knowledge: Working secretly with Vaud Qalix to undermine Emissary/Echoforge alliance
> - Status: Active leader of splinter cell within Emissaries

![[valen-elderguard.png|right|300]]
# Description
A tall, wiry half-elf with an asymmetrical hairstyle - long raven-black hair tossed to one side, shaved short on the other with a geometric tattoo on his temple. Despite what most would consider an ugly face, his outward demeanor is pleasant and inviting. He favors deep maroon robes with black and brown trim, decorated with subtle arcane patterns.

## Roleplay
- Voice: Calm, smooth, and eerily captivating. Speaks with measured precision, choosing words carefully. Maintains an academic's thoughtful tone.
- Mannerisms: 
  - Tends to steeple fingers when making important points
  - Maintains uncomfortably direct eye contact during conversations
  - Often references historical texts and scholarly works
  - Gestures precisely and economically, no wasted movements
- Notable Traits:
  - Projects an air of reasonable authority
  - Masks forceful opinions behind academic discourse
  - Shows genuine enthusiasm for magical theory and research
  - Treats subordinates with apparent respect while subtly manipulating them

# Current Situation
Operating primarily from two locations in Rexxentrum: the Scroll and Scribe for legitimate Emissary business, and a townhouse in the Pearls' Rest district for splinter cell activities. The townhouse serves as the primary meeting place for the Inkwell, appearing outwardly as a wealthy scholar's residence. Currently investigating an old prophecy through his agent [[Eledyr Dephar]].

# Background
Comes from the Elderguard family, known for shadow magic prowess. Rose to prominence within the Emissaries of the Sunfall but grew disillusioned with their diplomatic approach. Secretly believes in returning to the more aggressive methods of Neris Solbane's era. Has begun gathering like-minded members within the Emissaries, forming a splinter cell financed by Vaud Qalix.

# Hidden Information
> [!secret]- DM Only
> - Secret motivations: Believes power and control are the only reliable means of securing peace
> - Unknown connections: 
>   - Reports directly to [[Vaud Qalix]]
>   - Has recruited [[Eledyr Dephar]] using Clasp connections
> - Operations:
>   - Orchestrated failed skyjacking of the *Unshaken*
>   - Targeting [[Aethor Kalisk]] and [[Obsidian Echoforge]] operations
> ## Meeting Locations
> - Public/Legitimate: Scroll and Scribe, used for Emissary business and occasional quiet recruitment
> - Secret: Three-story townhouse in Pearls' Rest district
> 	- Cover: Private residence of a wealthy scholar
> 	- Basement converted for secure meetings
> 	- Maintains appearance of normal household
> 	- Location well-removed from Scroll and Scribe
> ## Splinter Cell Code Language ("The Inkwell")
> The cell uses terminology related to writing, inks, and magical scribing as code:
> - "[[The Inkwell]]" - The splinter cell itself (representing the source of their power)
> - "Master scribe" - Cell leader (Valen)
> - "Prime pigment" - Primary target
> - "Mixed ink" - Compromised situation
> - "Fresh batch" - New operation
> - "Quality test" - Surveillance
> - "Blotting" - Cleanup/covering tracks
> - "Private commission" - Covert operation
> - "Workshop" - Meeting location
> - "Sealed document" - Sensitive information
> - "Color sample" - Initial reconnaissance
> - "Binding agent" - Key resource or ally
> - "Preservation" - Protecting assets/people
> - "Special order" - High-priority target
> - "Disposal" - Elimination of a threat
> - "Spoiled batch" - Compromised agent/operation
> - "Formula" - Operation plan
> - "Certification" - Clearance/authorization
> 
> Example: "The prime pigment needs a quality test before the fresh batch" = "The primary target needs surveillance before the new operation"

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
