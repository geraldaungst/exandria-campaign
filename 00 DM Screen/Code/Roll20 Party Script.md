---
hide_from_related: true
---

**Purpose:** The Roll20 side of the Session Hub's Party card. A GM-only API script that reads each active player character (2014 and 2024 sheets) and whispers one line per character, starting with `PARTY|`. You copy the lines into the card, which saves them. Nothing in the vault is typed by hand.

**Used by:** [[Party Card]] · [[Session Hub]]

How to install it:

1. In Roll20, open **Game Settings → API Scripts** (Pro, campaign creator only). Open the existing `Attribute dump` script, replace its contents with the script below, rename it `Party export`, and **Save Script**. The API console should log "Party export ready:!party".
2. Mod Script Sandbox must be 1.5 or newer (it is in your game). The 2024 sheets are read with `getComputed`, which older sandboxes don't have.

How to use it:

1. Type `!party` in chat. The script uses the `DEFAULT_PARTY` list at the top of the script. Edit that list when the party changes. `!party Name One|Name Two` reads only those characters.
2. About a second later a whisper arrives with the `PARTY|` lines. Copy them.
3. On the Session Hub, open **Update from Roll20** on the Party card, paste, and press Save.

Tip: put `!party` in a Roll20 macro so it is one click.

What it reads, and what it can't:

- **Both sheets:** level, AC, maximum HP, speed, spell save DC, and passive Perception. Passive Insight and Investigation are 10 plus the sheet's skill bonus.
- **2024 sheets only:** resistances, immunities, vulnerabilities, and condition notes, from the sheet's NPC-style fields.
- **2014 sheets only:** languages. The 2024 sheet does not expose them to scripts, so those cells stay blank unless you type them into the data note.
- **Not read:** current HP (it would be stale by the time you looked), items, and class names (the 2024 sheet reports unreliable class text).

```js
// Party export for the Obsidian Session Hub. GM-only. Whispers one line per character, starting with PARTY|
// !party                    the characters in DEFAULT_PARTY below
// !party Name One|Name Two  only these characters (separate names with |)
// Works with both the 2014 (legacy) and the 2024 (Beacon) character sheets.
on("ready", function () {
  // Edit this list when the party changes.
  var DEFAULT_PARTY = ["Drawg Stormbrew", "Qilynn DuskWhisper", "Hesterian Shyr 2024", "Seraphina (new)", "Popcorn", "Dechs (2024)"];
  var DELAY = 700;

  function esc(s) {
    return String(s === undefined || s === null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/[*_\[\]{}@%$!~`^|\\]/g, function (ch) { return "&#" + ch.charCodeAt(0) + ";"; });
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
    sendChat("Party export", "/w gm " + next);
    setTimeout(pump, DELAY);
  }

  function isBlank(v) { return v === undefined || v === null || String(v).trim() === "" || String(v) === "0"; }

  function list(text) {
    var seen = {};
    var out = [];
    String(text === undefined || text === null ? "" : text).split(",").forEach(function (part) {
      var t = part.trim();
      if (!t) return;
      t = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
      if (!seen[t]) { seen[t] = true; out.push(t); }
    });
    return out.join(", ");
  }

  var CONDITIONS = ["blinded", "charmed", "deafened", "exhaustion", "frightened", "grappled", "incapacitated", "invisible", "paralyzed", "petrified", "poisoned", "prone", "restrained", "stunned", "unconscious"];

  /** Splits a comma list into damage-type entries and condition entries. */
  function split(text) {
    var dmg = [];
    var cond = [];
    list(text).split(", ").forEach(function (t) {
      if (!t) return;
      (CONDITIONS.indexOf(t.toLowerCase()) >= 0 ? cond : dmg).push(t);
    });
    return { dmg: dmg, cond: cond };
  }

  function defenses(resistances, immunities, conditionImmunities, vulnerabilities) {
    var r = split(resistances);
    var i = split(String(immunities || "") + "," + String(conditionImmunities || ""));
    var cond = [];
    r.cond.concat(i.cond).forEach(function (t) { if (cond.indexOf(t) < 0) cond.push(t); });
    return { resist: r.dmg.join(", "), immune: i.dmg.join(", "), vuln: list(vulnerabilities), cond: cond.join(", ") };
  }

  function passive(bonus) {
    var n = Number(bonus);
    return isNaN(n) ? "" : 10 + Math.floor(n);
  }

  function speedText(base, extras) {
    var parts = [];
    if (!isBlank(base)) parts.push(String(base));
    extras.forEach(function (e) { if (!isBlank(e[1])) parts.push(e[0] + " " + e[1]); });
    return parts.join(", ");
  }

  async function beacon(c) {
    async function get(prop) {
      try { return await getComputed({ characterId: c.id, property: prop }); }
      catch (e) {
        try { return await getSheetItem(c.id, prop); } catch (e2) { return ""; }
      }
    }
    var d = defenses(await get("npc_resistances"), await get("npc_immunities"), await get("npc_condition_immunities"), await get("npc_vulnerabilities"));
    return {
      level: await get("level"),
      ac: await get("ac"),
      hp: await get("hp_max"),
      speed: speedText(await get("speed"), [["fly", await get("speed_fly")], ["climb", await get("speed_climb")], ["swim", await get("speed_swim")], ["burrow", await get("speed_burrow")]]),
      pp: await get("passive_wisdom"),
      pi: passive(await get("insight_bonus")),
      pinv: passive(await get("investigation_bonus")),
      dc: await get("spell_save_dc"),
      resist: d.resist,
      immune: d.immune,
      vuln: d.vuln,
      cond: d.cond,
      languages: "",
    };
  }

  function legacy(c, attrs) {
    var byName = {};
    attrs.forEach(function (a) { if (!/^repeating_/.test(a.get("name"))) byName[a.get("name")] = a; });
    function cur(n) { return byName[n] ? byName[n].get("current") : ""; }
    var rows = {};
    attrs.forEach(function (a) {
      var m = a.get("name").match(/^repeating_proficiencies_(.+)_(name|prof_type)$/);
      if (m) { rows[m[1]] = rows[m[1]] || {}; rows[m[1]][m[2]] = String(a.get("current")); }
    });
    var langs = Object.keys(rows).filter(function (k) { return rows[k].prof_type === "LANGUAGE" && rows[k].name; }).map(function (k) { return rows[k].name; });
    if (!langs.length && !isBlank(cur("other_languages"))) langs = [cur("other_languages")];
    var hp = byName.hp ? byName.hp.get("max") : "";
    return {
      level: cur("level"),
      ac: cur("ac"),
      hp: hp,
      speed: speedText(cur("speed"), []),
      pp: cur("passive_wisdom"),
      pi: passive(cur("insight_bonus")),
      pinv: passive(cur("investigation_bonus")),
      dc: cur("spell_save_dc"),
      resist: "",
      immune: "",
      vuln: "",
      cond: "",
      languages: list(langs.join(", ")),
    };
  }

  async function run(chosen) {
    var lines = [];
    for (var i = 0; i < chosen.length; i++) {
      var c = chosen[i];
      var attrs = findObjs({ type: "attribute", characterid: c.id });
      var d;
      try { d = attrs.length > 40 ? legacy(c, attrs) : await beacon(c); }
      catch (e) { say("Could not read " + esc(c.get("name")) + ": " + esc(e && e.message ? e.message : e)); continue; }
      var cells = [c.get("name"), d.level, d.ac, d.hp, d.speed, d.pp, d.pi, d.pinv, isBlank(d.dc) ? "" : d.dc, d.resist, d.immune, d.vuln, d.cond, d.languages];
      lines.push("PARTY|" + cells.map(esc).join("|"));
    }
    say("<b>Copy these lines into the hub's Party card:</b><br>" + lines.join("<br>"));
  }

  on("chat:message", function (msg) {
    if (msg.type !== "api" || !/^!party\b/.test(msg.content)) return;
    if (!playerIsGM(msg.playerid)) return;
    var arg = msg.content.replace(/^!party\s*/, "").trim();
    var wanted = (arg ? arg.split("|") : DEFAULT_PARTY).map(function (s) { return s.trim().toLowerCase(); });
    var all = findObjs({ type: "character" });
    var chosen = all.filter(function (c) { return wanted.indexOf(c.get("name").toLowerCase()) >= 0; });
    var missing = wanted.filter(function (w) { return !chosen.some(function (c) { return c.get("name").toLowerCase() === w; }); });
    if (missing.length) say("Not found: " + esc(missing.join(", ")));
    if (!chosen.length) return;
    run(chosen);
  });
  log("Party export ready: !party");
});
```
