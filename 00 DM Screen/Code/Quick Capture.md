---
hide_from_related: true
---

**Purpose:** Quick capture for the table: a one-line form that makes a stub note for an NPC, location, shop, item, or faction you improvised, or adds an event to the campaign timeline.

**Exports:** `QuickCapture`, `createStub`, `createEvent`, `stubContent`, `templateBody`, `safeName`

**Depends on:** [[Shared Helpers]] · [[Campaign State]] · [[Calendar and Timeline]] · [[Note Types]]

**Used by:** [[Session Hub]]

Conventions this module relies on:

- **Stubs** are built from the body of your own templates ([[NPC Template]], [[Location Template]], [[Faction Template]], [[Artifact-Item Template]]; names in [[Hub Config]] as `template_…`). The templates ask questions and move the file, so the module reads each template's text, drops its Templater header and frontmatter, and keeps the headings. If a template can't be found or read, the stub gets a "rebuild with the … template" note instead.
- **Frontmatter** on every stub: the kind's tag, `needs-work`, `improvised`, the campaign's tag, `first_session` (a link to the current session), and `created`. NPC stubs also get `aliases` and `disposition: indifferent`; faction stubs get `aliases`. Place and faction are tags (`place/…`, `faction/…`), added when the note is developed. Remove `needs-work` when the note is developed.
- **Where stubs go:** NPCs to `folder_npcs`; factions to `folder_factions/<World>` (the world's name from the campaign note's `world` property); items to `folder_objects`; locations and shops to a `Stubs` folder inside the campaign's folder (`folder_stubs`; it sits there, not under Worlds, because the NPC, faction, item, and location templates read every folder directly under Worlds as a world).
- **World tag:** the campaign note's `world` property (for example `Exandria`) becomes `world/exandria` on the stub. Without it the stub has no world tag and says so.
- **Current session:** the session dated today (the next session on game night); with none dated today, the next session; with none at all, the last one played. The form shows which.
- **Events** are added to the campaign's timeline note in the same format as [[Close Session]]: in-world date (starts as the current session's start date), a Calendarium category, the name, and the one line as the description.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Quick Capture.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, linkPath, todayDay, rawText, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const { useActiveCampaign, useSessionState } = await dc.require(dc.headerLink("00 DM Screen/Code/Campaign State.md", "Code"));

const { useCalendar } = await dc.require(dc.headerLink("00 DM Screen/Code/Calendar and Timeline.md", "Code"));

const { noteType } = await dc.require(dc.headerLink("00 DM Screen/Code/Note Types.md", "Code"));

const Q = {
  card: {
    border: "1px solid var(--background-modifier-border)",
    borderRadius: "10px",
    padding: "16px 20px",
    background: "var(--background-secondary)",
  },
  row: { display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" },
  field: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "var(--font-ui-smaller)", color: "var(--text-muted)" },
  status: { margin: "12px 0 0", fontSize: "var(--font-ui-small)" },
  warn: { color: "var(--color-orange)" },
};

// ── Text helpers ──────────────────────────────────────────────────

const toTag = (s) => String(s).trim().toLowerCase().replace(/\s+/g, "-");
/** A file name without characters Obsidian or the file system reject. */
const safeName = (s) => String(s ?? "").replace(/[\\/:*?"<>|#^[\]]/g, "").replace(/\s+/g, " ").trim();
/** Text for a timeline tag attribute or body: no angle brackets, no double quotes. */
const clean = (s) => String(s ?? "").replace(/[<>]/g, "").replace(/"/g, "'").trim();
const sentence = (s) => (s ? s[0].toUpperCase() + s.slice(1) + (/[.!?]$/.test(s) ? "" : ".") : "");
const dirOf = (p) => p.split("/").slice(0, -1).join("/");

/** The kinds the form offers: label, tags, extra frontmatter, template, and where the note goes. */
function kinds() {
  const c = cfg();
  return {
    npc: { label: "NPC", template: c.template_npc, tags: [c.tag_npc], extra: ["aliases: []", "disposition: indifferent"] },
    location: { label: "Location", template: c.template_location, tags: [c.tag_location], extra: [], inStubs: true },
    shop: { label: "Shop", template: c.template_location, tags: [c.tag_location, "shop"], extra: [], inStubs: true },
    faction: { label: "Faction", template: c.template_faction, tags: [c.tag_faction], extra: ["aliases: []"], byWorld: true },
    item: { label: "Item", template: c.template_item, tags: [c.tag_item], extra: [] },
  };
}

/** A template's body: the text after its Templater header and frontmatter. null when it can't be used as-is. */
function templateBody(text) {
  if (!text) return null;
  const i = text.indexOf("_%>");
  const rest = i >= 0 ? text.slice(i + 3) : text;
  // The frontmatter ends at a "---" line; in the Location Template it follows a Templater tag directly ("%>---").
  const m = rest.match(/^\s*---\n[\s\S]*?(?:\n|%>)---\n?/);
  if (!m) return null;
  const body = rest.slice(m[0].length).replace(/^\n+/, "");
  return body.includes("<%") || !body.trim() ? null : body.replace(/\s*$/, "\n");
}

/**
 * The full text of a stub note.
 * kind: an entry from kinds(). session: { name } of the current session note. worldTag: "world/exandria" or "".
 * body: the template body, or null when the template can't be used.
 */
function stubContent({ kind, line, session, campaignTag, worldTag, body, templateName }) {
  const c = cfg();
  const tags = [...kind.tags, c.tag_needs_work, c.tag_improvised, campaignTag, worldTag].filter(Boolean);
  const front = ["---", "tags:", ...tags.map((t) => `  - ${t}`)];
  if (session) front.push(`first_session: "[[${session.name}]]"`);
  front.push(`created: ${todayDay()}`, ...kind.extra, "---");
  const note = [
    `> [!todo] Stub${session ? ` from [[${session.name}]]` : ""}`,
    ...(line ? [`> ${line}`] : []),
    `> Needs development. Remove the \`${c.tag_needs_work}\` tag when it's done.`,
  ];
  if (!worldTag) note.push("> No world tag yet: add `world/…` (and a region tag if it has one), as the template would.");
  if (body === null) note.push(`> The ${templateName} couldn't be used here: rebuild this note with it (create a new note from the template, then move this text across).`);
  return `${front.join("\n")}\n\n${note.join("\n")}\n\n${body ?? "# Quick Reference\n\n"}`;
}

// ── Vault actions ─────────────────────────────────────────────────

async function ensureFolder(path) {
  let current = "";
  for (const part of path.split("/")) {
    current = current ? `${current}/${part}` : part;
    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
  }
}

function availablePath(folder, name) {
  for (let n = 1; ; n++) {
    const path = `${folder}/${name}${n > 1 ? ` ${n}` : ""}.md`;
    if (!app.vault.getAbstractFileByPath(path)) return path;
  }
}

/** The text of a template note, found in Templater's template folder when known, else by name. null when missing. */
async function readTemplate(name) {
  const folder = app.plugins?.plugins?.["templater-obsidian"]?.settings?.templates_folder;
  const file = folder
    ? app.vault.getAbstractFileByPath(`${folder}/${name}.md`)
    : app.vault.getMarkdownFiles().find((f) => f.basename === name);
  return file ? await app.vault.cachedRead(file) : null;
}

/**
 * Create a stub note for something improvised at the table.
 * Returns { file } or { error }. worldName is the plain world name from the campaign note ("" if none).
 */
async function createStub({ kindKey, name, line, campaign, session, worldName }) {
  const c = cfg();
  const kind = kinds()[kindKey];
  const title = safeName(name);
  if (!kind) return { error: "Choose a kind." };
  if (!title) return { error: "Give it a name." };
  const folder = kind.inStubs
    ? `${dirOf(campaign.page.$path)}/${c.folder_stubs}`
    : kind.byWorld
    ? worldName
      ? `${c.folder_factions}/${worldName}`
      : c.folder_factions
    : kindKey === "npc"
    ? c.folder_npcs
    : c.folder_objects;
  try {
    await ensureFolder(folder);
    const body = templateBody(await readTemplate(kind.template));
    const content = stubContent({
      kind,
      line: clean(line),
      session: session ? { name: session.$name } : null,
      campaignTag: campaign.tag,
      worldTag: worldName ? (worldName.includes("/") ? worldName : `world/${toTag(worldName)}`) : "",
      body,
      templateName: kind.template,
    });
    const file = await app.vault.create(availablePath(folder, title), content);
    return { file, plain: body === null };
  } catch (e) {
    console.error(e);
    return { error: `Couldn't create the note: ${e.message}` };
  }
}

/**
 * Add an event line to the campaign timeline note, in the same format and place as Close Session does.
 * date is year-month-day with the month as a number from 1. Returns { text } or { error }.
 */
async function createEvent({ name, line, date, category, campaign, session, months }) {
  const title = clean(name);
  if (!title) return { error: "Give it a name." };
  const m = String(date).trim().match(/^(\d+)-(\d+)-(\d+)$/);
  if (!m) return { error: "Date must be year-month-day, like 835-04-27." };
  if (!category) return { error: "Choose a category." };
  const timeline = campaign.timelinePath ? app.vault.getAbstractFileByPath(campaign.timelinePath) : null;
  if (!timeline) return { error: "The campaign note names no timeline note." };
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const monthName = months[mo - 1] ?? "";
  const monthHead = `## ${monthName || "Month " + mo} ${y}`;
  const isoDate = `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const link = session ? `[[${session.$name}${session.value("session_number") ? `|Session ${session.value("session_number")}` : ""}]]` : "";
  const entry =
    `- **${d} ${monthName}** · **${title}** · ` +
    `<span data-date="${isoDate}" data-category="${clean(category)}" data-name="${title}">${sentence(clean(line))}</span>` +
    (link ? ` · ${link}` : "");
  try {
    await app.vault.process(timeline, (text) => {
      const lines = text.replace(/\s*$/, "").split("\n");
      const head = lines.indexOf(monthHead);
      if (head === -1) return `${lines.join("\n")}\n\n${monthHead}\n\n${entry}\n`;
      let at = head + 1;
      for (let i = head + 1; i < lines.length && !lines[i].startsWith("## "); i++) if (lines[i].startsWith("- ")) at = i + 1;
      lines.splice(at, 0, entry);
      return `${lines.join("\n")}\n`;
    });
    return { text: `${d} ${monthName} ${y}` };
  } catch (e) {
    console.error(e);
    return { error: `Couldn't update the timeline: ${e.message}` };
  }
}

// ── The form ──────────────────────────────────────────────────────

/** Quick capture form with the list of notes captured in the current session. */
function QuickCapture() {
  const { campaign } = useActiveCampaign();
  const { lastPlayed, next } = useSessionState(campaign?.tag);
  const cal = useCalendar(campaign?.calendar);
  const session = next ?? lastPlayed;
  const worldValue = campaign ? campaign.page.value("world") : null;
  const worldName = worldValue ? String(worldValue).replace(/^\[\[|\]\]$/g, "") : "";
  const categories = Object.keys(cal.colors).filter((n) => n !== cfg().calendar_category_sessions);
  const defaultDate = session ? rawText(session.value("fc-date")) ?? rawText(session.value("fc-end")) ?? "" : "";

  const [kindKey, setKindKey] = dc.useState("npc");
  const [name, setName] = dc.useState("");
  const [line, setLine] = dc.useState("");
  const [date, setDate] = dc.useState("");
  const [category, setCategory] = dc.useState("");
  const [busy, setBusy] = dc.useState(false);
  const [result, setResult] = dc.useState(null);
  const isEvent = kindKey === "event";
  const shownDate = date || defaultDate;
  const shownCategory = category || categories[0] || "";

  const captured = dc
    .useQuery(`@page and #${cfg().tag_improvised}`)
    .filter((p) => session && linkPath(p.value("first_session")) === session.$path)
    .sort((a, b) => b.$name.localeCompare(a.$name));

  async function submit() {
    if (busy || !campaign) return;
    setBusy(true);
    const out = isEvent
      ? await createEvent({ name, line, date: shownDate, category: shownCategory, campaign, session, months: cal.months })
      : await createStub({ kindKey, name, line, campaign, session, worldName });
    setBusy(false);
    if (out.error) {
      setResult({ error: out.error });
      return;
    }
    setResult(
      isEvent
        ? { text: `Added to the timeline: ${safeName(name)}, ${out.text}.` }
        : { text: `Created [[${out.file.path.replace(/\.md$/, "")}|${out.file.basename}]]${out.plain ? " (template missing: see the note)" : ""}.`, markdown: true }
    );
    setName("");
    setLine("");
  }
  const enter = (e) => {
    if (e.key === "Enter") submit();
  };

  if (!campaign) return <div style={S.muted}>No campaign note has status: active.</div>;
  return (
    <div>
      <div style={Q.card}>
        <div style={Q.row}>
          <div style={Q.field}>
            <span style={Q.label}>Kind</span>
            <select value={kindKey} onChange={(e) => setKindKey(e.target.value)}>
              {Object.entries(kinds()).map(([key, k]) => (
                <option key={key} value={key}>
                  {k.label}
                </option>
              ))}
              <option value="event">Event</option>
            </select>
          </div>
          <div style={Q.field}>
            <span style={Q.label}>Name</span>
            <input type="text" value={name} placeholder="Name" onInput={(e) => setName(e.target.value)} onKeyDown={enter} />
          </div>
          <div style={{ ...Q.field, flex: "1 1 260px" }}>
            <span style={Q.label}>One line</span>
            <input type="text" value={line} placeholder="One line" onInput={(e) => setLine(e.target.value)} onKeyDown={enter} />
          </div>
          {isEvent ? (
            <div style={Q.field}>
              <span style={Q.label}>In-world date</span>
              <input type="text" value={shownDate} style={{ width: "110px" }} onInput={(e) => setDate(e.target.value)} onKeyDown={enter} />
            </div>
          ) : null}
          {isEvent ? (
            <div style={Q.field}>
              <span style={Q.label}>Category</span>
              <select value={shownCategory} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <button class="mod-cta" disabled={busy} onClick={submit}>
            {isEvent ? "Add event" : "Create stub"}
          </button>
        </div>
        <div style={{ ...S.muted, marginTop: "10px" }}>
          {session ? (
            <span>
              Linked to <dc.Link link={session.$link} />
            </span>
          ) : (
            "No session note to link to."
          )}
          {!isEvent && !worldName ? <span style={Q.warn}> · the campaign note has no world property, so stubs get no world tag</span> : null}
        </div>
        {result ? (
          <div style={{ ...Q.status, ...(result.error ? Q.warn : {}) }}>
            {result.error ? result.error : result.markdown ? <dc.Markdown content={result.text} inline={true} sourcePath={campaign.page.$path} /> : result.text}
          </div>
        ) : null}
      </div>
      {captured.length ? (
        <div style={{ marginTop: "16px" }}>
          <div style={{ ...Q.label, marginBottom: "6px" }}>Captured in this session</div>
          <ul>
            {captured.map((p) => (
              <li key={p.$path}>
                <dc.Link link={p.$link} />
                <span style={S.pill}>{noteType(p)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

return { QuickCapture, createStub, createEvent, stubContent, templateBody, safeName };
```
