---
hide_from_related: true
---

**Purpose:** The "Record a change" form on the artifact hub. It writes one dated line to a piece's History (a Calendarium inline event) and, when the change calls for it, updates the piece's current-state sections: Who knows, Pursued by, or Properties and rulings. A holder or moved change also sets the piece's `whereabouts` property, which is what the location core reads.

**Exports:** `CHANGE_KINDS`, `historyLine`, `applyChange`, `planWhereabouts`, `refFromName`, `shareText`, `PieceChangeForm`

**Depends on:** [[Shared Helpers]] (its `locations()` loads the location core, [[Location Engine Spec]]) · [[Campaign State]] · [[Calendar and Timeline]] · [[Artifact Pieces]]

**Used by:** [[Artifact Hub Views]]

Conventions this module relies on:

- **One change, one History line**, appended at the end of the History section in the format [[Artifact Pieces]] reads: `- **27 Thunsheer 835** · holder · <span data-date="835-04-27" data-category="Lorestone" data-name="Shard 6: to Hesterian">Description.</span> · [[Hesterian Shyr - Dot|Hesterian]] · [[Session 53]]`. With "No in-world date" ticked, the bold label is the text you type and there is no span, so the line stays off the calendar.
- **What each kind also changes:**
  - holder, moved: History, and the piece's `whereabouts` (see below). The holder shown on the hub still comes from History.
  - lines read, note: History only ("lines read" marks the piece's lines as read).
  - knows exists, knows where, wrong: the person's line in Who knows is replaced, or added if they had none.
  - pursuing: the person's line in Pursued by is replaced or added. stopped: it is removed.
  - ruling: the description is also added as a bullet under Properties and rulings.
  A replaced or removed line survives in History, which is the full record.
- **Who they share it with.** For the knows and pursuing kinds, when the person belongs to a faction: their factions (the default; no field written), no one (writes `personal`), or only some of them (writes `shares with [[…]], [[…]]`). The choice starts at what the person's current line says, so a personal line stays personal unless you change it. [[Artifact Pieces]] has the format.
- **Matching a person.** Two lines are about the same person when their links point to the same note, or their plain text is the same (ignoring case).
- **Whereabouts.** On a holder or moved change the form also writes the piece's `whereabouts` (one link, with `processFrontMatter`) and removes the `unplaced` tag if the piece had it. Moved: the place in At; if At is not a place note, `whereabouts` is left alone and the status line says so. Holder: when the holder is the party (`label_party`), a "Carried by" list of PCs appears and the chosen PC is written (the location core then gives the party's location); otherwise the holder's note (the piece then goes wherever the holder goes, even when At is filled in; At stays in History); otherwise the place in At when the holder has no note; a holder with no note and no place leaves `whereabouts` alone. [[Artifact Pieces]] checks later that the two still agree.
- **Defaults.** Date: today in-world (the last played session's end date). Session: the last played session. Calendarium category: `calendar_category_pieces` in [[Hub Config]]; the list offers every category of the campaign's calendar. Event name: built from the kind and the person ("Shard 6: to Hesterian"), editable.
- **Names.** The Who and At fields suggest note names (NPCs, factions, PCs, and locations) and accept anything; a name that matches a note is written as a link (by full path when another note shares its file name, such as a Player Wiki twin), anything else as plain text. `Party` (the `label_party` value) always stays plain text and stands for the whole party.
- A missing section is created before "Connected Elements", or at the end of the note.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Artifact Change Form.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, tagsOf, hasTag, isExcluded, num, escapeRe, S: BASE, locations } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));
const { useActiveCampaign, useSessionState } = await dc.require(dc.headerLink("00 DM Screen/Code/Campaign State.md", "Code"));
const { useCalendar, inGameNow, inWorldText } = await dc.require(dc.headerLink("00 DM Screen/Code/Calendar and Timeline.md", "Code"));
const { displayName, factionNotesByTag, factionsOf, SHARE_PERSONAL, makeLocator } = await dc.require(dc.headerLink("00 DM Screen/Code/Artifact Pieces.md", "Code"));

const SEP = " · ";

/** Kinds offered, with which fields they use and the default calendar event name. */
const CHANGE_KINDS = [
  { kind: "holder", label: "New holder", who: "required", at: true, event: (n, w) => `Shard ${n}: to ${w}` },
  { kind: "moved", label: "Moved", at: "required", event: (n, w, a) => `Shard ${n}: moved to ${a}` },
  { kind: "knows exists", label: "Learned it exists", who: "required", section: "knows", level: "exists", event: (n, w) => `Shard ${n}: ${w} learns of it` },
  { kind: "knows where", label: "Learned where it is", who: "required", section: "knows", level: "where", event: (n, w) => `Shard ${n}: ${w} learns where it is` },
  { kind: "wrong", label: "Believes something false", who: "required", section: "knows", level: "wrong", event: (n, w) => `Shard ${n}: ${w} misled` },
  { kind: "pursuing", label: "Now pursuing", who: "required", section: "pursuit", event: (n, w) => `Shard ${n}: ${w} pursues it` },
  { kind: "stopped", label: "Stopped pursuing", who: "required", section: "pursuit", remove: true, event: (n, w) => `Shard ${n}: ${w} stops pursuing` },
  { kind: "lines read", label: "Lines read", who: true, event: (n, w) => `Shard ${n}: lines read${w ? ` by ${w}` : ""}` },
  { kind: "ruling", label: "Ruling", section: "rulings", event: (n) => `Shard ${n}: ruling` },
  { kind: "note", label: "Note", who: true, at: true, event: (n) => `Shard ${n}: note` },
];
const kindInfo = (kind) => CHANGE_KINDS.find((k) => k.kind === kind);

// ── Text helpers (pure) ───────────────────────────────────────────

/** Text safe inside a Calendarium span or attribute: no angle brackets; double quotes become single. */
const clean = (s) => String(s ?? "").replace(/<[^>]*>/g, "").replace(/[<>]/g, "").replace(/"/g, "'").replace(/\s+/g, " ").trim();
/** Plain field text: also no field separator. */
const plain = (s) => clean(s).split(SEP).join(" - ");
const sentence = (s) => (s ? s[0].toUpperCase() + s.slice(1) + (/[.!?…]$/.test(s) ? "" : ".") : "");

/**
 * A typed name → ref. `find(name)` returns { path, name, unique } for a note with that name, or null;
 * `unique` is false when another note shares its file name, and the link then uses the full path.
 * The party's label always stays plain text.
 */
function refFromName(name, find) {
  const text = plain(name);
  if (!text) return null;
  if (text.toLowerCase() === String(cfg().label_party).toLowerCase()) return { plain: cfg().label_party };
  const page = find(text);
  if (!page) return { plain: text };
  const base = page.path.replace(/\.md$/, "").split("/").pop();
  const target = page.unique === false ? page.path.replace(/\.md$/, "") : base;
  const shown = displayName(page.name);
  return { target, display: shown !== target ? shown : null, path: page.path };
}
const refMd = (r) => (!r ? "" : r.plain ? r.plain : `[[${r.target}${r.display ? `|${r.display}` : ""}]]`);
const refName = (r) => (!r ? "" : r.plain ? r.plain : r.display || r.target);

/** Identity of a who-field for matching: a link's target, or plain text, lowercased. */
function whoKey(field, resolve) {
  const m = String(field).trim().match(/^\[\[([^\]|#]+)/);
  if (!m) return `plain:${String(field).trim().toLowerCase()}`;
  const path = resolve ? resolve(m[1].trim()) : null;
  return path ? `path:${path}` : `link:${m[1].trim().toLowerCase()}`;
}

/** The sharing field for a Who knows or Pursued by line: "" (all their factions), "personal", or "shares with [[A]], [[B]]". */
const shareText = (share) => (!share ? "" : share.personal ? SHARE_PERSONAL : share.with?.length ? `shares with ${share.with.map(refMd).join(", ")}` : "");

/** The History line for a change. */
function historyLine(ch) {
  const info = kindInfo(ch.kind);
  const desc = sentence(clean(ch.description));
  const tail = [ch.who ? refMd(ch.who) : "", ch.at ? `at ${refMd(ch.at)}` : "", ch.session ? refMd(ch.session) : ""].filter(Boolean);
  if (!ch.date) return [`- **${plain(ch.label) || "Undated"}**`, ch.kind, plain(desc), ...tail].join(SEP);
  const span = `<span data-date="${ch.date}" data-category="${clean(ch.category)}" data-name="${clean(ch.eventName)}">${desc}</span>`;
  return [`- **${plain(ch.label)}**`, info.kind, span, ...tail].join(SEP);
}

/** Lines of a "## heading" section and where it sits: { start, end } line indexes (end exclusive), or null. */
function findSection(lines, heading) {
  const start = lines.findIndex((l) => new RegExp(`^##\\s+${escapeRe(heading)}\\s*$`, "i").test(l));
  if (start < 0) return null;
  let end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
  if (end < 0) end = lines.length;
  return { start, end };
}

/** Run `edit(bullets)` on a section's top-level bullets (each with its nested lines) and write the result back. */
function editSection(text, heading, edit) {
  const lines = text.replace(/\s*$/, "").split("\n");
  let sec = findSection(lines, heading);
  if (!sec) {
    const before = lines.findIndex((l) => /^##\s+Connected Elements\s*$/i.test(l));
    const at = before < 0 ? lines.length : before;
    lines.splice(at, 0, ...(at > 0 && lines[at - 1].trim() ? [""] : []), `## ${heading}`, "", ...(before < 0 ? [] : [""]));
    sec = findSection(lines, heading);
  }
  const body = lines.slice(sec.start + 1, sec.end);
  const bullets = [];
  const lead = [];
  for (const l of body) {
    if (/^-\s/.test(l)) bullets.push([l]);
    else if (bullets.length && l.trim()) bullets[bullets.length - 1].push(l);
    else if (!bullets.length && l.trim()) lead.push(l);
  }
  const next = edit(bullets);
  const out = [...(lead.length ? ["", ...lead] : []), "", ...next.flat(), ""];
  lines.splice(sec.start + 1, sec.end - sec.start - 1, ...out);
  return lines.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

/**
 * The piece note's text with the change applied. ch: { kind, label, date, category, eventName, description,
 * who, at, session, share } (refs as from refFromName; share: null, { personal: true }, or { with: [refs] }). headings: Hub Config's heading_piece_… values.
 * resolve(target) → note path, for matching people across differently written links.
 */
function applyChange(text, ch, headings, resolve) {
  const info = kindInfo(ch.kind);
  if (!info) throw new Error(`Unknown kind "${ch.kind}"`);
  let out = editSection(text, headings.history, (bullets) => [...bullets, [historyLine(ch)]]);
  if (info.section === "knows" || info.section === "pursuit") {
    const heading = info.section === "knows" ? headings.knows : headings.pursuit;
    const key = whoKey(refMd(ch.who), resolve);
    const note = plain(ch.description).replace(/[.]$/, "");
    const line = info.section === "knows"
      ? ["- " + refMd(ch.who), info.level, shareText(ch.share), note, ch.session ? refMd(ch.session) : ""].filter(Boolean).join(SEP)
      : ["- " + refMd(ch.who), shareText(ch.share), note, ch.session ? refMd(ch.session) : ""].filter(Boolean).join(SEP);
    out = editSection(out, heading, (bullets) => {
      const i = bullets.findIndex((b) => whoKey(b[0].replace(/^-\s+/, "").split(SEP)[0], resolve) === key);
      if (info.remove) return i < 0 ? bullets : bullets.filter((_, j) => j !== i);
      if (i < 0) return [...bullets, [line]];
      return bullets.map((b, j) => (j === i ? [line] : b));
    });
  }
  if (info.section === "rulings") out = editSection(out, headings.rulings, (bullets) => [...bullets, [`- ${sentence(clean(ch.description))}`]]);
  return out;
}

// ── Whereabouts ───────────────────────────────────────────────────

/**
 * What a change does to the piece's `whereabouts`: null for kinds that don't touch it; { link, label } to write; or { skip: reason }.
 * `loc` is the location core's index, `isPlace(place)` says whether a place object is a location note, `carrier` is the PC ref chosen
 * when the party is the holder, `fileOf(path)` finds a note's file.
 */
function planWhereabouts(ch, { loc, sourcePath, carrier, isPlace, fileOf }) {
  if (ch.kind !== "holder" && ch.kind !== "moved") return null;
  const noteOf = (ref) => (ref && !ref.plain && ref.path ? fileOf(ref.path) : null);
  const placeOfRef = (ref) => {
    const file = noteOf(ref);
    if (!file) return null;
    const place = loc.placeOf(file.path.replace(/\.md$/, ""), sourcePath);
    return isPlace(place) ? place : null;
  };
  const at = placeOfRef(ch.at);
  const toPlace = (place) => ({ link: loc.linkFor(place, sourcePath), label: displayName(place.name) });
  const toFile = (file) => ({ link: loc.linkFor(file, sourcePath), label: displayName(file.basename) });
  if (ch.kind === "moved") return at ? toPlace(at) : { skip: ch.at ? "At is not a place note" : "no place was given" };
  const party = !!ch.who?.plain && ch.who.plain.toLowerCase() === String(cfg().label_party).toLowerCase();
  if (party) {
    const file = noteOf(carrier);
    return file ? toFile(file) : { skip: "no PC was chosen to carry it" };
  }
  const holder = noteOf(ch.who);
  if (holder) return toFile(holder); // a holder with a note wins over At: the piece goes where they go
  if (at) return toPlace(at);
  return { skip: "the holder has no note and no place was given" };
}

/** Sets `whereabouts` on the piece to a link and removes the `unplaced` tag. */
async function writeWhereabouts(file, link) {
  const c = cfg();
  const unplaced = String(c.tag_unplaced).replace(/^#/, "").toLowerCase();
  await app.fileManager.processFrontMatter(file, (fm) => {
    fm[c.prop_whereabouts] = `[[${link}]]`;
    if (fm.tags !== undefined && fm.tags !== null) {
      const list = Array.isArray(fm.tags) ? fm.tags : String(fm.tags).split(/[,\s]+/).filter(Boolean);
      fm.tags = list.filter((t) => String(t).replace(/^#/, "").toLowerCase() !== unplaced);
    }
  });
}

// ── The form ──────────────────────────────────────────────────────

const F = {
  wrap: { border: "1px solid var(--background-modifier-border)", borderRadius: "8px", padding: "12px 14px", margin: "8px 0 12px", background: "var(--background-secondary)" },
  row: { display: "flex", flexWrap: "wrap", gap: "10px 14px", alignItems: "flex-end", margin: "0 0 10px" },
  field: { display: "flex", flexDirection: "column", gap: "3px" },
  label: { fontSize: "var(--font-ui-smaller)", color: "var(--text-muted)" },
  wide: { minWidth: "320px", flex: "1 1 320px" },
  status: { fontSize: "var(--font-ui-small)", marginTop: "6px" },
  warn: { color: "var(--color-orange)" },
};

/** Name suggestions: NPCs, factions, PCs (for Who) and locations (for At), outside the Player Wiki and excluded folders. */
function useNameLists() {
  const c = cfg();
  const all = dc.useQuery("@page");
  return dc.useMemo(() => {
    const ok = all.filter((p) => !isExcluded(p) && !p.$path.startsWith(c.folder_player_wiki + "/"));
    const names = (pred) => [...new Set(ok.filter(pred).map((p) => displayName(p.$name)))].sort((a, b) => a.localeCompare(b));
    const people = names((p) => hasTag(p, c.tag_npc) || hasTag(p, c.tag_pc) || hasTag(p, c.tag_faction));
    const places = names((p) => hasTag(p, c.tag_location));
    const pcs = names((p) => hasTag(p, c.tag_pc));
    // A typed name finds its note by display name or file name; file names shared with another note (a wiki twin) link by path.
    const baseCount = new Map();
    for (const p of all) baseCount.set(p.$name.toLowerCase(), (baseCount.get(p.$name.toLowerCase()) ?? 0) + 1);
    const byName = new Map();
    for (const p of ok) {
      const entry = { path: p.$path, name: p.$name, unique: baseCount.get(p.$name.toLowerCase()) === 1 };
      for (const k of [p.$name.toLowerCase(), displayName(p.$name).toLowerCase()]) if (!byName.has(k)) byName.set(k, entry);
    }
    const pages = all.map((p) => ({ path: p.$path, name: p.$name, tags: tagsOf(p) }));
    const pageByPath = new Map(pages.map((p) => [p.path, p]));
    const factionByTag = factionNotesByTag(pages);
    const factionsFor = (path) => factionsOf(pageByPath.get(path), factionByTag);
    return { people: [c.label_party, ...people], places, pcs, find: (name) => byName.get(String(name).trim().toLowerCase()) ?? null, factionsFor };
  }, [all]);
}

/** Props: piece (an entry from usePieces), onDone(). */
function PieceChangeForm({ piece, onDone }) {
  const c = cfg();
  const { campaign } = useActiveCampaign();
  const { played, lastPlayed } = useSessionState(campaign?.tag);
  const cal = useCalendar(campaign?.calendar);
  const now = inGameNow(lastPlayed, cal.months);
  const lists = useNameLists();
  const categories = Object.keys(cal.colors ?? {});
  const recent = [...played].reverse().slice(0, 8);
  const [f, setF] = dc.useState({ kind: "holder", who: "", at: "", description: "", undated: false, label: "Before the campaign", date: null, session: null, category: null, eventName: null, share: null, shareWith: null, carrier: "" });
  const [status, setStatus] = dc.useState(null);
  const set = (patch) => setF({ ...f, ...patch });
  const info = kindInfo(f.kind);
  const date = f.date ?? now?.date ?? "";
  const sessionPath = f.session ?? lastPlayed?.$path ?? "";
  const category = f.category ?? c.calendar_category_pieces;
  const who = refFromName(f.who, lists.find);
  const at = refFromName(f.at, lists.find);
  const carrierNeeded = f.kind === "holder" && !!who?.plain && who.plain.toLowerCase() === String(c.label_party).toLowerCase();
  const carrier = carrierNeeded ? refFromName(f.carrier, lists.find) : null;
  const autoName = info.event(piece.number, refName(who), refName(at));
  const eventName = f.eventName ?? autoName;
  const listId = `piece-names-${piece.number}`;

  // Who they share it with: offered for knows and pursuing when the person belongs to a faction.
  // Until changed, it follows the person's current line in that section.
  const factions = who?.path ? lists.factionsFor(who.path) : [];
  const sameWho = (r) => (r.plain ? !!who?.plain && r.plain.toLowerCase() === who.plain.toLowerCase() : !!who?.path && piece.ctx.resolve(r.target)?.path === who.path);
  const current = info.section === "knows" ? piece.parsed.knows.find((k) => sameWho(k.who)) : info.section === "pursuit" ? piece.parsed.pursuit.find((q) => sameWho(q.who)) : null;
  const currentShare = current?.share ?? null;
  const askShare = (info.section === "knows" || (info.section === "pursuit" && !info.remove)) && (factions.length > 0 || !!currentShare);
  const shareMode = f.share ?? (currentShare?.personal ? "personal" : currentShare?.with ? "some" : "factions");
  const sharePaths = f.shareWith ?? (currentShare?.with ?? []).map((r) => (r.target ? piece.ctx.resolve(r.target)?.path : null) ?? factions.find((x) => displayName(x.name).toLowerCase() === refName(r).toLowerCase())?.path).filter(Boolean);
  const toggleShare = (path, on) => set({ share: "some", shareWith: on ? [...new Set([...sharePaths, path])] : sharePaths.filter((x) => x !== path) });

  async function save() {
    if (info.who === "required" && !who) return setStatus({ warn: true, text: "Who is this about? Pick or type a name." });
    if (info.at === "required" && !at) return setStatus({ warn: true, text: "Where did it go? Fill in At." });
    if (!plain(f.description)) return setStatus({ warn: true, text: "Add a line describing what happened." });
    if (carrierNeeded && !carrier) return setStatus({ warn: true, text: "Which PC carries it? Pick one under Carried by." });
    if (!f.undated && !/^\d+-\d+-\d+$/.test(date)) return setStatus({ warn: true, text: "The in-world date must be year-month-day, like 835-04-27." });
    if (askShare && shareMode === "some" && !sharePaths.length) return setStatus({ warn: true, text: "Pick at least one faction they share it with, or choose No one." });
    const share = !askShare || shareMode === "factions" ? null : shareMode === "personal" ? { personal: true } : { with: sharePaths.map((p) => refFromName(displayName(p.split("/").pop().replace(/\.md$/, "")), lists.find) ?? { plain: p }) };
    const sPage = sessionPath ? played.find((s) => s.$path === sessionPath) : null;
    const session = sPage
      ? { target: sPage.$name, display: sPage.value("session_number") && `Session ${sPage.value("session_number")}` !== sPage.$name ? `Session ${sPage.value("session_number")}` : null }
      : null;
    const ch = {
      kind: f.kind,
      label: f.undated ? f.label : inWorldText(date, cal.months),
      date: f.undated ? null : date,
      category,
      eventName,
      description: f.description,
      who: info.who ? who : null,
      at: info.at ? at : null,
      session,
      share,
    };
    const headings = { history: c.heading_piece_history, knows: c.heading_piece_knows, pursuit: c.heading_piece_pursuit, rulings: c.heading_piece_rulings };
    const resolve = (t) => app.metadataCache.getFirstLinkpathDest?.(t, piece.path)?.path ?? null;
    try {
      const file = app.vault.getAbstractFileByPath(piece.path);
      await app.vault.process(file, (text) => applyChange(text, ch, headings, resolve));
      let where = "";
      if (f.kind === "holder" || f.kind === "moved") {
        try {
          const loc = locations();
          const plan = planWhereabouts(ch, { loc, sourcePath: piece.path, carrier, isPlace: makeLocator(loc, null).isPlace, fileOf: (path) => app.vault.getAbstractFileByPath(path) });
          if (plan?.link) {
            await writeWhereabouts(file, plan.link);
            where = ` Whereabouts: ${plan.label}.`;
          } else if (plan?.skip) where = ` Whereabouts not changed: ${plan.skip}.`;
        } catch (e) {
          console.error(e);
          where = ` Whereabouts not changed: ${e.message}.`;
        }
      }
      setStatus({ text: `Added to ${piece.name}: ${historyLine(ch).replace(/<[^>]+>/g, "").replace(/^- /, "")}${where}` });
      setF({ ...f, who: "", at: "", description: "", eventName: null, share: null, shareWith: null, carrier: "" });
      onDone?.();
    } catch (e) {
      console.error(e);
      setStatus({ warn: true, text: `Couldn't update the note: ${e.message}` });
    }
  }

  return (
    <div style={F.wrap}>
      <datalist id={`${listId}-who`}>{lists.people.map((n) => <option key={n} value={n} />)}</datalist>
      <datalist id={`${listId}-at`}>{lists.places.map((n) => <option key={n} value={n} />)}</datalist>
      <div style={F.row}>
        <label style={F.field}>
          <span style={F.label}>What happened</span>
          <select value={f.kind} onChange={(e) => set({ kind: e.currentTarget.value, eventName: null, share: null, shareWith: null })}>
            {CHANGE_KINDS.map((k) => <option key={k.kind} value={k.kind}>{k.label}</option>)}
          </select>
        </label>
        {info.who ? (
          <label style={F.field}>
            <span style={F.label}>Who{info.who === "required" ? "" : " (optional)"}</span>
            <input type="text" list={`${listId}-who`} placeholder="Name or Party" value={f.who} onInput={(e) => set({ who: e.currentTarget.value, eventName: null, share: null, shareWith: null })} />
          </label>
        ) : null}
        {info.at ? (
          <label style={F.field}>
            <span style={F.label}>At{info.at === "required" ? "" : " (optional)"}</span>
            <input type="text" list={`${listId}-at`} placeholder="Place" value={f.at} onInput={(e) => set({ at: e.currentTarget.value, eventName: null })} />
          </label>
        ) : null}
        {carrierNeeded ? (
          <label style={F.field}>
            <span style={F.label}>Carried by</span>
            <select value={f.carrier} onChange={(e) => set({ carrier: e.currentTarget.value })}>
              <option value="">Pick a PC</option>
              {lists.pcs.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        ) : null}
      </div>
      {askShare ? (
        <div style={F.row}>
          <label style={F.field}>
            <span style={F.label}>Shares it with</span>
            <select value={shareMode} onChange={(e) => set({ share: e.currentTarget.value, shareWith: e.currentTarget.value === "some" ? sharePaths : null })}>
              <option value="factions">Their factions{factions.length ? ` (${factions.map((x) => displayName(x.name)).join(", ")})` : ""}</option>
              <option value="personal">No one: keeps it to themselves</option>
              {factions.length > 1 ? <option value="some">Only some of their factions</option> : null}
            </select>
          </label>
          {shareMode === "some"
            ? factions.map((x) => (
                <label key={x.path} style={{ ...F.field, flexDirection: "row", alignItems: "center", gap: "6px" }}>
                  <input type="checkbox" checked={sharePaths.includes(x.path)} onChange={(e) => toggleShare(x.path, e.currentTarget.checked)} />
                  <span style={F.label}>{displayName(x.name)}</span>
                </label>
              ))
            : null}
        </div>
      ) : null}
      <div style={F.row}>
        <label style={{ ...F.field, ...F.wide }}>
          <span style={F.label}>{info.section === "knows" ? "What they know or believe" : info.section === "pursuit" ? "How they go about it" : "Description"}</span>
          <input type="text" value={f.description} onInput={(e) => set({ description: e.currentTarget.value })} />
        </label>
      </div>
      <div style={F.row}>
        {f.undated ? (
          <label style={F.field}>
            <span style={F.label}>Label instead of a date</span>
            <input type="text" value={f.label} onInput={(e) => set({ label: e.currentTarget.value })} />
          </label>
        ) : (
          <label style={F.field}>
            <span style={F.label}>In-world date{date && cal.months.length ? ` (${inWorldText(date, cal.months)})` : ""}</span>
            <input type="text" placeholder="835-04-27" value={date} onInput={(e) => set({ date: e.currentTarget.value })} />
          </label>
        )}
        <label style={{ ...F.field, flexDirection: "row", alignItems: "center", gap: "6px" }}>
          <input type="checkbox" checked={f.undated} onChange={(e) => set({ undated: e.currentTarget.checked })} />
          <span style={F.label}>No in-world date</span>
        </label>
        <label style={F.field}>
          <span style={F.label}>Session</span>
          <select value={sessionPath} onChange={(e) => set({ session: e.currentTarget.value })}>
            <option value="">None</option>
            {recent.map((s) => <option key={s.$path} value={s.$path}>{s.value("session_number") ? `Session ${s.value("session_number")}` : s.$name}</option>)}
          </select>
        </label>
      </div>
      {f.undated ? null : (
        <div style={F.row}>
          <label style={F.field}>
            <span style={F.label}>Calendar category</span>
            <select value={category} onChange={(e) => set({ category: e.currentTarget.value })}>
              {[...new Set([c.calendar_category_pieces, ...categories])].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
          <label style={{ ...F.field, ...F.wide }}>
            <span style={F.label}>Calendar event name</span>
            <input type="text" value={eventName} onInput={(e) => set({ eventName: e.currentTarget.value })} />
          </label>
        </div>
      )}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button className="mod-cta" onClick={save}>Save to {piece.name.replace(/\s+-\s+.*$/, "")}</button>
        <span style={BASE.muted}>
          {info.section === "knows" ? "Also replaces their line in Who knows." : info.section === "pursuit" ? (info.remove ? "Also removes their line from Pursued by." : "Also replaces their line in Pursued by.") : info.section === "rulings" ? "Also adds it under Properties and rulings." : f.kind === "holder" || f.kind === "moved" ? "Adds one line to History and sets whereabouts." : "Adds one line to History."}
        </span>
      </div>
      {status ? <div style={{ ...F.status, ...(status.warn ? F.warn : {}) }}>{status.text}</div> : null}
    </div>
  );
}

return { CHANGE_KINDS, historyLine, applyChange, planWhereabouts, refFromName, shareText, PieceChangeForm };
```
