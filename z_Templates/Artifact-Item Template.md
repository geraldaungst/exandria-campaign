<%*
// ── Dynamic tag derivation for Artifact/Item notes ──

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

// Build flat world list
const worldsRoot = app.vault.getAbstractFileByPath("Worlds");
if (!worldsRoot) { new Notice("Could not find Worlds/ folder."); await abort(); return; }

const worldFolders = getChildFolders(worldsRoot);
const worldNames = worldFolders.map(f => f.name).sort();
const labels = [...worldNames, ABORT];

// 1. Prompt for world
const chosenWorld = await tp.system.suggester(labels, labels);
if (!chosenWorld || chosenWorld === ABORT) { await abort(); return; }

const worldTag = `world/${toTag(chosenWorld)}`;

// 2. Move file to Items/
await tp.file.move(`Items/${tp.file.title}`);
_%>
---
tags:
  - item
  - <% worldTag %>
---

# Quick Reference
**Location:** 
**Significance:** 

# Description & Properties
<!-- Physical description, magical properties, game mechanics all together -->

# Lore
<!-- History, legends, secrets - add only if relevant -->

## Connected Elements

![[Related Notes.base]]
