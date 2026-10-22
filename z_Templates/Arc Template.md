<%*
// Settings from Hub Config (same names and defaults as the hub code in 00 DM Screen/Code).
const HUB_CONFIG = (() => {
  const f = app.vault.getAbstractFileByPath("00 DM Screen/Code/Hub Config.md");
  return (f && app.metadataCache.getFileCache(f)?.frontmatter) ?? {};
})();
const C = (key, fallback) => {
  const v = HUB_CONFIG[key];
  if (v === undefined || v === null || v === "") return fallback;
  return key.startsWith("tag") || key === "campaign_tag_prefix" ? String(v).replace(/^#/, "").toLowerCase() : v;
};
const tagsOf = (fm) => [].concat(fm?.tags ?? []).map((t) => String(t).replace(/^#/, ""));
const notes = app.vault
  .getMarkdownFiles()
  .filter((f) => !f.path.split("/").some((p) => p.startsWith(C("excluded_folder_prefix", "z_"))))
  .map((f) => ({ f, fm: app.metadataCache.getFileCache(f)?.frontmatter ?? {} }));
// Campaigns: campaign notes (tag campaign-hub), each with one campaign/… tag; the active one is listed first.
const campaignTagsOf = (fm) => tagsOf(fm).filter((t) => t.startsWith(C("campaign_tag_prefix", "campaign/")));
const campaigns = notes
  .filter((n) => tagsOf(n.fm).includes(C("tag_campaign_note", "campaign-hub")) && campaignTagsOf(n.fm).length)
  .sort(
    (a, b) =>
      (String(b.fm.status).toLowerCase() === "active") - (String(a.fm.status).toLowerCase() === "active") ||
      a.f.basename.localeCompare(b.f.basename)
  );
const campaign =
  campaigns.length > 1
    ? await tp.system.suggester(
        campaigns.map((c) => c.f.basename + (c.fm.status ? `  (${c.fm.status})` : "")),
        campaigns,
        false,
        "Campaign"
      )
    : campaigns[0];
const campaignTag = campaign ? campaignTagsOf(campaign.fm)[0] : null;
if (campaign && campaignTagsOf(campaign.fm).length > 1)
  new Notice(`${campaign.f.basename} has more than one campaign/… tag; using ${campaignTag}.`);
if (!campaign) new Notice("No campaign note found (tag campaign-hub); the new note gets no campaign tag or calendar.");
const campaignLine = campaignTag ? `\n  - ${campaignTag}` : "";
-%>
---
status: idea
tags:
  - <% C("tag_arc", "arc") %><% campaignLine %>
threads: []
tier: <% await tp.system.suggester(["Standard (several sessions)", "Filler (one session)"], ["standard", "filler"]) %>
---

## <% tp.file.title %>

### Quick Reference

<!-- One screen. Everything needed to start running this arc cold. Filler arcs: this plus the beats is often enough. -->

- **Premise:**
- **Hook:** <!-- how the party gets pulled in -->
- **What the party wants:**
- **What stands in the way:**
- **Advances:** <!-- the plot threads in `threads`, in a phrase each -->
- **Pacing dial:** <!-- Trim: what to cut if short on time. Stretch: what to add if ahead. -->

### The Truth

<!-- DM only. What is actually going on, in a few bullets. -->

#### The clock

<!-- What happens if the party does nothing, step by step. -->

1.

### Social Reference

<!-- NPCs who matter here: goal, attitude, what they know, how they react under pressure. Standing DC ladder if the arc has one. -->

### Scenes

<!-- Situations, not a script. Likely play order, each with more than one way in and out.
For each: who is there, what they want, what the party can find, what changes if they leave. -->

#### Scene 1:

### Fact Map

<!-- Every conclusion the party needs, with three or more clues each. Tick as revealed in play. -->

- [ ]

### Locations

<!-- One memorable detail each; link the location note. Add the main place's place/… tag to this arc's tags (no location property). -->

### Loss State

<!-- What failure looks like, and how the campaign keeps moving if it happens. -->

### Loose Threads

<!-- What this arc leaves open for later arcs. -->

---

### Play History

```datacorejsx
const { ArcHistory } = await dc.require(dc.headerLink("00 DM Screen/Code/Arc and Session Views.md", "Code"));
return ArcHistory;
```

### Paused and Abandoned Arcs

```datacorejsx
const { RelatedArcs } = await dc.require(dc.headerLink("00 DM Screen/Code/Arc and Session Views.md", "Code"));
return RelatedArcs;
```

### Design To-Dos

<!-- Work still needed on this document. Keep these here, not in the scenes. -->

- [ ]

## Connected Elements

![[Related Notes.base]]
