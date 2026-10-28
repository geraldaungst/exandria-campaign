---
cssclasses:
  - wide-page
hide_from_related: true
tags: []
---

[[Session Hub]] · [[Plot Dashboard]] · [[Eryndor Timeline]] · [[DM Hubs Design]]

```datacorejsx
const { DMScreenTop } = await dc.require(dc.headerLink("00 DM Screen/Code/DM Screen Views.md", "Code"));
return DMScreenTop;
```

## Active plot threads

```datacorejsx
const { PlotDashboard } = await dc.require(dc.headerLink("00 DM Screen/Code/Plot Dashboard Views.md", "Code"));
return function ActivePlots() {
  return <PlotDashboard only={["active"]} showBar={false} />;
};
```

## Recent work

![[Recent Work.base]]

## Vault health

![[Vault Health.base]]

### Location checks

```datacorejsx
const { LocationChecks } = await dc.require(dc.headerLink("00 DM Screen/Code/Location Checks.md", "Code"));
return LocationChecks;
```
