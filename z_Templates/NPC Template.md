<%*
// ── NPC note: world and region, disposition, place and factions, then writes the tags ──
// Place and faction are tags (place/…, faction/…), nested to any depth, so notes show up under every parent level.
// ── Shared helpers: the same block is in the NPC, Faction and Location templates ──
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

// 0. Name first
const title = await askTitle("NPC");
if (!title) { await abort(); return; }

// 1. World and region, from the folders under the worlds folder
const worldsRoot = app.vault.getAbstractFileByPath(C("folder_worlds", "Worlds"));
if (!worldsRoot) { new Notice("Could not find the worlds folder."); await abort(); return; }
const entries = worldRegionEntries(worldsRoot);
const labels = [...entries.map((e) => e.label), ABORT];
const values = [...entries, { label: ABORT }];
const chosen = await tp.system.suggester(labels, values, false, "Which world and region does this NPC belong to?");
if (!chosen || chosen.label === ABORT) { await abort(); return; }
const worldTag = `world/${slug(chosen.world)}`;
const regionTag = chosen.region ? `region/${slug(chosen.region)}` : null;

// 2. Disposition (set once)
const dispositions = ["indifferent", "friendly", "hostile"];
const disposition = await tp.system.suggester(dispositions, dispositions, false, "How does this NPC feel about the party?");
if (!disposition) { await abort(); return; }

// 3. Place: where this NPC is typically found. Only places already used in this world are listed.
const inWorld = liveNotes().filter(inWorldFilter(chosen.world));
const placeTag = await pickTag("place", "place", vocabulary("place", inWorld), "— none yet (adds needs-work)", true, "Where is this NPC usually found? (place tag)");

// 4. Factions: a checklist. Select an entry to check or uncheck it; choose Done when finished.
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
    "Factions for this NPC: select an entry to check or uncheck it, then choose Done"
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

// 5. Tags and file location
const tags = [
  C("tag_npc", "npc"), worldTag, regionTag,
  ...dropParents([placeTag, ...picked].filter(Boolean)),
  ...(placeTag ? [] : [C("tag_needs_work", "needs-work")]),
].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
await safeMove(C("folder_npcs", "Characters/NPCs"), title);
_%>
---
aliases: []
disposition: <% disposition %>
tags:
<% tagLines %>
---

# Quick Reference
> [!info] Essential Details
> - **Location:** 
> - **Goal:** 
> - **Attitude toward party:** 
> - **Key knowledge:** 

# Description & Roleplay
[Appearance in 2-3 sentences. Then:]
- **Voice:** 
- **Mannerisms:** 
- **Key traits:** 

# Current Situation
[What's happening with them RIGHT NOW. 
Update this as the campaign progresses.
This replaces the separate "Status" note.]

> [!secret]- Hidden Information
> [DM-only secrets, future plans, what they're hiding.
> Collapsed by default.]

> [!note]- Background
> [Condensed background — just what informs their behavior.
> If this grows beyond ~15 lines, it probably needs its own linked note.
> Link to extended background note if one exists.]

> [!note]- Stats
> [Stat block if needed. Collapsed by default.
> Many NPCs won't need this at all.]

## Connected Elements

![[Related Notes.base]]
