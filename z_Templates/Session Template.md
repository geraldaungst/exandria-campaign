<%*
// Picks the campaign (only asks when there is more than one campaign note), finds that campaign's
// latest numbered session, asks quick questions (Enter accepts each default), renames the note,
// and writes the frontmatter plus the "Last time" embed.
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
const baseOf = (v) => String(v ?? "").replace(/^\[\[/, "").replace(/\]\]$/, "").replace(/\|.*$/, "").split("/").pop();
const notes = app.vault
  .getMarkdownFiles()
  .filter((f) => f.path !== tp.file.path(true) && !f.path.split("/").some((p) => p.startsWith(C("excluded_folder_prefix", "z_"))))
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

const inCampaign = (n) => !campaignTag || tagsOf(n.fm).includes(campaignTag);
const sessions = notes
  .filter((n) => tagsOf(n.fm).includes(C("tag_session", "session")) && n.fm.session_number && inCampaign(n))
  .sort((a, b) => Number(b.fm.session_number) - Number(a.fm.session_number));
const prev = sessions[0];
const prevArc = prev ? baseOf(prev.fm.arc) : "";
// In-world start = where the previous session ended (set by Close Session).
const quote = (v) => (v ? `"${String(v).replace(/"/g, "")}"` : "");
const prevEnd = prev ? prev.fm["fc-end"] ?? prev.fm["fc-date"] ?? "" : "";

const num = await tp.system.prompt("Session number", String(prev ? Number(prev.fm.session_number) + 1 : 1));
const title = await tp.system.prompt("Session title (optional, can add later)", "");
const date = await tp.system.prompt("Play date (YYYY-MM-DD)", tp.date.now("YYYY-MM-DD"));

const arcs = notes
  .filter((n) => tagsOf(n.fm).includes(C("tag_arc", "arc")) && inCampaign(n) && !["complete", "abandoned"].includes(String(n.fm.status ?? "").toLowerCase()))
  .sort((a, b) => (a.f.basename === prevArc ? -1 : b.f.basename === prevArc ? 1 : a.f.basename.localeCompare(b.f.basename)));
const arc = arcs.length
  ? await tp.system.suggester(
      arcs.map((a) => a.f.basename + (a.f.basename === prevArc ? "  (same as last session)" : `  (${a.fm.status ?? "no status"})`)),
      arcs.map((a) => a.f.basename),
      false,
      "Arc for this session"
    )
  : null;

const name = `Session ${num}` + (title ? ` - ${title}` : "");
await tp.file.rename(name);

tR += "---\n";
tR += `arc: ${arc ? `"[[${arc}]]"` : ""}\n`;
tR += `date: ${date}\n`;
tR += `previous_session: ${prev ? `"[[${prev.f.basename}]]"` : ""}\n`;
tR += `session_number: ${num}\n`;
tR += "tags:\n" + (campaignTag ? `  - ${campaignTag}\n` : "") + `  - ${C("tag_session", "session")}\n`;
tR += `fc-calendar: ${campaign?.fm.calendar ?? ""}\n`;
tR += `fc-date: ${quote(prevEnd)}\n`;
tR += "fc-end:\n";
tR += "ingame_time:\n";
tR += `fc-display-name: "Session ${num}"\n`;
tR += `fc-category: ${C("calendar_category_sessions", "Sessions")}\n`;
tR += "---\n\n";
tR += `## ${name}\n\n`;
tR += "### Last Time\n\n";
tR += prev ? `![[${prev.f.basename}#Where we left off]]\n` : "First session in this system.\n";
-%>

### Arc and Open Clues

```datacorejsx
const { SessionArc } = await dc.require(dc.headerLink("00 DM Screen/Code/Arc and Session Views.md", "Code"));
return SessionArc;
```

---

## Prep

<!-- About 20 minutes. The arc document holds the content; this is choosing from it. -->

### 0. The world since last time

<!-- What did the factions, villains, and clocks do off-screen? Check the [[Plot Dashboard]]. -->

-

### 1. Review the characters

<!-- [[Character Story Beats]]: whose goals or backstory can this session touch? -->

-

### 2. Strong start

<!-- Where are they, what happens in the first two minutes, what grabs them? -->

-

### 3. Likely scenes

<!-- Which arc scenes are likely tonight, plus anything new. About one per 45 minutes. -->

1.

### 4. Secrets and clues

<!-- The arc's unrevealed clues are listed above. Add any session-only secrets here. -->

- [ ]

### 5. NPCs, locations, monsters, rewards

<!-- Only what tonight needs that the arc doc doesn't already cover.
[[Quick NPCs]] · [[NPC Stat Block Reference Table]] · [[Location Idea Generator]] · [[Session Rewards Reference]] -->

-

---

## At the Table

- **Opening:**
- **If the PCs do nothing:**
- **Pacing:** <!-- trim / stretch -->

### Session log

<!-- Quick notes during play: names invented, rulings, promises made. -->

-

---

## Where we left off

<!-- Fill in right after the game. The hub, the next session's "Last Time", and the arc's Play History all show this section. -->

- **Party location:**
- **What happened:** <!-- link each PC who drives a bullet ([[Seraphina…), so the spotlight tracker sees them -->
  -
- **Decisions and consequences:**
  -
- **Changed at the table:** <!-- improvised facts that differ from the arc doc and must stay true -->
- **Threads moved:** <!-- link the plot notes -->
- **World next:** <!-- what happens if the party does nothing -->

## After the Game

<!-- About 10 minutes. -->

- [ ] Run the **Close Session** template (Templater: insert template): in-world end date and time, then key events for the campaign timeline
- [ ] Fill in "Where we left off"
- [ ] Tick revealed clues in the arc's Fact Map
- [ ] Open each plot note in "Threads moved" and update it
- [ ] Update `current_location` for any NPC who moved
- [ ] If the arc ended or was set aside, change its `status`
- [ ] Commit

## Connected Elements

![[Related Notes.base]]
