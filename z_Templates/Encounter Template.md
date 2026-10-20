<%*
// ── Encounter Template: campaign folder placement + tag derivation ──

const ABORT = "✕ Cancel (don't create file)";

async function abort() {
  const f = app.vault.getAbstractFileByPath(tp.file.path(true));
  if (f) await app.vault.delete(f, true);
}

function toTag(str) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

function getChildFolders(folder) {
  if (!folder || !folder.children) return [];
  return folder.children.filter(f => f.children !== undefined);
}

// ── Load campaign tag map from vault_inspector_config.json ──
async function loadCampaignTagMap() {
  const configFile = app.vault.getAbstractFileByPath("vault_inspector_config.json");
  if (!configFile) return {};
  try {
    const text = await app.vault.read(configFile);
    const config = JSON.parse(text);
    return config.campaign_tag_map || {};
  } catch (e) {
    return {};
  }
}

// ── Write updated campaign tag map back to config ──
async function saveCampaignTagMap(map) {
  const configFile = app.vault.getAbstractFileByPath("vault_inspector_config.json");
  if (!configFile) return;
  try {
    const text = await app.vault.read(configFile);
    const config = JSON.parse(text);
    config.campaign_tag_map = map;
    await app.vault.modify(configFile, JSON.stringify(config, null, 2));
  } catch (e) {
    new Notice("Warning: could not save campaign tag map to config.");
  }
}

// ── Get campaign tag for a folder name, prompting if missing ──
async function getCampaignTag(folderName, tagMap) {
  if (tagMap[folderName]) return tagMap[folderName];
  const newTag = await tp.system.prompt(
    `No tag mapping found for "${folderName}".\nEnter short tag (e.g. "eryndor"):`,
    toTag(folderName)
  );
  if (!newTag || !newTag.trim()) return toTag(folderName);
  const trimmed = newTag.trim().toLowerCase().replace(/\s+/g, "-");
  tagMap[folderName] = trimmed;
  await saveCampaignTagMap(tagMap);
  return trimmed;
}

// ── Build campaign list from Campaigns/ (exclude z_Archive) ──
const campaignsRoot = app.vault.getAbstractFileByPath("Campaigns");
if (!campaignsRoot) {
  new Notice("Could not find Campaigns/ folder.");
  await abort();
  return;
}

const campaignFolders = getChildFolders(campaignsRoot)
  .filter(f => !f.name.startsWith("z_"));
const campaignNames = campaignFolders.map(f => f.name).sort();
const labels = [...campaignNames, ABORT];

// 1. Prompt for campaign
const chosenCampaign = await tp.system.suggester(labels, labels);
if (!chosenCampaign || chosenCampaign === ABORT) { await abort(); return; }

// 2. Resolve campaign tag
const tagMap = await loadCampaignTagMap();
const campaignTag = await getCampaignTag(chosenCampaign, tagMap);

// 3. Ensure Encounters folder exists
const encountersPath = `Campaigns/${chosenCampaign}/Encounters`;
if (!app.vault.getAbstractFileByPath(encountersPath)) {
  await app.vault.createFolder(encountersPath);
}

// 4. Move file
await tp.file.move(`${encountersPath}/${tp.file.title}`);
_%>
---
tags:
  - encounter
  - campaign/<% campaignTag %>
session: ""
location: "[[]]"
---

# Encounter: <% tp.file.title %>

## Setup

**Location:** `=this.location`

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