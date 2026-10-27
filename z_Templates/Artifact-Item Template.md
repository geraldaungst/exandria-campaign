<%*
// ── Item note: name, world, whereabouts; writes the type tag (artifact), the world tag and the whereabouts property, and
// files the note in the objects folder (Objects). Whereabouts is a place or a person (a PC when the party holds it), or the
// unplaced tag. No region tag.
// If a Player Wiki note of the same name exists, the note is named "… - DM" and embeds it under Quick Reference.
// Quick Capture builds item stubs from this template's body: keep the closing tag of this block directly before the
// frontmatter, and no Templater tags in the body except the embed tag (the word embed between percent-angle brackets).
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them. The location logic is in location_core.js, reached through them.
const { C, ABORT, PROP, UNPLACED, askTitle, discard, safeMove, locations, worldChoices, pickOne, propText, withTwin, embedFor } = tp.user.dm_helpers(tp, Notice);

const asked = await askTitle("Item");
if (!asked) { await discard(); return; }
const { title, wiki } = withTwin(asked);

// World
const worlds = worldChoices();
const world = await tp.system.suggester([...worlds.map((w) => w.label), ABORT], [...worlds, null], false, "Which world does this item belong to?");
if (!world) { await discard(); return; }

// Whereabouts: a place or the person holding it, or unplaced
const where = await pickOne(locations().pickerChoices({ field: "whereabouts", world: world.slug, kind: "item" }), "Where is this item now (a place, or the person holding it)?",
  [{ extra: "unplaced", label: "— Unplaced (no known or decided location)" }], { allowNew: true });
if (!where) { await discard(); return; }
const unplaced = where.extra === "unplaced";

const tags = [C("tag_item", "artifact"), `world/${world.slug}`, ...(unplaced ? [UNPLACED] : [])];
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
const propLines = propText([[PROP.whereabouts, unplaced ? null : where]]);
const embed = embedFor(wiki);
await safeMove(C("folder_objects", "Objects"), title);
_%>
---
tags:
<% tagLines %><% propLines %>
---

# Quick Reference<% embed %>
**Location:** 
**Significance:** 

# Description & Properties
<!-- Physical description, magical properties, game mechanics all together -->

# Lore
<!-- History, legends, secrets - add only if relevant -->

## Connected Elements

![[Related Notes.base]]
