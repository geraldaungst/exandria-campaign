---
type: npc
faction: 
location: 
status: active/inactive/deceased
processed: no
tags:
  - npc
  - to-process
---
# Quick Reference
> [!info] Essential Details
> - Current Location: [[Ilya's Realm Shop]]
> - Key Motivation: 
> - Attitude toward party: 
> - Critical Knowledge: Link to knowledge note
> - Status: Link to status note

# Description
Ilya was an adventurer sorcerress who quested Exandria before retiring to Port Damali. She has multiple items of her time adventuring, which she sells as well as maintaining a business: [[Ilya's Realm Shop]]. She is a 20th level sorceress with dragon's blood.

## Roleplay
- Voice:
- Mannerisms: Chatty and borderline creepy.
- Notable Traits: Unfearing of burglars. Rumor has it that when some people tried to rob her, their bodies were found in front of her shop with the skin melted off.

# Current Situation
Transclude Status Note here

# Background
Transclude Background note here
- Key history points
- Important events

# Statistics
_Medium humanoid (any race), neutral good_

---

**Armor Class** 16 (Mage Armor, active at all times)  
**Hit Points** 142 (20d6 + 60)  
**Speed** 30 ft., fly 60 ft. (with metamagic)

---

|STR|DEX|CON|INT|WIS|CHA|
|---|---|---|---|---|---|
|10 (+0)|16 (+3)|16 (+3)|14 (+2)|12 (+1)|22 (+6)|

---

**Saving Throws** Con +9, Cha +12  
**Skills** Arcana +8, Deception +12, Insight +7, Persuasion +12  
**Damage Resistances** Fire  
**Senses** passive Perception 11  
**Languages** Common, Draconic, Celestial, Infernal, Abyssal  
**Challenge** 16 (15,000 XP)

---

## Traits

_**Draconic Ancestry.**_ Ilya has draconic ancestry that grants her resistance to Fire damage.

_**Legendary Resistance (3/Day).**_ If Ilya fails a saving throw, she can choose to succeed instead.

## Actions

_**Multiattack.**_ Ilya makes three Arcane Blast attacks.

_**Arcane Blast.**_ _Ranged Attack Roll:_ +12, range 120 ft. _Hit:_ 28 (4d10 + 6) Fire damage.

_**Dagger.**_ _Melee or Ranged Attack Roll:_ +9, reach 5 ft. or range 20/60 ft. _Hit:_ 5 (1d4 + 3) Piercing damage.

_**Meteor Storm (1/Day).**_ _Dexterity Saving Throw:_ DC 20, each creature in four 40-foot-radius Spheres, each centered on a point Ilya can see within 1 mile. _Failure:_ 70 (20d6) Fire damage plus 70 (20d6) Bludgeoning damage. _Success:_ Half damage.

_**Spellcasting.**_ Ilya casts one of the following spells, using Charisma as the spellcasting ability (spell save DC 20, +12 to hit with spell attacks): **At Will:** _Charm Person_, _Counterspell_, _Mage Armor_ (included in AC), _Mage Hand_, _Magic Missile_, _Misty Step_, _Prestidigitation_, _Shield_ **2/Day Each:** _Dimension Door_, _Fireball_ (deals 10d6 fire damage), _Greater Invisibility_ **1/Day Each:** _Chain Lightning_, _Disintegrate_, _Dominate Monster_, _Incendiary Cloud_, _Teleport_, _Wish_

## Bonus Actions

_**Enhanced Spell (Recharge 5–6).**_ Ilya enhances the next spell she casts before the end of her turn in one of the following ways:

- The spell's range is doubled
- One target has Disadvantage on its first saving throw against the spell
- The spell requires no somatic or verbal components
- If the spell targets only one creature, Ilya can target a second creature within range with the same spell

## Reactions

_**Protective Magic (3/Day).**_ Ilya casts _Counterspell_ or _Shield_ in response to the spell's trigger, using the same spellcasting ability as Spellcasting.

## Legendary Actions

_**Legendary Action Uses: 3. Immediately after another creature's turn, Ilya can expend a use to take one of the following actions. Ilya regains all expended uses at the start of each of her turns.**_

_**Cantrip.**_ Ilya uses one of the following cantrips:

- _Fire Bolt:_ Ranged spell attack: +12 to hit, range 120 ft., one target. Hit: 22 (4d10) fire damage.
- _Mage Hand:_ Ilya creates a spectral hand that can manipulate an object, open an unlocked door or container, or retrieve an item within 30 feet.
- _Minor Illusion:_ Ilya creates a sound or an image of an object within 30 feet that lasts for 1 minute.
- _Prestidigitation:_ Ilya creates a minor magical effect such as lighting or snuffing out a small flame, cleaning an object, or creating a small sensory effect.
- _Message:_ Ilya whispers a message that only a creature of her choice within 120 feet can hear.

_**Arcane Step.**_ Ilya teleports up to 30 feet to an unoccupied space she can see.

_**Quick Spell (Costs 2 Actions).**_ Ilya uses one of the following spells:

- _Magic Missile:_ Three glowing darts automatically hit up to three creatures Ilya can see within 120 feet, dealing 10 (3d4+1) Force damage per dart.
- _Fireball:_ Dexterity saving throw: DC 20, each creature in a 20-foot-radius Sphere centered on a point within 120 feet. Failure: 28 (8d6) Fire damage. Success: Half damage.
- _Misty Step:_ Ilya teleports up to 30 feet to an unoccupied space she can see.
- _Charm Person:_ Wisdom saving throw: DC 20, one humanoid Ilya can see within 30 feet. Failure: The target is charmed by Ilya for 1 hour.
- _Mirror Image:_ Three illusory duplicates of Ilya appear, making it harder to target her with attacks.

## Lair Actions

When fighting in her shop, on initiative count 20 (losing initiative ties), Ilya can take one of the following lair actions:

_**Animated Items.**_ Ilya activates one magic item in her shop to create a magical effect appropriate to the item.

_**Collapsing Shelves.**_ _Dexterity Saving Throw:_ DC 15, each creature in a 10-foot-radius area. _Failure:_ 10 (3d6) Bludgeoning damage, and the area becomes difficult terrain until cleared. _Success:_ Half damage.

_**Protective Winds.**_ Swirling winds impose Disadvantage on ranged attack rolls against Ilya until initiative count 20 on the next round.

_**Shield Guardian.**_ Ilya summons a shield guardian from a back room. The guardian appears in an unoccupied space she can see within 30 feet of her and acts on her initiative.

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
