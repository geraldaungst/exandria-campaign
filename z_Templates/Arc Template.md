<%*
// ── Arc note: name, campaign, tier, site, then writes the tags and files it in the campaign's Arcs folder ──
// Tags: arc, campaign/…. No world, place or region tags: an arc lives inside one campaign. Properties: status (starts
// at idea), threads (empty), tier, and site (a link to the place where the arc is mainly set; none for travel or several
// places). The site is also linked under Locations so the Session Hub can find the arc.
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them.
const { C, ABORT, PROP, campaignTagOf, campaignNotes, pickCampaign, campaignWorld, linkTo,
  askTitle, discard, safeMove, locations, pickOne, fileOfChoice, propText } = tp.user.dm_helpers(tp, Notice);


// 0. Name first
const title = await askTitle("Arc Name");
if (!title) { await discard(); return; }

// 1. Campaign: from the campaign notes (tag campaign-hub); asked only when there is more than one.
if (!campaignNotes().length) { new Notice("No campaign note found (tag campaign-hub), so the arc can't be filed."); await discard(); return; }
const campaign = await pickCampaign("Which campaign is this arc for?");
if (!campaign) { await discard(); return; }
const campaignTag = campaignTagOf(campaign);

// 2. Tier
const tier = await tp.system.suggester(
  ["Standard (several sessions)", "Filler (one session)", ABORT],
  ["standard", "filler", null],
  false,
  "What kind of arc is this?"
);
if (!tier) { await discard(); return; }

// 3. Site: the place where the arc is mainly set, from the places of the campaign's world, or none.
const worldName = campaignWorld(campaign);
const site = await pickOne(locations().pickerChoices({ field: "site", world: worldName || undefined }), "Where is this arc mainly set? (site)",
  [{ extra: "none", label: "— no site (travel, several places, or none yet)" }], { allowNew: true });
if (!site) { await discard(); return; }
const siteChoice = site.extra ? null : site;

// 4. Tags and file location (the campaign folder's Arcs folder)
const tags = [C("tag_arc", "arc"), campaignTag].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
const siteProp = propText([[PROP.site, siteChoice]]);
const siteFile = fileOfChoice(siteChoice);
const locationLine = siteFile ? `- ${linkTo(siteFile)}\n\n` : siteChoice ? `- [[${siteChoice.link}]]\n\n` : "";

await safeMove(`${campaign.parent.path}/Arcs`, title);
-%>
---
status: idea
tags:
<% tagLines %>
threads: []
tier: <% tier %><% siteProp %>
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

<!-- DM only. What is actually going on, as checklist lines (- [ ]), ticked when the party learns each. Running notes the party could not learn stay plain bullets. -->

- [ ]

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

<% locationLine %><!-- One memorable detail each; link the location note. -->

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
