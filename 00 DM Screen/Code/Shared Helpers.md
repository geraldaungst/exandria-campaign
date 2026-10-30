---
hide_from_related: true
---

**Purpose:** The configuration reader (settings from [[Hub Config]]) and general utilities every other module uses: reading links, tags, and dates from notes; reading a note's text; finding and making notes and folders with capitals ignored; base styles; and `locations()`, the one way a hub reaches the location core (`z_Templates/Scripts/location_core.js`, spec: [[Location Engine Spec]]). Nothing here knows about campaigns, sessions, or calendars.

**Exports:** `CONFIG_PATH`, `CONFIG_DEFAULTS`, `cfg`, `linkPath`, `asList`, `statusOf`, `shortName`, `dmSuffix`, `stripDmSuffix`, `num`, `dateText`, `S`, `pad`, `todayDay`, `dayOf`, `rawText`, `isExcluded`, `tagsOf`, `hasTag`, `inFolder`, `findPath`, `ensureFolder`, `availablePath`, `daysBetween`, `useNoteText`, `stripComments`, `escapeRe`, `bulletValue`, `numberRanges`, `locations`

**Depends on:** none

**Used by:** [[Campaign State]] · [[Calendar and Timeline]] · [[Note Types]] · [[Arc and Session Views]] · [[DM Screen Views]] · [[Session Hub Views]] · [[Session Hub Table]] · [[Quick Capture]] · [[Item Data]] · [[Party Card]] · [[NPC Browser]] · [[Artifact Pieces]] · [[Progress Tracks]] · [[Artifact Change Form]] · [[Artifact Hub Views]] · [[Item Finder]] · [[Location Checks]] · [[Plot Dashboard Views]] · [[Reference Lists]] · [[Section Picker]] · [[Trap Roll]] · [[Treasure Roll]]

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
// ── Configuration ────────────────────────────────────────────────
// Every tag, folder, heading, and status name the hubs rely on lives in Hub Config's
// properties. These built-in values are used for any setting missing there.
const CONFIG_PATH = "00 DM Screen/Code/Hub Config.md";
const CONFIG_DEFAULTS = {
  party_card_note: "00 DM Screen/Party Card Data.md",
  dm_note_suffix: " - DM",
  tag_session: "session",
  tag_arc: "arc",
  tag_plot: "plot",
  tag_npc: "npc",
  tag_pc: "player",
  tag_location: "location",
  tag_faction: "organization",
  faction_tag_prefix: "faction",
  tag_item: "artifact",
  tag_lore: "lore",
  tags_dm_tools: ["dm-tool"],
  tag_needs_work: "needs-work",
  tag_campaign_note: "campaign-hub",
  campaign_tag_prefix: "campaign/",
  tag_timeline: "inline-events",
  tag_improvised: "improvised",
  tag_unplaced: "unplaced",
  tag_deceased: "deceased",
  tag_encounter: "encounter",
  folder_npcs: "Characters/NPCs",
  folder_factions: "Characters/Factions",
  folder_stubs: "Stubs",
  template_npc: "NPC Template",
  template_location: "Location Template",
  template_faction: "Faction Template",
  template_item: "Artifact-Item Template",
  folder_campaigns: "Campaigns",
  folder_session_notes: "Session Notes",
  folder_player_wiki: "Player Wiki",
  folder_creatures: "Characters/Creatures",
  folder_objects: "Objects",
  folder_characters: "Characters",
  folder_worlds: "Worlds",
  folder_kind_places: "Places",
  folder_kind_lore: "Lore",
  folder_kind_tables: "Tables",
  folder_dm_screen: "00 DM Screen",
  folder_code: "00 DM Screen/Code",
  excluded_folder_prefix: "z_",
  heading_left_off: "Where we left off",
  heading_prep: "Prep",
  heading_open_issues: "Open Issues",
  heading_seeds: "Seeds Planted",
  label_priority: "Priority",
  heading_fact_map: "Fact Map",
  label_party_location: "Party location",
  label_threads_moved: "Threads moved",
  label_changed_at_table: "Changed at the table",
  label_world_next: "World next",
  label_party: "Party",
  label_player_only: "player note only",
  prop_political_region: "political_region",
  prop_natural_region: "natural_region",
  prop_whereabouts: "whereabouts",
  prop_site: "site",
  prop_ties_to: "ties_to",
  piece_tag_prefix: "piece",
  heading_piece_history: "History",
  heading_piece_knows: "Who knows",
  heading_piece_pursuit: "Pursued by",
  heading_piece_lines: "Prophecy lines",
  heading_piece_rulings: "Properties and rulings",
  heading_piece_notes: "Notes",
  heading_track_history: "History",
  calendar_category_pieces: "Lorestone",
  template_session: "Session Template",
  status_running: "running",
  statuses_paused: ["paused", "abandoned"],
  calendar_category_sessions: "Sessions",
  data_url_5etools: "https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data",
};

/** The current settings: Hub Config's properties over the built-in values. Read live, so edits apply on reopen. */
function cfg() {
  const file = app.vault.getAbstractFileByPath(CONFIG_PATH);
  const fm = (file && app.metadataCache.getFileCache(file)?.frontmatter) ?? {};
  const out = {};
  for (const [key, fallback] of Object.entries(CONFIG_DEFAULTS)) {
    const v = fm[key];
    const set = v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);
    const value = set ? v : fallback;
    out[key] = Array.isArray(fallback)
      ? [].concat(value).map((x) => String(x).replace(/^#/, "").toLowerCase())
      : key.startsWith("tag") || key.endsWith("_tag_prefix")
      ? String(value).replace(/^#/, "").toLowerCase()
      : String(value);
  }
  return out;
}

const linkPath = (v) => {
  if (!v) return null;
  if (typeof v === "object" && v.path) return v.path;
  const text = String(v).replace(/^\[\[/, "").replace(/\]\]$/, "").replace(/\|.*$/, "").replace(/#.*$/, "");
  return text ? dc.resolvePath(text) : null;
};
const asList = (v) => (v === null || v === undefined || v === "" ? [] : Array.isArray(v) ? v : [v]);
const statusOf = (p) => String(p.value("status") ?? "").toLowerCase();
/** The suffix of a DM note that has a Player Wiki twin ("Rexxentrum - DM"): Hub Config's dm_note_suffix. */
const dmSuffix = () => cfg().dm_note_suffix;
/** A note name without that suffix (capitals ignored). */
const stripDmSuffix = (name) => {
  const text = String(name ?? ""), suffix = dmSuffix();
  return suffix && text.toLowerCase().endsWith(suffix.toLowerCase()) ? text.slice(0, -suffix.length) : text;
};
const shortName = (p) => stripDmSuffix(p.$name);
const num = (v) => (v === null || v === undefined || v === "" ? -Infinity : Number(v));
const dateText = (v) => {
  if (!v) return "";
  if (v.toFormat) return v.toFormat("d MMM yyyy");
  return String(v);
};

const S = {
  muted: { color: "var(--text-muted)", fontSize: "var(--font-ui-smaller)" },
  row: { margin: "4px 0" },
  sessionHead: { fontWeight: 600, cursor: "pointer" },
  embed: { margin: "4px 0 10px 14px" },
  pill: {
    fontSize: "var(--font-ui-smaller)",
    padding: "1px 6px",
    borderRadius: "10px",
    background: "var(--background-modifier-hover)",
    marginLeft: "6px",
  },
  shared: { color: "var(--text-accent)", fontSize: "var(--font-ui-smaller)", marginLeft: "6px" },
};

const pad = (n) => String(n).padStart(2, "0");
/** Today's real-world date as yyyy-MM-dd, local time. */
const todayDay = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
/** A date property as yyyy-MM-dd, or null. */
const dayOf = (v) => {
  if (!v) return null;
  if (v.toFormat) return v.toFormat("yyyy-MM-dd");
  const m = String(v).match(/\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : null;
};
/** A property value as plain text (in-world dates are shown as stored). */
const rawText = (v) => {
  if (v === null || v === undefined || v === "") return null;
  if (v.toFormat) return v.toFormat("yyyy-MM-dd");
  return String(v);
};
/** True for notes in excluded folders (names starting with the configured prefix, e.g. z_). */
const isExcluded = (p) => p.$path.split("/").some((part) => part.startsWith(cfg().excluded_folder_prefix));
const tagsOf = (p) => (p.$tags ?? []).map((t) => String(t).replace(/^#/, "").toLowerCase());
const hasTag = (p, tag) => tagsOf(p).some((t) => t === tag || t.startsWith(tag + "/"));
const inFolder = (p, folder) => p.$path.startsWith(folder + "/");

// ── Files and folders ─────────────────────────────────────────────
// getAbstractFileByPath matches capitals exactly, but macOS treats "Place Tag" and "Place tag" as the same name.
// These ignore capitals, so "is this name taken?" sees what the disk sees. The templates' copies are in
// z_Templates/Scripts/dm_helpers.js (findPath, ensureFolder): change both together.

/** A note or folder by path, ignoring capitals; null when there is none. */
const findPath = (path) => {
  const p = String(path).toLowerCase();
  return app.vault.getAllLoadedFiles().find((f) => f.path.toLowerCase() === p) ?? null;
};
/** Makes each missing level of a folder path; a level that exists with other capitals is reused as it is. Returns the real path. */
async function ensureFolder(path) {
  let current = "";
  for (const part of String(path).split("/").filter(Boolean)) {
    const want = current ? `${current}/${part}` : part;
    const found = findPath(want);
    if (found && found.children === undefined) throw new Error(`"${found.path}" is a file, not a folder.`);
    if (!found) await app.vault.createFolder(want);
    current = found ? found.path : want;
  }
  return current;
}
/** folder/name.md, or "name 2", "name 3"… when that name is taken (capitals ignored). */
function availablePath(folder, name) {
  for (let n = 1; ; n++) {
    const path = `${folder}/${name}${n > 1 ? ` ${n}` : ""}.md`;
    if (!findPath(path)) return path;
  }
}

// ── Location ─────────────────────────────────────────────────────
// The location core is one plain script shared with the templates (spec: Location Engine Spec). It is loaded once here;
// if it can't be loaded, only locations() fails, so every other hub keeps working.
let createLocationIndex = null;
let locationLoadError = null;
try {
  createLocationIndex = await dc.require("z_Templates/Scripts/location_core.js");
} catch (e) {
  locationLoadError = e;
  console.error("Shared Helpers: could not load z_Templates/Scripts/location_core.js", e);
}
/** A fresh location index over the vault (twins, parents, whereIs, within, pickers, checks), with the current settings. */
function locations() {
  if (typeof createLocationIndex !== "function") throw new Error(`The location core could not be loaded (z_Templates/Scripts/location_core.js): ${locationLoadError?.message ?? "not a function"}`);
  return createLocationIndex(app, cfg());
}

const daysBetween = (a, b) => Math.round((Date.parse(`${b}T00:00:00`) - Date.parse(`${a}T00:00:00`)) / 86400000);

/** A note's full text; re-read whenever the note changes. Empty string until loaded or if missing. */
function useNoteText(path) {
  const page = dc.useFile(path ?? "");
  const stamp = page?.$mtime?.toMillis ? page.$mtime.toMillis() : String(page?.$mtime ?? "");
  const [text, setText] = dc.useState("");
  dc.useEffect(() => {
    let live = true;
    (async () => {
      const file = path ? app.vault.getAbstractFileByPath(path) : null;
      const t = file ? await app.vault.cachedRead(file) : "";
      if (live) setText(t);
    })();
    return () => {
      live = false;
    };
  }, [path, stamp]);
  return text;
}

const stripComments = (s) => String(s ?? "").replace(/<!--[\s\S]*?-->/g, "");
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The rest of a "- **Label:** value" bullet, comments removed; "" when absent or blank. */
function bulletValue(text, label) {
  const m = stripComments(text).match(new RegExp(`^\\s*-\\s*\\*\\*${escapeRe(label)}:\\*\\*[ \\t]*(.*)$`, "m"));
  return m ? m[1].trim() : "";
}

/** [49, 50, 51, 53] → "49–51, 53". */
function numberRanges(nums) {
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const parts = [];
  for (let i = 0; i < sorted.length; i++) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    parts.push(i === j ? `${sorted[i]}` : `${sorted[i]}–${sorted[j]}`);
    i = j;
  }
  return parts.join(", ");
}

return { CONFIG_PATH, CONFIG_DEFAULTS, cfg, linkPath, asList, statusOf, shortName, dmSuffix, stripDmSuffix, num, dateText, S, pad, todayDay, dayOf, rawText, isExcluded, tagsOf, hasTag, inFolder, findPath, ensureFolder, availablePath, daysBetween, useNoteText, stripComments, escapeRe, bulletValue, numberRanges, locations };
```
