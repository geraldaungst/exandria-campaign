---
hide_from_related: true
---

**Purpose:** The configuration reader (settings from [[Hub Config]]) and general utilities every other module uses: reading links, tags, and dates from notes; reading a note's text; base styles. Nothing here knows about campaigns, sessions, or calendars.

**Exports:** `CONFIG_PATH`, `CONFIG_DEFAULTS`, `cfg`, `linkPath`, `asList`, `statusOf`, `shortName`, `num`, `dateText`, `S`, `pad`, `todayDay`, `dayOf`, `rawText`, `isExcluded`, `tagsOf`, `hasTag`, `inFolder`, `daysBetween`, `useNoteText`, `stripComments`, `escapeRe`, `bulletValue`, `numberRanges`

**Depends on:** none

**Used by:** [[Campaign State]] · [[Calendar and Timeline]] · [[Note Types]] · [[Arc and Session Views]] · [[DM Screen Views]] · [[Session Hub Views]] · [[Session Hub Table]] · [[Quick Capture]] · [[Item Data]] · [[Party Card]] · [[Diagnostics]] · [[Artifact Pieces]]

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
// ── Configuration ────────────────────────────────────────────────
// Every tag, folder, heading, and status name the hubs rely on lives in Hub Config's
// properties. These built-in values are used for any setting missing there.
const CONFIG_PATH = "00 DM Screen/Code/Hub Config.md";
const CONFIG_DEFAULTS = {
  party_card_note: "00 DM Screen/Party Card Data.md",
  tag_session: "session",
  tag_arc: "arc",
  tag_plot: "plot",
  tag_npc: "npc",
  tag_pc: "player",
  tag_location: "location",
  tag_faction: "faction",
  tag_item: "artifact",
  tag_lore: "lore",
  tags_dm_tools: ["dm-tool", "dm-tools"],
  tag_needs_work: "needs-work",
  tag_campaign_note: "campaign-hub",
  campaign_tag_prefix: "campaign/",
  tag_timeline: "inline-events",
  tag_improvised: "improvised",
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
  folder_dm_screen: "00 DM Screen",
  folder_code: "00 DM Screen/Code",
  excluded_folder_prefix: "z_",
  heading_left_off: "Where we left off",
  heading_prep: "Prep",
  heading_fact_map: "Fact Map",
  label_party_location: "Party location",
  label_threads_moved: "Threads moved",
  label_changed_at_table: "Changed at the table",
  label_world_next: "World next",
  label_party: "Party",
  piece_tag_prefix: "piece",
  heading_piece_history: "History",
  heading_piece_knows: "Who knows",
  heading_piece_pursuit: "Pursued by",
  heading_piece_lines: "Prophecy lines",
  heading_piece_questions: "Open questions",
  heading_piece_rulings: "Properties and rulings",
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
      : key.startsWith("tag") || key === "campaign_tag_prefix"
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
const shortName = (p) => p.$name.replace(/ - DM Notes$/, "");
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

return { CONFIG_PATH, CONFIG_DEFAULTS, cfg, linkPath, asList, statusOf, shortName, num, dateText, S, pad, todayDay, dayOf, rawText, isExcluded, tagsOf, hasTag, inFolder, daysBetween, useNoteText, stripComments, escapeRe, bulletValue, numberRanges };
```
