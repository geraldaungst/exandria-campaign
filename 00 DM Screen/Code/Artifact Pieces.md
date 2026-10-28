---
hide_from_related: true
---

**Purpose:** Reads the pieces of a multi-part artifact (the Lorestone's shards, or any other) from their notes: each piece's history, who knows about it, who pursues it, its inscribed lines, and its open questions. Works out each piece's current holder and location (the location from the piece's `whereabouts`, read by the location core) and the who-knows-what grid. No views; [[Artifact Hub Views]] draws them.

**Exports:** `PIECE_KINDS`, `KNOW_LEVELS`, `CODES`, `SHARE_PERSONAL`, `slug`, `pieceTag`, `pieceNumber`, `parsePiece`, `parseInscription`, `pieceLines`, `currentState`, `checkWhereabouts`, `makeLocator`, `partyKnowledge`, `buildGrid`, `factionNotesByTag`, `factionsOf`, `displayName`, `usePieces`, `sectionLines`, `bullets`, `fields`

**Depends on:** [[Shared Helpers]] (and [[Hub Config]] through it; its `locations()` loads the location core, [[Location Engine Spec]])

**Used by:** [[Artifact Hub Views]] · [[Progress Tracks]] (its line readers: `sectionLines`, `bullets`, `fields`)

Conventions this module relies on:

- **Which notes are pieces.** Notes tagged `<piece_tag_prefix>/<artifact slug>` (`piece/lorestone-of-eryndor`). The hub names the slug in its embed block, so renaming the artifact's note changes nothing. A piece's number is the first number in its note name (`Shard 6 - Marquet Shard` is 6); pieces without one sort last. Notes in excluded folders are ignored.
- **Sections.** Each piece note has `##` headings named in [[Hub Config]]: History, Who knows, Pursued by, Prophecy lines, Open questions, Properties and rulings, Notes. A missing section counts as empty; the last two are free text, shown on the hub as they are.
- **History** (append-only, newest last; the order in the note is the order shown):
  `- **25 Thunsheer 835** · holder · <span data-date="835-04-25" data-category="Lorestone" data-name="Shard 6: to Drawg">Taken from Dreyara's body.</span> · [[Drawg]] · at [[Some Place]] · [[Session 47]]`
  Fields are separated by ` · `: the date label in bold, the kind, the description, then any of: who (a link, or plain text such as `Party`), `at` plus a link or plain text, and a session link (any linked note tagged `session`). A dated line wraps its description in a Calendarium span, so it shows on the calendar; an undated line (`**Before the campaign**`) has plain text instead. Kinds: holder, moved, knows exists, knows where, wrong, pursuing, stopped, lines read, ruling, note. Only holder and moved lines change the current state; the others are the record.
- **Current holder and location.** The holder is the who of the last holder line (History). The location is where the piece's `whereabouts` leads, read by the location core (`whereIs`): the place it names; a person it names, followed to that person's own `whereabouts`; or the party's location (from the last played session) when it leads to a PC. A piece with no `whereabouts` yet falls back to the old History rule until the migration ends: the party's location when the holder is a PC or the party; otherwise the `at` of the last holder or moved line after the holder changed; otherwise the holder's own deepest `place/…` tag. [[Artifact Change Form]] writes `whereabouts` whenever it records a holder or moved change.
- **Whereabouts check** (check 10 of [[Location Engine Spec]]). `checkWhereabouts` compares `whereabouts` with the last History line, by the rule the change form writes it: a party holder means `whereabouts` must lead to a PC; a moved line after the holder means the place in its `at`; otherwise the holder's own note; otherwise (a holder with no note) the place in `at`. A difference is reported as a sentence naming both; a piece with no `whereabouts` is not reported here (the core's check 5 covers it). `usePieces` returns the sentence as `state.whereCheck` for each piece.
- **Who knows** (current state): `- [[Vaud Qalix - DM]] · where · note text · [[Session 25]]`. Levels: `exists` (knows it exists), `where` (knows where it is or who holds it), `wrong` (believes something false about it).
- **Pursued by** (current state): `- [[Obsidian Echoforge - DM]] · how they go about it · [[Session 28]]`.
- **Who they share it with** (optional field on a Who knows or Pursued by line, anywhere after the who and level): `personal` keeps the line to the person (`- [[Varnes Dwell - DM|Varnes Dwell]] · where · personal · note`); `shares with [[Clasp - DM|Clasp]], [[Obsidian Echoforge - DM]]` passes it only to the factions named. Without the field, the line counts for all their factions.
- **Inscribed lines** come from two notes the hub names: the original text and the version known today (`original` and `modern` props). Each line starts with a label, the piece's number and the line's position on it: `4a Where once-grand spires…`. A modern line carries the label of the original line it comes from; a label in parentheses, `(6b)`, is a line that survived although its piece is lost. Markdown around the text (bold, italics, a link) is ignored. A line's state: **read** once the piece's History has a `lines read` entry; **modern** when only its modern version is known; **unknown** otherwise. With no `original` note, the piece note's own "Prophecy lines" tasks are used instead (ticked = read).
- **Open questions**: tasks; unticked means open.
- **Party knowledge** (for the card color): `holds` when the holder is a PC or the party; otherwise the best `Who knows` level of any line about the party or a PC (`where`, `exists`, `wrong`); otherwise none.
- **Grid roll-up.** A line about a person also counts for each faction they belong to (`faction/…` tags, every level that has a faction note) and, for a PC, for the party, unless the line says otherwise (`personal`, or `shares with` naming some of those factions; a named faction they don't belong to is ignored). A person is listed under a faction only when at least one of their lines reaches it; someone whose lines are all personal is listed on their own. The current holder always counts for their factions. A faction's note is a note tagged `faction` or `faction/…` that is not an NPC, PC, location, or player wiki page; when several carry the same faction tag, the one whose name matches the tag wins, then one in the factions folder.
- Lines that don't match these shapes are reported as problems, so a hand edit that breaks the format shows on the hub instead of disappearing.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Artifact Pieces.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, tagsOf, isExcluded, stripComments, escapeRe, stripDmSuffix, locations } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const SEP = " · ";
const PIECE_KINDS = ["holder", "moved", "knows exists", "knows where", "wrong", "pursuing", "stopped", "lines read", "ruling", "note"];
const KNOW_LEVELS = ["exists", "where", "wrong"];
/** Grid codes, in display order. */
const CODES = [
  { key: "holds", code: "H", label: "holds" },
  { key: "where", code: "K", label: "knows where" },
  { key: "exists", code: "E", label: "knows it exists" },
  { key: "wrong", code: "W", label: "believes something false" },
  { key: "pursuing", code: "P", label: "pursuing" },
];

/** Tag-safe form of a name: the rule the templates use for world/… and place/… tags. */
const slug = (name) =>
  stripDmSuffix(name).trim().normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/&/g, " and ").replace(/['’`]/g, "").replace(/[^a-z0-9_]+/g, "-").replace(/^-+|-+$/g, "");

const pieceTag = (artifactSlug) => `${String(cfg().piece_tag_prefix).replace(/^#/, "").toLowerCase()}/${slug(artifactSlug)}`;

/** First number in a note name; Infinity when there is none (sorts last). */
function pieceNumber(name) {
  const m = String(name ?? "").match(/\d+/);
  return m ? Number(m[0]) : Infinity;
}

/** "Hesterian Shyr (Dot)" → "Hesterian Shyr"; "Aethor Kalisk - DM" → "Aethor Kalisk". */
const displayName = (name) => stripDmSuffix(name).replace(/\s*\([^)]*\)\s*$/, "").trim();

// ── Reading a piece note ──────────────────────────────────────────

/** Lines under "## heading" up to the next "## " heading; [] when absent. */
function sectionLines(text, heading) {
  const lines = stripComments(text).split("\n");
  const start = lines.findIndex((l) => new RegExp(`^##\\s+${escapeRe(heading)}\\s*$`, "i").test(l));
  if (start < 0) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^##\s/.test(l));
  return end < 0 ? rest : rest.slice(0, end);
}

/** Top-level bullets of a section; nested bullets and wrapped lines attach to the bullet above as `details`. */
function bullets(lines) {
  const out = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const top = line.match(/^-\s+(.*)$/);
    if (top) out.push({ text: top[1].trim(), details: [] });
    else if (out.length) out[out.length - 1].details.push(line.trim().replace(/^[-*+]\s+/, ""));
  }
  return out;
}

const LINK_RE = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\\?\|([^\]]*))?\]\]/;
/** A field that is exactly one wiki-link → { target, display }; otherwise null. */
function asLink(field) {
  const m = String(field).trim().match(new RegExp(`^${LINK_RE.source}$`));
  return m ? { target: m[1].trim(), display: (m[2] ?? "").trim() || null } : null;
}
/** A who/at field: a link, or plain text. */
const asRef = (field) => asLink(field) ?? { plain: String(field).trim() };

/** Split " · " fields, keeping a Calendarium span whole even if its text contains the separator. */
function fields(text) {
  const spans = [];
  const masked = text.replace(/<span\b[^>]*>[\s\S]*?<\/span>/g, (s) => {
    spans.push(s);
    return `\u0000${spans.length - 1}\u0000`;
  });
  return masked.split(SEP).map((f) => f.replace(/\u0000(\d+)\u0000/g, (_, i) => spans[Number(i)]).trim());
}

function readSpan(s) {
  const m = String(s).match(/^<span\b([^>]*)>([\s\S]*?)<\/span>$/);
  if (!m) return null;
  const attr = (name) => (m[1].match(new RegExp(`data-${name}="([^"]*)"`)) ?? [])[1] ?? null;
  return { date: attr("date"), category: attr("category"), name: attr("name"), text: m[2].trim() };
}

/** Sort trailing fields into who, at, and session, using `isSession(target)` to spot session links. */
function trailing(rest, isSession) {
  const out = { who: null, at: null, session: null, extra: [] };
  for (const f of rest) {
    if (!f) continue;
    const at = f.match(/^at\s+(.+)$/i);
    if (at) {
      out.at = asRef(at[1]);
      continue;
    }
    const link = asLink(f);
    if (link && isSession(link.target)) out.session = link;
    else if (!out.who) out.who = link ?? { plain: f };
    else out.extra.push(f);
  }
  return out;
}

function parseHistory(b, isSession) {
  const m = b.text.match(/^\*\*(.+?)\*\*\s*·\s*(.*)$/);
  if (!m) return { problem: "expected **date** · kind · description" };
  const [kindField, descField, ...rest] = fields(m[2]);
  const kind = String(kindField ?? "").toLowerCase();
  if (!PIECE_KINDS.includes(kind)) return { problem: `unknown kind "${kindField}"` };
  const span = readSpan(descField ?? "");
  const dated = !!span && /^\d+-\d+-\d+$/.test(span.date ?? "");
  const t = trailing(rest, isSession);
  return {
    label: m[1].trim(),
    kind,
    dated,
    date: dated ? span.date : null,
    category: span?.category ?? null,
    eventName: span?.name ?? null,
    description: span ? span.text : String(descField ?? ""),
    who: t.who,
    at: t.at,
    session: t.session,
    extra: t.extra,
    details: b.details,
    raw: b.text,
  };
}

const SHARE_PERSONAL = "personal";
const SHARE_WITH_RE = /^shares with\s+(.+)$/i;
/** Pull the optional sharing field out of a line's fields → { share, rest }. share: null (all their factions), { personal: true }, or { with: [refs] }. */
function shareField(rest) {
  const i = rest.findIndex((f) => f.toLowerCase() === SHARE_PERSONAL || SHARE_WITH_RE.test(f));
  if (i < 0) return { share: null, rest };
  const f = rest[i];
  const others = rest.filter((_, j) => j !== i);
  if (f.toLowerCase() === SHARE_PERSONAL) return { share: { personal: true }, rest: others };
  const list = f.match(SHARE_WITH_RE)[1].split(/\s*,\s*/).map((s) => s.trim()).filter(Boolean);
  return { share: { with: list.map(asRef) }, rest: others };
}

function parseKnows(b, isSession) {
  const [whoField, levelField, ...all] = fields(b.text);
  const { share, rest } = shareField(all);
  const level = String(levelField ?? "").toLowerCase();
  if (!whoField || !KNOW_LEVELS.includes(level)) return { problem: `expected who · ${KNOW_LEVELS.join("/")} · note` };
  const last = rest.length ? asLink(rest[rest.length - 1]) : null;
  const session = last && isSession(last.target) ? last : null;
  return { who: asRef(whoField), level, share, note: (session ? rest.slice(0, -1) : rest).join(SEP), session, details: b.details, raw: b.text };
}

function parsePursuit(b, isSession) {
  const [whoField, ...all] = fields(b.text);
  const { share, rest } = shareField(all);
  if (!whoField) return { problem: "expected who · how" };
  const last = rest.length ? asLink(rest[rest.length - 1]) : null;
  const session = last && isSession(last.target) ? last : null;
  return { who: asRef(whoField), how: (session ? rest.slice(0, -1) : rest).join(SEP), share, session, details: b.details, raw: b.text };
}

function parseTask(b, isSession) {
  const m = b.text.match(/^\[([ xX])\]\s*(.*)$/);
  if (!m) return { problem: "expected a task (- [ ] or - [x])" };
  let text = m[2].trim();
  let session = null;
  const tail = text.match(new RegExp(`\\s*(${LINK_RE.source})\\s*$`));
  if (tail) {
    const link = asLink(tail[1]);
    if (link && isSession(link.target)) {
      session = link;
      text = text.slice(0, tail.index).trim();
    }
  }
  return { text, done: m[1] !== " ", session, details: b.details, raw: b.text };
}

/**
 * A piece note's text → { history, knows, pursuit, lines, questions, problems }.
 * `isSession(target)` says whether a link target is a session note (so it can be told apart from a person or place).
 */
function parsePiece(text, isSession = () => false) {
  const c = cfg();
  const problems = [];
  const read = (heading, parse) => {
    const out = [];
    for (const b of bullets(sectionLines(text, heading))) {
      const r = parse(b, isSession);
      if (r.problem) problems.push({ section: heading, line: b.text, reason: r.problem });
      else out.push(r);
    }
    return out;
  };
  const lines = read(c.heading_piece_lines, parseTask).map((t) => ({ ...t, read: t.done }));
  const questions = read(c.heading_piece_questions, parseTask).map((t) => ({ ...t, open: !t.done }));
  return {
    history: read(c.heading_piece_history, parseHistory),
    knows: read(c.heading_piece_knows, parseKnows),
    pursuit: read(c.heading_piece_pursuit, parsePursuit),
    lines,
    questions,
    problems,
  };
}

// ── Inscribed lines ───────────────────────────────────────────────

const LABEL_LINE = /^\s*(\()?(\d+)([a-z])\)?\s+(.+?)\s*$/;
/** Visible text of a verse line: links reduced to their display text, emphasis markers dropped. */
const verseText = (s) =>
  String(s)
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1")
    .replace(/\[\[([^\]]*)\]\]/g, "$1")
    .replace(/(\*\*\*|\*\*|\*|___|__)/g, "")
    .trim();

/** Labeled lines of an inscription note, in order: [{ key: "4a", number: 4, part: "a", text, lost }]. */
function parseInscription(text) {
  const out = [];
  const body = stripComments(String(text ?? "")).replace(/^---\n[\s\S]*?\n---\n?/, "");
  for (const line of body.split("\n")) {
    const m = line.match(LABEL_LINE);
    if (!m) continue;
    out.push({ key: `${m[2]}${m[3]}`, number: Number(m[2]), part: m[3], text: verseText(m[4]), lost: !!m[1] });
  }
  return out;
}

/**
 * A piece's lines with what the party knows of each: [{ key, text, modern, state: "read" | "modern" | "unknown" }].
 * original / modern: parsed inscription lines, or null to fall back on the note's own "Prophecy lines" tasks.
 */
function pieceLines(number, parsed, original, modern) {
  if (!original) return parsed.lines.map((l, i) => ({ key: String(i + 1), text: l.text, modern: null, state: l.read ? "read" : "unknown" }));
  const read = parsed.history.some((e) => e.kind === "lines read");
  const modernByKey = new Map((modern ?? []).map((l) => [l.key, l]));
  return original
    .filter((l) => l.number === number)
    .map((l) => {
      const m = modernByKey.get(l.key) ?? null;
      return { key: l.key, text: l.text, modern: m ? m.text : null, state: read ? "read" : m ? "modern" : "unknown" };
    });
}

// ── Current state ─────────────────────────────────────────────────

/**
 * ctx: { resolve(target) → { path, name, tags } | null, partyLocation: ref | null, placeFor(tag) → location page | null (optional),
 * where() → { place, via, source, link } from the location core, or null when the piece has no `whereabouts` (optional) }.
 * A ref is { target, display } (a link) or { plain }. Resolved refs gain `.page`.
 */
const withPage = (ref, ctx) => (ref && ref.target ? { ...ref, page: ctx.resolve(ref.target) } : ref);

function isParty(ref) {
  const c = cfg();
  if (!ref) return false;
  if (ref.plain) return ref.plain.toLowerCase() === String(c.label_party).toLowerCase();
  return !!ref.page && ref.page.tags.some((t) => t === c.tag_pc || t.startsWith(c.tag_pc + "/"));
}

const deepestUnder = (tags, prefix) => {
  const under = tags.filter((t) => t.startsWith(prefix + "/"));
  return under.filter((t) => !under.some((o) => o.startsWith(t + "/")));
};

/** { holder, holderSince, location, locationSource: "party" | "holder" | "whereabouts" | "line" | "tag" | null, last } for a parsed piece. */
function currentState(piece, ctx) {
  let holder = null;
  let holderSince = null;
  let at = null;
  for (const e of piece.history) {
    if (e.kind === "holder") {
      holder = e.who ?? holder;
      holderSince = e;
      at = e.at ?? null;
    } else if (e.kind === "moved" && e.at) at = e.at;
  }
  holder = withPage(holder, ctx);
  const last = piece.history.length ? piece.history[piece.history.length - 1] : null;
  // The piece's own `whereabouts`, read by the core: a place, or a holder followed to their place.
  const w = ctx.where?.() ?? null;
  if (w && w.place) {
    const location = { target: w.link, display: displayName(w.place.name), place: w.place };
    const locationSource = w.source === "party" ? "party" : w.via && w.via.length ? "holder" : "whereabouts";
    return { holder, holderSince, location, locationSource, last };
  }
  // No `whereabouts` yet (or it leads nowhere): the History rule, until the migration's last step removes the tag part.
  if (holder && isParty(holder) && ctx.partyLocation)
    return { holder, holderSince, location: withPage(ctx.partyLocation, ctx), locationSource: "party", last };
  if (at) return { holder, holderSince, location: withPage(at, ctx), locationSource: "line", last };
  const place = holder?.page ? deepestUnder(holder.page.tags, "place")[0] : null;
  if (place) {
    const note = ctx.placeFor?.(place);
    const location = note ? { target: note.path.replace(/\.md$/, ""), display: displayName(note.name), tag: place } : { plain: place.slice("place/".length).split("/").join(" / "), tag: place };
    return { holder, holderSince, location, locationSource: "tag", last };
  }
  return { holder, holderSince, location: null, locationSource: null, last };
}

/**
 * The location core, applied to pieces. `loc` is the core's index; partyLocation is a ref ({ target }) or null.
 * { partyPlace, isPlace(place), where(path), current(path) }: `where` gives whereIs plus a link for a piece that has a `whereabouts`
 * (null when it has none); `current` gives the first value of its `whereabouts` as a picker choice ({ place } or { file }).
 */
function makeLocator(loc, partyLocation) {
  const c = cfg();
  const partyPlace = (() => {
    if (!partyLocation?.target) return null;
    const p = loc.placeOf(partyLocation.target, "");
    return p && !p.unresolved ? p : null;
  })();
  const placeKeys = new Set(loc.pickerChoices({ field: "site" }).map((x) => x.place.key));
  const fileAt = (path) => app.vault.getAbstractFileByPath(path);
  const has = (file) => {
    const v = app.metadataCache.getFileCache(file)?.frontmatter?.[c.prop_whereabouts];
    return !(v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0));
  };
  return {
    partyPlace,
    isPlace: (place) => !!place && !place.unresolved && placeKeys.has(place.key),
    where(path) {
      const file = fileAt(path);
      if (!file || !has(file)) return null;
      const w = loc.whereIs(file, { partyPlace });
      return { ...w, link: w.place ? loc.linkFor(w.place, path) : null };
    },
    current(path) {
      const file = fileAt(path);
      return file ? loc.currentChoices(file, c.prop_whereabouts)[0] ?? null : null;
    },
  };
}

/**
 * Check 10 (Location Engine Spec): the piece's `whereabouts` against its last History holder or `at`.
 * A sentence when they differ; null when they agree, when the piece has no `whereabouts` (the core's check 5 covers it),
 * or when there is nothing to compare (a holder with no note and no place in `at`).
 */
function checkWhereabouts(piece, state, ctx, locate) {
  const w = ctx.where?.() ?? null;
  if (!w || !locate) return null;
  let at = null, lastKind = null;
  for (const e of piece.history) {
    if (e.kind === "holder") { at = e.at ?? null; lastKind = "holder"; }
    else if (e.kind === "moved" && e.at) { at = e.at; lastKind = "moved"; }
  }
  const cur = locate.current(ctx.path);
  const curLabel = cur ? cur.label : "nothing";
  const holder = state.holder;
  if (holder && isParty(holder)) return w.source === "party" ? null : `History says the party holds it, but whereabouts (${curLabel}) does not lead to a PC`;
  const atPlace = at && at.target ? ctx.locatePlace?.(at.target) : null;
  const holderFirst = lastKind === "holder" && holder && holder.page; // a holder with a note wins over At
  if (atPlace && !holderFirst) return cur && cur.place && cur.place.key === atPlace.key ? null : `History puts it at ${displayName(atPlace.name)}, but whereabouts says ${curLabel}`;
  if (holder && holder.page && ctx.fileOf) {
    const hf = ctx.fileOf(holder.page.path);
    if (!hf) return null;
    const expected = ctx.entityPath(hf);
    const actual = cur && cur.file ? ctx.entityPath(cur.file) : null;
    return actual === expected ? null : `History says ${displayName(holder.page.name)} holds it, but whereabouts says ${curLabel}`;
  }
  return null;
}

/** What the party knows of a piece: "holds", "where", "exists", "wrong", or null. */
function partyKnowledge(parsed, state, ctx) {
  if (state.holder && isParty(state.holder)) return "holds";
  const levels = parsed.knows.filter((k) => isParty(withPage(k.who, ctx))).map((k) => k.level);
  for (const level of ["where", "exists", "wrong"]) if (levels.includes(level)) return level;
  return null;
}

// ── Who knows what ────────────────────────────────────────────────

const PARTY_KEY = "party:";

/** A faction's own note: carries the faction type tag (`tag_faction`, organization), and is not an NPC, PC, location, or player wiki page. */
function isFactionNote(page) {
  const c = cfg();
  const has = (t) => page.tags.some((x) => x === t || x.startsWith(t + "/"));
  return has(c.tag_faction) && !has(c.tag_npc) && !has(c.tag_pc) && !has(c.tag_location) && !page.path.startsWith(c.folder_player_wiki + "/");
}

/** Which note stands for a faction tag: the one whose name matches the tag's last part, then one in the factions folder, then any. */
function factionNotesByTag(pages) {
  const c = cfg();
  const best = new Map();
  const score = (p, tag) => (slug(p.name) === tag.split("/").pop() ? 2 : 0) + (p.path.startsWith(c.folder_factions + "/") ? 1 : 0);
  for (const p of pages) {
    if (!isFactionNote(p)) continue;
    for (const t of deepestUnder(p.tags, c.faction_tag_prefix)) {
      const cur = best.get(t);
      if (!cur || score(p, t) > score(cur, t)) best.set(t, p);
    }
  }
  return best;
}

/** The faction notes a page belongs to, at every level of its faction/… tags: [{ path, name, tags }]. */
function factionsOf(page, factionByTag) {
  const out = [];
  if (!page) return out;
  for (const t of deepestUnder(page.tags, cfg().faction_tag_prefix)) {
    const parts = t.split("/");
    for (let i = 2; i <= parts.length; i++) {
      const f = factionByTag.get(parts.slice(0, i).join("/"));
      if (f && f.path !== page.path && !out.some((o) => o.path === f.path)) out.push(f);
    }
  }
  return out;
}

/** Whether a line's sharing field lets it reach a parent (a faction note page, or the party). */
function sharesWith(share, parent, ctx) {
  if (!share) return true;
  if (share.personal) return false;
  return share.with.some((r) =>
    r.plain ? displayName(r.plain).toLowerCase() === parent.name.toLowerCase() : (ctx.resolve(r.target)?.path ?? r.target) === parent.key || displayName(r.target.split("/").pop()).toLowerCase() === parent.name.toLowerCase());
}

/**
 * The grid: rows of people and factions, one column per piece.
 * pieces: [{ number, path, name, parsed, state }]; ctx as for currentState, plus `pages` (all pages, for finding faction notes).
 * Returns { numbers, factions: [{ row, members: [row] }], party: { row, members } | null, others: [row] }.
 * A row is { key, name, ref, cells: { [number]: { codes: Set, sources: [{ code, via, text, session, share }] } } }.
 */
function buildGrid(pieces, ctx) {
  const c = cfg();
  const numbers = pieces.map((p) => p.number);
  const factionByTag = factionNotesByTag(ctx.pages);
  const factionPaths = new Set([...factionByTag.values()].map((p) => p.path));
  const rows = new Map();
  const rowFor = (key, name, ref) => {
    if (!rows.has(key)) rows.set(key, { key, name, ref, cells: {} });
    return rows.get(key);
  };
  const members = new Map(); // parent key → Set of member keys
  const addMember = (parent, child) => {
    if (!members.has(parent)) members.set(parent, new Set());
    members.get(parent).add(child);
  };
  const mark = (row, number, source) => {
    const cell = (row.cells[number] ??= { codes: new Set(), sources: [] });
    cell.codes.add(source.code);
    cell.sources.push(source);
  };
  const subjectKey = (ref) => {
    if (ref.plain) return ref.plain.toLowerCase() === String(c.label_party).toLowerCase() ? PARTY_KEY : `plain:${ref.plain.toLowerCase()}`;
    return ref.page ? ref.page.path : `missing:${ref.target.toLowerCase()}`;
  };
  const nameOf = (ref) => (ref.plain ? ref.plain : ref.display || displayName(ref.page?.name ?? ref.target));

  /** Parents a subject rolls up into: its factions at every level with a faction note, and the party for a PC. */
  const parentsOf = (ref) => {
    const out = [];
    if (!ref.page) return out;
    if (isParty(ref)) out.push({ key: PARTY_KEY, name: c.label_party, ref: { plain: c.label_party } });
    for (const f of factionsOf(ref.page, factionByTag)) out.push({ key: f.path, name: displayName(f.name), ref: { target: f.path, page: f } });
    return out;
  };

  const record = (rawRef, number, code, text, session, share = null) => {
    const ref = withPage(rawRef, ctx);
    const key = subjectKey(ref);
    const row = rowFor(key, key === PARTY_KEY ? c.label_party : nameOf(ref), ref);
    mark(row, number, { code, via: null, text, session, share });
    for (const parent of parentsOf(ref).filter((p) => sharesWith(share, p, ctx))) {
      const prow = rowFor(parent.key, parent.name, parent.ref);
      mark(prow, number, { code, via: row.name, text, session });
      addMember(parent.key, key);
    }
  };

  for (const p of pieces) {
    if (p.state.holder) record(p.state.holder, p.number, "H", p.state.holderSince?.description ?? "", p.state.holderSince?.session ?? null);
    for (const k of p.parsed.knows) record(k.who, p.number, k.level === "where" ? "K" : k.level === "exists" ? "E" : "W", k.note, k.session, k.share);
    for (const q of p.parsed.pursuit) record(q.who, p.number, "P", q.how, q.session, q.share);
  }

  // A holder knows where their piece is: drop K and E from cells that hold.
  for (const row of rows.values())
    for (const cell of Object.values(row.cells))
      if (cell.codes.has("H")) {
        cell.codes.delete("K");
        cell.codes.delete("E");
      }
      else if (cell.codes.has("K")) cell.codes.delete("E");

  const byName = (a, b) => a.name.localeCompare(b.name);
  const memberRows = (key) => [...(members.get(key) ?? [])].map((k) => rows.get(k)).sort(byName);
  const memberKeys = new Set([...members.values()].flatMap((s) => [...s]));
  const factionKeys = [...rows.keys()].filter((k) => factionPaths.has(k));
  return {
    numbers,
    factions: factionKeys.map((k) => ({ row: rows.get(k), members: memberRows(k) })).sort((a, b) => byName(a.row, b.row)),
    party: rows.has(PARTY_KEY) ? { row: rows.get(PARTY_KEY), members: memberRows(PARTY_KEY) } : null,
    others: [...rows.values()].filter((r) => r.key !== PARTY_KEY && !factionKeys.includes(r.key) && !memberKeys.has(r.key)).sort(byName),
  };
}

// ── In Obsidian ───────────────────────────────────────────────────

/**
 * Every piece of an artifact, parsed, with its current state, lines, and the grid.
 * artifactSlug: "lorestone-of-eryndor". partyLocation: a ref for where the party is, or null.
 * inscription: { original, modern }, the names (or paths) of the notes holding the labeled lines; both optional.
 */
function usePieces(artifactSlug, partyLocation = null, inscription = {}) {
  const c = cfg();
  const tag = pieceTag(artifactSlug);
  const all = dc.useQuery("@page");
  const findNote = (name) => (name ? app.metadataCache.getFirstLinkpathDest?.(String(name).replace(/\.md$/, ""), "")?.path ?? null : null);
  const originalPath = findNote(inscription.original);
  const modernPath = findNote(inscription.modern);
  const extra = [originalPath, modernPath].filter(Boolean).map((p) => all.find((x) => x.$path === p)).filter(Boolean);
  const notes = all.filter((p) => !isExcluded(p) && tagsOf(p).some((t) => t === tag || t.startsWith(tag + "/")));
  const stamp = (p) => (p.$mtime?.toMillis ? p.$mtime.toMillis() : String(p.$mtime ?? ""));
  // The location core, rebuilt when any note changes. If it can't be loaded, pieces fall back to the History rule.
  const core = dc.useMemo(() => {
    try {
      return locations();
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [all]);
  const key = [...notes, ...extra].map((p) => `${p.$path}@${stamp(p)}`).join("|");
  const [texts, setTexts] = dc.useState({});
  dc.useEffect(() => {
    let live = true;
    (async () => {
      const out = {};
      for (const p of [...notes, ...extra]) {
        const file = app.vault.getAbstractFileByPath(p.$path);
        out[p.$path] = file ? await app.vault.cachedRead(file) : "";
      }
      if (live) setTexts(out);
    })();
    return () => {
      live = false;
    };
  }, [key]);

  return dc.useMemo(() => {
    const byPath = new Map(all.map((p) => [p.$path, { path: p.$path, name: p.$name, tags: tagsOf(p) }]));
    const pages = [...byPath.values()];
    // A place tag's own note, for a holder whose location comes from their place tag: the location note carrying
    // that tag whose name matches the tag's last part (places inside it may carry the same tag).
    const places = new Map();
    for (const p of pages) {
      if (!p.tags.some((t) => t === c.tag_location || t.startsWith(c.tag_location + "/")) || p.path.startsWith(c.folder_player_wiki + "/")) continue;
      for (const t of deepestUnder(p.tags, "place")) if (slug(p.name) === t.split("/").pop() && !places.has(t)) places.set(t, p);
    }
    const placeFor = (tag) => places.get(tag) ?? null;
    const locate = core ? makeLocator(core, partyLocation) : null;
    const original = originalPath ? parseInscription(texts[originalPath] ?? "") : null;
    const modern = modernPath ? parseInscription(texts[modernPath] ?? "") : null;
    const resolverFor = (source) => (target) => {
      const f = app.metadataCache.getFirstLinkpathDest?.(target, source);
      return f ? byPath.get(f.path) ?? { path: f.path, name: f.basename, tags: [] } : null;
    };
    const pieces = notes
      .map((p) => {
        const resolve = resolverFor(p.$path);
        const isSession = (t) => {
          const r = resolve(t);
          return !!r && (r.tags.some((x) => x === c.tag_session || x.startsWith(c.tag_session + "/")) || r.path.includes(`${c.folder_session_notes}/`));
        };
        const parsed = parsePiece(texts[p.$path] ?? "", isSession);
        const ctx = {
          resolve, partyLocation, placeFor, path: p.$path,
          where: locate ? () => locate.where(p.$path) : undefined,
          fileOf: (path) => app.vault.getAbstractFileByPath(path),
          entityPath: (file) => core.entityOf(file).file.path,
          locatePlace: (target) => {
            const pl = core.placeOf(target, p.$path);
            return locate.isPlace(pl) ? pl : null;
          },
        };
        const number = pieceNumber(p.$name);
        const state = currentState(parsed, ctx);
        state.whereCheck = checkWhereabouts(parsed, state, ctx, locate);
        return { page: p, path: p.$path, name: p.$name, number, parsed, state, ctx, party: partyKnowledge(parsed, state, ctx), lines: pieceLines(number, parsed, original, modern) };
      })
      .sort((a, b) => a.number - b.number || a.name.localeCompare(b.name));
    const grid = buildGrid(pieces, { resolve: (t) => pieces[0]?.ctx.resolve(t) ?? null, partyLocation, pages });
    return { tag, pieces, grid, loading: [...notes, ...extra].some((p) => texts[p.$path] === undefined) };
  }, [key, texts, all, partyLocation, originalPath, modernPath, core]);
}

return { PIECE_KINDS, KNOW_LEVELS, CODES, SHARE_PERSONAL, slug, pieceTag, pieceNumber, parsePiece, parseInscription, pieceLines, currentState, checkWhereabouts, makeLocator, partyKnowledge, buildGrid, factionNotesByTag, factionsOf, displayName, usePieces, sectionLines, bullets, fields };
```
