<%*
// ── Location note: folder, then world, region and place tags ──
// The place tag (place/…) nests to any depth: place/port-damali/harmony-hall also shows under place/port-damali.
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them.
const { C, ABORT, FACTION, slug, tagPath, fmOf, tagsOfFile, liveNotes, vocabulary, levels, dropParents, pickTag, pickFactions, childFolders,
  inWorldFilter, worldRegionEntries, campaignTagOf, campaignNotes, pickCampaign, campaignWorld, placeNoteFor, linkTo,
  findPath, ensureFolder, askTitle, discard, safeMove } = tp.user.dm_helpers(tp, Notice);

const ADD_FOLDER = "＋ Add new folder...";

const title = await askTitle("Location");
if (!title) { await discard(); return; }

// Folders under the worlds folder, below the world level
const worldsRoot = app.vault.getAbstractFileByPath(C("folder_worlds", "Worlds"));
if (!worldsRoot) { new Notice("Could not find the worlds folder."); await discard(); return; }
function collectFolders(folder, depth, results) {
  if (!folder.children) return;
  for (const child of folder.children) {
    if (child.children === undefined) continue; // skip files
    if (depth >= 1) results.push(child);
    collectFolders(child, depth + 1, results);
  }
}
const allFolders = [];
collectFolders(worldsRoot, 0, allFolders);
const toLabel = (folder) => folder.path.split("/").slice(2).join(" / "); // drop the worlds folder and the world
allFolders.sort((a, b) => toLabel(a).localeCompare(toLabel(b)));
const folderLabels = allFolders.map(toLabel);

// 1. Destination folder
const chosenLabel = await tp.system.suggester([...folderLabels, ADD_FOLDER, ABORT], [...folderLabels, ADD_FOLDER, ABORT], false, "Which folder should this location go in?");
if (!chosenLabel || chosenLabel === ABORT) { await discard(); return; }
let targetVaultPath;
if (chosenLabel === ADD_FOLDER) {
  const parentLabel = await tp.system.suggester([...folderLabels, ABORT], [...folderLabels, ABORT], false, "Which folder should the new folder go inside?");
  if (!parentLabel || parentLabel === ABORT) { await discard(); return; }
  const parentFolder = allFolders[folderLabels.indexOf(parentLabel)];
  const newPath = await tp.system.prompt("New folder path (use / to create multiple levels):");
  if (!newPath || !newPath.trim()) { await discard(); return; }
  targetVaultPath = `${parentFolder.path}/${newPath.trim()}`;
  targetVaultPath = await ensureFolder(targetVaultPath);
} else {
  targetVaultPath = allFolders[folderLabels.indexOf(chosenLabel)].path;
}

// 2. World and region from the folder path: worlds folder / world / continent / region / …
const parts = targetVaultPath.split("/");
const worldTag = `world/${slug(parts[1])}`;
const regionTag = parts.length >= 4 ? `region/${slug(parts[3])}` : null;

// 3. Place tag: pick an existing place (applied as-is), skip it, or generate a new one
const ownSlug = slug(title);
const inWorld = liveNotes().filter(inWorldFilter(parts[1]));
const existingPlaces = vocabulary("place", inWorld);
const NONE = "— No place tag (adds needs-work)";
const NEW = "＋ Generate new place tag…";
const placeChoice = await tp.system.suggester(
  [NONE, NEW, ...existingPlaces.map((t) => levels(t, "place"))],
  [null, NEW, ...existingPlaces],
  false,
  "Which place is this location? (place tag)"
);
let placeTag = null;
if (placeChoice === NEW) {
  const typed = await tp.system.prompt("New place name (use / for levels). Default is this note's name", ownSlug);
  const own = typed ? tagPath(typed, "place") : null;
  if (typed && !own) new Notice(`"${typed}" is not a usable tag, so it was skipped.`);
  if (own) {
    const name = own.slice("place/".length);
    const where = await tp.system.suggester(
      [`Top level: place/${name}`, ...existingPlaces.map((t) => `Inside ${levels(t, "place")}: ${levels(t, "place")} / ${name.split("/").join(" / ")}`)],
      [null, ...existingPlaces],
      false,
      "Where does the new place tag go?"
    );
    placeTag = where ? `${where}/${name}` : own;
    new Notice(`Added ${placeTag}`);
  }
} else if (placeChoice) {
  placeTag = placeChoice;
}

const tags = [C("tag_location", "location"), worldTag, regionTag, placeTag, ...(placeTag ? [] : [C("tag_needs_work", "needs-work")])].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
await safeMove(targetVaultPath, title);
_%>
---
tags:
<% tagLines %>
---

# Quick Reference
**Status:** 
**Significance:** 

# Description
<!-- What does it look/feel like? Add details as needed -->

# What's Happening Now
<!-- Current plot hooks, recent events, immediate concerns -->

# Secrets
<!-- DM-only info, hidden connections -->

## Connected Elements

![[Related Notes.base]]
