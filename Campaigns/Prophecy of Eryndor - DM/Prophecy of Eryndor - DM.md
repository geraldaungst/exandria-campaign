---
tags:
  - campaign-hub
  - campaign/eryndor
calendar: Exandrian Calendar
status: active
timeline: "[[Eryndor Timeline]]"
world: Exandria
---

> [!quote]- What players know
> ![[Prophecy of Eryndor]]

## Prophecy of Eryndor

<!-- Campaign hub. The properties above (the campaign-hub tag, the campaign's one campaign/… tag, calendar, timeline, status, world) drive the DM hubs and templates. Add any other properties or content freely; the automation ignores them. Change `status` only when the campaign starts, pauses, or ends. -->

### Key notes

- [[Eryndor Timeline]] · [[Character Story Beats]] · [[Party Notes]] · [[Player Preferences]]
- [[The Prophecy]] · [[Lorestone Shard Status Tracker|Shard Tracker]] · [[Adaptable Modules]]
- [[Plot Dashboard]] · [[00 DM Screen|DM Screen]]

### NPCs

```datacorejsx
const { NpcBrowser } = await dc.require(dc.headerLink("00 DM Screen/Code/NPC Browser.md", "Code"));
return NpcBrowser;
```

### Arcs

```base
filters:
  and:
    - file.inFolder(this.file.folder)
    - file.hasTag("arc")
views:
  - type: table
    name: Arcs by status
    groupBy:
      property: status
      direction: ASC
    order:
      - file.name
      - threads
      - tier
```

### Recent sessions

```base
filters:
  and:
    - file.inFolder(this.file.folder)
    - file.hasTag("session")
views:
  - type: table
    name: Recent sessions
    order:
      - file.name
      - date
      - arc
      - fc-end
    sort:
      - property: session_number
        direction: DESC
    limit: 8
```

### Notes
