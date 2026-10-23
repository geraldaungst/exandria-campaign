<%*
// ── Encounter note: name, campaign (sets world), place and factions, then writes the tags ──
// Tags: encounter, campaign/…, world/… (from the campaign note's world property), place/… (picked),
// region/… (copied from the place's location note), faction/… (checklist). No hand-filled properties.
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them.
const { C, ABORT, FACTION, slug, tagPath, fmOf, tagsOfFile, liveNotes, vocabulary, levels, dropParents, pickTag, pickFactions, childFolders,
  inWorldFilter, worldRegionEntries, campaignTagOf, campaignNotes, pickCampaign, campaignWorld, placeNoteFor, linkTo,
  findPath, ensureFolder, askTitle, discard, safeMove } = tp.user.dm_helpers(tp, Notice);


// 0. Name first
const title = await askTitle("Encounter");
if (!title) { await discard(); return; }

// 1. Campaign: from the campaign notes (tag campaign-hub); asked only when there is more than one.
if (!campaignNotes().length) { new Notice("No campaign note found (tag campaign-hub), so the encounter can't be filed."); await discard(); return; }
const campaign = await pickCampaign("Which campaign is this encounter for?");
if (!campaign) { await discard(); return; }
const campaignTag = campaignTagOf(campaign);
const worldName = campaignWorld(campaign);
const worldTag = worldName ? `world/${slug(worldName)}` : null;
if (!worldName) new Notice(`${campaign.basename} has no world property, so the encounter gets no world tag.`);

// 2. Place: places already used in the campaign's world, a new one, or none.
const inWorld = worldName ? liveNotes().filter(inWorldFilter(worldName)) : liveNotes();
const placeTag = await pickTag("place", "place", vocabulary("place", inWorld), "— no place (wilderness or roaming)", true, "Where does this encounter happen? (place tag)");
// The place's own location note (named like the tag's last part), and the region copied from it, else from any
// location note with this place tag (they share it).
const { note: placeNote, tagged } = placeNoteFor(placeTag, inWorld);
const regionTag = [placeNote, ...tagged].filter(Boolean).map((f) => tagsOfFile(f).find((t) => t.startsWith("region/"))).find(Boolean) ?? null;

// 3. Factions involved, enemies or allies: a checklist of the faction tags already used in this world.
const picked = await pickFactions(vocabulary(FACTION, inWorld), "Factions involved in this encounter: select an entry to check or uncheck it, then choose Done");

// 4. Tags, the Location line, and file location (the campaign folder's Encounters folder)
const tags = [
  C("tag_encounter", "encounter"), campaignTag, worldTag, regionTag,
  ...dropParents([placeTag, ...picked].filter(Boolean)),
].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
const locationLine = placeNote ? linkTo(placeNote) : "<!-- Link the place, e.g. [[Port Damali - DM Notes|Port Damali]] -->";
await safeMove(`${campaign.parent.path}/Encounters`, title);
_%>
---
tags:
<% tagLines %>
---

# Encounter: <% title %>

## Setup

**Location:** <% locationLine %>

**What is this encounter for?**
<!-- Why does this encounter exist in the session? Pacing, resource drain, story beat, setpiece? -->

**Party objective:**
<!-- What do the players need to accomplish? If it's just "kill everything," add a secondary objective. -->

**Enemy objective:**
<!-- What do the enemies want? This determines their tactics. -->

---

## The Field

**Map/Environment:**
<!-- Describe or link the map. Note key terrain: cover, elevation, chokepoints, hazards. -->

**The one complication:**
<!-- Pick ONE: difficult terrain, environmental hazard, split attention, information gap, or other. -->

---

## Enemies

| Creature | Count | HP | AC | Key Action | Stat Reference |
|----------|-------|----|----|------------|----------------|
| | | | | | [[]] |
| | | | | | [[]] |

**Total enemy actions per round:**
**Does this survive the [[Encounter Design Guide#The Delete Test|Delete Test]]?** (Can the party end this in round 1 with ~120 focused damage?)

---

## Enemy Tactics

**Opening move:**
<!-- What do the enemies do in round 1? Where are they positioned? Are any hidden? -->

**Standing orders:**
<!-- Default behavior each round. Who do they target? Do they use cover? Do they focus fire or spread damage? -->

**Concentration pressure:**
<!-- Which enemy specifically threatens concentration? How? (multi-hit, area damage, grapple the caster?) -->

**Retreat/morale:**
<!-- When do they flee, surrender, or change tactics? What triggers this? -->

---

## The Shift

**What changes and when:**
<!-- What happens at round 2-3 to change the tactical picture? Reinforcements, terrain change, objective shift, reveal? -->

**Trigger:**
<!-- Is this timed (round count), conditional (HP threshold, enemy dies), or responsive (you read the table)? -->

---

## Boxed Text

> **On entering / encounter start:**
>

---

## Running Notes

*Quick-reference section for at the table. Fill this in last, after all decisions above are made.*

**Round-by-round reminders:**
- **Round 1:** 
- **Round 2-3:** 
- **Round 4+:** 

**Don't forget:**
<!-- Specific things you'll lose track of in the moment: lair actions, recharge abilities, environmental effects, morale triggers. -->
- 

**If the party is winning easily:**
<!-- What do you escalate? Reinforcements? Terrain change? Enemy desperation tactics? -->

**If the party is struggling:**
<!-- What do you pull back? Enemy retreats? Environmental hazard subsides? NPC intervention? -->

---

## Aftermath

**What changes in the world after this encounter?**

**Loot/rewards:**

**Connections to other notes:**
- 