<%*
// ── NPC note: name, world, disposition, whereabouts, ties and factions, then writes the tags and properties ──
// Where the NPC is found is the whereabouts property (a link to a place) or the unplaced tag; places the NPC comes from or
// is tied to go in ties_to. Factions are tags (faction/…), nested to any depth. No place or region tags.
// If a Player Wiki note of the same name exists, the note is named "… - DM" and embeds it under Quick Reference.
// Quick Capture builds NPC stubs from this template's body: keep the closing tag of this block directly before the
// frontmatter, and no Templater tags in the body except the embed tag (the word embed between percent-angle brackets).
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them. The location logic is in location_core.js, reached through them.
const { C, ABORT, FACTION, PROP, UNPLACED, liveNotes, vocabulary, dropParents, pickFactions, inWorldFilter,
  askTitle, discard, safeMove, locations, worldChoices, pickMany, pickOne, propText, withTwin, embedFor } = tp.user.dm_helpers(tp, Notice);

// 0. Name first
const asked = await askTitle("NPC");
if (!asked) { await discard(); return; }
const { title, wiki } = withTwin(asked);

// 1. World
const worlds = worldChoices();
const world = await tp.system.suggester([...worlds.map((w) => w.label), ABORT], [...worlds, null], false, "Which world does this NPC belong to?");
if (!world) { await discard(); return; }

// 2. Disposition (set once)
const dispositions = ["indifferent", "friendly", "hostile"];
const disposition = await tp.system.suggester(dispositions, dispositions, false, "How does this NPC feel about the party?");
if (!disposition) { await discard(); return; }

// 3. Whereabouts: where this NPC is usually found, or unplaced. Then the places, cultures or factions the NPC is tied to.
const loc = locations();
const where = await pickOne(loc.pickerChoices({ field: "whereabouts", world: world.slug }), "Where is this NPC usually found?",
  [{ extra: "unplaced", label: "— Unplaced (no known or decided location)" }], { allowNew: true });
if (!where) { await discard(); return; }
const unplaced = where.extra === "unplaced";
const ties = await pickMany(loc.pickerChoices({ field: "ties_to", world: world.slug }),
  "Which places, cultures or factions is this NPC tied to, wherever they are now? (optional) Pick any, then Done", { noneLabel: "no ties", allowNew: true });

// 4. Factions: a checklist of the faction tags already used in this world.
const inWorld = liveNotes().filter(inWorldFilter(world.slug));
const picked = await pickFactions(vocabulary(FACTION, inWorld), "Factions for this NPC: select an entry to check or uncheck it, then choose Done");

// 5. Tags, properties, embed and file location
const tags = [C("tag_npc", "npc"), `world/${world.slug}`, ...dropParents(picked), ...(unplaced ? [UNPLACED] : [])].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
const propLines = propText([[PROP.whereabouts, unplaced ? null : where], [PROP.ties, ties]]);
const embed = embedFor(wiki);
await safeMove(C("folder_npcs", "Characters/NPCs"), title);
_%>
---
aliases: []
disposition: <% disposition %>
tags:
<% tagLines %><% propLines %>
---

# Quick Reference<% embed %>
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
> - [ ] [A secret the party may learn: one line per fact, ticked when they learn it.
> Future plans and what they're hiding go here too. Collapsed by default.
> Running notes the party could not learn stay plain bullets.]

> [!note]- Background
> [Condensed background — just what informs their behavior.
> If this grows beyond ~15 lines, it probably needs its own linked note.
> Link to extended background note if one exists.]

> [!note]- Stats
> [Stat block if needed. Collapsed by default.
> Many NPCs won't need this at all.]

## Connected Elements

![[Related Notes.base]]
