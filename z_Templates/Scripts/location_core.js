// location_core.js: the only code that reads location properties or resolves twins.
// Spec: 00 DM Screen/Location Engine Spec.md (sections 3 and 4). Version 0.1.2.
//
// One file, loaded by two runtimes (see the last two lines):
//   - Templater user script (z_Templates/Scripts), reached through dm_helpers.js `locations()`.
//   - Datacore dc.require, reached through Shared Helpers `locations()`.
// Rules (spec 3.2): no dc. or tp. calls; input is Obsidian's `app` and a plain `cfg` object; output is
// plain data and TFile objects. Picker logic lives here; consumers only display what it returns.
//
// Vocabulary used below:
//   place   {key, name, dm, wiki, unresolved}: the identity behind any link to a location. `key` is the
//           DM note's path when it exists, else the player note's path, else "unresolved:" + linktext.
//   twin    a Player Wiki note and the DM note of the same subject (spec section 2).
//   h       a hierarchy: "political", "natural" or "both".

function createLocationIndex(app, cfg) {
  const VERSION = "0.1.2";

  // ── Settings ────────────────────────────────────────────────────
  // Names come from the caller's cfg (Hub Config through Shared Helpers or dm_helpers). The built-in values
  // below only keep the core usable when a key is missing; they match the defaults in Shared Helpers.
  const DEFAULTS = {
    prop_political_region: "political_region",
    prop_natural_region: "natural_region",
    prop_whereabouts: "whereabouts",
    prop_site: "site",
    prop_ties_to: "ties_to",
    tag_unplaced: "unplaced",
    tag_deceased: "deceased",
    tag_location: "location",
    tag_npc: "npc",
    tag_faction: "organization",
    tag_item: "artifact",
    tag_arc: "arc",
    tag_encounter: "encounter",
    tag_lore: "lore",
    tag_pc: "player",
    piece_tag_prefix: "piece",
    world_tag_prefix: "world",
    dm_note_suffix: " - DM",
    excluded_folder_prefix: "z_",
    folder_player_wiki: "Player Wiki",
    label_player_only: "player note only",
  };
  const C = Object.assign({}, DEFAULTS);
  for (const k of Object.keys(cfg || {})) {
    const v = cfg[k];
    if (v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)) C[k] = v;
  }
  const lc = (s) => String(s).replace(/^#/, "").toLowerCase();
  const T = {
    location: lc(C.tag_location), npc: lc(C.tag_npc), organization: lc(C.tag_faction), artifact: lc(C.tag_item),
    arc: lc(C.tag_arc), encounter: lc(C.tag_encounter), lore: lc(C.tag_lore), pc: lc(C.tag_pc),
    unplaced: lc(C.tag_unplaced), deceased: lc(C.tag_deceased), piece: lc(C.piece_tag_prefix), world: lc(C.world_tag_prefix),
  };
  const P = {
    political: C.prop_political_region, natural: C.prop_natural_region, whereabouts: C.prop_whereabouts,
    site: C.prop_site, ties: C.prop_ties_to,
  };
  const SUFFIX = C.dm_note_suffix;
  const WIKI_PREFIX = String(C.folder_player_wiki).replace(/\/+$/, "") + "/";
  const KIND_TAG = { npc: T.npc, organization: T.organization, artifact: T.artifact, location: T.location, arc: T.arc, encounter: T.encounter };

  // ── Reading properties ──────────────────────────────────────────
  const LINK_G = /\[\[([^\]|#]*?)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g;

  // Every link in a property value, as link text. Handles "[[A]]", ["[[A]]", "[[B]]"], and the nested arrays
  // YAML makes of an unquoted [[A]].
  function linkTexts(value) {
    const out = [];
    (function walk(x) {
      if (x === undefined || x === null) return;
      if (Array.isArray(x)) return x.forEach(walk);
      if (typeof x === "object") { if (x.path) out.push(String(x.path)); return; }
      const s = String(x).trim();
      if (!s) return;
      const found = [...s.matchAll(LINK_G)].map((m) => m[1].trim()).filter(Boolean);
      if (found.length) out.push(...found); else out.push(s);
    })(value);
    return out;
  }

  function tagsOfCache(cache) {
    const out = new Set();
    const add = (t) => { const s = lc(String(t).trim()); if (s) out.add(s); };
    const fmTags = cache && cache.frontmatter ? (cache.frontmatter.tags ?? cache.frontmatter.tag) : null;
    if (Array.isArray(fmTags)) fmTags.forEach(add);
    else if (typeof fmTags === "string") fmTags.split(/[\s,]+/).forEach(add);
    for (const t of (cache && cache.tags) || []) add(t.tag);
    return out;
  }

  const tagMatch = (tags, tag) => { for (const t of tags) if (t === tag || t.startsWith(tag + "/")) return true; return false; };

  // ── Scan (once) ─────────────────────────────────────────────────
  const baseName = (path) => path.replace(/^.*\//, "").replace(/\.md$/, "");
  const isExcludedPath = (path) => path.split("/").slice(0, -1).some((seg) => seg.startsWith(C.excluded_folder_prefix));
  const stripSuffix = (name) => (SUFFIX && name.endsWith(SUFFIX) ? name.slice(0, -SUFFIX.length) : name);

  const allFiles = app.vault.getMarkdownFiles();
  const infos = new Map(); // path -> info (indexed files only: outside excluded folders)

  function mkInfo(file) {
    const cache = app.metadataCache.getFileCache(file) || {};
    const path = file.path;
    return {
      file, path, name: file.basename ?? baseName(path), cache,
      fm: cache.frontmatter || {}, tags: tagsOfCache(cache),
      isWiki: path.startsWith(WIKI_PREFIX), twin: null,
    };
  }
  for (const f of allFiles) if (!isExcludedPath(f.path)) infos.set(f.path, mkInfo(f));
  const sorted = [...infos.values()].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));

  // Twins by name. Wiki "X" pairs with a DM note "X - DM" or an "X" outside Player Wiki (spec 3.3).
  const wikiByName = new Map(), dmByName = new Map();
  for (const inf of sorted) {
    const m = inf.isWiki ? wikiByName : dmByName;
    if (!m.has(inf.name)) m.set(inf.name, inf);
  }
  for (const inf of sorted) {
    inf.twin = inf.isWiki
      ? (dmByName.get(inf.name + SUFFIX) || dmByName.get(inf.name) || null)
      : (wikiByName.get(stripSuffix(inf.name)) || null);
  }

  // Files outside the index (a link into z_ resolves there) still work; they get an info on demand.
  const lazy = new Map();
  function infoOf(file) {
    return infos.get(file.path) || lazy.get(file.path) || (lazy.set(file.path, mkInfo(file)), lazy.get(file.path));
  }

  // ── Places and twins (spec 3.3) ─────────────────────────────────
  const placeCache = new Map(); // key -> place
  const placeInfos = new Map(); // key -> { dm: info|null, wiki: info|null }

  function placeOfInfo(inf) {
    const dm = inf.isWiki ? inf.twin : inf;
    const wiki = inf.isWiki ? inf : inf.twin;
    const key = (dm || wiki).path;
    let p = placeCache.get(key);
    if (!p) {
      p = { key, name: stripSuffix((dm || wiki).name), dm: dm ? dm.file : null, wiki: wiki ? wiki.file : null, unresolved: false };
      placeCache.set(key, p);
      placeInfos.set(key, { dm, wiki });
    }
    return p;
  }
  const placeOfFile = (file) => placeOfInfo(infoOf(file));

  function parseLinkText(link) {
    if (link && typeof link === "object") return String(link.path ?? link.linktext ?? link.link ?? "");
    const s = String(link ?? "").trim();
    const m = new RegExp(LINK_G.source).exec(s);
    return (m ? m[1] : s).trim();
  }

  function placeOf(link, sourcePath) {
    const text = parseLinkText(link);
    const dest = text ? app.metadataCache.getFirstLinkpathDest(text, sourcePath || "") : null;
    if (!dest || (dest.extension && dest.extension !== "md")) {
      const key = "unresolved:" + text;
      let p = placeCache.get(key);
      if (!p) { p = { key, name: text, dm: null, wiki: null, unresolved: true }; placeCache.set(key, p); }
      return p;
    }
    return placeOfFile(dest);
  }

  const isFileLike = (x) => x && typeof x === "object" && typeof x.path === "string" && (x.basename !== undefined || x.extension !== undefined);
  function asPlace(x, sourcePath) {
    if (!x) return null;
    if (typeof x === "object" && typeof x.key === "string" && "unresolved" in x) return x;
    if (isFileLike(x)) return placeOfFile(x);
    return placeOf(x, sourcePath);
  }
  function asFile(x) {
    if (!x) return null;
    if (typeof x === "object" && typeof x.key === "string" && "unresolved" in x) return x.dm || x.wiki;
    if (isFileLike(x)) return x;
    if (typeof x === "string") {
      const i = infos.get(x);
      if (i) return i.file;
      return app.vault.getAbstractFileByPath ? app.vault.getAbstractFileByPath(x) : null;
    }
    return null;
  }

  function entityOf(file) {
    const inf = infoOf(file);
    if (inf.isWiki && inf.twin) return { file: inf.twin.file, playerOnly: false };
    return { file, playerOnly: inf.isWiki && !inf.twin };
  }
  function isPlayerOnly(file) { const i = infoOf(file); return i.isWiki && !i.twin; }

  // ── Note kinds ──────────────────────────────────────────────────
  const hasTag = (inf, tag) => tagMatch(inf.tags, tag);
  const placeKeyInfos = (place) => placeInfos.get(place.key) || { dm: null, wiki: null };
  function isPlaceInfo(inf) {
    const pi = placeKeyInfos(placeOfInfo(inf));
    return !!((pi.dm && hasTag(pi.dm, T.location)) || (pi.wiki && hasTag(pi.wiki, T.location)));
  }
  const isPlaceKey = (place) => { const pi = placeInfos.get(place.key); return !!pi && ((pi.dm && hasTag(pi.dm, T.location)) || (pi.wiki && hasTag(pi.wiki, T.location))); };
  const isPersonInfo = (inf) => hasTag(inf, T.npc) || hasTag(inf, T.pc);
  const kindsOf = (inf) => Object.keys(KIND_TAG).filter((k) => hasTag(inf, KIND_TAG[k]));

  const worldPrefix = T.world + "/";
  function worldsOfInfo(inf) { return [...inf.tags].filter((t) => t.startsWith(worldPrefix)).map((t) => t.slice(worldPrefix.length)); }
  function worldsOfPlace(place) {
    const pi = placeInfos.get(place.key); if (!pi) return [];
    const dmW = pi.dm ? worldsOfInfo(pi.dm) : [];
    return dmW.length ? dmW : (pi.wiki ? worldsOfInfo(pi.wiki) : []);
  }
  const worldSlug = (w) => lc(w).replace(new RegExp("^" + worldPrefix), "").replace(/['’]/g, "").replace(/\s+/g, "-");

  // The place notes of the index, one per place key.
  let _placeList = null;
  function allPlaces() {
    if (_placeList) return _placeList;
    const seen = new Set(), out = [];
    for (const inf of sorted) {
      if (!isPlaceInfo(inf)) continue;
      const p = placeOfInfo(inf);
      if (seen.has(p.key)) continue;
      seen.add(p.key); out.push(p);
    }
    return (_placeList = out);
  }
  const placeFile = (p) => p.dm || p.wiki;

  // ── Hierarchy ───────────────────────────────────────────────────
  const dedupe = (places) => { const s = new Set(), o = []; for (const p of places) if (!s.has(p.key)) { s.add(p.key); o.push(p); } return o; };

  // Raw parents: effective list per hierarchy (the DM note's list when non-empty, else the player note's).
  // Includes unresolved places and the place itself if it lists itself; the checks need both.
  function rawParents(place, h) {
    const pi = placeInfos.get(place.key);
    if (!pi) return [];
    const read = (prop) => {
      for (const inf of [pi.dm, pi.wiki]) {
        if (!inf) continue;
        const t = linkTexts(inf.fm[prop]);
        if (t.length) return t.map((x) => placeOf(x, inf.path));
      }
      return [];
    };
    if (h === "political") return dedupe(read(P.political));
    if (h === "natural") return dedupe(read(P.natural));
    return dedupe(read(P.political).concat(read(P.natural)));
  }
  function parents(place, h) {
    place = asPlace(place);
    return rawParents(place, h || "both").filter((p) => !p.unresolved && p.key !== place.key);
  }
  function trail(place, h) {
    place = asPlace(place);
    const seen = new Set([place.key]), out = [];
    let cur = place;
    for (;;) {
      const first = parents(cur, h)[0];
      if (!first || seen.has(first.key)) break;
      seen.add(first.key); out.push(first); cur = first;
    }
    return out;
  }
  function ancestors(place, h) {
    place = asPlace(place);
    const seen = new Set([place.key]), out = [], queue = [place];
    while (queue.length) {
      for (const p of parents(queue.shift(), h)) if (!seen.has(p.key)) { seen.add(p.key); out.push(p); queue.push(p); }
    }
    return out;
  }
  const childMaps = {};
  function childMap(h) {
    if (childMaps[h]) return childMaps[h];
    const m = new Map();
    for (const p of allPlaces()) for (const par of parents(p, h)) {
      if (!m.has(par.key)) m.set(par.key, []);
      m.get(par.key).push(p);
    }
    return (childMaps[h] = m);
  }
  function descendants(place, h) {
    place = asPlace(place);
    const map = childMap(h || "both");
    const seen = new Set([place.key]), out = [], queue = [place];
    while (queue.length) {
      for (const c of map.get(queue.shift().key) || []) if (!seen.has(c.key)) { seen.add(c.key); out.push(c); queue.push(c); }
    }
    return out;
  }
  function isWithinPlace(x, place, h) {
    if (!x || !place) return false;
    if (x.key === place.key) return true;
    return ancestors(x, h).some((a) => a.key === place.key);
  }

  // ── Where is something ──────────────────────────────────────────
  const firstLink = (inf, prop) => linkTexts(inf.fm[prop])[0];

  function whereIs(file, opts) {
    opts = opts || {};
    const party = opts.partyPlace ? asPlace(opts.partyPlace) : null;
    const via = [], seen = new Set();
    let cur = entityOf(asFile(file)).file, hop = null;
    for (;;) {
      const inf = infoOf(cur);
      if (seen.has(inf.path)) return { place: null, via, source: "loop" };
      seen.add(inf.path);
      if (isPlaceInfo(inf)) return { place: placeOfInfo(inf), via, source: hop || "self" };
      if (hasTag(inf, T.pc)) return { place: party, via, source: "party" };
      let prop = P.whereabouts, text = firstLink(inf, prop);
      if (!text) { prop = P.site; text = firstLink(inf, prop); }
      if (text) {
        const dest = app.metadataCache.getFirstLinkpathDest(text, inf.path);
        if (!dest || (dest.extension && dest.extension !== "md")) return { place: null, via, source: "none" };
        if (!hop) hop = prop === P.site ? "site" : "whereabouts";
        const next = entityOf(dest).file;
        if (!isPlaceInfo(infoOf(next)) && !hasTag(infoOf(next), T.pc)) via.push(next);
        cur = next;
        continue;
      }
      if (hasTag(inf, T.unplaced)) return { place: null, via, source: "unplaced" };
      if (hasTag(inf, T.deceased)) return { place: null, via, source: "deceased" };
      return { place: null, via, source: "none" };
    }
  }

  function tiePlaces(file) {
    const inf = infoOf(entityOf(file).file);
    return linkTexts(inf.fm[P.ties]).map((t) => placeOf(t, inf.path)).filter((p) => !p.unresolved);
  }

  function within(file, place, opts) {
    opts = opts || {};
    const h = opts.h || "both";
    place = asPlace(place);
    if (!place) return false;
    const w = whereIs(file, { partyPlace: opts.partyPlace });
    if (w.place && isWithinPlace(w.place, place, h)) return true;
    if (opts.ties) return tiePlaces(file).some((t) => isWithinPlace(t, place, h));
    return false;
  }

  function entitiesWithin(place, opts) {
    opts = opts || {};
    place = asPlace(place);
    const kinds = opts.kinds && opts.kinds.length ? opts.kinds : Object.keys(KIND_TAG);
    const out = [], seenKeys = new Set();
    for (const inf of sorted) {
      if (inf.isWiki && inf.twin) continue; // reached through the DM note
      if (hasTag(inf, T.pc)) continue;
      const ks = kindsOf(inf);
      if (!ks.some((k) => kinds.includes(k))) continue;
      if (isPlaceInfo(inf)) { // a place is listed once and never inside itself
        const p = placeOfInfo(inf);
        if (p.key === place.key || seenKeys.has(p.key)) continue;
        seenKeys.add(p.key);
      }
      if (within(inf.file, place, { h: opts.h, ties: opts.ties, partyPlace: opts.partyPlace })) out.push(inf.file);
    }
    return out;
  }

  // ── Links and pickers ───────────────────────────────────────────
  // The link text to write: the DM note when one exists, path-qualified when the plain name is ambiguous.
  function linkFor(target, sourcePath) {
    if (typeof target === "string") target = asPlace(target, sourcePath);
    let file = null;
    if (target && typeof target === "object" && typeof target.key === "string" && "unresolved" in target) {
      if (target.unresolved) return target.name;
      file = placeFile(target);
    } else file = asFile(target);
    if (!file) return "";
    if (isFileLike(file)) { const inf = infoOf(file); if (inf.isWiki && inf.twin) file = inf.twin.file; }
    const name = file.basename ?? baseName(file.path);
    const dest = app.metadataCache.getFirstLinkpathDest(name, sourcePath || "");
    return dest && dest.path === file.path ? name : file.path.replace(/\.md$/, "");
  }
  const wikiLink = (target, sourcePath) => { const t = linkFor(target, sourcePath); return t ? "[[" + t + "]]" : ""; };

  const trailLabel = (place) => [place.name].concat(trail(place, "both").map((p) => p.name)).join(" · ");

  function pickerChoices(opts) {
    opts = opts || {};
    const field = opts.field;
    const forFile = opts.forFile ? asFile(opts.forFile) : null;
    const forPath = forFile ? forFile.path : "";
    const slug = opts.world ? worldSlug(opts.world) : null;
    const inWorld = (worlds) => !slug || worlds.includes(slug);
    const selfPlace = forFile && isPlaceInfo(infoOf(forFile)) ? placeOfFile(forFile) : null;

    const excluded = new Set();
    if (selfPlace) {
      excluded.add(selfPlace.key);
      const h = field === "political_region" || field === P.political ? "political"
        : field === "natural_region" || field === P.natural ? "natural" : null;
      if (h) for (const d of descendants(selfPlace, h)) excluded.add(d.key);
    }
    const selfInfo = forFile ? infoOf(entityOf(forFile).file) : null;
    const placeChoices = () => allPlaces()
      .filter((p) => !excluded.has(p.key) && inWorld(worldsOfPlace(p)))
      .map((p) => ({ label: trailLabel(p), place: p, link: linkFor(p, forPath), playerOnly: !p.dm }));
    const fileChoice = (inf) => ({ label: stripSuffix(inf.name), file: inf.file, link: linkFor(inf.file, forPath), playerOnly: inf.isWiki && !inf.twin });
    const byLabel = (a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0);
    const dmLevel = (inf) => !(inf.isWiki && inf.twin);

    // The field may be given by its canonical name or by the configured property name.
    const canon = { political_region: P.political, natural_region: P.natural, whereabouts: P.whereabouts, site: P.site, ties_to: P.ties };
    const name = Object.keys(canon).find((k) => k === field || canon[k] === field);
    let out = [];
    if (name === "political_region" || name === "natural_region" || name === "site") out = placeChoices();
    else if (name === "whereabouts") {
      out = placeChoices();
      const isItem = opts.kind === "item" || (selfInfo && hasTag(selfInfo, T.artifact));
      if (isItem) {
        for (const inf of sorted) {
          if (!dmLevel(inf) || !isPersonInfo(inf) || (selfInfo && inf.path === selfInfo.path)) continue;
          const ws = worldsOfInfo(inf);
          if (ws.length && !inWorld(ws)) continue;
          out.push(fileChoice(inf));
        }
      }
    } else if (name === "ties_to") {
      out = placeChoices();
      for (const inf of sorted) {
        if (!dmLevel(inf) || isPlaceInfo(inf) || (selfInfo && inf.path === selfInfo.path)) continue;
        if (!hasTag(inf, T.organization) && !hasTag(inf, T.lore)) continue;
        const ws = worldsOfInfo(inf);
        if (ws.length && !inWorld(ws)) continue;
        out.push(fileChoice(inf));
      }
    }
    // Parent pickers list the places other places already use as that parent first (most used first), so the
    // regions in daily use sit at the top; ties and unused places follow in label order.
    if (name === "political_region" || name === "natural_region") {
      const h = name === "political_region" ? "political" : "natural";
      const used = new Map();
      for (const p of allPlaces()) for (const q of rawParents(p, h)) if (!q.unresolved) used.set(q.key, (used.get(q.key) || 0) + 1);
      return out.sort((a, b) => (used.get(b.place.key) || 0) - (used.get(a.place.key) || 0) || byLabel(a, b));
    }
    return out.sort(byLabel);
  }

  // The player note of a subject, found by name: for a DM note being created ("Ilya the Sorceress" or
  // "Ilya the Sorceress - DM"). null when there is none. Templates use it to name the DM note and add the embed.
  function playerTwinOf(name) {
    const inf = wikiByName.get(stripSuffix(String(name === undefined || name === null ? "" : name).trim()));
    return inf ? inf.file : null;
  }

  // What a note has now in a location field, as picker choices ({ label, place|file, link }) in the written order.
  // A link that does not resolve comes back as { label, link, broken: true }. Used by Set Location to show the
  // current value and to pre-check a multi-pick.
  function currentChoices(file, field) {
    file = asFile(file);
    if (!file) return [];
    const canon = { political_region: P.political, natural_region: P.natural, whereabouts: P.whereabouts, site: P.site, ties_to: P.ties };
    const name = Object.keys(canon).find((k) => k === field || canon[k] === field);
    if (!name) return [];
    const out = [];
    for (const text of linkTexts(infoOf(file).fm[canon[name]])) {
      const p = placeOf(text, file.path);
      if (p.unresolved) { out.push({ label: p.name, link: p.name, broken: true }); continue; }
      if (isPlaceKey(p)) { out.push({ label: trailLabel(p), place: p, link: linkFor(p, file.path), playerOnly: !p.dm }); continue; }
      const f = p.dm || p.wiki;
      out.push({ label: p.name, file: f, link: linkFor(f, file.path), playerOnly: !p.dm });
    }
    return out;
  }

  // ── Checks (spec section 4) ─────────────────────────────────────
  // Each check is one registry entry: { id, n, label, kind, run() }. run() returns [{ file, detail, also? }].
  const nm = (inf) => stripSuffix(inf.name);
  const propsList = [["political_region", P.political], ["natural_region", P.natural], ["whereabouts", P.whereabouts], ["site", P.site], ["ties_to", P.ties]];

  function sccLoops(h) {
    // Tarjan over place keys; a component of more than one place, or a place listing itself, is a loop.
    const places = allPlaces(), idx = new Map(), low = new Map(), onStack = new Set(), stack = [], comps = [];
    let counter = 0;
    const edges = (p) => rawParents(p, h).filter((x) => !x.unresolved && placeInfos.has(x.key));
    function strong(p) {
      idx.set(p.key, counter); low.set(p.key, counter); counter++; stack.push(p); onStack.add(p.key);
      for (const q of edges(p)) {
        if (!idx.has(q.key)) { strong(q); low.set(p.key, Math.min(low.get(p.key), low.get(q.key))); }
        else if (onStack.has(q.key)) low.set(p.key, Math.min(low.get(p.key), idx.get(q.key)));
      }
      if (low.get(p.key) === idx.get(p.key)) {
        const comp = []; let q;
        do { q = stack.pop(); onStack.delete(q.key); comp.push(q); } while (q.key !== p.key);
        if (comp.length > 1 || edges(p).some((e) => e.key === p.key)) comps.push(comp);
      }
    }
    for (const p of places) if (!idx.has(p.key)) strong(p);
    // Parents outside allPlaces() (a parent that is not a place note) can join a loop too; start from them as well.
    return comps;
  }

  const REGISTRY = [
    { n: 1, id: "no-parent", label: "Places with no parent", kind: "review", run() {
      const out = [];
      for (const p of allPlaces()) {
        if (rawParents(p, "both").length === 0) out.push({ file: placeFile(p), detail: "no political_region or natural_region (only top places should appear)" });
      }
      return out;
    } },
    { n: 2, id: "loop", label: "Loops", kind: "error", run() {
      const out = [];
      for (const h of ["political", "natural"]) {
        for (const comp of sccLoops(h)) {
          const rep = comp.slice().sort((a, b) => (a.key < b.key ? -1 : 1))[0];
          out.push({ file: placeFile(rep), detail: "loop in " + (h === "political" ? P.political : P.natural) + ": " + comp.map((p) => p.name).sort().join(", "), also: comp.map((p) => placeFile(p).path) });
        }
      }
      // whereabouts chains (item held by an item held by the first)
      const reported = new Set();
      for (const inf of sorted) {
        if (inf.isWiki && inf.twin) continue;
        if (!firstLink(inf, P.whereabouts)) continue;
        const idxm = new Map(), seq = [];
        let cur = inf, cycle = null;
        for (;;) {
          if (idxm.has(cur.path)) { cycle = seq.slice(idxm.get(cur.path)); break; }
          idxm.set(cur.path, seq.length); seq.push(cur);
          if (isPlaceInfo(cur)) break;
          const t = firstLink(cur, P.whereabouts);
          if (!t) break;
          const dest = app.metadataCache.getFirstLinkpathDest(t, cur.path);
          if (!dest) break;
          cur = infoOf(entityOf(dest).file);
        }
        if (!cycle) continue;
        const rep = cycle.slice().sort((a, b) => (a.path < b.path ? -1 : 1))[0];
        if (reported.has(rep.path)) continue;
        reported.add(rep.path);
        out.push({ file: rep.file, detail: "loop in " + P.whereabouts + ": " + cycle.map(nm).sort().join(", "), also: cycle.map((c) => c.path) });
      }
      return out;
    } },
    { n: 3, id: "broken-link", label: "Broken or wrong-kind location links", kind: "error", run() {
      const out = [];
      for (const inf of sorted) {
        const kinds = kindsOf(inf);
        for (const [label, prop] of propsList) {
          const texts = linkTexts(inf.fm[prop]);
          if (label === "whereabouts" && texts.length > 1) out.push({ file: inf.file, detail: prop + " holds " + texts.length + " links; it takes one" });
          for (const t of texts) {
            const p = placeOf(t, inf.path);
            if (p.unresolved) { out.push({ file: inf.file, detail: prop + ": [[" + t + "]] does not resolve" }); continue; }
            const isPlace = isPlaceKey(p);
            const pi = placeInfos.get(p.key);
            const person = !!pi && ((pi.dm && isPersonInfo(pi.dm)) || (pi.wiki && isPersonInfo(pi.wiki)));
            let bad = null;
            if (label === "political_region" || label === "natural_region" || label === "site") { if (!isPlace) bad = "is not a place"; }
            else if (label === "whereabouts") {
              if (kinds.includes("npc")) { if (!isPlace) bad = "is not a place (an NPC's whereabouts must be a place)"; }
              else if (!isPlace && !person) bad = "is not a place or a person";
            }
            if (bad) out.push({ file: inf.file, detail: prop + ": [[" + t + "]] " + bad });
          }
        }
      }
      return out;
    } },
    { n: 4, id: "unplaced-conflict", label: "unplaced together with whereabouts or site", kind: "error", run() {
      const out = [];
      for (const inf of sorted) {
        if (!hasTag(inf, T.unplaced)) continue;
        const has = [P.whereabouts, P.site].filter((p) => linkTexts(inf.fm[p]).length);
        if (has.length) out.push({ file: inf.file, detail: "tagged " + T.unplaced + " and has " + has.join(" and ") });
      }
      return out;
    } },
    { n: 5, id: "missing-location", label: "NPCs, factions and items with no location", kind: "error", run() {
      const out = [];
      for (const inf of sorted) {
        if (inf.isWiki || hasTag(inf, T.pc)) continue;
        const ks = kindsOf(inf);
        const npc = ks.includes("npc");
        if (!(npc || ks.includes("organization") || ks.includes("artifact"))) continue;
        if (npc && hasTag(inf, T.deceased)) continue;
        if (linkTexts(inf.fm[P.whereabouts]).length || hasTag(inf, T.unplaced)) continue;
        out.push({ file: inf.file, detail: "no " + P.whereabouts + " and not tagged " + T.unplaced });
      }
      return out;
    } },
    { n: 6, id: "world-mismatch", label: "Parent in a different world", kind: "error", run() {
      const out = [];
      for (const inf of sorted) {
        const w = worldsOfInfo(inf);
        if (!w.length) continue;
        for (const [label, prop] of [["political", P.political], ["natural", P.natural]]) {
          for (const t of linkTexts(inf.fm[prop])) {
            const p = placeOf(t, inf.path);
            if (p.unresolved) continue;
            const pw = worldsOfPlace(p);
            if (pw.length && !pw.some((x) => w.includes(x))) out.push({ file: inf.file, detail: prop + ": " + p.name + " is in " + T.world + "/" + pw.join(", ") + " but this note is in " + T.world + "/" + w.join(", ") });
          }
        }
      }
      return out;
    } },
    { n: 7, id: "player-leak", label: "Player notes linking outside Player Wiki", kind: "error", run() {
      const out = [];
      for (const inf of sorted) {
        if (!inf.isWiki) continue;
        for (const [, prop] of propsList) {
          for (const t of linkTexts(inf.fm[prop])) {
            const dest = app.metadataCache.getFirstLinkpathDest(t, inf.path);
            if (dest && !dest.path.startsWith(WIKI_PREFIX)) out.push({ file: inf.file, detail: prop + ": [[" + t + "]] points outside " + C.folder_player_wiki + " (a leak)" });
          }
        }
      }
      return out;
    } },
    { n: 8, id: "part-of", label: "Player place: Part of differs from first parent", kind: "error", run() {
      const out = [];
      for (const inf of sorted) {
        if (!inf.isWiki || !hasTag(inf, T.location)) continue;
        const first = linkTexts(inf.fm[P.political])[0] ?? linkTexts(inf.fm[P.natural])[0];
        const part = partOfLink(inf);
        if (!first && !part) continue;
        const fp = first ? placeOf(first, inf.path) : null;
        const pp = part ? placeOf(part, inf.path) : null;
        if (fp && pp && fp.key === pp.key) continue;
        out.push({ file: inf.file, detail: "Part of " + (pp ? pp.name : "(none)") + " but first parent is " + (fp ? fp.name : "(none)") });
      }
      return out;
    } },
    { n: 9, id: "embed", label: "What players know embed", kind: "error", run() {
      const out = [];
      for (const inf of sorted) {
        const embeds = (inf.cache.embeds || []).map((e) => app.metadataCache.getFirstLinkpathDest(parseLinkText(e.link), inf.path)).filter(Boolean);
        if (!inf.isWiki && inf.twin && !embeds.some((d) => d.path === inf.twin.path)) {
          out.push({ file: inf.file, detail: "has a player note (" + inf.twin.name + ") but no \"What players know\" embed of it" });
        }
        if (inf.isWiki) for (const d of embeds) {
          if (!d.path.startsWith(WIKI_PREFIX)) out.push({ file: inf.file, detail: "embeds a DM note (" + baseName(d.path) + "); embeds go from DM to player only" });
        }
      }
      return out;
    } },
    // Check 10 is parsed in Artifact Pieces (History holder vs whereabouts), which reports it with this id.
    { n: 10, id: "piece-holder", label: "Artifact piece: History holder differs from whereabouts", kind: "error", run() { return []; } },
    { n: 11, id: "player-only", label: "Player notes with no DM note", kind: "review", run() {
      const out = [];
      for (const inf of sorted) {
        if (!inf.isWiki || inf.twin) continue;
        const ks = kindsOf(inf).filter((k) => k !== "arc" && k !== "encounter");
        if (ks.length) out.push({ file: inf.file, detail: C.label_player_only + " (" + ks.join(", ") + ")" });
      }
      return out;
    } },
    { n: 12, id: "legacy-tag", label: "Leftover place/ or region/ tags", kind: "error", run() {
      const out = [];
      for (const inf of sorted) {
        const old = [...inf.tags].filter((t) => /^(place|region)(\/|$)/.test(t));
        if (old.length) out.push({ file: inf.file, detail: old.join(", ") });
      }
      return out;
    } },
  ];

  // Part of link: the first link inside the first callout (Quick Reference). The metadata cache holds no text,
  // so the line is not read; a Quick Reference callout with another link ahead of Part of would misreport.
  function partOfLink(inf) {
    const sections = inf.cache.sections || [], links = inf.cache.links || [];
    const callout = sections.find((s) => s.type === "callout");
    if (!callout) return null;
    const a = callout.position.start.line, b = callout.position.end.line;
    const l = links.find((x) => x.position.start.line >= a && x.position.start.line <= b);
    return l ? parseLinkText(l.link) : null;
  }

  const checkList = REGISTRY.map((c) => ({ id: c.id, label: c.label, kind: c.kind, n: c.n }));

  function checks(opts) {
    opts = opts || {};
    const only = opts.only ? [].concat(opts.only) : null;
    let want = null;
    if (opts.files) {
      want = new Set();
      for (const x of [].concat(opts.files)) {
        const f = typeof x === "string" ? { path: x } : x;
        if (!f || !f.path) continue;
        want.add(f.path);
        const i = infos.get(f.path);
        if (i && i.twin) want.add(i.twin.path);
      }
    }
    const out = [];
    for (const c of REGISTRY) {
      if (only && !only.includes(c.id)) continue;
      for (const r of c.run()) {
        if (want && !want.has(r.file.path) && !(r.also || []).some((p) => want.has(p))) continue;
        out.push({ check: c.id, file: r.file, detail: r.detail });
      }
    }
    return out;
  }

  const api = {
    placeOf, entityOf, parents, trail, ancestors, descendants, whereIs, within, entitiesWithin,
    pickerChoices, linkFor, isPlayerOnly, checks, checkList, version: VERSION,
    // Extra exports (adding is allowed, spec 3.2 rule 2):
    wikiLink, trailLabel, playerTwinOf, currentChoices,
  };
  return api;
}
if (typeof module !== "undefined") module.exports = createLocationIndex; // Templater user script
return createLocationIndex; // Datacore dc.require
