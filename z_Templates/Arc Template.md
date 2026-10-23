<%*
// ── Arc note
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by the NPC, Faction,
// Location, Encounter and Arc templates. Edit them there, once, for all five.
const { C, slug, tagPath, tagsOfFile, liveNotes, vocabulary, levels, pickTag, inWorldFilter, worldRegionEntries, dropParents, askTitle, discard, safeMove } =
  tp.user.dm_helpers(tp, Notice);

const ABORT = "✕ Cancel (don't create file)";
async function abort() { await discard(); }
const fmOf = (f) => app.metadataCache.getFileCache(f)?.frontmatter ?? {};

// 0. Name first
const title = await askTitle("Arc Name");
if (!title) { await abort(); return; }

// 1. Campaign: campaign notes (tag campaign-hub) with a campaign/… tag; the active one is listed first.
const campaignPrefix = C("campaign_tag_prefix", "campaign/");
const campaigns = liveNotes()
  .filter((f) => tagsOfFile(f).includes(C("tag_campaign_note", "campaign-hub")) && tagsOfFile(f).some((t) => t.startsWith(campaignPrefix)))
  .sort(
    (a, b) =>
      (String(fmOf(b).status).toLowerCase() === "active") - (String(fmOf(a).status).toLowerCase() === "active") ||
      a.basename.localeCompare(b.basename)
  );
if (!campaigns.length) { new Notice("No campaign note found (tag campaign-hub), so the arc can't be filed."); await abort(); return; }
const campaignLabels = [...campaigns.map((f) => f.basename + (fmOf(f).status ? `  (${fmOf(f).status})` : "")), ABORT];
const campaign = await tp.system.suggester(campaignLabels, [...campaigns, null], false, "Which campaign is this arc for?");
if (!campaign) { await abort(); return; }
const campaignTag = tagsOfFile(campaign).find((t) => t.startsWith(campaignPrefix));

// 2. Tier
const tier = await tp.system.suggester(
  ["Standard (several sessions)", "Filler (one session)", ABORT],
  ["standard", "filler", null],
  false,
  "What kind of arc is this?"
);
if (!tier) { await abort(); return; }

// 3. Place: the arc's main place, from places already tagged in the campaign's world, a new one, or none.
const worldName = String(fmOf(campaign).world ?? "").replace(/^\[\[|\]\]$/g, "").replace(/\|.*$/, "").trim();
const inWorld = worldName ? liveNotes().filter(inWorldFilter(worldName)) : liveNotes();
const placeTag = await pickTag("place", "place", vocabulary("place", inWorld), "— no place (travel or several places)", true, "Where is this arc mainly set? (place tag)");

// 4. Tags and file location (the campaign folder's Arcs folder)
const tags = [C("tag_arc", "arc"), campaignTag, placeTag].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");

const folder = `${campaign.parent.path}/Arcs`;
if (!app.vault.getAbstractFileByPath(folder)) await app.vault.createFolder(folder);
await safeMove(folder, title);
-%>
---
status: idea
tags:
<% tagLines %>
threads: []
tier: <% tier %>
---

## Quick Reference

<!-- One screen. Everything needed to start running this arc cold. Filler arcs: this plus the beats is often enough. -->

- **Premise:**
- **Hook:** <!-- how the party gets pulled in -->
- **What the party wants:**
- **What stands in the way:**
- **Advances:** <!-- the plot threads in `threads`, in a phrase each -->
- **Pacing dial:** <!-- Trim: what to cut if short on time. Stretch: what to add if ahead. -->

## The Truth

<!-- DM only. What is actually going on, in a few bullets. -->

### The clock

<!-- What happens if the party does nothing, step by step. -->

1.

## Social Reference

<!-- NPCs who matter here: goal, attitude, what they know, how they react under pressure. Standing DC ladder if the arc has one. -->

## Scenes

<!-- Situations, not a script. Likely play order, each with more than one way in and out.
For each: who is there, what they want, what the party can find, what changes if they leave. -->

### Scene 1:

## Fact Map

<!-- Every conclusion the party needs, with three or more clues each. Tick as revealed in play. -->

- [ ]

## Locations

<!-- One memorable detail each; link the location note. Add the main place's place/… tag to this arc's tags (no location property). -->

## Loss State

<!-- What failure looks like, and how the campaign keeps moving if it happens. -->

## Loose Threads

<!-- What this arc leaves open for later arcs. -->

---

## Play History

```datacorejsx
const { ArcHistory } = await dc.require(dc.headerLink("00 DM Screen/Code/Arc and Session Views.md", "Code"));
return ArcHistory;
```

## Paused and Abandoned Arcs

```datacorejsx
const { RelatedArcs } = await dc.require(dc.headerLink("00 DM Screen/Code/Arc and Session Views.md", "Code"));
return RelatedArcs;
```

## Design To-Dos

<!-- Work still needed on this document. Keep these here, not in the scenes. -->

- [ ]

## Connected Elements

![[Related Notes.base]]
