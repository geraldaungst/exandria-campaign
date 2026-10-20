---
cssclasses:
  - wide-page
hide_from_related: true
tags: []
---

[[Session Hub]] · [[Plot Dashboard]] · [[Eryndor Timeline]] · [[DM Hubs Design]]

```datacorejsx
const { DMScreenTop } = await dc.require(dc.headerLink("00 DM Screen/Arc Views.md", "Views"));
return DMScreenTop;
```

## Active plot threads

```datacorejsx
const { PlotDashboard } = await dc.require(dc.headerLink("00 DM Screen/Plot Dashboard.md", "Views"));
return function ActivePlots() {
  return <PlotDashboard only={["plot/active"]} showBar={false} />;
};
```

## Recent work

![[Recent Work.base]]

## Table tools

Until the [[Session Hub]] is built: [[Quick NPCs]] · [[NPC Stat Block Reference Table]] · [[Table Rulings]] · [[Party Combat Profile]] · [[Random Tavern]] · [[Fast NPC + Picture]] · [[Sources of Maps]]
