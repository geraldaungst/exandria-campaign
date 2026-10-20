<%*
// ── Dynamic tag derivation for NPC notes ──

const SKIP_REGION = "＋ World tag only (no region)";
const ABORT       = "✕ Cancel (don't create file)";

function getChildFolders(folder) {
  if (!folder || !folder.children) return [];
  return folder.children.filter(f => f.children !== undefined);
}

// ── Helper: delete current file and abort ──
async function abort() {
  const f = app.vault.getAbstractFileByPath(tp.file.path(true));
  if (f) await app.vault.delete(f, true);
}

// ── Helper: normalize to tag format ──
function toTag(str) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

// Build flat list of World / Region pairs
const worldsRoot = app.vault.getAbstractFileByPath("Worlds");
if (!worldsRoot) {
  new Notice("Could not find Worlds/ folder.");
  await abort();
  return;
}

const pairs = []; // { label, world, region }
for (const worldFolder of getChildFolders(worldsRoot)) {
  for (const continentFolder of getChildFolders(worldFolder)) {
    for (const regionFolder of getChildFolders(continentFolder)) {
      pairs.push({
        label: `${worldFolder.name} / ${regionFolder.name}`,
        world: worldFolder.name,
        region: regionFolder.name
      });
    }
  }
}
pairs.sort((a, b) => a.label.localeCompare(b.label));

// Also add world-only entries
const worldOnlyEntries = getChildFolders(worldsRoot).map(w => ({
  label: `${w.name} / (no region)`,
  world: w.name,
  region: null
}));

const labels = [
  ...pairs.map(p => p.label),
  ...worldOnlyEntries.map(p => p.label),
  ABORT
];
const values = [...pairs, ...worldOnlyEntries, { label: ABORT }];

// 1. Prompt for world/region
const chosen = await tp.system.suggester(labels, values);
if (!chosen || chosen.label === ABORT) { await abort(); return; }

const worldTag  = `world/${toTag(chosen.world)}`;
const regionTag = chosen.region ? `region/${toTag(chosen.region)}` : null;

// 2. Prompt for disposition
const dispositions = ["indifferent", "friendly", "hostile"];
const disposition = await tp.system.suggester(dispositions, dispositions);
if (!disposition) { await abort(); return; }

// 3. Prompt for current_location
const currentLocation = await tp.system.prompt("Current location (leave blank if unknown):", "");

// 4. Move file to Characters/NPCs/
const title = tp.file.title;
await tp.file.move(`Characters/NPCs/${title}`);
_%>
---
tags:
  - npc
  - <% worldTag %>
<%* if (regionTag) { %>  - <% regionTag %>
<%* } %>aliases: []
disposition: <% disposition %>
current_location: <% currentLocation %>
affiliations: []
---

# Quick Reference
> [!info] Essential Details
> - **Location:** 
> - **Goal:** 
> - **Attitude toward party:** 
> - **Key knowledge:** 

# Description & Roleplay
[Appearance in 2-3 sentences. Then:]
- **Voice:** 
- **Mannerisms:** 
- **Key traits:** 

# Current Situation
[What's happening with them RIGHT NOW. 
Update this as the campaign progresses.
This replaces the separate "Status" note.]

> [!secret]- Hidden Information
> [DM-only secrets, future plans, what they're hiding.
> Collapsed by default.]

> [!note]- Background
> [Condensed background — just what informs their behavior.
> If this grows beyond ~15 lines, it probably needs its own linked note.
> Link to extended background note if one exists.]

> [!note]- Stats
> [Stat block if needed. Collapsed by default.
> Many NPCs won't need this at all.]

## Connected Elements

![[Related Notes.base]]
