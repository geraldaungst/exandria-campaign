<%*
// ── Faction note: name, world, folder, parent faction, base and ties, then writes the tags and properties ──
// Tags: the type tag (organization), world/…, the faction's own tag faction/<name> (or faction/<parent>/<name> for a
// sub-faction), and unplaced when its base is unknown. NPCs and encounters carry the faction/… tag; only the faction's
// own note carries the type tag. The base is the whereabouts property (a link to a place); ties_to lists the places,
// cultures or factions it comes from. No region tag.
// If a Player Wiki note of the same name exists, the note is named "… - DM" and embeds it under Quick Reference.
// Quick Capture builds faction stubs from this template's body: keep the closing tag of this block directly before the
// frontmatter, and no Templater tags in the body except the embed tag (the word embed between percent-angle brackets).
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them. The location logic is in location_core.js, reached through them.
const { C, ABORT, FACTION, PROP, UNPLACED, slug, liveNotes, vocabulary, pickTag, childFolders, inWorldFilter, findPath, ensureFolder,
  askTitle, discard, safeMove, locations, worldChoices, pickMany, pickOne, propText, withTwin, embedFor } = tp.user.dm_helpers(tp, Notice);

const NO_CLUSTER = "No cluster (drop in world folder)";

const asked = await askTitle("Faction");
if (!asked) { await discard(); return; }
const { title, wiki } = withTwin(asked);

// 1. World
const worlds = worldChoices();
const world = await tp.system.suggester([...worlds.map((w) => w.label), ABORT], [...worlds, null], false, "Which world does this faction belong to?");
if (!world) { await discard(); return; }

// 2. Folder: the factions folder, then the world, then an optional cluster subfolder
const factionsRoot = C("folder_factions", "Characters/Factions");
const worldFactionPath = await ensureFolder(`${factionsRoot}/${world.name}`);
const clusters = childFolders(findPath(worldFactionPath));
let targetPath = worldFactionPath;
if (clusters.length) {
  const clusterLabels = [...clusters.map((f) => f.name), NO_CLUSTER, ABORT];
  const chosenCluster = await tp.system.suggester(clusterLabels, clusterLabels, false, "Which group folder should this faction be filed in?");
  if (!chosenCluster || chosenCluster === ABORT) { await discard(); return; }
  if (chosenCluster !== NO_CLUSTER) targetPath = `${worldFactionPath}/${chosenCluster}`;
}

// 3. Parent faction (optional): a faction already tagged in this world
const inWorld = inWorldFilter(world.slug);
const factionNotes = liveNotes().filter((f) => f.path.startsWith(factionsRoot + "/") && (inWorld(f) || f.path.startsWith(`${worldFactionPath}/`)));
const parentTag = await pickTag(FACTION, "parent faction", vocabulary(FACTION, factionNotes), "— top-level faction (no parent)", false, "Is this a sub-faction? Pick its parent faction, or none");
const ownSlug = slug(title);
if (!ownSlug) new Notice(`The note name gave no usable tag. Add ${FACTION}/… by hand.`);
const ownTag = ownSlug ? `${parentTag ?? FACTION}/${ownSlug}` : null;

// 4. Base and ties
const loc = locations();
const where = await pickOne(loc.pickerChoices({ field: "whereabouts", world: world.slug }), "Where is this faction's base?",
  [{ extra: "unplaced", label: "— Unplaced (no known or decided base)" }], { allowNew: true });
if (!where) { await discard(); return; }
const unplaced = where.extra === "unplaced";
const ties = await pickMany(loc.pickerChoices({ field: "ties_to", world: world.slug }),
  "Which places or cultures is this faction tied to, wherever its base is now? (optional) Pick any, then Done", { noneLabel: "no ties", allowNew: true });

// 5. Tags, properties, embed and file location
const tags = [C("tag_faction", "organization"), `world/${world.slug}`, ownTag, ...(unplaced ? [UNPLACED] : [])].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
const propLines = propText([[PROP.whereabouts, unplaced ? null : where], [PROP.ties, ties]]);
const embed = embedFor(wiki);
await safeMove(targetPath, title);
_%>
---
aliases: []
tags:
<% tagLines %><% propLines %>
---

# Quick Reference<% embed %>
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
