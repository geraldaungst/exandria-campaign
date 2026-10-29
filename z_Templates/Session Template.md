<%*
// Picks the campaign (only asks when there is more than one campaign note), finds that campaign's
// latest numbered session, asks quick questions (Enter accepts each default), renames the note,
// and writes the frontmatter plus the "Last time" embed.
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them.
const { C, ABORT, FACTION, slug, tagPath, fmOf, tagsOfFile, liveNotes, vocabulary, levels, dropParents, pickTag, pickFactions, childFolders,
  inWorldFilter, campaignTagOf, campaignNotes, pickCampaign, campaignWorld, linkTo,
  findPath, ensureFolder, askTitle, discard, safeMove } = tp.user.dm_helpers(tp, Notice);
const baseOf = (v) => String(v ?? "").replace(/^\[\[/, "").replace(/\]\]$/, "").replace(/\|.*$/, "").split("/").pop();

// Campaign: from the campaign notes (tag campaign-hub, the active one first); asked only when there is more than one.
const campaign = await pickCampaign("Campaign");
if (!campaign && campaignNotes().length) { await discard(); return; } // the campaign picker was cancelled
const campaignTag = campaign ? campaignTagOf(campaign) : null;
if (campaign && tagsOfFile(campaign).filter((t) => t.startsWith(C("campaign_tag_prefix", "campaign/"))).length > 1)
  new Notice(`${campaign.basename} has more than one campaign/… tag; using ${campaignTag}.`);
if (!campaign) new Notice("No campaign note found (tag campaign-hub); the new note gets no campaign tag or calendar.");

const inCampaign = (f) => !campaignTag || tagsOfFile(f).includes(campaignTag);
const sessions = liveNotes()
  .filter((f) => tagsOfFile(f).includes(C("tag_session", "session")) && fmOf(f).session_number && inCampaign(f))
  .sort((a, b) => Number(fmOf(b).session_number) - Number(fmOf(a).session_number));
const prev = sessions[0] ?? null;
const prevFm = fmOf(prev);
const prevArc = prev ? baseOf(prevFm.arc) : "";
// In-world start = where the previous session ended (set by Close Session).
const quote = (v) => (v ? `"${String(v).replace(/"/g, "")}"` : "");
const prevEnd = prev ? prevFm["fc-end"] ?? prevFm["fc-date"] ?? "" : "";

const num = await tp.system.prompt("Session number", String(prev ? Number(prevFm.session_number) + 1 : 1));
const title = await tp.system.prompt("Session title (optional, can add later)", "");
const date = await tp.system.prompt("Play date (YYYY-MM-DD)", tp.date.now("YYYY-MM-DD"));

const arcs = liveNotes()
  .filter((f) => tagsOfFile(f).includes(C("tag_arc", "arc")) && inCampaign(f) && !["complete", "abandoned"].includes(String(fmOf(f).status ?? "").toLowerCase()))
  .sort((a, b) => (a.basename === prevArc ? -1 : b.basename === prevArc ? 1 : a.basename.localeCompare(b.basename)));
const arc = arcs.length
  ? await tp.system.suggester(
      arcs.map((a) => a.basename + (a.basename === prevArc ? "  (same as last session)" : `  (${fmOf(a).status ?? "no status"})`)),
      arcs.map((a) => a.basename),
      false,
      "Arc for this session"
    )
  : null;

// Plan for this night: a new plan, or a continuation of an earlier night's plan (Vault Conventions, Session row).
// The Plan: line always names the note that holds the plan, never the previous night.
let cont = false, planNote = "";
if (prev) {
  const prevBody = await tp.app.vault.cachedRead(prev);
  planNote = (prevBody.match(/^Plan: \[\[([^\]|#]+)/m) ?? [])[1] ?? prev.basename;
  cont = (await tp.system.suggester(["New plan", `Continues the plan in ${planNote}`], [false, true], false, "Plan for this night")) === true;
}

const name = `Session ${num}` + (title ? ` - ${title}` : "");
// Renamed where it is. A name already taken (capitals ignored, as on macOS) gets a number instead of failing.
await safeMove(tp.file.folder(true), name);

tR += "---\n";
tR += `arc: ${arc ? `"[[${arc}]]"` : ""}\n`;
tR += `date: ${date}\n`;
tR += `previous_session: ${prev ? `"[[${prev.basename}]]"` : ""}\n`;
tR += `session_number: ${num}\n`;
tR += "tags:\n" + (campaignTag ? `  - ${campaignTag}\n` : "") + `  - ${C("tag_session", "session")}\n`;
tR += `fc-calendar: ${fmOf(campaign).calendar ?? ""}\n`;
tR += `fc-date: ${quote(prevEnd)}\n`;
tR += "fc-end:\n";
tR += "ingame_time:\n";
tR += `fc-display-name: "Session ${num}"\n`;
tR += `fc-category: ${C("calendar_category_sessions", "Sessions")}\n`;
tR += "---\n\n";
tR += `## ${name}\n\n`;
if (cont) tR += `Plan: [[${planNote}]]\n\n> [!note]- Plan\n> ![[${planNote}#Prep]]\n\n`;
tR += "### Last Time\n\n";
tR += prev ? `![[${prev.basename}#Where we left off]]\n` : "First session in this system.\n";
-%>

### Arc and Open Clues

```datacorejsx
const { SessionArc } = await dc.require(dc.headerLink("00 DM Screen/Code/Arc and Session Views.md", "Code"));
return SessionArc;
```

<%* if (!cont) { %>---

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

<%* } %>---

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
- [ ] If the arc ended or was set aside, change its `status`
- [ ] Commit

## Connected Elements

![[Related Notes.base]]
