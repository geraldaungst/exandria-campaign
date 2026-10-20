---
hide_from_related: true
---

Test page for the shared hub logic ([[Diagnostics]] in `00 DM Screen/Code`). Shows the active campaign, last and next session, running arc, today in-world, and every note grouped by type.

```datacorejsx
const { HubLogicCheck } = await dc.require(dc.headerLink("00 DM Screen/Code/Diagnostics.md", "Code"));
return HubLogicCheck;
```
