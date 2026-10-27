<%*
// ── Set Location: sets the location fields of the open note; writes nothing into its body ──
// Run it on the open note with a Templater template hotkey (Settings > Templater > Template hotkeys; Gerald binds the key).
// It offers the fields for the note's type: parents on a place (political_region, natural_region), whereabouts on an NPC,
// faction or item, site on an arc or encounter, and ties_to on any of them. Each field shows its current value; choose
// "Unchanged" (or Done) to leave it. Only changed fields are written, with processFrontMatter, as quoted links. Setting a
// place removes the unplaced tag. Player Wiki notes are left alone (their parents must name player notes: set them by hand).
// ── Shared helpers: z_Templates/Scripts/dm_helpers.js (a Templater user script). The location logic is in location_core.js.
const { C, PROP, UNPLACED, fmOf, tagsOfFile, campaignNotes, campaignTagOf, campaignWorld, slug,
  locations, pickMany, pickOne, idOf } = tp.user.dm_helpers(tp, Notice);

const file = tp.config.target_file;
if (!file || file.extension !== "md") { new Notice("Set Location works on a note: open one first."); return; }
if (file.path.startsWith(C("folder_player_wiki", "Player Wiki") + "/")) {
  new Notice("Set Location skips Player Wiki notes: their parents must link to player notes, so set them by hand.");
  return;
}
const tags = tagsOfFile(file);
const isTag = (t) => tags.some((x) => x === t || x.startsWith(t + "/"));
let kind = null;
if (isTag(C("tag_location", "location"))) kind = "place";
else if (isTag(C("tag_npc", "npc"))) kind = "npc";
else if (isTag(C("tag_faction", "organization"))) kind = "faction";
else if (isTag(C("tag_item", "artifact"))) kind = "item";
else if (isTag(C("tag_arc", "arc"))) kind = "arc";
else if (isTag(C("tag_encounter", "encounter"))) kind = "encounter";
if (!kind) { new Notice("Set Location works on place, NPC, faction, item, arc and encounter notes (by their type tag)."); return; }

// The note's world: its world/ tag, else its campaign's world (arcs carry no world tag). No world: all places are offered.
let worldSlug = (tags.find((t) => t.startsWith("world/")) ?? "").slice(6);
if (!worldSlug) {
  const campaignTag = tags.find((t) => t.startsWith(C("campaign_tag_prefix", "campaign/")));
  const campaign = campaignTag ? campaignNotes().find((f) => campaignTagOf(f) === campaignTag) : null;
  worldSlug = campaign ? slug(campaignWorld(campaign)) : "";
}
const world = worldSlug || undefined;

const loc = locations();
const label = (c) => c.label + (c.broken ? "  [broken link]" : "");
const changes = []; // { field, value } where value is a list of choices (list fields), a choice, null (clear) or "unplaced"

// A single-value field: Unchanged first, then the extras, then the choices.
const single = async (field, prop, question, extras, opts = {}) => {
  const cur = loc.currentChoices(file, field);
  const unchanged = { extra: "keep", label: `Unchanged (${cur.length ? cur.map(label).join("; ") : isTag(UNPLACED) ? "unplaced" : "not set"})` };
  const got = await pickOne(loc.pickerChoices({ field, forFile: file, world, ...opts }), question, [unchanged, ...extras], { allowNew: true });
  if (!got) return false;
  if (got.extra === "keep") return true;
  changes.push({ field, prop, value: got.extra === "unplaced" ? "unplaced" : got.extra === "clear" ? null : got });
  return true;
};
// A list field: current values pre-checked; Done keeps whatever is checked.
const many = async (field, prop, question, noneLabel) => {
  const cur = loc.currentChoices(file, field);
  const got = await pickMany(loc.pickerChoices({ field, forFile: file, world }), question, { noneLabel, initial: cur, allowNew: true });
  const same = got.length === cur.length && got.every((c, i) => idOf(c) === idOf(cur[i]));
  if (!same) changes.push({ field, prop, value: got });
  return true;
};

if (kind === "place") {
  await many("political_region", PROP.political, "Which place governs it? Pick the nearest one (the first pick is the main one), then Done", "none: top of setting");
  await many("natural_region", PROP.natural, "Which land does it sit on? Pick the nearest one (the first pick is the main one), then Done", "none: top of setting");
} else if (kind === "arc" || kind === "encounter") {
  if (!(await single("site", PROP.site, `Where does this ${kind} happen? (site)`, [{ extra: "clear", label: "— no site (travel, wilderness, several places, or none yet)" }]))) return;
} else {
  const noun = kind === "faction" ? "faction's base" : kind === "item" ? "item (a place, or the person holding it)" : "NPC";
  if (!(await single("whereabouts", PROP.whereabouts, `Where is this ${noun} now?`, [{ extra: "unplaced", label: "— Unplaced (no known or decided location)" }], kind === "item" ? { kind: "item" } : {}))) return;
}
await many("ties_to", PROP.ties, "Which places, cultures or factions is it tied to, wherever it is now? Pick any, then Done", "no ties");

if (!changes.length) { new Notice("Location unchanged."); return; }
const linkOf = (c) => `[[${c.link}]]`;
await app.fileManager.processFrontMatter(file, (fm) => {
  const norm = (t) => String(t).replace(/^#/, "").toLowerCase();
  let list = fm.tags === undefined || fm.tags === null ? [] : Array.isArray(fm.tags) ? [...fm.tags] : String(fm.tags).split(/[,\s]+/).filter(Boolean);
  const dropUnplaced = () => { list = list.filter((t) => norm(t) !== UNPLACED); };
  for (const ch of changes) {
    if (Array.isArray(ch.value)) {
      if (ch.value.length) fm[ch.prop] = ch.value.map(linkOf); else delete fm[ch.prop];
      if (ch.value.length && ch.field !== "ties_to") dropUnplaced();
    } else if (ch.value === "unplaced") {
      delete fm[ch.prop];
      if (!list.some((t) => norm(t) === UNPLACED)) list.push(UNPLACED);
    } else if (ch.value) {
      fm[ch.prop] = linkOf(ch.value);
      dropUnplaced();
    } else {
      delete fm[ch.prop];
    }
  }
  fm.tags = list;
});
new Notice(`Location set on ${file.basename}: ${changes.map((c) => c.field).join(", ")}.`);
_%>
