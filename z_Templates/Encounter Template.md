<%*
// ── Encounter note: name, campaign (sets world), place and factions, then writes the tags ──
// Tags: encounter, campaign/…, world/… (from the campaign note's world property), place/… (picked),
// region/… (copied from the place's location note), faction/… (checklist). No hand-filled properties.
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by the NPC, Faction,
// Location, Encounter and Arc templates. Edit them there, once, for all five.
const { C, slug, tagPath, tagsOfFile, liveNotes, vocabulary, levels, pickTag, inWorldFilter, worldRegionEntries, dropParents, askTitle, discard, safeMove } =
  tp.user.dm_helpers(tp, Notice);

const ABORT = "✕ Cancel (don't create file)";
async function abort() { await discard(); }
const fmOf = (f) => app.metadataCache.getFileCache(f)?.frontmatter ?? {};

// 0. Name first
const title = await askTitle("Encounter");
if (!title) { await abort(); return; }

// 1. Campaign: campaign notes (tag campaign-hub) with a campaign/… tag; the active one is listed first.
const campaignPrefix = C("campaign_tag_prefix", "campaign/");
const campaigns = liveNotes()
  .filter((f) => tagsOfFile(f).includes(C("tag_campaign_note", "campaign-hub")) && tagsOfFile(f).some((t) => t.startsWith(campaignPrefix)))
  .sort(
    (a, b) =>
      (String(fmOf(b).status).toLowerCase() === "active") - (String(fmOf(a).status).toLowerCase() === "active") ||
      a.basename.localeCompare(b.basename)
  );
if (!campaigns.length) { new Notice("No campaign note found (tag campaign-hub), so the encounter can't be filed."); await abort(); return; }
const campaignLabels = [...campaigns.map((f) => f.basename + (fmOf(f).status ? `  (${fmOf(f).status})` : "")), ABORT];
const campaign = await tp.system.suggester(campaignLabels, [...campaigns, null], false, "Which campaign is this encounter for?");
if (!campaign) { await abort(); return; }
const campaignTag = tagsOfFile(campaign).find((t) => t.startsWith(campaignPrefix));
const worldName = String(fmOf(campaign).world ?? "").replace(/^\[\[|\]\]$/g, "").replace(/\|.*$/, "").trim();
const worldTag = worldName ? `world/${slug(worldName)}` : null;
if (!worldName) new Notice(`${campaign.basename} has no world property, so the encounter gets no world tag.`);

// 2. Place: places already used in the campaign's world, a new one, or none.
const inWorld = worldName ? liveNotes().filter(inWorldFilter(worldName)) : liveNotes();
const placeTag = await pickTag("place", "place", vocabulary("place", inWorld), "— no place (wilderness or roaming)", true, "Where does this encounter happen? (place tag)");
// Location notes carrying this place tag (not Player Wiki pages). Places inside it can carry the same tag,
// so the place's own note is the one whose name matches the tag's last part ("Rexxentrum - DM Notes" for place/rexxentrum).
const wiki = C("folder_player_wiki", "Player Wiki") + "/";
const tagged = placeTag
  ? inWorld.filter((f) => !f.path.startsWith(wiki) && tagsOfFile(f).includes(C("tag_location", "location")) && tagsOfFile(f).includes(placeTag))
  : [];
const placeNote = tagged.find((f) => slug(f.basename) === placeTag.split("/").pop()) ?? null;
// Region: from the place's own note, else from any location note with this place tag (they share it).
const regionTag = [placeNote, ...tagged].filter(Boolean).map((f) => tagsOfFile(f).find((t) => t.startsWith("region/"))).find(Boolean) ?? null;

// 3. Factions involved, enemies or allies: a checklist. Select an entry to check or uncheck it; choose Done when finished.
const factionVocab = vocabulary("faction", inWorld);
const extraFactions = []; // tags typed during this run
const picked = [];
for (;;) {
  const all = [...new Set([...factionVocab, ...extraFactions])].sort((a, b) => a.localeCompare(b));
  const labels = [
    picked.length ? `✓ Done (${picked.length} checked)` : "✓ Done (no faction)",
    "＋ New faction tag…",
    ...all.map((t) => `${picked.includes(t) ? "☑" : "☐"} ${levels(t, "faction")}`),
  ];
  const choice = await tp.system.suggester(
    labels,
    ["done", "new", ...all],
    false,
    "Factions involved in this encounter: select an entry to check or uncheck it, then choose Done"
  );
  if (!choice || choice === "done") break;
  if (choice === "new") {
    const typed = await tp.system.prompt("New faction tag under faction/ (use / for levels, e.g. ashari/terrah)", "");
    const tag = typed ? tagPath(typed, "faction") : null;
    if (typed && !tag) new Notice(`"${typed}" is not a usable tag, so it was skipped.`);
    if (tag) {
      if (!all.includes(tag)) extraFactions.push(tag);
      if (!picked.includes(tag)) picked.push(tag);
      new Notice(`Added ${tag}`);
    }
  } else if (picked.includes(choice)) {
    picked.splice(picked.indexOf(choice), 1);
  } else {
    picked.push(choice);
  }
}

// 4. Tags, the Location line, and file location (the campaign folder's Encounters folder)
const tags = [
  C("tag_encounter", "encounter"), campaignTag, worldTag, regionTag,
  ...dropParents([placeTag, ...picked].filter(Boolean)),
].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
const placeShown = placeNote ? placeNote.basename.replace(/ - DM Notes$/i, "") : "";
const placeLink = placeNote ? app.metadataCache.fileToLinktext(placeNote, "") : "";
const locationLine = placeNote
  ? `[[${placeLink}${placeShown !== placeLink ? `|${placeShown}` : ""}]]`
  : "<!-- Link the place, e.g. [[Port Damali - DM Notes|Port Damali]] -->";
const folder = `${campaign.parent.path}/Encounters`;
if (!app.vault.getAbstractFileByPath(folder)) await app.vault.createFolder(folder);
await safeMove(folder, title);
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