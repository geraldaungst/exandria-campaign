<%*
// ── Faction note: world and region, folder, optional parent faction, then writes the tags ──
// The faction's own tag is faction/<name>, or faction/<parent>/<name> for a sub-faction. NPCs carry that tag.
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
// A note created without a name has no title to build a tag from.
const ensureTitle = async (label) => {
  if (!/^Untitled/i.test(tp.file.title)) return tp.file.title;
  const name = await tp.system.prompt(`${label} name`, "");
  if (name && name.trim()) { await tp.file.rename(name.trim()); return name.trim(); }
  return tp.file.title;
};

const NO_CLUSTER = "No cluster (drop in world folder)";
const ABORT = "✕ Cancel (don't create file)";
async function abort() {
  const f = app.vault.getAbstractFileByPath(tp.file.path(true));
  if (f) await app.vault.delete(f, true);
}
const childFolders = (folder) => (folder?.children ?? []).filter((f) => f.children !== undefined);

const title = await ensureTitle("Faction");

// 1. World and region
const worldsRoot = app.vault.getAbstractFileByPath(C("folder_worlds", "Worlds"));
if (!worldsRoot) { new Notice("Could not find the worlds folder."); await abort(); return; }
const entries = worldRegionEntries(worldsRoot);
const tagLabels = [...entries.map((e) => e.label), ABORT];
const tagValues = [...entries, { label: ABORT }];
const chosen = await tp.system.suggester(tagLabels, tagValues, false, "Which world and region does this faction belong to?");
if (!chosen || chosen.label === ABORT) { await abort(); return; }
const worldTag = `world/${slug(chosen.world)}`;
const regionTag = chosen.region ? `region/${slug(chosen.region)}` : null;

// 2. Folder: the factions folder, then the world, then an optional cluster subfolder
const factionsRoot = C("folder_factions", "Characters/Factions");
const worldFactionPath = `${factionsRoot}/${chosen.world}`;
if (!app.vault.getAbstractFileByPath(worldFactionPath)) {
  if (!app.vault.getAbstractFileByPath(factionsRoot)) await app.vault.createFolder(factionsRoot);
  await app.vault.createFolder(worldFactionPath);
}
const clusters = childFolders(app.vault.getAbstractFileByPath(worldFactionPath));
let targetPath = worldFactionPath;
if (clusters.length) {
  const clusterLabels = [...clusters.map((f) => f.name), NO_CLUSTER, ABORT];
  const chosenCluster = await tp.system.suggester(clusterLabels, clusterLabels, false, "Which group folder should this faction be filed in?");
  if (!chosenCluster || chosenCluster === ABORT) { await abort(); return; }
  if (chosenCluster !== NO_CLUSTER) targetPath = `${worldFactionPath}/${chosenCluster}`;
}

// 3. Parent faction (optional): a faction already tagged in this world
const inWorld = inWorldFilter(chosen.world);
const factionNotes = liveNotes().filter((f) => f.path.startsWith(factionsRoot + "/") && (inWorld(f) || f.path.startsWith(`${factionsRoot}/${chosen.world}/`)));
const parentTag = await pickTag("faction", "parent faction", vocabulary("faction", factionNotes), "— top-level faction (no parent)", false, "Is this a sub-faction? Pick its parent faction, or none");
const ownSlug = slug(title);
if (!ownSlug) new Notice("The note name gave no usable tag. Add faction/… by hand.");
const ownTag = ownSlug ? `${parentTag ?? "faction"}/${ownSlug}` : null;
const tags = [worldTag, regionTag, ownTag].filter(Boolean);
const tagLines = tags.map((t) => `  - ${t}`).join("\n");
await tp.file.move(`${targetPath}/${title}`);
_%>
---
aliases: []
tags:
<% tagLines %>
---

# Quick Reference
**Base:** 
**Goal:** 
**Status:** 
**Influence:** 

# Leadership
**Current Leader:**

**Notable Members:**

# Culture & Methods
<!-- Philosophy, traditions, how they operate -->

# Relationships
**Allies:**
**Rivals:**
**Neutral:**

# Current Activities
<!-- What they're doing now, recent events -->

# History
<!-- Origins, major events, evolution -->

## Connected Elements

![[Related Notes.base]]
