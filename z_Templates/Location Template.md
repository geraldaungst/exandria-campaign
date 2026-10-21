<%*
// ── Location note: folder, then world, region and place tags ──
// The place tag (place/…) nests to any depth: place/port-damali/harmony-hall also shows under place/port-damali.
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

const ADD_FOLDER = "＋ Add new folder...";
const ABORT = "✕ Cancel (don't create file)";
async function abort() { await discard(); }

const title = await askTitle("Location");
if (!title) { await abort(); return; }

// Folders under the worlds folder, below the world level
const worldsRoot = app.vault.getAbstractFileByPath(C("folder_worlds", "Worlds"));
if (!worldsRoot) { new Notice("Could not find the worlds folder."); await abort(); return; }
function collectFolders(folder, depth, results) {
  if (!folder.children) return;
  for (const child of folder.children) {
    if (child.children === undefined) continue; // skip files
    if (depth >= 1) results.push(child);
    collectFolders(child, depth + 1, results);
  }
}
const allFolders = [];
collectFolders(worldsRoot, 0, allFolders);
const toLabel = (folder) => folder.path.split("/").slice(2).join(" / "); // drop the worlds folder and the world
allFolders.sort((a, b) => toLabel(a).localeCompare(toLabel(b)));
const folderLabels = allFolders.map(toLabel);

async function ensureFolderPath(vaultPath) {
  let current = "";
  for (const part of vaultPath.split("/")) {
    current = current ? `${current}/${part}` : part;
    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
  }
}

// 1. Destination folder
const chosenLabel = await tp.system.suggester([...folderLabels, ADD_FOLDER, ABORT], [...folderLabels, ADD_FOLDER, ABORT], false, "Which folder should this location go in?");
if (!chosenLabel || chosenLabel === ABORT) { await abort(); return; }
let targetVaultPath;
if (chosenLabel === ADD_FOLDER) {
  const parentLabel = await tp.system.suggester([...folderLabels, ABORT], [...folderLabels, ABORT], false, "Which folder should the new folder go inside?");
  if (!parentLabel || parentLabel === ABORT) { await abort(); return; }
  const parentFolder = allFolders[folderLabels.indexOf(parentLabel)];
  const newPath = await tp.system.prompt("New folder path (use / to create multiple levels):");
  if (!newPath || !newPath.trim()) { await abort(); return; }
  targetVaultPath = `${parentFolder.path}/${newPath.trim()}`;
  await ensureFolderPath(targetVaultPath);
} else {
  targetVaultPath = allFolders[folderLabels.indexOf(chosenLabel)].path;
}

// 2. World and region from the folder path: worlds folder / world / continent / region / …
const parts = targetVaultPath.split("/");
const worldTag = `world/${slug(parts[1])}`;
const regionTag = parts.length >= 4 ? `region/${slug(parts[3])}` : null;

// 3. Place tag: pick an existing place (applied as-is), skip it, or generate a new one
const ownSlug = slug(title);
const inWorld = liveNotes().filter(inWorldFilter(parts[1]));
const existingPlaces = vocabulary("place", inWorld);
const NONE = "— No place tag (adds needs-work)";
const NEW = "＋ Generate new place tag…";
const placeChoice = await tp.system.suggester(
  [NONE, NEW, ...existingPlaces.map((t) => levels(t, "place"))],
  [null, NEW, ...existingPlaces],
  false,
  "Which place is this location? (place tag)"
);
let placeTag = null;
if (placeChoice === NEW) {
  const typed = await tp.system.prompt("New place name (use / for levels). Default is this note's name", ownSlug);
  const own = typed ? tagPath(typed, "place") : null;
  if (typed && !own) new Notice(`"${typed}" is not a usable tag, so it was skipped.`);
  if (own) {
    const name = own.slice("place/".length);
    const where = await tp.system.suggester(
      [`Top level: place/${name}`, ...existingPlaces.map((t) => `Inside ${levels(t, "place")}: ${levels(t, "place")} / ${name.split("/").join(" / ")}`)],
      [null, ...existingPlaces],
      false,
      "Where does the new place tag go?"
    );
    placeTag = where ? `${where}/${name}` : own;
    new Notice(`Added ${placeTag}`);
  }
} else if (placeChoice) {
  placeTag = placeChoice;
}

const tags = [C("tag_location", "location"), worldTag, regionTag, placeTag, ...(placeTag ? [] : [C("tag_needs_work", "needs-work")])].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
await safeMove(targetVaultPath, title);
_%>
---
tags:
<% tagLines %>
---

# Quick Reference
**Status:** 
**Significance:** 

# Description
<!-- What does it look/feel like? Add details as needed -->

# What's Happening Now
<!-- Current plot hooks, recent events, immediate concerns -->

# Secrets
<!-- DM-only info, hidden connections -->

## Connected Elements

![[Related Notes.base]]
