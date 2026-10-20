---
hide_from_related: true
---

**Purpose:** The table side of the Session Hub. Currently: Tonight's cast (the NPCs, locations, factions, and items the next session note and its arc link to, each opening to its Quick Reference section) and Where are we (the notes connected to the party's current location).

**Exports:** `TableCast`, `WhereAreWe`, `linkTargets`, `kindOf`

**Depends on:** [[Shared Helpers]] · [[Campaign State]] · [[Quick Capture]] · [[Session Hub Views]]

**Used by:** [[Session Hub]]

Conventions this module relies on:

- **Tonight's cast.** The session is the next one dated today or later; with none, the last one played. Its links are read from the note text, with `<!-- comments -->` and embeds (`![[...]]`) left out, so a link inside a comment does not count. The arc named in the session's `arc` property is read the same way and shown in a collapsed group.
- **What counts as cast.** A linked note tagged `npc`, `location`, `faction`, or `artifact` (names in [[Hub Config]]). Notes in the Player Wiki folder and in excluded folders are not listed. A link that lands on a Player Wiki note shows that note's DM twin instead, the note named `<name> - DM Notes` (or the same name outside the Player Wiki), so a DM note and its player-facing twin do not both appear. A Player Wiki note with no DM twin is left out. When an entry has a Player Wiki twin, a "player wiki" link beside it opens what the players have been told.
- **Quick Reference.** Each entry opens to the `Quick Reference` section of its note, loaded when you open the entry. A note with no such heading says so.
- **No note yet.** A link that matches no note gets a kind picker and a Create button. It builds the same stub as [[Quick Capture]] and links it to the session. The stub takes the link's name, so the original link starts working.

- **Where are we.** The place is the link in the `Party location` bullet under `Where we left off` in the last played session (names in [[Hub Config]]). A link that lands on a Player Wiki note counts for its DM twin too. Under it: NPCs whose `current_location` property points there ("here now"), then every other NPC, faction, item, plot thread, and arc whose note links to the place (body or properties), with no counts. Arcs with `status: complete` and session notes are not listed.
- **Locations here vs. mentioned.** A location is in the place when its note sits inside the folder of the place's note (the folder named for the place, holding a note of the same name, with or without " - DM Notes"; subfolders count; the Player Wiki twin's folder works too), or when it sets `located_in: "[[Place]]"`. Those are "Locations here" whether or not they link to the place. Locations that only link to it go in a collapsed "Mentioned, not located here" group. A Party location with no link shows its text and says to link the place.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Session Hub Table.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, linkPath, hasTag, isExcluded, statusOf, useNoteText, stripComments, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const { useActiveCampaign, useSessionState } = await dc.require(dc.headerLink("00 DM Screen/Code/Campaign State.md", "Code"));

const { sectionText, labelItems } = await dc.require(dc.headerLink("00 DM Screen/Code/Session Hub Views.md", "Code"));

const { createStub } = await dc.require(dc.headerLink("00 DM Screen/Code/Quick Capture.md", "Code"));

const T = {
  wrap: { margin: "8px 0 16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", alignItems: "start", margin: "12px 0" },
  panel: { border: "1px solid var(--background-modifier-border)", borderRadius: "10px", padding: "12px 18px 10px" },
  label: {
    fontSize: "var(--font-ui-smaller)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--text-muted)",
    marginBottom: "6px",
  },
  entry: { margin: "6px 0" },
  embed: { margin: "6px 0 12px 14px" },
  missing: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", margin: "6px 0" },
  warn: { color: "var(--text-error)", fontSize: "var(--font-ui-smaller)" },
};

const KIND_ORDER = ["npc", "location", "faction", "item"];
const KIND_LABEL = { npc: "NPCs", location: "Locations", faction: "Factions", item: "Items" };
const CREATE_OPTIONS = [
  ["npc", "NPC"],
  ["location", "Location"],
  ["shop", "Shop"],
  ["faction", "Faction"],
  ["item", "Item"],
];

/** Link targets in a note's text, in order, once each. Comments and embeds are left out. */
function linkTargets(text) {
  const out = [];
  const seen = new Set();
  for (const m of stripComments(text).matchAll(/(!?)\[\[([^\]]+?)\]\]/g)) {
    if (m[1]) continue;
    const target = m[2].replace(/\\?\|.*$/, "").replace(/#.*$/, "").trim();
    const key = target.toLowerCase();
    if (target && !seen.has(key)) {
      seen.add(key);
      out.push(target);
    }
  }
  return out;
}

/** "npc", "location", "faction", "item", or null for a page that is none of them. */
function kindOf(page) {
  const c = cfg();
  if (hasTag(page, c.tag_npc)) return "npc";
  if (hasTag(page, c.tag_location)) return "location";
  if (hasTag(page, c.tag_faction)) return "faction";
  if (hasTag(page, c.tag_item)) return "item";
  return null;
}

/** The note a link points to, as Obsidian resolves it; null when there is none. */
const resolveTarget = (target, source) => app.metadataCache.getFirstLinkpathDest?.(target, source)?.path ?? null;

/** Cast from a note's text: { groups: { npc: [{ page, wiki }], ... }, missing: [name] }. Pages in `skip` are left out. */
function castOf(text, sourcePath, byPath, wikiByName, skip) {
  const c = cfg();
  const byName = new Map();
  for (const p of byPath.values()) byName.set(p.$name.toLowerCase(), p);
  const groups = { npc: [], location: [], faction: [], item: [] };
  const missing = [];
  const taken = new Set();
  for (const target of linkTargets(text)) {
    const path = resolveTarget(target, sourcePath);
    if (!path) {
      missing.push(target);
      continue;
    }
    let page = byPath.get(path);
    if (!page && path.startsWith(c.folder_player_wiki + "/")) {
      const name = path.split("/").pop().replace(/\.md$/, "").toLowerCase();
      page = byName.get(`${name} - dm notes`) ?? byName.get(name);
    }
    if (!page || taken.has(page.$path) || skip.has(page.$path)) continue;
    taken.add(page.$path);
    const wiki = wikiByName.get(page.$name.replace(/ - DM Notes$/i, "").toLowerCase()) ?? null;
    groups[kindOf(page)].push({ page, wiki });
  }
  return { groups, missing, paths: taken };
}

const isEmpty = (cast) => cast.missing.length === 0 && KIND_ORDER.every((k) => cast.groups[k].length === 0);

function CastEntry({ page, wiki, plain }) {
  const [open, setOpen] = dc.useState(false);
  if (plain)
    return (
      <div style={T.entry}>
        <dc.Link link={page.$link} />
      </div>
    );
  const hasReference = (page.$sections ?? []).some((s) => String(s.$title).trim().toLowerCase() === "quick reference");
  const needsWork = hasTag(page, cfg().tag_needs_work);
  return (
    <details style={T.entry} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        <dc.Link link={page.$link} />
        {needsWork ? <span style={S.pill}>needs work</span> : null}
        {wiki ? (
          <span style={S.muted}>
            {" · "}
            <dc.Link link={wiki.$link.withDisplay("player wiki")} />
          </span>
        ) : null}
      </summary>
      {open ? (
        hasReference ? (
          <div style={T.embed}>
            <dc.LinkEmbed link={dc.headerLink(page.$path, "Quick Reference")} />
          </div>
        ) : (
          <div style={{ ...S.muted, ...T.embed }}>No Quick Reference section in this note.</div>
        )
      ) : null}
    </details>
  );
}

function MissingRow({ name, campaign, session, worldName }) {
  const [kind, setKind] = dc.useState("npc");
  const [busy, setBusy] = dc.useState(false);
  const [made, setMade] = dc.useState(null);
  async function create() {
    if (busy || !campaign) return;
    setBusy(true);
    const out = await createStub({ kindKey: kind, name, line: "", campaign, session, worldName });
    setBusy(false);
    setMade(out);
  }
  if (made?.file) {
    return (
      <div style={T.missing}>
        <span>{name}</span>
        <span style={S.muted}>created at {made.file.path}</span>
        <button onClick={() => app.workspace.getLeaf("tab").openFile(made.file)}>Open</button>
      </div>
    );
  }
  return (
    <div style={T.missing}>
      <span>{name}</span>
      <span style={S.muted}>no note yet</span>
      <select value={kind} onChange={(e) => setKind(e.currentTarget.value)}>
        {CREATE_OPTIONS.map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <button disabled={busy || !campaign} onClick={create}>
        Create
      </button>
      {made?.error ? <span style={T.warn}>{made.error}</span> : null}
    </div>
  );
}

function CastGroups({ cast, campaign, session, worldName }) {
  const shown = KIND_ORDER.filter((k) => cast.groups[k].length);
  return (
    <div>
      {shown.length ? (
        <div style={T.grid}>
          {shown.map((k) => (
            <div key={k} style={T.panel}>
              <div style={T.label}>{KIND_LABEL[k]}</div>
              {cast.groups[k].map((e) => (
                <CastEntry key={e.page.$path} page={e.page} wiki={e.wiki} />
              ))}
            </div>
          ))}
        </div>
      ) : null}
      {cast.missing.length ? (
        <div style={T.panel}>
          <div style={T.label}>Linked, but no note yet</div>
          {cast.missing.map((name) => (
            <MissingRow key={name} name={name} campaign={campaign} session={session} worldName={worldName} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const HERE_ORDER = [
  ["here", "NPCs here now"],
  ["npc", "NPCs"],
  ["inside", "Locations here"],
  ["faction", "Factions"],
  ["item", "Items"],
  ["plot", "Plot threads"],
  ["arc", "Arcs"],
];

const noteBase = (path) => path.split("/").pop().replace(/\.md$/, "");
const placeKey = (name) => name.replace(/ - DM Notes$/i, "").trim().toLowerCase();

/** The folder a place's note is the folder note of ("Rexxentrum/Rexxentrum - DM Notes.md"), or null. */
function folderOfPlace(path) {
  const parts = path.split("/");
  if (parts.length < 2) return null;
  const folder = parts[parts.length - 2];
  return placeKey(folder) === placeKey(noteBase(path)) ? parts.slice(0, -1).join("/") : null;
}

/** The place the party is, from the last played session, and the notes connected to it. */
function WhereAreWe() {
  const c = cfg();
  const { campaign } = useActiveCampaign();
  const { lastPlayed } = useSessionState(campaign?.tag);
  const text = useNoteText(lastPlayed?.$path);

  const pages = new Map();
  const wikiByName = new Map();
  for (const tag of [c.tag_npc, c.tag_location, c.tag_faction, c.tag_item, c.tag_plot, c.tag_arc]) {
    for (const p of dc.useQuery(`@page and #${tag}`)) {
      if (isExcluded(p)) continue;
      if (p.$path.startsWith(c.folder_player_wiki + "/")) wikiByName.set(p.$name.toLowerCase(), p);
      else pages.set(p.$path, p);
    }
  }

  if (!lastPlayed) return <div style={S.muted}>No session played yet.</div>;
  const items = labelItems(sectionText(text, c.heading_left_off), c.label_party_location);
  if (!items.length) {
    return (
      <div style={S.muted}>
        <dc.Link link={lastPlayed.$link} /> has no Party location yet. Fill it in under "Where we left off" after the game.
      </div>
    );
  }

  // Everything the Party location line links to, plus the DM or wiki twin of each.
  const byName = new Map([...pages.values()].map((p) => [p.$name.toLowerCase(), p]));
  const targets = new Set();
  const places = [];
  for (const target of items.flatMap((i) => linkTargets(i.text))) {
    const path = resolveTarget(target, lastPlayed.$path);
    if (!path) continue;
    targets.add(path);
    const inWiki = path.startsWith(c.folder_player_wiki + "/");
    const base = path.split("/").pop().replace(/\.md$/, "").toLowerCase();
    const dm = inWiki ? byName.get(`${base} - dm notes`) ?? byName.get(base) : pages.get(path);
    const wiki = inWiki ? wikiByName.get(base) : wikiByName.get(base.replace(/ - dm notes$/, ""));
    if (dm) {
      targets.add(dm.$path);
      places.push({ page: dm, wiki: wiki ?? null });
    }
    if (wiki) targets.add(wiki.$path);
  }

  const header = (
    <div style={{ margin: "4px 0 12px" }}>
      <span style={S.muted}>Party location, from <dc.Link link={lastPlayed.$link} />: </span>
      <dc.Markdown content={items[0].text || items.map((i) => i.text).join(" ")} inline={true} sourcePath={lastPlayed.$path} />
    </div>
  );
  if (!targets.size) {
    return (
      <div>
        {header}
        <div style={S.muted}>The Party location line has no link to a note. Link the place to see what connects to it.</div>
      </div>
    );
  }

  const groups = { here: [], npc: [], inside: [], mentioned: [], faction: [], item: [], plot: [], arc: [] };
  const seen = new Set();
  for (const p of pages.values()) {
    if (targets.has(p.$path) || !hasTag(p, c.tag_npc)) continue;
    const at = linkPath(p.value("current_location"));
    if (at && targets.has(at)) {
      groups.here.push(p);
      seen.add(p.$path);
    }
  }
  // Folders that hold the place, on the DM side and the Player Wiki side.
  const folders = [];
  for (const e of places) {
    for (const page of [e.page, e.wiki]) {
      const f = page ? folderOfPlace(page.$path) : null;
      if (f) folders.push(f);
    }
  }
  const insideOf = (p) => {
    if (folders.some((f) => p.$path.startsWith(f + "/"))) return true;
    const located = linkPath(p.value("located_in"));
    if (located && targets.has(located)) return true;
    const twin = wikiByName.get(placeKey(p.$name));
    return !!twin && folders.some((f) => twin.$path.startsWith(f + "/"));
  };
  for (const p of pages.values()) {
    if (targets.has(p.$path) || !hasTag(p, c.tag_location) || !insideOf(p)) continue;
    groups.inside.push(p);
    seen.add(p.$path);
  }
  for (const [src, dests] of Object.entries(app.metadataCache.resolvedLinks ?? {})) {
    if (targets.has(src) || seen.has(src) || !Object.keys(dests).some((d) => targets.has(d))) continue;
    const p = pages.get(src);
    if (!p) continue;
    if (hasTag(p, c.tag_arc) && statusOf(p) === "complete") continue;
    const kind = kindOf(p) ?? (hasTag(p, c.tag_plot) ? "plot" : hasTag(p, c.tag_arc) ? "arc" : null);
    if (kind === "location") groups.mentioned.push(p);
    else if (kind) groups[kind].push(p);
  }
  const shown = HERE_ORDER.filter(([k]) => groups[k].length);
  const wikiOf = (p) => wikiByName.get(p.$name.replace(/ - DM Notes$/i, "").toLowerCase()) ?? null;

  return (
    <div style={T.wrap}>
      {header}
      {places.map((e) => (
        <CastEntry key={e.page.$path} page={e.page} wiki={e.wiki} />
      ))}
      {shown.length ? (
        <div style={T.grid}>
          {shown.map(([k, label]) => (
            <div key={k} style={T.panel}>
              <div style={T.label}>{label}</div>
              {groups[k]
                .sort((a, b) => a.$name.localeCompare(b.$name))
                .map((p) => (
                  <CastEntry key={p.$path} page={p} wiki={wikiOf(p)} plain={k === "plot" || k === "arc"} />
                ))}
            </div>
          ))}
        </div>
      ) : groups.mentioned.length ? null : (
        <div style={{ ...S.muted, margin: "12px 0" }}>No other NPC, location, faction, item, or plot note links to this place yet.</div>
      )}
      {groups.mentioned.length ? (
        <details style={{ marginTop: "8px" }}>
          <summary style={S.muted}>Mentioned, not located here</summary>
          <div style={{ margin: "8px 0 0 14px" }}>
            {groups.mentioned
              .sort((a, b) => a.$name.localeCompare(b.$name))
              .map((p) => (
                <CastEntry key={p.$path} page={p} wiki={wikiOf(p)} plain={true} />
              ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function TableCast() {
  const c = cfg();
  const { campaign } = useActiveCampaign();
  const { next, lastPlayed } = useSessionState(campaign?.tag);
  const session = next ?? lastPlayed;
  const arcPath = session ? linkPath(session.value("arc")) : null;
  const sessionText = useNoteText(session?.$path);
  const arcText = useNoteText(arcPath);
  const worldValue = campaign ? campaign.page.value("world") : null;
  const worldName = worldValue ? String(worldValue).replace(/^\[\[|\]\]$/g, "") : "";

  const byPath = new Map();
  const wikiByName = new Map();
  for (const tag of [c.tag_npc, c.tag_location, c.tag_faction, c.tag_item]) {
    for (const p of dc.useQuery(`@page and #${tag}`)) {
      if (isExcluded(p) || !kindOf(p)) continue;
      if (p.$path.startsWith(c.folder_player_wiki + "/")) wikiByName.set(p.$name.toLowerCase(), p);
      else byPath.set(p.$path, p);
    }
  }

  if (!session) return <div style={S.muted}>No session note yet. Create the next session above.</div>;

  const fromSession = castOf(sessionText, session.$path, byPath, wikiByName, new Set());
  const fromArc = arcPath ? castOf(arcText, arcPath, byPath, wikiByName, fromSession.paths) : null;
  const arcMissing = fromArc ? fromArc.missing.filter((n) => !fromSession.missing.some((m) => m.toLowerCase() === n.toLowerCase())) : [];
  const arcCast = fromArc ? { ...fromArc, missing: arcMissing } : null;

  return (
    <div style={T.wrap}>
      <div style={S.muted}>
        From <dc.Link link={session.$link} />
        {next ? "" : " (last played; no session is scheduled)"}
      </div>
      {isEmpty(fromSession) ? (
        <div style={{ ...S.muted, margin: "12px 0" }}>The session note links no NPCs, locations, factions, or items yet. Link them in the prep steps and they appear here.</div>
      ) : (
        <CastGroups cast={fromSession} campaign={campaign} session={session} worldName={worldName} />
      )}
      {arcCast && !isEmpty(arcCast) ? (
        <details style={{ marginTop: "12px" }}>
          <summary style={S.muted}>In the arc: {arcPath.split("/").pop().replace(/\.md$/, "")}</summary>
          <CastGroups cast={arcCast} campaign={campaign} session={session} worldName={worldName} />
        </details>
      ) : null}
    </div>
  );
}

return { TableCast, WhereAreWe, linkTargets, kindOf };
```
