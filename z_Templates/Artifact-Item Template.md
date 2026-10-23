<%*
// ── Item note: name, then world; writes the type tag (artifact) and the world tag, and files the note in the
// objects folder (Objects). Items carry no region tag.
// Quick Capture builds item stubs from this template's body: keep the closing tag of this block directly
// before the frontmatter, and no Templater tags below the frontmatter.
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them.
const { C, ABORT, FACTION, slug, tagPath, fmOf, tagsOfFile, liveNotes, vocabulary, levels, dropParents, pickTag, pickFactions, childFolders,
  inWorldFilter, worldRegionEntries, campaignTagOf, campaignNotes, pickCampaign, campaignWorld, placeNoteFor, linkTo,
  findPath, ensureFolder, askTitle, discard, safeMove } = tp.user.dm_helpers(tp, Notice);

const title = await askTitle("Item");
if (!title) { await discard(); return; }

// World: the folders under the worlds folder
const worldsRoot = app.vault.getAbstractFileByPath(C("folder_worlds", "Worlds"));
if (!worldsRoot) { new Notice("Could not find the worlds folder."); await discard(); return; }
const worlds = childFolders(worldsRoot).map((f) => f.name).sort((a, b) => a.localeCompare(b));
const world = await tp.system.suggester([...worlds, ABORT], [...worlds, ABORT], false, "Which world does this item belong to?");
if (!world || world === ABORT) { await discard(); return; }

const tags = [C("tag_item", "artifact"), `world/${slug(world)}`];
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
await safeMove(C("folder_objects", "Objects"), title);
_%>
---
tags:
<% tagLines %>
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
