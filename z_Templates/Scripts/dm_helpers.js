// dm_helpers.js: shared helpers for the DM vault's Templater templates
// (NPC, Faction, Location, Encounter, Arc, Artifact-Item, Set Location, Session, Campaign and Close Session).
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
// Location: all location logic (twins, parents, pickers) is in location_core.js, a second Templater user script.
// Templates reach it only through locations() below; nothing here reads a location property.
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
  // "Ashari / Terrah" -> "faction/ashari/terrah" (prefix given); null when nothing usable was typed.
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
  // Every prefix/… tag used by the given notes, with each parent level included (faction/a/b also gives faction/a).
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
    const typed = await tp.system.prompt(`New ${noun} tag under ${prefix}/ (use / for levels, e.g. ashari/terrah)`, "");
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
  // A wiki-link to a note, shown without the DM suffix.
  const linkTo = (f) => {
    const shown = stripDm(f.basename);
    const link = app.metadataCache.fileToLinktext(f, "");
    return `[[${link}${shown !== link ? `|${shown}` : ""}]]`;
  };

  // ── Location (the core is location_core.js; this is the only way a template reaches it) ──
  const LOCATION_KEYS = [
    "prop_political_region", "prop_natural_region", "prop_whereabouts", "prop_site", "prop_ties_to",
    "tag_unplaced", "tag_deceased", "tag_location", "tag_npc", "tag_faction", "tag_item", "tag_arc", "tag_encounter", "tag_lore", "tag_pc",
    "piece_tag_prefix", "dm_note_suffix", "excluded_folder_prefix", "folder_player_wiki", "label_player_only",
  ];
  let _locations = null;
  // The location index (built once per template run). Hub Config's values over the core's own defaults.
  const locations = () => {
    if (_locations) return _locations;
    if (typeof tp.user.location_core !== "function") throw new Error("location_core.js is not loaded: check Templater's script folder (z_Templates/Scripts).");
    const cfg = {};
    for (const k of LOCATION_KEYS) if (HUB[k] !== undefined) cfg[k] = HUB[k];
    return (_locations = tp.user.location_core(app, cfg));
  };
  // Property names from Hub Config, as the core reads them.
  const PROP = {
    political: C("prop_political_region", "political_region"), natural: C("prop_natural_region", "natural_region"),
    whereabouts: C("prop_whereabouts", "whereabouts"), site: C("prop_site", "site"), ties: C("prop_ties_to", "ties_to"),
  };
  const UNPLACED = C("tag_unplaced", "unplaced");
  const titleCase = (s) => String(s).split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  // The worlds a new note can belong to: every world/ tag value in use plus the folders under the worlds folder,
  // one entry per slug. `name` is the folder name when there is a folder, else the slug in capitals (it names the new folder).
  const worldChoices = () => {
    const bySlug = new Map();
    for (const f of childFolders(app.vault.getAbstractFileByPath(C("folder_worlds", "Worlds")))) bySlug.set(slug(f.name), f.name);
    for (const f of liveNotes()) for (const t of tagsOfFile(f)) {
      const m = t.match(/^world\/([^/]+)$/);
      if (m && !bySlug.has(m[1])) bySlug.set(m[1], titleCase(m[1]));
    }
    return [...bySlug].map(([s, name]) => ({ slug: s, name, label: name })).sort((a, b) => a.name.localeCompare(b.name));
  };
  const idOf = (c) => (c.place ? c.place.key : c.file ? c.file.path : c.link);
  const fileOfChoice = (c) => (c ? c.file || (c.place && (c.place.dm || c.place.wiki)) || null : null);
  const NO_MORE = "\u0000done", NEW_PLACE = "\u0000new";
  const NEW_PLACE_LABEL = "＋ A place with no note yet (type its name)";
  // A place typed by hand because it has no note yet. The name is cleaned like a note title; a name that matches a listed
  // choice (capitals ignored) gives that choice. Otherwise the choice is { label, link, typed: true }: it is written as a
  // link to a note that does not exist yet. null when nothing usable was typed.
  const askNewPlace = async (choices) => {
    const typed = await tp.system.prompt("Name of the place (it has no note yet; the link is written as typed)", "");
    const name = String(typed ?? "").replace(/[\\/:*?"<>|#^\[\]]+/g, "-").trim();
    if (!name) return null;
    const known = choices.find((c) => [c.place && c.place.name, c.file && c.file.basename, c.link].some((x) => x && String(x).toLowerCase() === name.toLowerCase()));
    if (known) { new Notice(`"${known.label}" already has a note, so that one is used.`); return known; }
    new Notice(`"${name}" has no note yet: the link is written, and the note can be made later.`);
    return { label: name, link: name, typed: true };
  };
  const rowLabel = (c) => `${c.label}${c.typed ? "  [no note yet]" : ""}${c.playerOnly ? "  [player note only]" : ""}${c.broken ? "  [broken link]" : ""}`;
  // Multi-pick. Select an entry to add or remove it; choose Done to finish. Picked entries (■) are listed first, in the
  // order they were picked (the first is the main one), then the rest (□). `initial` are the picks to start from (a note's
  // current values). allowNew adds an entry for a place that has no note yet.
  const pickMany = async (choices, question, { noneLabel = "none", initial = [], allowNew = false } = {}) => {
    const picked = [...initial];
    let all = [...initial.filter((i) => !choices.some((c) => idOf(c) === idOf(i))), ...choices];
    for (;;) {
      const rest = all.filter((c) => !picked.some((p) => idOf(p) === idOf(c)));
      const first = picked.map((p) => all.find((c) => idOf(c) === idOf(p)) ?? p);
      const ordered = [...first, ...rest];
      const labels = [
        picked.length ? `✓ Done (${picked.length} picked)` : `✓ Done (${noneLabel})`,
        ...first.map((c, i) => `■ ${i === 0 ? "(main) " : ""}${rowLabel(c)}`),
        ...(allowNew ? [NEW_PLACE_LABEL] : []),
        ...rest.map((c) => `□ ${rowLabel(c)}`),
      ];
      const values = [NO_MORE, ...first, ...(allowNew ? [NEW_PLACE] : []), ...rest];
      const choice = await tp.system.suggester(labels, values, false, question);
      if (!choice || choice === NO_MORE) break;
      if (choice === NEW_PLACE) {
        const made = await askNewPlace(all);
        if (made && !picked.some((p) => idOf(p) === idOf(made))) { if (!all.some((c) => idOf(c) === idOf(made))) all = [made, ...all]; picked.push(made); }
        continue;
      }
      const i = picked.findIndex((p) => idOf(p) === idOf(choice));
      if (i >= 0) picked.splice(i, 1); else picked.push(choice);
    }
    return picked;
  };
  // Single pick. `extras` come first: [{ extra: "unplaced", label: "…" }]. Returns the chosen extra or choice;
  // undefined when the picker was cancelled. allowNew adds an entry for a place that has no note yet.
  const pickOne = async (choices, question, extras = [], { allowNew = false } = {}) => {
    const entries = [...extras, ...(allowNew ? [{ extra: NEW_PLACE, label: NEW_PLACE_LABEL }] : []), ...choices];
    const labels = entries.map((c) => (c.extra ? c.label : rowLabel(c)));
    const got = (await tp.system.suggester(labels, entries, false, question)) ?? undefined;
    if (got && got.extra === NEW_PLACE) return (await askNewPlace(choices)) ?? undefined;
    return got;
  };
  // Frontmatter text for location properties, each line starting with a newline so it sits directly after the
  // tag lines: a choice gives `name: "[[link]]"`, a list of choices gives a YAML list; empty values give nothing.
  const quoted = (s) => `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  const propText = (entries) =>
    entries.map(([name, v]) => {
      if (Array.isArray(v)) return v.length ? `\n${name}:\n${v.map((c) => `  - ${quoted(`[[${c.link}]]`)}`).join("\n")}` : "";
      return v ? `\n${name}: ${quoted(`[[${v.link}]]`)}` : "";
    }).join("");
  // Player-twin handling for a new DM note: the Player Wiki note of the same subject (null when none) and the
  // title the DM note should have (the DM suffix is added when a player note exists, per the naming rule).
  const withTwin = (title) => {
    const wiki = locations().playerTwinOf(stripDm(title));
    if (!wiki) return { title, wiki: null };
    const named = stripDm(title) + DM_SUFFIX;
    if (named !== title) new Notice(`A player note "${stripDm(title)}" exists, so this DM note is named "${named}".`);
    return { title: named, wiki };
  };
  // The "What players know" callout, for <% embed %> directly after the Quick Reference heading. Starts with a
  // newline and ends with one; the template's own newline then leaves a blank line before the next block.
  const embedFor = (wiki) => (wiki ? `\n> [!quote]- What players know\n> ![[${locations().linkFor(wiki, "")}]]\n` : "");

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
    pickTag, pickFactions, childFolders, inWorldFilter,
    campaignTagOf, campaignNotes, pickCampaign, campaignWorld, linkTo,
    findPath, ensureFolder, askTitle, discard, safeMove,
    stripDm, PROP, UNPLACED, locations, worldChoices, idOf, fileOfChoice, pickMany, pickOne, propText, withTwin, embedFor,
  };
};
