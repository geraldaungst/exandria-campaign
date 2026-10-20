<%*
// Close Session: run from a session note after the game (Templater: insert template).
// Asks how much in-world time passed and the time of day, then writes fc-end and
// ingame_time to the note's frontmatter, then offers to log events to the campaign
// timeline note (Calendarium inline events). Inserts no text into the session note.
const file = tp.config.target_file ?? app.workspace.getActiveFile();
const fm = (file && app.metadataCache.getFileCache(file)?.frontmatter) ?? {};
const tags = [].concat(fm.tags ?? []).map((t) => String(t).replace(/^#/, ""));
if (!file || !tags.includes("session")) {
  new Notice("Close Session: open a session note first.");
  return;
}

// Month names and lengths come from Calendarium's own settings.
const calName = fm["fc-calendar"] ?? "Exandrian Calendar";
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

// Timeline events: appended to the campaign timeline note as Calendarium inline events.
const TIMELINE = "Campaigns/Prophecy of Eryndor/Eryndor Timeline.md";
const timeline = app.vault.getAbstractFileByPath(TIMELINE);
// "Sessions" is reserved for session notes themselves.
const categories = (cal.categories ?? []).map((c) => c.name).filter((n) => n && n !== "Sessions");
const clean = (s) => String(s ?? "").replace(/[<>]/g, "").replace(/"/g, "'").trim();
const sessionLink = `[[${file.basename}|Session ${fm.session_number ?? ""}]]`.replace("|Session ]]", "]]");
let added = 0;
while (timeline && categories.length) {
  const next = await tp.system.suggester(
    [added ? "Add another timeline event" : "Add a timeline event", "Done"],
    ["add", "done"],
    false,
    `Timeline (${TIMELINE.split("/").pop().replace(/\.md$/, "")})`
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
    `- **${when.d} ${months[when.m - 1]?.name ?? ""}** · ` +
    `<span data-date="${toText(when)}" data-category="${category}" data-name="${name}">${name}${desc ? ": " + desc : ""}</span>` +
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
