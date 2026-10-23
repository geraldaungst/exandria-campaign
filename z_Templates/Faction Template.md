<%*
// ── Faction note: world and region, folder, optional parent faction, then writes the tags ──
// The faction's own tag is faction/<name>, or faction/<parent>/<name> for a sub-faction. NPCs carry that tag.
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by the NPC, Faction,
// Location, Encounter and Arc templates. Edit them there, once, for all five.
const { C, slug, tagPath, tagsOfFile, liveNotes, vocabulary, levels, pickTag, inWorldFilter, worldRegionEntries, dropParents, askTitle, discard, safeMove } =
  tp.user.dm_helpers(tp, Notice);

const NO_CLUSTER = "No cluster (drop in world folder)";
const ABORT = "✕ Cancel (don't create file)";
async function abort() { await discard(); }
const childFolders = (folder) => (folder?.children ?? []).filter((f) => f.children !== undefined);

const title = await askTitle("Faction");
if (!title) { await abort(); return; }

// 1. World and region
const worldsRoot = app.vault.getAbstractFileByPath(C("folder_worlds", "Worlds"));
if (!worldsRoot) { new Notice("Could not find the worlds folder."); await abort(); return; }
const entries = worldRegionEntries(worldsRoot);
const tagLabels = [...entries.map((e) => e.label), ABORT];
const tagValues = [...entries, { label: ABORT }];
const chosen = await tp.system.suggester(tagLabels, tagValues, false, "Which world and region does this faction belong to?");
if (!chosen || chosen.label === ABORT) { await abort(); return; }
const worldTag = `world/${slug(chosen.world)}`;
const regionTag = chosen.region ? `region/${slug(chosen.region)}` : null;

// 2. Folder: the factions folder, then the world, then an optional cluster subfolder
const factionsRoot = C("folder_factions", "Characters/Factions");
const worldFactionPath = `${factionsRoot}/${chosen.world}`;
if (!app.vault.getAbstractFileByPath(worldFactionPath)) {
  if (!app.vault.getAbstractFileByPath(factionsRoot)) await app.vault.createFolder(factionsRoot);
  await app.vault.createFolder(worldFactionPath);
}
const clusters = childFolders(app.vault.getAbstractFileByPath(worldFactionPath));
let targetPath = worldFactionPath;
if (clusters.length) {
  const clusterLabels = [...clusters.map((f) => f.name), NO_CLUSTER, ABORT];
  const chosenCluster = await tp.system.suggester(clusterLabels, clusterLabels, false, "Which group folder should this faction be filed in?");
  if (!chosenCluster || chosenCluster === ABORT) { await abort(); return; }
  if (chosenCluster !== NO_CLUSTER) targetPath = `${worldFactionPath}/${chosenCluster}`;
}

// 3. Parent faction (optional): a faction already tagged in this world
const inWorld = inWorldFilter(chosen.world);
const factionNotes = liveNotes().filter((f) => f.path.startsWith(factionsRoot + "/") && (inWorld(f) || f.path.startsWith(`${factionsRoot}/${chosen.world}/`)));
const parentTag = await pickTag("faction", "parent faction", vocabulary("faction", factionNotes), "— top-level faction (no parent)", false, "Is this a sub-faction? Pick its parent faction, or none");
const ownSlug = slug(title);
if (!ownSlug) new Notice("The note name gave no usable tag. Add faction/… by hand.");
const ownTag = ownSlug ? `${parentTag ?? "faction"}/${ownSlug}` : null;
const tags = [worldTag, regionTag, ownTag].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
await safeMove(targetPath, title);
_%>
---
aliases: []
tags:
<% tagLines %>
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
