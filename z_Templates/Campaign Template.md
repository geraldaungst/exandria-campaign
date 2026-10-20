<%*
// New campaign: asks for the campaign's name, tag, Calendarium calendar, world, status, and timeline
// note name; makes Campaigns/<name>/ with this note as its folder note; creates the timeline note.
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
const fail = async (msg) => {
  new Notice(`Campaign Template: ${msg}`);
  const f = app.vault.getAbstractFileByPath(tp.file.path(true));
  if (f) await app.vault.delete(f);
};
const name = (await tp.system.prompt("Campaign name", ""))?.trim();
if (!name) {
  await fail("no name given; nothing created.");
  return;
}
const folder = `${C("folder_campaigns", "Campaigns")}/${name}`;
if (app.vault.getAbstractFileByPath(`${folder}/${name}.md`)) {
  await fail(`"${folder}/${name}.md" already exists; nothing created.`);
  return;
}
const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().split(/\s+/).pop();
const campaignTag = ((await tp.system.prompt("Campaign tag (used on every session and arc)", `${C("campaign_tag_prefix", "campaign/")}${slug}`)) || `${C("campaign_tag_prefix", "campaign/")}${slug}`)
  .trim()
  .replace(/^#/, "");
let calendars = [];
try {
  calendars = JSON.parse(await app.vault.adapter.read(`${app.vault.configDir}/plugins/calendarium/data.json`)).calendars.map((c) => c.name);
} catch (e) {}
const calendar = calendars.length
  ? (await tp.system.suggester([...calendars, "None yet"], [...calendars, ""], false, "Calendarium calendar for this campaign")) ?? ""
  : "";
// World: the name of a folder directly under Worlds/ (quick capture uses it for world tags and faction folders)
const worlds = (app.vault.getAbstractFileByPath(C("folder_worlds", "Worlds"))?.children ?? [])
  .filter((f) => f.children !== undefined)
  .map((f) => f.name)
  .sort();
const world = worlds.length
  ? (await tp.system.suggester([...worlds, "None yet"], [...worlds, ""], false, "World this campaign is set in")) ?? ""
  : "";
const status =
  (await tp.system.suggester(["active", "upcoming", "paused", "complete"], ["active", "upcoming", "paused", "complete"], false, "Status")) ??
  "upcoming";
const timelineName = ((await tp.system.prompt("Timeline note name", `${name} Timeline`)) || `${name} Timeline`).trim();

if (!app.vault.getAbstractFileByPath(folder)) await app.vault.createFolder(folder);
await tp.file.move(`${folder}/${name}`);
const timelinePath = `${folder}/${timelineName}.md`;
if (!app.vault.getAbstractFileByPath(timelinePath)) {
  await app.vault.create(
    timelinePath,
    `---\ntags:\n  - ${campaignTag}\n  - ${C("tag_timeline", "inline-events")}\n---\n\nIn-world events of [[${name}]], oldest first. Each line is an inline event that Calendarium shows on the campaign's calendar. Add events with the Close Session template (after the game) or quick capture (during play); to add one by hand, copy a line and change the date in the bold label and in \`data-date\` (\`year-month-day\`, month as a number from 1), \`data-category\` (an exact Calendarium category name), the event name (bold, and again in \`data-name\`), and the description inside the tag. Links go after the event's closing tag, never inside it.\n`
  );
}
if (status === "active") {
  const others = app.vault
    .getMarkdownFiles()
    .filter((f) => f.path !== `${folder}/${name}.md`)
    .map((f) => app.metadataCache.getFileCache(f)?.frontmatter ?? {})
    .filter((fm) => [].concat(fm.tags ?? []).map(String).includes(C("tag_campaign_note", "campaign-hub")) && String(fm.status).toLowerCase() === "active");
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
