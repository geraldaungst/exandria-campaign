<%*
// ── Location note: name, world, then the two parent pickers; writes the tags and properties and files it in Worlds/<World>/Places ──
// Tags: location, world/…. Properties: political_region and natural_region, each a list of links to the nearest parent
// place (the first is the main one; none for a place at the top of its setting). No place or region tags.
// If a Player Wiki note of the same name exists, the note is named "… - DM" and embeds it under Quick Reference.
// Quick Capture builds location stubs from this template's body: keep the closing tag of this block directly before the
// frontmatter, and no Templater tags in the body except the embed tag (the word embed between percent-angle brackets).
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them. The location logic is in location_core.js, reached through them.
const { C, ABORT, PROP, askTitle, discard, safeMove, locations, worldChoices, pickMany, propText, withTwin, embedFor } = tp.user.dm_helpers(tp, Notice);

const asked = await askTitle("Location");
if (!asked) { await discard(); return; }
const { title, wiki } = withTwin(asked);

// 1. World
const worlds = worldChoices();
const world = await tp.system.suggester([...worlds.map((w) => w.label), ABORT], [...worlds, null], false, "Which world is this location in?");
if (!world) { await discard(); return; }

// 2. Parents: the nearest place that governs it, and the nearest land it sits on. Each can be several or none.
const loc = locations();
const political = await pickMany(loc.pickerChoices({ field: "political_region", world: world.slug }),
  "Which place governs it? Pick the nearest one (the first pick is the main one), then Done", { noneLabel: "none: top of setting", allowNew: true });
const natural = await pickMany(loc.pickerChoices({ field: "natural_region", world: world.slug }),
  "Which land does it sit on? Pick the nearest one (the first pick is the main one), then Done", { noneLabel: "none: top of setting", allowNew: true });

// 3. Tags, properties, embed and file location
const tags = [C("tag_location", "location"), `world/${world.slug}`];
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
const propLines = propText([[PROP.political, political], [PROP.natural, natural]]);
const embed = embedFor(wiki);
await safeMove(`${C("folder_worlds", "Worlds")}/${world.name}/${C("folder_kind_places", "Places")}`, title);
_%>
---
tags:
<% tagLines %><% propLines %>
---

# Quick Reference<% embed %>
**Status:** 
**Significance:** 

# Description
<!-- What does it look/feel like? Add details as needed -->

# What's Happening Now
<!-- Current plot hooks, recent events, immediate concerns -->

# Secrets
<!-- DM-only info, hidden connections. One checklist line per fact the party could learn, ticked when they learn it. Running notes the party could not learn stay plain bullets. -->

- [ ]

## Open Issues

- [ ] 

## Seeds Planted

- [ ] 

## Connected Elements

![[Related Notes.base]]
