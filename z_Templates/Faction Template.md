<%*
// ── Faction note: world and region, folder, optional parent faction, then writes the tags ──
// Tags: the type tag (organization), world, region, and the faction's own tag faction/<name>, or
// faction/<parent>/<name> for a sub-faction. NPCs and encounters carry that faction/… tag; only the faction's
// own note carries the type tag.
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them.
const { C, ABORT, FACTION, slug, tagPath, fmOf, tagsOfFile, liveNotes, vocabulary, levels, dropParents, pickTag, pickFactions, childFolders,
  inWorldFilter, worldRegionEntries, campaignTagOf, campaignNotes, pickCampaign, campaignWorld, placeNoteFor, linkTo,
  findPath, ensureFolder, askTitle, discard, safeMove } = tp.user.dm_helpers(tp, Notice);

const NO_CLUSTER = "No cluster (drop in world folder)";

const title = await askTitle("Faction");
if (!title) { await discard(); return; }

// 1. World and region
const worldsRoot = app.vault.getAbstractFileByPath(C("folder_worlds", "Worlds"));
if (!worldsRoot) { new Notice("Could not find the worlds folder."); await discard(); return; }
const entries = worldRegionEntries(worldsRoot);
const tagLabels = [...entries.map((e) => e.label), ABORT];
const tagValues = [...entries, { label: ABORT }];
const chosen = await tp.system.suggester(tagLabels, tagValues, false, "Which world and region does this faction belong to?");
if (!chosen || chosen.label === ABORT) { await discard(); return; }
const worldTag = `world/${slug(chosen.world)}`;
const regionTag = chosen.region ? `region/${slug(chosen.region)}` : null;

// 2. Folder: the factions folder, then the world, then an optional cluster subfolder
const factionsRoot = C("folder_factions", "Characters/Factions");
const worldFactionPath = await ensureFolder(`${factionsRoot}/${chosen.world}`);
const clusters = childFolders(findPath(worldFactionPath));
let targetPath = worldFactionPath;
if (clusters.length) {
  const clusterLabels = [...clusters.map((f) => f.name), NO_CLUSTER, ABORT];
  const chosenCluster = await tp.system.suggester(clusterLabels, clusterLabels, false, "Which group folder should this faction be filed in?");
  if (!chosenCluster || chosenCluster === ABORT) { await discard(); return; }
  if (chosenCluster !== NO_CLUSTER) targetPath = `${worldFactionPath}/${chosenCluster}`;
}

// 3. Parent faction (optional): a faction already tagged in this world
const inWorld = inWorldFilter(chosen.world);
const factionNotes = liveNotes().filter((f) => f.path.startsWith(factionsRoot + "/") && (inWorld(f) || f.path.startsWith(`${worldFactionPath}/`)));
const parentTag = await pickTag(FACTION, "parent faction", vocabulary(FACTION, factionNotes), "— top-level faction (no parent)", false, "Is this a sub-faction? Pick its parent faction, or none");
const ownSlug = slug(title);
if (!ownSlug) new Notice(`The note name gave no usable tag. Add ${FACTION}/… by hand.`);
const ownTag = ownSlug ? `${parentTag ?? FACTION}/${ownSlug}` : null;
const tags = [C("tag_faction", "organization"), worldTag, regionTag, ownTag].filter(Boolean);
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
