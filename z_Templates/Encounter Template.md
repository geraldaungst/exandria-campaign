<%*
// ── Encounter note: name, campaign (sets world), place and factions, then writes the tags ──
// Tags: encounter, campaign/…, world/… (from the campaign note's world property), place/… (picked),
// region/… (copied from the place's location note), faction/… (checklist). No hand-filled properties.
// ── Shared helpers: the same block is in the NPC, Faction, Location and Encounter templates ──
// Settings come from Hub Config (names and defaults match the hub code in 00 DM Screen/Code).
const HUB = (() => {
  const f = app.vault.getAbstractFileByPath("00 DM Screen/Code/Hub Config.md");
  return (f && app.metadataCache.getFileCache(f)?.frontmatter) ?? {};
})();
const C = (key, fallback) => (HUB[key] === undefined || HUB[key] === null || HUB[key] === "" ? fallback : HUB[key]);
const IGNORE_SUFFIXES = [" - DM Notes"]; // removed from note names before they become tags

// Tag-safe segment: lowercase letters, digits, underscore, hyphen.
const slug = (text) => {
  let t = String(text).trim();
  for (const s of IGNORE_SUFFIXES) if (t.toLowerCase().endsWith(s.toLowerCase())) t = t.slice(0, -s.length);
  return t.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ")
    .replace(/['’`]/g, "").replace(/[^a-z0-9_]+/g, "-").replace(/^-+|-+$/g, "");
};
// "Zadash / Evening Nip" -> "place/zadash/evening-nip"; null when nothing usable was typed.
const tagPath = (typed, prefix) => {
  const segs = String(typed).split("/").map(slug).filter(Boolean);
  if (segs[0] === prefix) segs.shift();
  return segs.length && segs.every((s) => /\D/.test(s)) ? [prefix, ...segs].join("/") : null;
};
const tagsOfFile = (f) =>
  [].concat(app.metadataCache.getFileCache(f)?.frontmatter?.tags ?? [])
    .flatMap((t) => String(t).split(/[,\s]+/)).map((t) => t.replace(/^#/, "")).filter(Boolean);
const liveNotes = () =>
  app.vault.getMarkdownFiles().filter((f) => !f.path.split("/").some((p) => p.startsWith(C("excluded_folder_prefix", "z_"))));
// Every prefix/… tag used by the given notes, with each parent level included (place/a/b also gives place/a).
const vocabulary = (prefix, files) => {
  const out = new Set();
  for (const f of files) for (const t of tagsOfFile(f)) {
    if (!t.startsWith(prefix + "/")) continue;
    const parts = t.split("/");
    for (let i = 2; i <= parts.length; i++) out.add(parts.slice(0, i).join("/"));
  }
  return [...out].sort((a, b) => a.localeCompare(b));
};
const levels = (tag, prefix) => tag.slice(prefix.length + 1).split("/").join(" / ");
// One suggester: pick an existing tag, type a new one, or choose none. Returns a tag or null.
// `question` is the prompt shown in the search box, so say what is being chosen.
const pickTag = async (prefix, noun, existing, noneLabel, allowNew = true, question = "") => {
  const NEW = `＋ New ${noun} tag…`;
  const labels = [noneLabel, ...(allowNew ? [NEW] : []), ...existing.map((t) => levels(t, prefix))];
  const values = [null, ...(allowNew ? [NEW] : []), ...existing];
  const choice = await tp.system.suggester(labels, values, false, question || noun);
  if (!choice) return null;
  if (choice !== NEW) return choice;
  const typed = await tp.system.prompt(`New ${noun} tag under ${prefix}/ (use / for levels, e.g. zadash/evening-nip)`, "");
  const tag = typed ? tagPath(typed, prefix) : null;
  if (typed && !tag) new Notice(`"${typed}" is not a usable tag, so it was skipped.`);
  if (tag) new Notice(`Added ${tag}`);
  return tag;
};
// Tests whether a note belongs to a world: its world/… tag, or its folder under the worlds folder when it has no world tag.
const inWorldFilter = (worldName) => {
  const w = slug(worldName);
  const root = C("folder_worlds", "Worlds");
  return (f) => {
    const ws = tagsOfFile(f).filter((t) => t.startsWith("world/"));
    if (ws.length) return ws.includes(`world/${w}`);
    const p = f.path.split("/");
    return p[0] === root && slug(p[1] ?? "") === w;
  };
};
// "World / Region" choices, grouped by world (regions A-Z, then "(no region)").
const worldRegionEntries = (worldsRoot) => {
  const kids = (folder) => (folder?.children ?? []).filter((f) => f.children !== undefined);
  const entries = [];
  for (const world of kids(worldsRoot).sort((a, b) => a.name.localeCompare(b.name))) {
    const regions = kids(world).flatMap((continent) => kids(continent).map((r) => r.name)).sort((a, b) => a.localeCompare(b));
    for (const r of regions) entries.push({ label: `${world.name} / ${r}`, world: world.name, region: r });
    entries.push({ label: `${world.name} / (no region)`, world: world.name, region: null });
  }
  return entries;
};
// Keep only the deepest tag when a note would get both a parent and its child.
const dropParents = (tags) => [...new Set(tags)].filter((t) => !tags.some((o) => o.startsWith(t + "/")));
// Name of the note being created. A note still called "Untitled…" gets a prompt; a blank answer returns null (cancel).
const askTitle = async (label) => {
  if (!/^Untitled/i.test(tp.file.title)) return tp.file.title;
  const name = await tp.system.prompt(`${label} name (leave blank to cancel)`, "");
  const clean = String(name ?? "").replace(/[\\/:*?"<>|#^\[\]]+/g, "-").trim();
  return clean || null;
};
// Cancelling: the template just returns. Templater deletes the half-made note itself when a template returns nothing
// (deleting it here too made the second delete fail with ENOENT).
const discard = async () => {};
// Moves the new note to folder/title. Skips the move when it is already there; adds a number if the name is taken.
const safeMove = async (folder, title) => {
  const want = `${folder}/${title}.md`;
  if (want === tp.file.path(true)) return;
  let path = want, n = 2;
  while (app.vault.getAbstractFileByPath(path)) path = `${folder}/${title} ${n++}.md`;
  if (path !== want) new Notice(`"${title}" already exists in that folder, so this note is named "${title} ${n - 1}".`);
  await tp.file.move(path.replace(/\.md$/, ""));
};

const ABORT = "✕ Cancel (don't create file)";
async function abort() { await discard(); }
const fmOf = (f) => app.metadataCache.getFileCache(f)?.frontmatter ?? {};

// 0. Name first
const title = await askTitle("Encounter");
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
if (!campaigns.length) { new Notice("No campaign note found (tag campaign-hub), so the encounter can't be filed."); await abort(); return; }
const campaignLabels = [...campaigns.map((f) => f.basename + (fmOf(f).status ? `  (${fmOf(f).status})` : "")), ABORT];
const campaign = await tp.system.suggester(campaignLabels, [...campaigns, null], false, "Which campaign is this encounter for?");
if (!campaign) { await abort(); return; }
const campaignTag = tagsOfFile(campaign).find((t) => t.startsWith(campaignPrefix));
const worldName = String(fmOf(campaign).world ?? "").replace(/^\[\[|\]\]$/g, "").replace(/\|.*$/, "").trim();
const worldTag = worldName ? `world/${slug(worldName)}` : null;
if (!worldName) new Notice(`${campaign.basename} has no world property, so the encounter gets no world tag.`);

// 2. Place: places already used in the campaign's world, a new one, or none.
const inWorld = worldName ? liveNotes().filter(inWorldFilter(worldName)) : liveNotes();
const placeTag = await pickTag("place", "place", vocabulary("place", inWorld), "— no place (wilderness or roaming)", true, "Where does this encounter happen? (place tag)");
// Location notes carrying this place tag (not Player Wiki pages). Places inside it can carry the same tag,
// so the place's own note is the one whose name matches the tag's last part ("Rexxentrum - DM Notes" for place/rexxentrum).
const wiki = C("folder_player_wiki", "Player Wiki") + "/";
const tagged = placeTag
  ? inWorld.filter((f) => !f.path.startsWith(wiki) && tagsOfFile(f).includes(C("tag_location", "location")) && tagsOfFile(f).includes(placeTag))
  : [];
const placeNote = tagged.find((f) => slug(f.basename) === placeTag.split("/").pop()) ?? null;
// Region: from the place's own note, else from any location note with this place tag (they share it).
const regionTag = [placeNote, ...tagged].filter(Boolean).map((f) => tagsOfFile(f).find((t) => t.startsWith("region/"))).find(Boolean) ?? null;

// 3. Factions involved, enemies or allies: a checklist. Select an entry to check or uncheck it; choose Done when finished.
const factionVocab = vocabulary("faction", inWorld);
const extraFactions = []; // tags typed during this run
const picked = [];
for (;;) {
  const all = [...new Set([...factionVocab, ...extraFactions])].sort((a, b) => a.localeCompare(b));
  const labels = [
    picked.length ? `✓ Done (${picked.length} checked)` : "✓ Done (no faction)",
    "＋ New faction tag…",
    ...all.map((t) => `${picked.includes(t) ? "☑" : "☐"} ${levels(t, "faction")}`),
  ];
  const choice = await tp.system.suggester(
    labels,
    ["done", "new", ...all],
    false,
    "Factions involved in this encounter: select an entry to check or uncheck it, then choose Done"
  );
  if (!choice || choice === "done") break;
  if (choice === "new") {
    const typed = await tp.system.prompt("New faction tag under faction/ (use / for levels, e.g. ashari/terrah)", "");
    const tag = typed ? tagPath(typed, "faction") : null;
    if (typed && !tag) new Notice(`"${typed}" is not a usable tag, so it was skipped.`);
    if (tag) {
      if (!all.includes(tag)) extraFactions.push(tag);
      if (!picked.includes(tag)) picked.push(tag);
      new Notice(`Added ${tag}`);
    }
  } else if (picked.includes(choice)) {
    picked.splice(picked.indexOf(choice), 1);
  } else {
    picked.push(choice);
  }
}

// 4. Tags, the Location line, and file location (the campaign folder's Encounters folder)
const tags = [
  C("tag_encounter", "encounter"), campaignTag, worldTag, regionTag,
  ...dropParents([placeTag, ...picked].filter(Boolean)),
].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
const placeShown = placeNote ? placeNote.basename.replace(/ - DM Notes$/i, "") : "";
const placeLink = placeNote ? app.metadataCache.fileToLinktext(placeNote, "") : "";
const locationLine = placeNote
  ? `[[${placeLink}${placeShown !== placeLink ? `|${placeShown}` : ""}]]`
  : "<!-- Link the place, e.g. [[Port Damali - DM Notes|Port Damali]] -->";
const folder = `${campaign.parent.path}/Encounters`;
if (!app.vault.getAbstractFileByPath(folder)) await app.vault.createFolder(folder);
await safeMove(folder, title);
_%>
---
tags:
<% tagLines %>
---

# Encounter: <% title %>

## Setup

**Location:** <% locationLine %>

**What is this encounter for?**
<!-- Why does this encounter exist in the session? Pacing, resource drain, story beat, setpiece? -->

**Party objective:**
<!-- What do the players need to accomplish? If it's just "kill everything," add a secondary objective. -->

**Enemy objective:**
<!-- What do the enemies want? This determines their tactics. -->

---

## The Field

**Map/Environment:**
<!-- Describe or link the map. Note key terrain: cover, elevation, chokepoints, hazards. -->

**The one complication:**
<!-- Pick ONE: difficult terrain, environmental hazard, split attention, information gap, or other. -->

---

## Enemies

| Creature | Count | HP | AC | Key Action | Stat Reference |
|----------|-------|----|----|------------|----------------|
| | | | | | [[]] |
| | | | | | [[]] |

**Total enemy actions per round:**
**Does this survive the [[Encounter Design Guide#The Delete Test|Delete Test]]?** (Can the party end this in round 1 with ~120 focused damage?)

---

## Enemy Tactics

**Opening move:**
<!-- What do the enemies do in round 1? Where are they positioned? Are any hidden? -->

**Standing orders:**
<!-- Default behavior each round. Who do they target? Do they use cover? Do they focus fire or spread damage? -->

**Concentration pressure:**
<!-- Which enemy specifically threatens concentration? How? (multi-hit, area damage, grapple the caster?) -->

**Retreat/morale:**
<!-- When do they flee, surrender, or change tactics? What triggers this? -->

---

## The Shift

**What changes and when:**
<!-- What happens at round 2-3 to change the tactical picture? Reinforcements, terrain change, objective shift, reveal? -->

**Trigger:**
<!-- Is this timed (round count), conditional (HP threshold, enemy dies), or responsive (you read the table)? -->

---

## Boxed Text

> **On entering / encounter start:**
>

---

## Running Notes

*Quick-reference section for at the table. Fill this in last, after all decisions above are made.*

**Round-by-round reminders:**
- **Round 1:** 
- **Round 2-3:** 
- **Round 4+:** 

**Don't forget:**
<!-- Specific things you'll lose track of in the moment: lair actions, recharge abilities, environmental effects, morale triggers. -->
- 

**If the party is winning easily:**
<!-- What do you escalate? Reinforcements? Terrain change? Enemy desperation tactics? -->

**If the party is struggling:**
<!-- What do you pull back? Enemy retreats? Environmental hazard subsides? NPC intervention? -->

---

## Aftermath

**What changes in the world after this encounter?**

**Loot/rewards:**

**Connections to other notes:**
- 