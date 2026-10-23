// dm_helpers.js: shared helpers for the DM vault's Templater templates
// (NPC, Faction, Location, Encounter, Arc, Artifact-Item, Session, Campaign and Close Session).
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
// The Datacore code notes can't load this file; their shared code is in 00 DM Screen/Code/Shared Helpers.md.
// The settings reader (C), the case-insensitive path lookup (findPath, ensureFolder) and the slug rule
// have counterparts there: change both together.
//
// Edit this file in a text editor (Obsidian does not open .js files). Templater reads it each time a
// template runs.

module.exports = function dmHelpers(tp, Notice) {
  // ── Settings ──────────────────────────────────────────────────────
  // From Hub Config (names and defaults match the hub code in 00 DM Screen/Code). Tag values (keys starting
  // "tag" and the …_tag_prefix keys) lose a leading "#" and are lowercased, as Shared Helpers' cfg() does.
  const HUB = (() => {
    const f = app.vault.getAbstractFileByPath("00 DM Screen/Code/Hub Config.md");
    return (f && app.metadataCache.getFileCache(f)?.frontmatter) ?? {};
  })();
  const C = (key, fallback) => {
    const v = HUB[key];
    const set = v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);
    const value = set ? v : fallback;
    if (!(key.startsWith("tag") || key.endsWith("_tag_prefix"))) return value;
    const norm = (x) => String(x).replace(/^#/, "").toLowerCase();
    return Array.isArray(value) ? value.map(norm) : norm(value);
  };
  const ABORT = "✕ Cancel (don't create file)";
  // Root of the nested "associated with a faction" tags (faction/…). A faction's own note also carries
  // the type tag C("tag_faction", "organization").
  const FACTION = C("faction_tag_prefix", "faction");
  // The suffix of a DM note that has a Player Wiki twin (" - DM"): Hub Config's dm_note_suffix, same as Shared Helpers.
  const DM_SUFFIX = C("dm_note_suffix", " - DM");
  const IGNORE_SUFFIXES = [DM_SUFFIX]; // removed from note names before they become tags
  const stripDm = (name) => (String(name).toLowerCase().endsWith(DM_SUFFIX.toLowerCase()) ? String(name).slice(0, -DM_SUFFIX.length) : String(name));

  // ── Text and tags ─────────────────────────────────────────────────
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
  const fmOf = (f) => (f && app.metadataCache.getFileCache(f)?.frontmatter) ?? {};
  // A note's tags: no "#", lowercase (Obsidian ignores capitals in tags), comma or space lists split.
  const tagsOfFile = (f) =>
    [].concat(fmOf(f).tags ?? [])
      .flatMap((t) => String(t).split(/[,\s]+/)).map((t) => t.replace(/^#/, "").toLowerCase()).filter(Boolean);
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
  // Keep only the deepest tag when a note would get both a parent and its child.
  const dropParents = (tags) => [...new Set(tags)].filter((t) => !tags.some((o) => o.startsWith(t + "/")));

  // ── Pickers ───────────────────────────────────────────────────────
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
  // Faction checklist: select an entry to check or uncheck it, choose Done when finished. Returns the checked
  // faction/… tags (may be empty). `existing` is the faction vocabulary to offer.
  const pickFactions = async (existing, question) => {
    const extra = []; // tags typed during this run
    const picked = [];
    for (;;) {
      const all = [...new Set([...existing, ...extra])].sort((a, b) => a.localeCompare(b));
      const labels = [
        picked.length ? `✓ Done (${picked.length} checked)` : "✓ Done (no faction)",
        "＋ New faction tag…",
        ...all.map((t) => `${picked.includes(t) ? "☑" : "☐"} ${levels(t, FACTION)}`),
      ];
      const choice = await tp.system.suggester(labels, ["done", "new", ...all], false, question);
      if (!choice || choice === "done") break;
      if (choice === "new") {
        const typed = await tp.system.prompt(`New faction tag under ${FACTION}/ (use / for levels, e.g. ashari/terrah)`, "");
        const tag = typed ? tagPath(typed, FACTION) : null;
        if (typed && !tag) new Notice(`"${typed}" is not a usable tag, so it was skipped.`);
        if (tag) {
          if (!all.includes(tag)) extra.push(tag);
          if (!picked.includes(tag)) picked.push(tag);
          new Notice(`Added ${tag}`);
        }
      } else if (picked.includes(choice)) {
        picked.splice(picked.indexOf(choice), 1);
      } else {
        picked.push(choice);
      }
    }
    return picked;
  };

  // ── Worlds and campaigns ──────────────────────────────────────────
  const childFolders = (folder) => (folder?.children ?? []).filter((f) => f.children !== undefined);
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
    const entries = [];
    for (const world of childFolders(worldsRoot).sort((a, b) => a.name.localeCompare(b.name))) {
      const regions = childFolders(world).flatMap((continent) => childFolders(continent).map((r) => r.name)).sort((a, b) => a.localeCompare(b));
      for (const r of regions) entries.push({ label: `${world.name} / ${r}`, world: world.name, region: r });
      entries.push({ label: `${world.name} / (no region)`, world: world.name, region: null });
    }
    return entries;
  };
  // Campaign notes (tag campaign-hub with a campaign/… tag), the active one first, then A-Z.
  const campaignTagOf = (f) => tagsOfFile(f).find((t) => t.startsWith(C("campaign_tag_prefix", "campaign/"))) ?? null;
  const campaignNotes = () => {
    const isActive = (f) => String(fmOf(f).status).toLowerCase() === "active";
    return liveNotes()
      .filter((f) => tagsOfFile(f).includes(C("tag_campaign_note", "campaign-hub")) && campaignTagOf(f))
      .sort((a, b) => isActive(b) - isActive(a) || a.basename.localeCompare(b.basename));
  };
  // The campaign for a new note. With one campaign note it is used without asking. null when there is none
  // or the picker was cancelled; check campaignNotes().length to tell the two apart.
  const pickCampaign = async (question) => {
    const list = campaignNotes();
    if (list.length <= 1) return list[0] ?? null;
    const labels = [...list.map((f) => f.basename + (fmOf(f).status ? `  (${fmOf(f).status})` : "")), ABORT];
    return (await tp.system.suggester(labels, [...list, null], false, question)) ?? null;
  };
  // The campaign note's `world` property as a plain name ("" when unset).
  const campaignWorld = (f) => String(fmOf(f).world ?? "").replace(/^\[\[|\]\]$/g, "").replace(/\|.*$/, "").trim();
  // The location notes (not Player Wiki pages) among `files` carrying placeTag, and the place's own note:
  // the one whose name matches the tag's last part ("Rexxentrum - DM" for place/rexxentrum).
  const placeNoteFor = (placeTag, files) => {
    if (!placeTag) return { note: null, tagged: [] };
    const wiki = C("folder_player_wiki", "Player Wiki") + "/";
    const loc = C("tag_location", "location");
    const tagged = files.filter((f) => !f.path.startsWith(wiki) && tagsOfFile(f).includes(loc) && tagsOfFile(f).includes(placeTag));
    return { note: tagged.find((f) => slug(f.basename) === placeTag.split("/").pop()) ?? null, tagged };
  };
  // A wiki-link to a note, shown without the DM suffix.
  const linkTo = (f) => {
    const shown = stripDm(f.basename);
    const link = app.metadataCache.fileToLinktext(f, "");
    return `[[${link}${shown !== link ? `|${shown}` : ""}]]`;
  };

  // ── Files and folders ─────────────────────────────────────────────
  // getAbstractFileByPath matches capitals exactly, but macOS treats "Place Tag" and "Place tag" as the same
  // name. findPath ignores capitals, so every "is this name taken?" check sees what the disk sees.
  const findPath = (path) => {
    const p = String(path).toLowerCase();
    return app.vault.getAllLoadedFiles().find((f) => f.path.toLowerCase() === p) ?? null;
  };
  // Makes each missing level of a folder path. A level that exists with other capitals is reused as it is.
  // Returns the folder's real path.
  const ensureFolder = async (path) => {
    let current = "";
    for (const part of String(path).split("/").filter(Boolean)) {
      const want = current ? `${current}/${part}` : part;
      const found = findPath(want);
      if (found && found.children === undefined) throw new Error(`"${found.path}" is a file, not a folder.`);
      if (!found) await app.vault.createFolder(want);
      current = found ? found.path : want;
    }
    return current;
  };
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
  // Moves (or renames) the new note to folder/title, making the folder if needed. Skips the move when it is
  // already there; adds a number if the name is taken, ignoring capitals.
  const safeMove = async (folder, title) => {
    const dir = await ensureFolder(folder);
    const self = tp.file.path(true);
    const at = (name) => (dir ? `${dir}/${name}.md` : `${name}.md`);
    const want = at(title);
    if (want === self) return;
    const taken = (p) => { const f = findPath(p); return !!f && f.path !== self; };
    let path = want, n = 2;
    while (taken(path)) path = at(`${title} ${n++}`);
    if (path !== want) new Notice(`"${title}" already exists in that folder, so this note is named "${title} ${n - 1}".`);
    await tp.file.move(path.replace(/\.md$/, ""));
  };

  return {
    C, ABORT, FACTION, slug, tagPath, fmOf, tagsOfFile, liveNotes, vocabulary, levels, dropParents,
    pickTag, pickFactions, childFolders, inWorldFilter, worldRegionEntries,
    campaignTagOf, campaignNotes, pickCampaign, campaignWorld, placeNoteFor, linkTo,
    findPath, ensureFolder, askTitle, discard, safeMove,
  };
};
