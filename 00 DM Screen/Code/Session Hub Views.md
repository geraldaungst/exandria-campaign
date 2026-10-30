---
hide_from_related: true
---

**Purpose:** The prep side of the Session Hub: the next session card (with "Create next session"), prep progress, last time, "World next" and "Changed at the table" lines from session notes, the PC spotlight, and the arc's unrevealed clues.

**Exports:** `SessionHubPrep`, `NextSessionCard`, `PrepProgress`, `WorldNext`, `ChangedAtTable`, `Spotlight`, `HubClues`, `createNextSession`, `sectionText`, `labelItems`

**Depends on:** [[Shared Helpers]] · [[Campaign State]] · [[Calendar and Timeline]] · [[Arc and Session Views]]

**Used by:** [[Session Hub]] · [[Session Hub Table]] · [[Artifact Hub Views]]

Conventions this module relies on:

- **"Where we left off" bullets.** `World next` and `Changed at the table` are read from the bullets with those labels (names in [[Hub Config]]: `label_world_next`, `label_changed_at_table`) under the `Where we left off` heading of each played session. The text on the label line and every nested bullet under it count as lines. The note text is parsed directly, so this works with any bullet nesting and needs no inline fields.
- **Reconciled.** A "Changed at the table" line counts as reconciled once it is a ticked task (`- [x] …`) or struck through (`~~…~~`). Plain and unticked lines show as open. In Obsidian, Cmd+Enter turns a bullet into a task, and a second press ticks it.
- **Spotlight.** PCs are notes tagged `player` (`tag_pc`) and not `player/inactive`, in the active campaign. A plot note (any stage) is one of a PC's personal threads when the PC's own note links to it, or when it links that PC and no other active PC (a thread that links two active PCs is shared, so it counts for neither unless a PC's note links it). A PC counts as featured in a played session when that session note links to the PC note or to any of the PC's threads. Only links count, so link a PC's name in "What happened" when they drive a bullet.
- **Prep progress.** A step ("### 0." to "### 5." under "## Prep") counts as started when it has anything beyond its comment and empty bullets ([[Campaign State]] `prepStatus`).
- **Create next session** runs the Session Template (`template_session` in Hub Config, in Templater's template folder) into the active campaign's Session Notes folder and opens the new note in a new tab. It shows only when no session is dated today or later.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Session Hub Views.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, linkPath, statusOf, num, todayDay, dayOf, daysBetween, useNoteText, stripComments, escapeRe, hasTag, tagsOf, isExcluded, S } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const { useActiveCampaign, useSessionState, useRunningArc, prepStatus } = await dc.require(dc.headerLink("00 DM Screen/Code/Campaign State.md", "Code"));

const { useCalendar, inWorldText } = await dc.require(dc.headerLink("00 DM Screen/Code/Calendar and Timeline.md", "Code"));

const { ArcClues } = await dc.require(dc.headerLink("00 DM Screen/Code/Arc and Session Views.md", "Code"));

const HUB_CSS = `
.sh-prep a.internal-link { text-decoration: none; }
.sh-prep a.internal-link:hover { text-decoration: underline; }
.sh-prep ul { margin: 4px 0 12px; padding-left: 20px; }
.sh-prep li { margin: 5px 0; line-height: 1.5; }
.sh-prep summary { cursor: pointer; }
`;
const H = {
  top: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", margin: "16px 0 8px", alignItems: "stretch" },
  pair: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" },
  steps: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", columnGap: "16px", rowGap: "4px", marginTop: "8px" },
  card: {
    border: "1px solid var(--background-modifier-border)",
    borderRadius: "10px",
    padding: "16px 20px",
    background: "var(--background-secondary)",
  },
  panel: {
    border: "1px solid var(--background-modifier-border)",
    borderRadius: "10px",
    padding: "14px 20px 8px",
  },
  label: {
    fontSize: "var(--font-ui-smaller)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--text-muted)",
    marginBottom: "6px",
  },
  big: { fontSize: "1.3em", fontWeight: 600, margin: "2px 0 4px" },
  block: { margin: "36px 0 0" },
  sectionHead: {
    display: "flex",
    alignItems: "baseline",
    gap: "12px",
    borderBottom: "1px solid var(--background-modifier-border)",
    paddingBottom: "6px",
    marginBottom: "16px",
  },
  sectionTitle: { fontSize: "1.25em", fontWeight: 600 },
  line: { fontSize: "var(--font-ui-small)", margin: "6px 0", lineHeight: 1.5 },
  warn: { color: "var(--color-orange)", fontSize: "var(--font-ui-smaller)" },
  sessionHead: { fontWeight: 600, margin: "10px 0 2px" },
};

// ── Reading "Where we left off" bullets ───────────────────────────

/** Text under a "## Heading" up to the next "## " heading, comments removed; "" when the heading is absent. */
function sectionText(text, heading) {
  const lines = stripComments(text).split("\n");
  const start = lines.findIndex((l) => new RegExp(`^##\\s+${escapeRe(heading)}\\s*$`).test(l));
  if (start < 0) return "";
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^##\s/.test(l));
  return (end < 0 ? rest : rest.slice(0, end)).join("\n");
}

/** Width of a line's leading whitespace (a tab counts as four spaces). */
const indentOf = (line) => line.match(/^[\t ]*/)[0].replace(/\t/g, "    ").length;

/**
 * The content of a "- **Label:**" bullet: the text on the label line, then every nested bullet.
 * Each line is { text, depth (0 label line, 1 nested, 2 nested again), done }.
 * done: a ticked task ("[x]") or struck through ("~~text~~"). Empty bullets are skipped.
 */
function labelItems(section, label) {
  const lines = section.split("\n");
  const labelRe = new RegExp(`^\\s*-\\s*\\*\\*${escapeRe(label)}:\\*\\*`);
  const start = lines.findIndex((l) => labelRe.test(l));
  if (start < 0) return [];
  const base = indentOf(lines[start]);
  const items = [];
  const add = (raw, depth) => {
    let text = raw.trim();
    let done = false;
    const task = text.match(/^\[([ xX])\]\s*(.*)$/);
    if (task) {
      done = task[1] !== " ";
      text = task[2].trim();
    }
    const struck = text.match(/^~~([\s\S]+)~~$/);
    if (struck) {
      done = true;
      text = struck[1].trim();
    }
    if (text) items.push({ text, depth, done });
  };
  add(lines[start].replace(labelRe, ""), 0);
  let childIndent = null;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const ind = indentOf(line);
    if (ind <= base) break;
    const bullet = line.match(/^\s*(?:[-*+]|\d+\.)(?:\s+(.*))?$/);
    if (!bullet) {
      // A wrapped continuation of the previous line
      if (items.length) items[items.length - 1].text += " " + line.trim();
      continue;
    }
    if (childIndent === null) childIndent = ind;
    add(bullet[1] ?? "", ind <= childIndent ? 1 : 2);
  }
  return items;
}

const leftOffItems = (text, label) => labelItems(sectionText(text, cfg().heading_left_off), label);

/** The full text of each session note, keyed by path; re-read whenever a note changes. */
function useSessionTexts(sessions) {
  const stamp = (p) => (p.$mtime?.toMillis ? p.$mtime.toMillis() : String(p.$mtime ?? ""));
  const key = sessions.map((s) => `${s.$path}@${stamp(s)}`).join("|");
  const [texts, setTexts] = dc.useState({});
  dc.useEffect(() => {
    let live = true;
    (async () => {
      const out = {};
      for (const s of sessions) {
        const file = app.vault.getAbstractFileByPath(s.$path);
        out[s.$path] = file ? await app.vault.cachedRead(file) : "";
      }
      if (live) setTexts(out);
    })();
    return () => {
      live = false;
    };
  }, [key]);
  return texts;
}

// ── Small shared pieces ───────────────────────────────────────────

/** A full-width section: title and optional note on a divider line, then content. */
function Block({ title, note, children }) {
  return (
    <section style={H.block}>
      <div style={H.sectionHead}>
        <span style={H.sectionTitle}>{title}</span>
        {note ? <span style={S.muted}>{note}</span> : null}
      </div>
      {children}
    </section>
  );
}

/** A bordered panel with a small caps label, for side-by-side content. */
function Panel({ label, children }) {
  return (
    <div style={H.panel}>
      <div style={H.label}>{label}</div>
      {children}
    </div>
  );
}

function Line({ label, children }) {
  return (
    <div style={H.line}>
      <span style={S.muted}>{label} </span>
      {children}
    </div>
  );
}

function SessionHead({ session }) {
  return (
    <div style={H.sessionHead}>
      <dc.Link link={session.$link} />
      <span style={S.muted}> {dayOf(session.value("date"))}</span>
    </div>
  );
}

function ItemList({ items, sourcePath }) {
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i} style={it.depth === 2 ? { marginLeft: "16px" } : undefined}>
          <dc.Markdown content={it.text} inline={true} sourcePath={sourcePath} />
        </li>
      ))}
    </ul>
  );
}

// ── Next session ──────────────────────────────────────────────────

/** A short pop-up message (falls back to the console where Notice isn't available to hub code). */
const notify = (message) => (typeof Notice !== "undefined" ? new Notice(message) : console.warn(message));

/** Create the next session note from the Session Template (Templater) in the campaign's Session Notes folder, in a new tab. */
async function createNextSession(campaign) {
  try {
    const templater = app.plugins?.plugins?.["templater-obsidian"];
    const folderSetting = templater?.settings?.templates_folder;
    if (!templater?.templater?.create_new_note_from_template || !folderSetting) {
      notify("Create next session: Templater isn't available. Create the note from the Session Template by hand.");
      return;
    }
    const templatePath = `${folderSetting}/${cfg().template_session}.md`;
    const template = app.vault.getAbstractFileByPath(templatePath);
    if (!template) {
      notify(`Create next session: couldn't find ${templatePath}.`);
      return;
    }
    if (!campaign) {
      notify("Create next session: no campaign note has status: active.");
      return;
    }
    const parent = campaign.page.$path.split("/").slice(0, -1).join("/");
    const folder = `${parent}/${cfg().folder_session_notes}`;
    // The template asks its questions, then renames the note; Templater removes the empty note if you cancel.
    const created = await templater.templater.create_new_note_from_template(template, folder, "New session", false);
    if (created) await app.workspace.getLeaf("tab").openFile(created);
  } catch (e) {
    notify(`Create next session failed: ${e.message}`);
    console.error(e);
  }
}

/** The next session: link, play date, in-world start, arc; a button to create it when none is dated today or later. */
function NextSessionCard({ campaign, next, isTonight, runningArc, nextArc, cal }) {
  const today = todayDay();
  const nextDay = next ? dayOf(next.value("date")) : null;
  const until = nextDay ? daysBetween(today, nextDay) : null;
  const weekday = nextDay ? new Date(`${nextDay}T12:00:00`).toLocaleDateString("en-US", { weekday: "long" }) : "";
  const start = next ? next.value("fc-date") : null;
  const arcChange = nextArc && nextArc.$path !== runningArc?.$path ? nextArc : null;
  return (
    <div style={H.card}>
      <div style={H.label}>Next session</div>
      {next ? (
        <div>
          <div style={H.big}>
            <dc.Link link={next.$link} />
          </div>
          <div style={S.muted}>
            {weekday} {nextDay} · {isTonight ? "tonight" : until === 1 ? "tomorrow" : `in ${until} days`}
          </div>
          <Line label="Starts in-world:">{start ? inWorldText(String(start), cal.months) : <span style={S.muted}>no fc-date yet</span>}</Line>
          <Line label="Arc:">
            {nextArc ? (
              <span>
                <dc.Link link={nextArc.$link} />
                <span style={S.pill}>{statusOf(nextArc) || "no status"}</span>
                {arcChange ? (
                  <span style={S.shared}>{cfg().statuses_paused.includes(statusOf(nextArc)) ? "★ resumes this arc" : "★ starts this arc"}</span>
                ) : null}
              </span>
            ) : (
              <span style={S.muted}>no arc set in this note's properties</span>
            )}
          </Line>
        </div>
      ) : (
        <div>
          <div style={H.big}>None scheduled</div>
          <div style={S.muted}>No session is dated today or later.</div>
          <div style={{ marginTop: "6px" }}>
            <button class="mod-cta" onClick={() => createNextSession(campaign)}>
              Create next session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** A link to a heading that shows only the heading text. */
function headingLink(path, heading) {
  const link = dc.headerLink(path, heading);
  return link.withDisplay ? link.withDisplay(heading) : link;
}

/** Which of the next session's prep steps (### 0. … ### 5. under ## Prep) have content, each linked to its heading. */
function PrepProgress({ next }) {
  const text = useNoteText(next?.$path);
  if (!next) return <div style={S.muted}>No next session.</div>;
  const steps = prepStatus(text);
  if (!steps) return <div style={S.muted}>The next session note has no "{cfg().heading_prep}" section.</div>;
  const headings = [...sectionText(text, cfg().heading_prep).matchAll(/^###\s+(\d+\.\s+.*?)\s*$/gm)].map((m) => m[1]);
  const linked = headings.length === steps.length;
  const started = steps.filter((s) => s.filled).length;
  return (
    <div>
      <div style={S.muted}>
        {started} of {steps.length} steps started
      </div>
      <div style={H.steps}>
        {steps.map((s, i) => (
          <div key={i} style={H.line}>
            <span style={{ color: s.filled ? "var(--color-green)" : "var(--text-faint)" }}>{s.filled ? "✓" : "○"} </span>
            {linked ? <dc.Link link={headingLink(next.$path, headings[i])} /> : s.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Lines from played sessions ────────────────────────────────────

/** The "World next" lines of the last three played sessions, newest first. */
function WorldNext({ played, texts }) {
  const label = cfg().label_world_next;
  const recent = played.slice(-3).reverse();
  if (!recent.length) return <div style={S.muted}>No session played yet.</div>;
  return (
    <div>
      {recent.map((s) => {
        const items = leftOffItems(texts[s.$path] ?? "", label);
        return (
          <div key={s.$path}>
            <SessionHead session={s} />
            {items.length ? <ItemList items={items} sourcePath={s.$path} /> : <div style={S.muted}>Nothing recorded under "{label}".</div>}
          </div>
        );
      })}
    </div>
  );
}

/** "Changed at the table" lines from all played sessions that are not yet ticked or struck through, newest first. */
function ChangedAtTable({ played, texts }) {
  const label = cfg().label_changed_at_table;
  const groups = [...played]
    .reverse()
    .map((s) => ({ s, items: leftOffItems(texts[s.$path] ?? "", label).filter((it) => !it.done) }))
    .filter((g) => g.items.length);
  return (
    <div>
      {groups.length === 0 ? (
        <div style={S.muted}>Nothing waiting. Lines under "{label}" show here until you tick or strike them through.</div>
      ) : (
        <div>
          <div style={S.muted}>Tick a line (or strike it through) once the arc doc says the same.</div>
          {groups.map((g) => (
            <div key={g.s.$path}>
              <SessionHead session={g.s} />
              <ItemList items={g.items} sourcePath={g.s.$path} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Spotlight ─────────────────────────────────────────────────────

const sinceText = (since) =>
  since === null ? "not linked yet" : since === 0 ? "last session" : since === 1 ? "1 session ago" : `${since} sessions ago`;

/** Each active PC: sessions since their note, or a plot thread that links them, was last linked from a played session. */
function Spotlight({ campaign, played }) {
  const c = cfg();
  const pcs = dc.useQuery(`@page and #${c.tag_pc}`);
  const plots = dc.useQuery(`@page and #${c.tag_plot}`);
  const resolved = app.metadataCache.resolvedLinks ?? {};
  const links = (from, to) => (resolved[from]?.[to] ?? 0) > 0;
  const inactive = `${c.tag_pc}/inactive`;
  const party = pcs.filter(
    (p) => !isExcluded(p) && tagsOf(p).includes(c.tag_pc) && !tagsOf(p).includes(inactive) && (!campaign?.tag || hasTag(p, campaign.tag))
  );
  // A plot note is personal to a PC when the PC's own note links to it, or when it links that PC and no other active PC.
  const activeLinked = (thread) => party.filter((p) => links(thread.$path, p.$path)).length;
  const personalTo = (thread, pc) => links(pc.$path, thread.$path) || (links(thread.$path, pc.$path) && activeLinked(thread) === 1);
  const rows = party
    .map((pc) => {
      const threads = plots.filter((t) => !isExcluded(t) && t.$path !== pc.$path && personalTo(t, pc));
      const hits = played
        .map((s) => ({ s, via: [pc, ...threads].filter((n) => links(s.$path, n.$path)) }))
        .filter((h) => h.via.length);
      const last = hits.length ? hits[hits.length - 1] : null;
      const since = last ? played.filter((s) => num(s.value("session_number")) > num(last.s.value("session_number"))).length : null;
      return { pc, threads, last, since };
    })
    .sort((a, b) => (b.since ?? Infinity) - (a.since ?? Infinity) || a.pc.$name.localeCompare(b.pc.$name));
  if (!rows.length) return <div style={S.muted}>No notes tagged {c.tag_pc} in this campaign.</div>;
  return (
    <div>
      <div style={H.grid}>
        {rows.map((r) => (
          <div key={r.pc.$path} style={H.card}>
            <div style={{ fontWeight: 600 }}>
              <dc.Link link={r.pc.$link} />
            </div>
            <div style={{ margin: "4px 0 8px" }}>
              <span style={{ ...S.pill, marginLeft: 0 }}>{sinceText(r.since)}</span>
            </div>
            {r.last ? (
              <div style={{ ...S.muted, margin: "2px 0" }}>
                in <dc.Link link={r.last.s.$link} /> via{" "}
                {r.last.via.map((n, i) => (
                  <span key={n.$path}>
                    {i ? ", " : ""}
                    <dc.Link link={n.$link} />
                  </span>
                ))}
              </div>
            ) : null}
            <div style={{ ...S.muted, margin: "2px 0" }}>
              Threads:{" "}
              {r.threads.length ? (
                r.threads.map((t, i) => (
                  <span key={t.$path}>
                    {i ? ", " : ""}
                    <dc.Link link={t.$link} />
                  </span>
                ))
              ) : (
                "none"
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Arc and clues ─────────────────────────────────────────────────

/** The running arc's unrevealed clues; the next session's arc too when it is a different one. */
function HubClues({ arc, nextArc }) {
  const other = nextArc && nextArc.$path !== arc?.$path ? nextArc : null;
  return (
    <div>
      {arc ? (
        <div>
          <div style={H.line}>
            <strong>Running:</strong> <dc.Link link={arc.$link} />
            <span style={S.pill}>{statusOf(arc)}</span>
          </div>
          <ArcClues arcPath={arc.$path} />
        </div>
      ) : (
        <div style={S.muted}>No running arc.</div>
      )}
      {other ? (
        <div style={{ marginTop: "10px" }}>
          <div style={H.line}>
            <strong>Next session's arc:</strong> <dc.Link link={other.$link} />
            <span style={S.pill}>{statusOf(other) || "no status"}</span>
          </div>
          <ArcClues arcPath={other.$path} />
        </div>
      ) : null}
    </div>
  );
}

// ── The prep side ─────────────────────────────────────────────────

/** Prep side of the Session Hub. */
function SessionHubPrep() {
  const { campaign, extraActive } = useActiveCampaign();
  const { played, lastPlayed, next, isTonight } = useSessionState(campaign?.tag);
  const { arc, others } = useRunningArc(campaign?.tag);
  const cal = useCalendar(campaign?.calendar);
  const texts = useSessionTexts(played);
  const nextArcPath = next ? linkPath(next.value("arc")) : null;
  const nextArc = dc.useFile(nextArcPath ?? "");

  return (
    <div class="sh-prep">
      <style>{HUB_CSS}</style>
      <div style={H.line}>
        <span style={S.muted}>Campaign: </span>
        {campaign ? (
          <dc.Link link={campaign.page.$link} />
        ) : (
          <span style={H.warn}>no campaign note has status: active (create one from the Campaign Template)</span>
        )}
        {extraActive.length ? <span style={H.warn}> · also marked active: {extraActive.map((p) => p.$name).join(", ")}</span> : null}
        {others.length ? <span style={H.warn}> · also marked running: {others.map((p) => p.$name).join(", ")}</span> : null}
      </div>
      <div style={H.top}>
        <NextSessionCard campaign={campaign} next={next} isTonight={isTonight} runningArc={arc} nextArc={nextArc} cal={cal} />
        <div style={H.card}>
          <div style={H.label}>Prep progress</div>
          <PrepProgress next={next} />
        </div>
      </div>

      <Block title="Since last time" note={lastPlayed ? `from the last three played sessions` : ""}>
        <div style={H.pair}>
          <Panel label="World next">
            <WorldNext played={played} texts={texts} />
          </Panel>
          <Panel label="Changed at the table">
            <ChangedAtTable played={played} texts={texts} />
          </Panel>
        </div>
      </Block>

      <Block title="Arc and clues">
        <HubClues arc={arc} nextArc={nextArc} />
      </Block>

      <Block title="Spotlight" note="longest without a mention first">
        <Spotlight campaign={campaign} played={played} />
      </Block>

      <Block title="Last time" note={lastPlayed ? lastPlayed.$name : ""}>
        {lastPlayed ? (
          <details open>
            <summary style={S.muted}>Where we left off</summary>
            <div style={{ marginTop: "8px" }}>
              <dc.LinkEmbed link={dc.headerLink(lastPlayed.$path, cfg().heading_left_off)} />
            </div>
          </details>
        ) : (
          <div style={S.muted}>No session played yet.</div>
        )}
      </Block>
    </div>
  );
}

return { SessionHubPrep, NextSessionCard, PrepProgress, WorldNext, ChangedAtTable, Spotlight, HubClues, createNextSession, sectionText, labelItems };
```
