---
hide_from_related: true
---

**Purpose:** A one-time Roll20 API script that lists each active player character's party-related values (AC, HP, speed, passives, languages, spellcasting, and so on), so the Party card's real script can be written against what your sheets expose. It only reads; it changes nothing in the game.

**Used by:** [[Session Hub]] (Party card, in design)

**Version 2.1.** The whispers now escape characters that Roll20 chat silently drops on (brackets, braces, @), and also list all computed property names once.

**Why version 2.** The first run showed that the 2024 sheets (sheetVersion 25) are Roll20 "Beacon" sheets. They keep almost everything as computed properties, so the old attribute reading returned only 13 to 21 attributes for them. Mod scripts read Beacon data with `getComputed`, which needs Mod Script Sandbox v1.5. Version 2 reads both kinds: attributes for the 2014 sheets, computed properties for the 2024 ones.

How to use it:

1. In Roll20, open **Game Settings → API Scripts**. Open the existing `Attribute dump` script, replace its contents with the script below, and **Save Script**. The API console should log "Attribute dump 2 ready:!attrs".
2. In the game's chat, type the command below. It dumps the six active characters and nothing else, which keeps the output short:

   `!attrs Drawg Stormbrew|Qilynn DuskWhisper|Hesterian Shyr 2024|Seraphina (new)|Popcorn|Dechs (2024)`

3. Whispers arrive about a second apart, ending with "Done." Copy them from the chat log and paste them into the conversation.
4. When the Party script is done, delete this one from the API page.

If the first whisper says the sandbox is not 1.5, set **Mod Script Sandbox** in Game Settings to the newest version and save, then run the command again.

```js
// Roll20 attribute dump, version 2. GM-only. Reads both sheet types and whispers a compact report.
// !attrs                      the player characters with a controlling player
// !attrs Name One|Name Two    only these characters (separate names with |)
// !attrs all                  every character
on("ready", function () {
  var WANT = /(^ac$|^ac_|armor_class|armour|^hp|hit_point|speed|passive|perception|insight|investigation|language|^level|class|race|species|dc$|_dc|dc_|resist|immun|vuln|initiative|^pb$|proficiency_bonus|spell_attack|spellcasting|death|exhaustion|inspiration)/i;
  var MAX_VALUE = 90;
  var MAX_NAMES = 90;
  var CHUNK = 2500;
  var DELAY = 700;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/[*_\[\]{}@%$!~`^|\\]/g, function (ch) { return "&#" + ch.charCodeAt(0) + ";"; });
  }
  function clip(v) {
    var s = typeof v === "string" ? v : JSON.stringify(v);
    s = String(s === undefined ? "undefined" : s);
    return s.length > MAX_VALUE ? s.slice(0, MAX_VALUE) + "…" : s;
  }

  var queue = [];
  var busy = false;
  function say(text) {
    queue.push(text);
    if (!busy) pump();
  }
  function pump() {
    busy = true;
    var next = queue.shift();
    if (next === undefined) { busy = false; return; }
    log("Attribute dump sending " + next.length + " chars");
    sendChat("Attribute dump", "/w gm " + next);
    setTimeout(pump, DELAY);
  }
  function sayLines(lines) {
    var out = "";
    lines.forEach(function (line) {
      if (out.length + line.length > CHUNK) { say(out); out = ""; }
      out += line + "<br>";
    });
    if (out) say(out);
  }

  function computedNames() {
    try {
      var s = Campaign().computedSummary;
      if (Array.isArray(s)) return s.map(function (x) { return typeof x === "string" ? x : (x && (x.name || x.property || x.id)) || JSON.stringify(x); });
      if (s && typeof s === "object") return Object.keys(s);
      if (typeof s === "string") return s.split(/[\s,]+/);
    } catch (e) {}
    return [];
  }

  async function readComputed(c, prop) {
    try {
      var v = await getComputed({ characterId: c.id, property: prop });
      return clip(v);
    } catch (e) {
      try {
        var w = await getSheetItem(c.id, prop);
        return clip(w);
      } catch (e2) {
        return "ERROR " + String(e2 && e2.message ? e2.message : e2).slice(0, 60);
      }
    }
  }

  function legacyReport(c, attrs) {
    var plain = [];
    var langs = [];
    attrs.forEach(function (a) {
      var name = a.get("name");
      if (/^repeating_/.test(name)) return;
      if (WANT.test(name)) plain.push(name + " = " + clip(a.get("current")));
    });
    var byRow = {};
    attrs.forEach(function (a) {
      var m = a.get("name").match(/^repeating_proficiencies_([^_]+(?:_[^_]+)?)_(name|prof_type)$/);
      if (m) { byRow[m[1]] = byRow[m[1]] || {}; byRow[m[1]][m[2]] = String(a.get("current")); }
    });
    Object.keys(byRow).forEach(function (k) {
      if (byRow[k].prof_type === "LANGUAGE") langs.push(byRow[k].name);
    });
    plain.sort();
    var lines = ["<b>Legacy sheet. Plain attributes:</b>"];
    plain.forEach(function (l) { lines.push(esc(l)); });
    lines.push("<b>Languages (proficiency rows):</b> " + esc(langs.join(", ") || "none found"));
    return lines;
  }

  async function beaconReport(c, names) {
    var lines = ["<b>Beacon sheet. Computed values:</b>"];
    for (var i = 0; i < names.length; i++) {
      lines.push(esc(names[i] + " = " + (await readComputed(c, names[i]))));
    }
    return lines;
  }

  async function run(chosen) {
    var all = computedNames();
    var names = all.filter(function (n) { return WANT.test(n); }).slice(0, MAX_NAMES);
    var head = ["<b>Sandbox:</b> " + esc(String(Campaign().sandboxVersion)) + " · getComputed " + typeof getComputed + " · getSheetItem " + typeof getSheetItem,
      "<b>Computed properties:</b> " + all.length + " total, " + names.length + " matching"];
    sayLines(head);
    sayLines(["<b>Matching computed names:</b> " + esc(names.join(", "))]);
    sayLines(["<b>All computed names:</b> " + esc(all.join(", "))]);
    for (var i = 0; i < chosen.length; i++) {
      var c = chosen[i];
      var attrs = findObjs({ type: "attribute", characterid: c.id });
      var lines = ["<b>=== " + esc(c.get("name")) + " (" + attrs.length + " legacy attributes) ===</b>"];
      try {
        lines = lines.concat(attrs.length > 40 ? legacyReport(c, attrs) : await beaconReport(c, names));
      } catch (e) {
        lines.push("ERROR " + esc(e && e.message ? e.message : e));
      }
      sayLines(lines);
    }
    say("<b>Done.</b>");
  }

  on("chat:message", function (msg) {
    if (msg.type !== "api" || !/^!attrs\b/.test(msg.content)) return;
    if (!playerIsGM(msg.playerid)) return;
    var arg = msg.content.replace(/^!attrs\s*/, "").trim();
    var all = findObjs({ type: "character" });
    var chosen;
    if (arg === "all") chosen = all;
    else if (arg) {
      var wanted = arg.split("|").map(function (s) { return s.trim().toLowerCase(); });
      chosen = all.filter(function (c) { return wanted.indexOf(c.get("name").toLowerCase()) >= 0; });
    } else chosen = all.filter(function (c) { return String(c.get("controlledby")).replace(/all/g, "").replace(/,/g, "").trim() !== ""; });
    if (!chosen.length) { say("No matching characters. Check the names, or use !attrs all."); return; }
    say("Dumping " + chosen.length + ": " + esc(chosen.map(function (c) { return c.get("name"); }).join(", ")));
    run(chosen);
  });
  log("Attribute dump 2 ready: !attrs");
});
```
