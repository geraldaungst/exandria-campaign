<%*
// Close Session: run from a session note after the game (Templater: insert template).
// Asks how much in-world time passed and the time of day, then writes fc-end and
// ingame_time to the note's frontmatter, then offers to log events to the campaign
// timeline note (Calendarium inline events). Inserts no text into the session note.
// Settings from Hub Config (same names and defaults as the hub code in 00 DM Screen/Code).
const HUB_CONFIG = (() => {
  const f = app.vault.getAbstractFileByPath("00 DM Screen/Code/Hub Config.md");
  return (f && app.metadataCache.getFileCache(f)?.frontmatter) ?? {};
})();
const C = (key, fallback) => {
  const v = HUB_CONFIG[key];
  if (v === undefined || v === null || v === "") return fallback;
  return key.startsWith("tag") || key === "campaign_tag_prefix" ? String(v).replace(/^#/, "").toLowerCase() : v;
};
const file = tp.config.target_file ?? app.workspace.getActiveFile();
const fm = (file && app.metadataCache.getFileCache(file)?.frontmatter) ?? {};
const tags = [].concat(fm.tags ?? []).map((t) => String(t).replace(/^#/, ""));
if (!file || !tags.includes(C("tag_session", "session"))) {
  new Notice("Close Session: open a session note first.");
  return;
}

// The session's campaign note (tag campaign-hub, sharing this session's campaign/… tag) supplies
// the calendar (when the session has no fc-calendar) and the timeline note.
const campaignNote = app.vault
  .getMarkdownFiles()
  .filter((f) => !f.path.split("/").some((p) => p.startsWith(C("excluded_folder_prefix", "z_"))))
  .map((f) => ({ f, fm: app.metadataCache.getFileCache(f)?.frontmatter ?? {} }))
  .find((c) => {
    const ctags = [].concat(c.fm.tags ?? []).map((t) => String(t).replace(/^#/, ""));
    return ctags.includes(C("tag_campaign_note", "campaign-hub")) && ctags.some((t) => t.startsWith(C("campaign_tag_prefix", "campaign/")) && tags.includes(t));
  });
const linkTarget = (v, from) => {
  const t = String(v ?? "").replace(/^\[\[/, "").replace(/\]\]$/, "").replace(/\|.*$/, "");
  return t ? app.metadataCache.getFirstLinkpathDest(t, from) : null;
};

// Month names and lengths come from Calendarium's own settings.
const calName = fm["fc-calendar"] || campaignNote?.fm.calendar;
if (!calName) {
  new Notice("Close Session: this session has no fc-calendar and no campaign note names a calendar.");
  return;
}
let cal = null;
try {
  const raw = await app.vault.adapter.read(`${app.vault.configDir}/plugins/calendarium/data.json`);
  cal = JSON.parse(raw).calendars.find((c) => c.name === calName) ?? null;
} catch (e) {}
const months = cal?.static?.months ?? [];
if (!months.length) {
  new Notice(`Close Session: couldn't read the "${calName}" calendar from Calendarium.`);
  return;
}

const pad = (n) => String(n).padStart(2, "0");
const toText = ({ y, m, d }) => `${y}-${pad(m)}-${pad(d)}`;
const show = ({ y, m, d }) => `${d} ${months[m - 1]?.name ?? "month " + m} ${y}`;
const parse = (s) => {
  const parts = String(s ?? "").trim().split("-").map(Number);
  return parts.length === 3 && parts.every((n) => Number.isFinite(n) && n > 0) ? { y: parts[0], m: parts[1], d: parts[2] } : null;
};

// Start date: the note's fc-date, else ask (default: Calendarium's current date).
let start = parse(fm["fc-date"]);
if (!start) {
  const cur = cal.current ?? {};
  const guess = cur.year ? toText({ y: cur.year, m: (cur.month ?? 0) + 1, d: cur.day ?? 1 }) : "";
  const typed = await tp.system.prompt("In-world START date of this session (year-month-day, month as a number)", guess);
  start = parse(typed);
  if (!start) {
    new Notice("Close Session: no valid start date; nothing changed.");
    return;
  }
}

const step = await tp.system.suggester(
  ["Same day", "Long rest: next day", "More time passed…"],
  ["same", "next", "more"],
  false,
  `Session started ${show(start)}. How much in-world time passed?`
);
if (!step) return; // Escape: nothing changed
let days = step === "same" ? 0 : 1;
if (step === "more") {
  const typed = await tp.system.prompt("How many in-world days passed?", "2");
  days = Number.parseInt(typed, 10);
  if (!Number.isFinite(days) || days < 0) {
    new Notice("Close Session: not a number of days; nothing changed.");
    return;
  }
}

const end = { ...start };
end.d += days;
while (end.d > months[end.m - 1].length) {
  end.d -= months[end.m - 1].length;
  end.m += 1;
  if (end.m > months.length) {
    end.m = 1;
    end.y += 1;
  }
}

const time = await tp.system.suggester(["Morning", "Afternoon", "Evening", "Night"], ["Morning", "Afternoon", "Evening", "Night"], false, "Time of day at the end of the session");
if (!time) return; // Escape: nothing changed

await app.fileManager.processFrontMatter(file, (f) => {
  if (!parse(f["fc-date"])) f["fc-date"] = toText(start);
  f["fc-end"] = toText(end);
  f["ingame_time"] = time;
});
new Notice(`${file.basename} ends ${show(end)}, ${time}.`);

// Keep Calendarium's "today" in step with the campaign, using only its public API (to read)
// and its own "Set Current Date to Next" command (to move). That command acts on the
// default calendar, so this runs only when the default is this session's calendar and
// Calendarium's current date equals the session's start; otherwise it changes nothing.
try {
  const api = window.Calendarium?.getAPI?.();
  const sameCal = api?.getObject?.()?.name === calName;
  const cur = api?.getCurrentDate?.();
  const atStart = cur && cur.year === start.y && cur.month === start.m - 1 && cur.day === start.d;
  if (!sameCal) {
    new Notice(`Calendarium's default calendar isn't "${calName}", so its current date was left alone.`);
  } else if (!atStart) {
    const curText = cur ? show({ y: cur.year, m: cur.month + 1, d: cur.day }) : "unknown";
    new Notice(`Calendarium's current date (${curText}) isn't this session's start (${show(start)}), so it was left alone. Set it by hand.`);
  } else if (days > 0) {
    for (let i = 0; i < days; i++) {
      app.commands.executeCommandById("calendarium:advance-calendarium-current-date");
      await new Promise((r) => setTimeout(r, 50));
    }
    const now = api.getCurrentDate();
    const ok = now && now.year === end.y && now.month === end.m - 1 && now.day === end.d;
    new Notice(ok ? `Calendarium's current date is now ${show(end)}.` : `Calendarium's current date didn't land on ${show(end)}; check it by hand.`);
  }
} catch (e) {
  new Notice("Close Session: couldn't update Calendarium's current date; set it by hand.");
}

// Timeline events: appended to the campaign timeline note as Calendarium inline events.
const timeline = campaignNote ? linkTarget(campaignNote.fm.timeline, campaignNote.f.path) : null;
if (!timeline) new Notice("No timeline note is linked from this session's campaign note, so timeline events were skipped.");
// The sessions category is reserved for session notes themselves.
const categories = (cal.categories ?? []).map((c) => c.name).filter((n) => n && n !== C("calendar_category_sessions", "Sessions"));
const clean = (s) => String(s ?? "").replace(/[<>]/g, "").replace(/"/g, "'").trim();
// Descriptions are standalone sentences: capital first letter, closing period.
const sentence = (s) => (s ? s[0].toUpperCase() + s.slice(1) + (/[.!?]$/.test(s) ? "" : ".") : "");
const sessionLink = `[[${file.basename}|Session ${fm.session_number ?? ""}]]`.replace("|Session ]]", "]]");
let added = 0;
while (timeline && categories.length) {
  const next = await tp.system.suggester(
    [added ? "Add another timeline event" : "Add a timeline event", "Done"],
    ["add", "done"],
    false,
    `Timeline (${timeline.basename})`
  );
  if (next !== "add") break;
  const name = clean(await tp.system.prompt("Event name (a few words)", ""));
  if (!name) break;
  const category = await tp.system.suggester(categories, categories, false, "Category");
  if (!category) break;
  const desc = clean(await tp.system.prompt("One-line description (optional)", ""));
  const when = parse(await tp.system.prompt("In-world date", toText(end)));
  if (!when) {
    new Notice("Close Session: not a valid date; event skipped.");
    continue;
  }
  const monthHead = `## ${months[when.m - 1]?.name ?? "Month " + when.m} ${when.y}`;
  const line =
    `- **${when.d} ${months[when.m - 1]?.name ?? ""}** · **${name}** · ` +
    `<span data-date="${toText(when)}" data-category="${category}" data-name="${name}">${sentence(desc)}</span>` +
    ` · ${sessionLink}`;
  await app.vault.process(timeline, (text) => {
    const lines = text.replace(/\s*$/, "").split("\n");
    const head = lines.indexOf(monthHead);
    if (head === -1) return `${lines.join("\n")}\n\n${monthHead}\n\n${line}\n`;
    // Insert after the last list item in that month's section.
    let at = head + 1;
    for (let i = head + 1; i < lines.length && !lines[i].startsWith("## "); i++) if (lines[i].startsWith("- ")) at = i + 1;
    lines.splice(at, 0, line);
    return `${lines.join("\n")}\n`;
  });
  added += 1;
}
if (added) new Notice(`Added ${added} timeline ${added === 1 ? "event" : "events"}.`);
-%>
