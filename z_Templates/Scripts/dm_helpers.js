// dm_helpers.js: shared helpers for the DM vault's Templater templates
// (NPC, Faction, Location, Encounter and Arc templates).
//
// Templater loads every .js file in its "Script files folder location" (set in Templater's settings
// to z_Templates/Scripts) and offers it to templates as tp.user.<file name>. This file exports one
// function. A template calls it once, passing its own tp and Notice, and gets back all the helpers:
//
//   const { askTitle, safeMove, pickTag, ... } = tp.user.dm_helpers(tp, Notice);
//
// tp is passed in because a script file does not receive it the way a template does. Notice is passed
// in so the helpers use the same Notice the template sees. app is Obsidian's global and needs no passing.
//
// Edit this file in a text editor (Obsidian does not open .js files). Templater reads it each time a
// template runs.

module.exports = function dmHelpers(tp, Notice) {
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
    const taken = (p) => app.vault.getMarkdownFiles().some((f) => f.path.toLowerCase() === p.toLowerCase());
    let path = want, n = 2;
    while (taken(path)) path = `${folder}/${title} ${n++}.md`;
    if (path !== want) new Notice(`"${title}" already exists in that folder, so this note is named "${title} ${n - 1}".`);
    await tp.file.move(path.replace(/\.md$/, ""));
  };

  return { C, slug, tagPath, tagsOfFile, liveNotes, vocabulary, levels, pickTag, inWorldFilter, worldRegionEntries, dropParents, askTitle, discard, safeMove };
};
