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
> - Also known as the Tyrant of the Ebonglass.
> - Current Location: Corrupted temple complex in buried dwarven stronghold of Xagonstar, Ebonglass Massif, Blightshore
> - Key Motivation: Establish sovereignty, collect corrupted artifacts proving his intellectual superiority
> - Attitude toward party: Initially curious, dismissive, manipulable through flattery
> - Critical Knowledge: [[Rupture of the Molaesmyr Fey Crossing]], [[Lorestone of Eryndor]]
> - Status: Reigning over thralls in Xagonstar

# Description

Adult black dragon (~350 years old) with pitch-black iridescent scales. Several scales along his crest artificially corroded into dwarven rune patterns. Eyes gleam with acidic yellow-green intelligence. Wears modified corroded dwarven crown. Emits sharp acrid scent that intensifies with agitation.

## Roleplay

- Voice: Deep resonant with acidic rasp, uses unnecessarily complex vocabulary, professorial tone
- Mannerisms: Head tilting when evaluating, rhythmic claw tapping when thinking, raises crest when challenged
- Notable Traits: Intellectual arrogance, misinterprets evidence to support theories, fascination with corruption, susceptible to flattery about intelligence

# Current Situation

Rules "kingdom" of corrupted thralls in Xagonstar with elaborate court structure. A planar rift to the Abyss nearby continues corrupting the area—a process he claims to control but doesn't understand. Recently sending thralls to gather information about other "sovereign powers" and similar black stone artifacts. Currently "enhancing" dwarven architecture with acid, unknowingly destabilizing the structure.

# Background

- Born ~485 PD in Eastern Wynandir
- Witnessed aftermath of Molaesmyr's fall (~585 PD)
- At age 100 (~535 PD), defeated corrupted copper dragon Malastryx through exploiting her madness with paradoxical riddles
- Acquired Lorestone shard from Malastryx's hoard (originally from sunken ship Consecution's Hope)
- Discovered and claimed Xagonstar as lair (~500 PD)
- Established "sovereign court" with corrupted thralls
- Core Trait: "Subjugating others is preferable to destroying them. Thralls make life so much more pleasant."
- Ideal: Envy (particularly of respected dragons and ancient civilizations)

# Hidden Information

> [!secret]- DM Only
> 
> - Lorestone shard subtly affecting his mind, feeding sovereignty obsession
> - Misinterprets prophecy line "In the abyss, a beacon bright, its fate a mysterious stone" as referring to himself
> - Planar rift growing unstable due to his experiments
> - One thrall secretly a trapped Kryn agent who discovered hints about the lost shard
> - Possesses crucial insights about Molaesmyr's initial corruption, buried in self-aggrandizing accounts
> - Plans to expand territory using corrupted thralls to infiltrate nearby settlements, starting with Rotthold
> - Acid damage to Xagonstar inadvertently exposing sealed dwarven vault containing planar research artifacts

# Evidence in Rotthold

Information about Shoagragoth and Malastryx that has survived in Rotthold:

1. **Harbormaster's Logs**: Entries from ~535 PD mention copper-colored lights from northern hills, followed by black smoke and acid rain a month later.
2. **Thesra Moonfall**: Corrupted half-elven antiquarian who witnessed the draconic confrontation, keeps half-copper/half-blackened scale, rambles about "the night of riddles" and "backward answers to impossible questions."
3. **Scavenger's Guild Records**: Old ledger blacklisting "Copper's Folly" after salvage teams disappeared; journal describes corridors that change direction and speaking riddles.
4. **Corrupted Shrine**: Shrine built by witnesses showing copper serpentine figure surrounded by swirling patterns and a crowned black dragon figure. Hidden documents describe Malastryx's bizarre behavior.
5. **"Copper's Last Riddle"**: Popular tavern song about a "dragon of jokes turned sour" defeated by a "shadow with acid tongue" using "mirror words and backward thoughts."
6. **Expedition Report Fragment**: Recovered from deceased smuggler, describes Dynasty expedition seeking Consecution's Hope but diverted from area with "mad copper terror" that collected "shiny black stones."

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
