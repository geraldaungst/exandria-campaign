<%*
// ── Encounter note: name, campaign (sets world), site and factions, then writes the tags and the site property ──
// Tags: encounter, campaign/…, world/… (from the campaign note's world property), faction/… (checklist). Property: site, a
// link to the place where it happens (none for wilderness or roaming). No place or region tags.
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them.
const { C, FACTION, PROP, slug, liveNotes, vocabulary, dropParents, pickFactions, inWorldFilter,
  campaignTagOf, campaignNotes, pickCampaign, campaignWorld, linkTo,
  askTitle, discard, safeMove, locations, pickOne, fileOfChoice, propText } = tp.user.dm_helpers(tp, Notice);


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

// 2. Site: a place of the campaign's world, or none.
const inWorld = worldName ? liveNotes().filter(inWorldFilter(worldName)) : liveNotes();
const site = await pickOne(locations().pickerChoices({ field: "site", world: worldName || undefined }), "Where does this encounter happen? (site)",
  [{ extra: "none", label: "— no site (wilderness, roaming, several places, or none yet)" }], { allowNew: true });
if (!site) { await discard(); return; }
const siteChoice = site.extra ? null : site;

// 3. Factions involved, enemies or allies: a checklist of the faction tags already used in this world.
const picked = await pickFactions(vocabulary(FACTION, inWorld), "Factions involved in this encounter: select an entry to check or uncheck it, then choose Done");

// 4. Tags, the Location line, and file location (the campaign folder's Encounters folder)
const tags = [
  C("tag_encounter", "encounter"), campaignTag, worldTag,
  ...dropParents(picked),
].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
const siteProp = propText([[PROP.site, siteChoice]]);
const siteFile = fileOfChoice(siteChoice);
const locationLine = siteFile ? linkTo(siteFile) : siteChoice ? `[[${siteChoice.link}]]` : "<!-- Link the place, e.g. [[Port Damali - DM|Port Damali]] -->";
await safeMove(`${campaign.parent.path}/Encounters`, title);
_%>
---
tags:
<% tagLines %><% siteProp %>
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