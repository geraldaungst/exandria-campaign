<%*
// ── Dynamic folder placement for Location notes ──

const ADD_FOLDER = "＋ Add new folder...";
const ABORT      = "✕ Cancel (don't create file)";

// Helper: recursively collect all folders at depth 3+ under Worlds/
// depth is relative to Worlds/ root (Worlds/World = 1, Worlds/World/Continent = 2, etc.)
function collectFolders(folder, depth, results) {
  if (!folder.children) return;
  for (const child of folder.children) {
    if (child.children === undefined) continue; // skip files
    if (depth >= 1) {
      results.push(child);
    }
    collectFolders(child, depth + 1, results);
  }
}

const worldsRoot = app.vault.getAbstractFileByPath("Worlds");
console.log("Worlds children:", worldsRoot.children.map(f => f.name));
if (!worldsRoot) {
  new Notice("Could not find Worlds/ folder.");
  return;
}

const allFolders = [];
collectFolders(worldsRoot, 0, allFolders);
console.log("All collected folders:", allFolders.map(f => f.path));

// Build display labels: path relative to Worlds/[World]/ (strip first two segments)
function toLabel(folder) {
  const parts = folder.path.split("/").slice(2); // drop "Worlds" and world name
  return parts.join(" / ");
}

// Sort alphabetically by label
allFolders.sort((a, b) => toLabel(a).localeCompare(toLabel(b)));

const labels = [
  ...allFolders.map(toLabel),
  ADD_FOLDER,
  ABORT
];

// ── Helper: delete current file and abort ──
async function abort() {
  const f = app.vault.getAbstractFileByPath(tp.file.path(true));
  if (f) await app.vault.delete(f, true);
}

// ── Helper: derive world name from a vault path under Worlds/ ──
function worldFromPath(vaultPath) {
  return vaultPath.split("/")[1]; // Worlds/[World]/...
}

// ── Helper: derive region name from a vault path (depth-4 = index 3) ──
// Returns null if path is only continent-deep (depth 3 = index 2)
function regionFromPath(vaultPath) {
  const parts = vaultPath.split("/");
  // parts[0]=Worlds, parts[1]=World, parts[2]=Continent, parts[3]=Region
  return parts.length >= 4 ? parts[3] : null;
}

// ── Helper: normalize a string to tag format ──
function toTag(str) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

// ── Helper: create folders recursively ──
async function ensureFolderPath(vaultPath) {
  const parts = vaultPath.split("/");
  let current = "";
  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    if (!app.vault.getAbstractFileByPath(current)) {
      await app.vault.createFolder(current);
    }
  }
}

// 1. Prompt for destination folder
const chosenLabel = await tp.system.suggester(labels, labels);
if (!chosenLabel || chosenLabel === ABORT) { await abort(); return; }

let targetVaultPath;

if (chosenLabel === ADD_FOLDER) {
  // 2a. Pick parent folder (must be depth 2+ i.e. continent or deeper)
  const parentLabels = [...allFolders.map(toLabel), ABORT];
  const chosenParentLabel = await tp.system.suggester(parentLabels, parentLabels);
  if (!chosenParentLabel || chosenParentLabel === ABORT) { await abort(); return; }

  const parentFolder = allFolders[allFolders.map(toLabel).indexOf(chosenParentLabel)];

  // 2b. Type new path (e.g. "New Region" or "New Region/New City")
  const newPath = await tp.system.prompt("New folder path (use / to create multiple levels):");
  if (!newPath || !newPath.trim()) { await abort(); return; }

  targetVaultPath = `${parentFolder.path}/${newPath.trim()}`;
  await ensureFolderPath(targetVaultPath);
} else {
  const targetFolder = allFolders[allFolders.map(toLabel).indexOf(chosenLabel)];
  targetVaultPath = targetFolder.path;
}

// 3. Derive tags
const worldName  = worldFromPath(targetVaultPath);
const regionName = regionFromPath(targetVaultPath);
const worldTag   = `world/${toTag(worldName)}`;
const regionTag  = regionName ? `region/${toTag(regionName)}` : null;

// 4. Move file
const title = tp.file.title;
await tp.file.move(`${targetVaultPath}/${title}`);
_%>
---
tags:
  - location
  - <% worldTag %>
<%* if (regionTag) { %>  - <% regionTag %>
<%* } %>---

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
