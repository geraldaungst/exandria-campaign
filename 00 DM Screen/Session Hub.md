---
tags: []
cssclasses:
  - wide-page
hide_from_related: true
---

[[00 DM Screen]] · [[Plot Dashboard]] · [[DM Hubs Design]]

## Prep

```datacorejsx
const { SessionHubPrep } = await dc.require(dc.headerLink("00 DM Screen/Code/Session Hub Views.md", "Code"));
return SessionHubPrep;
```

## At a glance

```datacorejsx
const { PartyCard } = await dc.require(dc.headerLink("00 DM Screen/Code/Party Card.md", "Code"));
return PartyCard;
```

```datacorejsx
const { Row, Cell } = await dc.require(dc.headerLink("00 DM Screen/Code/Hub Layout.md", "Code"));
const { WhereAreWe, TableCast } = await dc.require(dc.headerLink("00 DM Screen/Code/Session Hub Table.md", "Code"));
const { QuickCapture } = await dc.require(dc.headerLink("00 DM Screen/Code/Quick Capture.md", "Code"));
return function AtAGlance() {
  return (
    <Row>
      <Cell title="Where are we" grow={3} min={300}><WhereAreWe /></Cell>
      <Cell title="Tonight's cast" grow={3} min={300}><TableCast /></Cell>
      <Cell title="Quick capture" grow={2} min={280}><QuickCapture /></Cell>
    </Row>
  );
};
```

## Rules

```datacorejsx
const { Row, Cell } = await dc.require(dc.headerLink("00 DM Screen/Code/Hub Layout.md", "Code"));
const { SectionPicker } = await dc.require(dc.headerLink("00 DM Screen/Code/Section Picker.md", "Code"));
const { ReferenceList } = await dc.require(dc.headerLink("00 DM Screen/Code/Reference Lists.md", "Code"));
return function Rules() {
  return (
    <Row>
      <Cell title="Conditions" grow={3} min={360}><SectionPicker note="Conditions" /></Cell>
      <Cell title="Rulings" grow={2} min={300}><ReferenceList source="00 DM Screen/Table References.md" group="Rulings" /></Cell>
    </Row>
  );
};
```

## Improvise

```datacorejsx
const { ReferenceList } = await dc.require(dc.headerLink("00 DM Screen/Code/Reference Lists.md", "Code"));
return function PeopleAndPlaces() {
  return <ReferenceList source="00 DM Screen/Table References.md" group="People and places" />;
};
```

## Loot and hazards

```datacorejsx
const { Row, Cell } = await dc.require(dc.headerLink("00 DM Screen/Code/Hub Layout.md", "Code"));
const { TreasureRoll } = await dc.require(dc.headerLink("00 DM Screen/Code/Treasure Roll.md", "Code"));
const { TrapRoll } = await dc.require(dc.headerLink("00 DM Screen/Code/Trap Roll.md", "Code"));
return function Rolls() {
  return (
    <Row>
      <Cell grow={1} min={380}><TreasureRoll /></Cell>
      <Cell grow={1} min={380}><TrapRoll /></Cell>
    </Row>
  );
};
```

```datacorejsx
const { ItemFinder } = await dc.require(dc.headerLink("00 DM Screen/Code/Item Finder.md", "Code"));
return ItemFinder;
```

## Sites and maps

```datacorejsx
const { SectionPicker } = await dc.require(dc.headerLink("00 DM Screen/Code/Section Picker.md", "Code"));
return function Sites() {
  return <SectionPicker note="Table Sites" />;
};
```
