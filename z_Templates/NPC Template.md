<%*
// ── NPC note: world and region, disposition, place and factions, then writes the tags ──
// Place and faction are tags (place/…, faction/…), nested to any depth, so notes show up under every parent level.
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them.
const { C, ABORT, FACTION, slug, tagPath, fmOf, tagsOfFile, liveNotes, vocabulary, levels, dropParents, pickTag, pickFactions, childFolders,
  inWorldFilter, worldRegionEntries, campaignTagOf, campaignNotes, pickCampaign, campaignWorld, placeNoteFor, linkTo,
  findPath, ensureFolder, askTitle, discard, safeMove } = tp.user.dm_helpers(tp, Notice);


// 0. Name first
const title = await askTitle("NPC");
if (!title) { await discard(); return; }

// 1. World and region, from the folders under the worlds folder
const worldsRoot = app.vault.getAbstractFileByPath(C("folder_worlds", "Worlds"));
if (!worldsRoot) { new Notice("Could not find the worlds folder."); await discard(); return; }
const entries = worldRegionEntries(worldsRoot);
const labels = [...entries.map((e) => e.label), ABORT];
const values = [...entries, { label: ABORT }];
const chosen = await tp.system.suggester(labels, values, false, "Which world and region does this NPC belong to?");
if (!chosen || chosen.label === ABORT) { await discard(); return; }
const worldTag = `world/${slug(chosen.world)}`;
const regionTag = chosen.region ? `region/${slug(chosen.region)}` : null;

// 2. Disposition (set once)
const dispositions = ["indifferent", "friendly", "hostile"];
const disposition = await tp.system.suggester(dispositions, dispositions, false, "How does this NPC feel about the party?");
if (!disposition) { await discard(); return; }

// 3. Place: where this NPC is typically found. Only places already used in this world are listed.
const inWorld = liveNotes().filter(inWorldFilter(chosen.world));
const placeTag = await pickTag("place", "place", vocabulary("place", inWorld), "— none yet (adds needs-work)", true, "Where is this NPC usually found? (place tag)");

// 4. Factions: a checklist of the faction tags already used in this world.
const picked = await pickFactions(vocabulary(FACTION, inWorld), "Factions for this NPC: select an entry to check or uncheck it, then choose Done");

// 5. Tags and file location
const tags = [
  C("tag_npc", "npc"), worldTag, regionTag,
  ...dropParents([placeTag, ...picked].filter(Boolean)),
  ...(placeTag ? [] : [C("tag_needs_work", "needs-work")]),
].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
await safeMove(C("folder_npcs", "Characters/NPCs"), title);
_%>
---
aliases: []
disposition: <% disposition %>
tags:
<% tagLines %>
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
