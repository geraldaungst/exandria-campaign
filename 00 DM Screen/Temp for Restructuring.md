
```dataviewjs
const vals = new Set();
dv.pages().forEach(p => { if (p.type) vals.add(p.type); });
dv.list([...vals].sort());
```

- artifact
- faction
- location
- note
- npc
- plot
- session

```dataviewjs
const vals = new Set();
dv.pages().forEach(p => { 
  if (p.region) {
    if (Array.isArray(p.region)) p.region.forEach(r => vals.add(r));
    else vals.add(p.region);
  }
});
dv.list([...vals].sort());
```

- Beaded Alley, Port Damali
- Cyrios Mountains
- Dwendalian Empire
- Menagerie Coast
- Menagerie Coast, Tyodan River
- Port Damali
- Port Damali, Menagerie Coast
- The Crescents, Port Damali, Menagerie Coast

```dataviewjs
const vals = new Set();
dv.pages().forEach(p => { if (p.status) vals.add(p.status); });
dv.list([...vals].sort());
```

- : Active
- Active
- active
- active/inactive
- active/inactive/deceased
- active/inactive/defunct
- historical
- under construction