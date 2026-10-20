<%*
// ── Dynamic folder placement and tag derivation for Faction notes ──

const NO_CLUSTER = "No cluster (drop in world folder)";
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

// ── Step 1: Build world/region list from Worlds/ ──
const worldsRoot = app.vault.getAbstractFileByPath("Worlds");
if (!worldsRoot) { new Notice("Could not find Worlds/ folder."); await abort(); return; }

const pairs = [];
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

const worldOnlyEntries = getChildFolders(worldsRoot).map(w => ({
  label: `${w.name} / (no region)`,
  world: w.name,
  region: null
}));

const tagLabels = [...pairs.map(p => p.label), ...worldOnlyEntries.map(p => p.label), ABORT];
const tagValues = [...pairs, ...worldOnlyEntries, { label: ABORT }];

// 1. Prompt for world/region
const chosen = await tp.system.suggester(tagLabels, tagValues);
if (!chosen || chosen.label === ABORT) { await abort(); return; }

const worldTag  = `world/${toTag(chosen.world)}`;
const regionTag = chosen.region ? `region/${toTag(chosen.region)}` : null;

// ── Step 2: Derive faction folder from chosen world ──
const worldFactionPath = `Characters/Factions/${chosen.world}`;

// Create world subfolder if it doesn't exist
if (!app.vault.getAbstractFileByPath(worldFactionPath)) {
  await app.vault.createFolder(worldFactionPath);
}

// ── Step 3: Check for cluster subfolders ──
const worldFactionFolder = app.vault.getAbstractFileByPath(worldFactionPath);
const clusterFolders = getChildFolders(worldFactionFolder);

let targetPath;

if (clusterFolders.length === 0) {
  // No clusters exist — drop directly into world folder
  targetPath = worldFactionPath;
} else {
  // Prompt for cluster
  const clusterLabels = [...clusterFolders.map(f => f.name), NO_CLUSTER, ABORT];
  const chosenCluster = await tp.system.suggester(clusterLabels, clusterLabels);
  if (!chosenCluster || chosenCluster === ABORT) { await abort(); return; }
  targetPath = chosenCluster === NO_CLUSTER
    ? worldFactionPath
    : `${worldFactionPath}/${chosenCluster}`;
}

// 4. Move file
await tp.file.move(`${targetPath}/${tp.file.title}`);
_%>
---
tags:
  - faction
  - <% worldTag %>
<%* if (regionTag) { %>  - <% regionTag %>
<%* } %>aliases: []
---

# Quick Reference
**Base:** 
**Goal:** 
**Status:** 
**Influence:** 

# Leadership
**Current Leader:**

**Notable Members:**

# Culture & Methods
<!-- Philosophy, traditions, how they operate -->

# Relationships
**Allies:**
**Rivals:**
**Neutral:**

# Current Activities
<!-- What they're doing now, recent events -->

# History
<!-- Origins, major events, evolution -->

## Connected Elements

![[Related Notes.base]]
