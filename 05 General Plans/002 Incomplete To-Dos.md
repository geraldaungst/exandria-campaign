---
processed: yes
tags: 
---

# 05 General Plans
```dataviewjs
const pages = dv.pages('"05 General Plans"').where(p => p.file.tasks.length > 0);
const tasks = pages.file.tasks.where(t => !t.completed && !t.checked).groupBy(p => p.path.split("/").last());

if (tasks.length === 0) {
    dv.paragraph("No tasks in this section");
} else {
    for (let group of tasks.sort(t => t.key)) {
        dv.paragraph("### " + dv.fileLink(group.key.replace(".md", "")) + " (" + group.rows.length + ")");
        dv.taskList(group.rows);
    }
}
```

# 10 The Party
```dataviewjs
const pages = dv.pages('"10 The Party"').where(p => p.file.tasks.length > 0);
const tasks = pages.file.tasks.where(t => !t.completed && !t.checked).groupBy(p => p.path.split("/").last());

if (tasks.length === 0) {
    dv.paragraph("No tasks in this section");
} else {
    for (let group of tasks.sort(t => t.key)) {
        dv.header(3, dv.fileLink(group.key.replace(".md", "")) + " (" + group.rows.length + ")");
        dv.taskList(group.rows);
    }
}
```

# 19 Factions
```dataviewjs
const pages = dv.pages('"19 Factions"').where(p => p.file.tasks.length > 0);
const tasks = pages.file.tasks.where(t => !t.completed && !t.checked).groupBy(p => p.path.split("/").last());

if (tasks.length === 0) {
    dv.paragraph("No tasks in this section");
} else {
    for (let group of tasks.sort(t => t.key)) {
        dv.header(3, dv.fileLink(group.key.replace(".md", "")) + " (" + group.rows.length + ")");
        dv.taskList(group.rows);
    }
}
```

# 21 Opponents
```dataviewjs
const pages = dv.pages('"21 Opponents"').where(p => p.file.tasks.length > 0);
const tasks = pages.file.tasks.where(t => !t.completed && !t.checked).groupBy(p => p.path.split("/").last());

if (tasks.length === 0) {
    dv.paragraph("No tasks in this section");
} else {
    for (let group of tasks.sort(t => t.key)) {
        dv.header(3, dv.fileLink(group.key.replace(".md", "")) + " (" + group.rows.length + ")");
        dv.taskList(group.rows);
    }
}
```

# 25 NPCs
```dataviewjs
const pages = dv.pages('"25 NPCs"').where(p => p.file.tasks.length > 0);
const tasks = pages.file.tasks.where(t => !t.completed && !t.checked).groupBy(p => p.path.split("/").last());

if (tasks.length === 0) {
    dv.paragraph("No tasks in this section");
} else {
    for (let group of tasks.sort(t => t.key)) {
        dv.header(3, dv.fileLink(group.key.replace(".md", "")) + " (" + group.rows.length + ")");
        dv.taskList(group.rows);
    }
}
```

# 60 Locations
```dataviewjs
const pages = dv.pages('"60 Locations"').where(p => p.file.tasks.length > 0);
const tasks = pages.file.tasks.where(t => !t.completed && !t.checked).groupBy(p => p.path.split("/").last());

if (tasks.length === 0) {
    dv.paragraph("No tasks in this section");
} else {
    for (let group of tasks.sort(t => t.key)) {
        dv.header(3, dv.fileLink(group.key.replace(".md", "")) + " (" + group.rows.length + ")");
        dv.taskList(group.rows);
    }
}
```

# 80 Mechanics
```dataviewjs
const pages = dv.pages('"80 Mechanics"').where(p => p.file.tasks.length > 0);
const tasks = pages.file.tasks.where(t => !t.completed && !t.checked).groupBy(p => p.path.split("/").last());

if (tasks.length === 0) {
    dv.paragraph("No tasks in this section");
} else {
    for (let group of tasks.sort(t => t.key)) {
        dv.header(3, dv.fileLink(group.key.replace(".md", "")) + " (" + group.rows.length + ")");
        dv.taskList(group.rows);
    }
}
```

# 90 Session Notes
```dataviewjs
const pages = dv.pages('"90 Session Notes"').where(p => p.file.tasks.length > 0);
const tasks = pages.file.tasks.where(t => !t.completed && !t.checked).groupBy(p => p.path.split("/").last());

if (tasks.length === 0) {
    dv.paragraph("No tasks in this section");
} else {
    for (let group of tasks.sort(t => t.key)) {
        dv.header(3, dv.fileLink(group.key.replace(".md", "")) + " (" + group.rows.length + ")");
        dv.taskList(group.rows);
    }
}
```
