---
aliases:
  - Shard Tracker
  - Lorestone Shards
cssclasses:
  - wide-page
hide_from_related: true
tags:
  - artifact
  - campaign/eryndor
---

[[Lorestone of Eryndor - DM Notes|Lorestone of Eryndor]] · [[Assembling the Lorestone]] · [[The Prophecy]] · [[Eryndor Timeline]]

## Overview

```datacorejsx
const { PieceOverview } = await dc.require(dc.headerLink("00 DM Screen/Code/Artifact Hub Views.md", "Code"));
return function Overview() {
  return <PieceOverview piece="lorestone-of-eryndor" />;
};
```

## Shards

```datacorejsx
const { PieceCards } = await dc.require(dc.headerLink("00 DM Screen/Code/Artifact Hub Views.md", "Code"));
return function Shards() {
  return <PieceCards piece="lorestone-of-eryndor" />;
};
```

## Faction knowledge evolution

![[Lorestone of Eryndor - DM Notes#Faction Knowledge Evolution]]
