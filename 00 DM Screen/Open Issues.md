---
cssclasses:
  - wide-page
hide_from_related: true
---

Every open item in the `## Open Issues` and `## Seeds Planted` sections of the DM notes, in priority bands. Tick a line in its own note to close it. The code lives in [[Open Issues Views]]; the design and the rules for the two sections are in [[Open Issues Spec]].

## Issues and seeds

```datacorejsx
const { OpenIssuesFull } = await dc.require(dc.headerLink("00 DM Screen/Code/Open Issues Views.md", "Code"));
return OpenIssuesFull;
```
