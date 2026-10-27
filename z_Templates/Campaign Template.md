<%*
// New campaign: asks for the campaign's name, tag, Calendarium calendar, world, status, and timeline
// note name; makes Campaigns/<name>/ with this note as its folder note; creates the timeline note.
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script), used by every template that
// runs code. Edit them there, once, for all of them.
const { C, ABORT, FACTION, slug, tagPath, fmOf, tagsOfFile, liveNotes, vocabulary, levels, dropParents, pickTag, pickFactions, childFolders,
  inWorldFilter, campaignTagOf, campaignNotes, pickCampaign, campaignWorld, linkTo,
  findPath, ensureFolder, askTitle, discard, safeMove } = tp.user.dm_helpers(tp, Notice);

const name = (await tp.system.prompt("Campaign name", ""))?.trim();
if (!name) {
  new Notice("Campaign Template: no name given; nothing created.");
  await discard();
  return;
}
const folderWanted = `${C("folder_campaigns", "Campaigns")}/${name}`;
// findPath ignores capitals, as the disk does, so "prophecy of eryndor" finds "Prophecy of Eryndor".
const existing = findPath(`${folderWanted}/${name}.md`);
if (existing) {
  new Notice(`Campaign Template: "${existing.path}" already exists; nothing created.`);
  await discard();
  return;
}
// Default tag: the campaign prefix plus the last word of the name ("Prophecy of Eryndor" gives campaign/eryndor).
const defaultTag = `${C("campaign_tag_prefix", "campaign/")}${slug(name).split("-").pop()}`;
const campaignTag = ((await tp.system.prompt("Campaign tag (used on every session and arc)", defaultTag)) || defaultTag)
  .trim()
  .replace(/^#/, "")
  .toLowerCase();
let calendars = [];
try {
  calendars = JSON.parse(await app.vault.adapter.read(`${app.vault.configDir}/plugins/calendarium/data.json`)).calendars.map((c) => c.name);
} catch (e) {}
const calendar = calendars.length
  ? (await tp.system.suggester([...calendars, "None yet"], [...calendars, ""], false, "Calendarium calendar for this campaign")) ?? ""
  : "";
// World: the name of a folder directly under Worlds/ (quick capture uses it for world tags and faction folders)
const worlds = childFolders(app.vault.getAbstractFileByPath(C("folder_worlds", "Worlds")))
  .map((f) => f.name)
  .sort();
const world = worlds.length
  ? (await tp.system.suggester([...worlds, "None yet"], [...worlds, ""], false, "World this campaign is set in")) ?? ""
  : "";
const status =
  (await tp.system.suggester(["active", "upcoming", "paused", "complete"], ["active", "upcoming", "paused", "complete"], false, "Status")) ??
  "upcoming";
const timelineName = ((await tp.system.prompt("Timeline note name", `${name} Timeline`)) || `${name} Timeline`).trim();

// The folder is reused when it exists with other capitals.
const folder = await ensureFolder(folderWanted);
await safeMove(folder, name);
const timelinePath = `${folder}/${timelineName}.md`;
if (!findPath(timelinePath)) {
  await app.vault.create(
    timelinePath,
    `---\ntags:\n  - ${campaignTag}\n  - ${C("tag_timeline", "inline-events")}\n---\n\nIn-world events of [[${name}]], oldest first. Each line is an inline event that Calendarium shows on the campaign's calendar. Add events with the Close Session template (after the game) or quick capture (during play); to add one by hand, copy a line and change the date in the bold label and in \`data-date\` (\`year-month-day\`, month as a number from 1), \`data-category\` (an exact Calendarium category name), the event name (bold, and again in \`data-name\`), and the description inside the tag. Links go after the event's closing tag, never inside it.\n`
  );
}
if (status === "active") {
  const others = campaignNotes().filter((f) => f.path !== tp.file.path(true) && String(fmOf(f).status).toLowerCase() === "active");
  if (others.length) new Notice("Another campaign is also marked active. The hubs show only one; change the other campaign's status.");
}
-%>
---
tags:
  - <% C("tag_campaign_note", "campaign-hub") %>
  - <% campaignTag %>
calendar: <% calendar %>
timeline: "[[<% timelineName %>]]"
status: <% status %>
world: <% world %>
---

# <% name %>

<!-- Campaign hub. The properties above (the campaign-hub tag, the campaign's one campaign/… tag, calendar, timeline, status, world) drive the DM hubs and templates. Add any other properties or content freely; the automation ignores them. Change `status` only when the campaign starts, pauses, or ends. -->

## Key notes

- [[<% timelineName %>]]

## Arcs

```base
filters:
  and:
    - file.inFolder(this.file.folder)
    - file.hasTag("<% C("tag_arc", "arc") %>")
views:
  - type: table
    name: Arcs by status
    groupBy:
      property: status
      direction: ASC
    order:
      - file.name
      - threads
      - tier
```

## Recent sessions

```base
filters:
  and:
    - file.inFolder(this.file.folder)
    - file.hasTag("<% C("tag_session", "session") %>")
views:
  - type: table
    name: Recent sessions
    order:
      - file.name
      - date
      - arc
      - fc-end
    sort:
      - property: session_number
        direction: DESC
    limit: 8
```

## Notes

-
