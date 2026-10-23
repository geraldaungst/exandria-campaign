---
hide_from_related: true
---

**Purpose:** The note-type rules (Session, Arc, NPC, Location, …) used by the hubs. The Recent Work base uses the Bases formula below, which must be kept in step with `typeRules`.

**Exports:** `typeRules`, `NOTE_TYPES`, `noteType`

**Depends on:** [[Shared Helpers]]

**Used by:** [[Diagnostics]] · [[Quick Capture]]

Tag rules come first, then folder fallbacks for untagged notes (Session Notes, Objects, Characters, Worlds, Campaigns). The tag and folder names come from [[Hub Config]]. Bases formulas can't read Hub Config, so if you change a name there, update this formula and the one in Recent Work too. The matching Bases formula, used by [[Recent Work.base|Recent Work]]:

```
if(file.inFolder("Player Wiki"), "Player wiki", if(file.hasTag("session"), "Session", if(file.hasTag("arc"), "Arc", if(file.hasTag("plot", "plot/active", "plot/upcoming", "plot/seed", "plot/paused"), "Plot thread", if(file.hasTag("lore"), "Lore", if(file.hasTag("player", "player/inactive"), "Player Character", if(file.hasTag("npc"), "NPC", if(file.inFolder("Characters/Creatures"), "Creature", if(file.hasTag("location"), "Location", if(file.hasTag("organization"), "Organization", if(file.hasTag("artifact"), "Artifact", if(file.inFolder("00 DM Screen") || file.hasTag("dm-tool"), "DM tools", if(file.path.contains("Session Notes/"), "Session", if(file.inFolder("Objects"), "Artifact", if(file.inFolder("Characters"), "NPC", if(file.inFolder("Worlds"), "World", if(file.inFolder("Campaigns"), "Campaign", "Other")))))))))))))))))
```

A third copy of the type rules is the `Type` formula in [[Related Notes.base]]. It is shorter (Session, Arc, Plot thread, Lore, Player Character, NPC, Location, Organization, Artifact, Atomic note, Other) and tests in the same order. Keep it in step when a type is added or a label changes. Labels match Recent Work and the code below (Player Character, Organization, Artifact).

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Note Types.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, tagsOf, hasTag, inFolder } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

/** The type rules, built from Hub Config. First matching rule names the type; keep the Bases formula above in step. */
function typeRules() {
  const c = cfg();
  const tag = (t) => (p) => hasTag(p, t);
  return [
    ["Player wiki", (p) => inFolder(p, c.folder_player_wiki)],
    ["Session", tag(c.tag_session)],
    ["Arc", tag(c.tag_arc)],
    ["Plot thread", tag(c.tag_plot)],
    ["Lore", tag(c.tag_lore)],
    ["Player Character", tag(c.tag_pc)],
    ["NPC", tag(c.tag_npc)],
    ["Creature", (p) => inFolder(p, c.folder_creatures)],
    ["Location", tag(c.tag_location)],
    ["Organization", tag(c.tag_faction)],
    ["Artifact", tag(c.tag_item)],
    ["DM tools", (p) => inFolder(p, c.folder_dm_screen) || c.tags_dm_tools.some((t) => tagsOf(p).includes(t))],
    // Folder fallbacks for notes with no type tag
    ["Session", (p) => p.$path.includes(`${c.folder_session_notes}/`)],
    ["Artifact", (p) => inFolder(p, c.folder_objects)],
    ["NPC", (p) => inFolder(p, c.folder_characters)],
    ["World", (p) => inFolder(p, c.folder_worlds)],
    ["Campaign", (p) => inFolder(p, c.folder_campaigns)],
  ];
}
const NOTE_TYPES = [...new Set([...typeRules().map(([name]) => name), "Other"])];
/** A note's type. Pass `rules` (from typeRules()) when typing many notes at once. */
function noteType(p, rules = typeRules()) {
  const rule = rules.find(([, test]) => test(p));
  return rule ? rule[0] : "Other";
}

return { typeRules, NOTE_TYPES, noteType };
```
