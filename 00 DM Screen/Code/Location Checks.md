---
hide_from_related: true
---

**Purpose:** The Location checks list on the 00 DM Screen, under Vault health. It runs the location core's checks ([[Location Engine Spec]], section 4) and shows one collapsible group per check with a count, each row a link plus what is wrong. Errors come first, then the review lists (places with no parent, Player Wiki notes with no DM note), which are not mistakes. Check 10 (an artifact piece's History against its `whereabouts`) is read by [[Artifact Pieces]] and shown in the same list.

**Exports:** `LocationChecks`, `groupResults`, `pieceSlugs`

**Depends on:** [[Shared Helpers]] (its `locations()` loads the location core) · [[Artifact Pieces]] · [[Artifact Hub Views]] (`usePartyLocation`)

**Used by:** [[00 DM Screen]]

Conventions this module relies on:

- **The checks live in the core.** This note runs `checks()` and groups the results by the core's `checkList` (the 12 checks, in their order). A new check added to the core's registry shows up here without a change to this note.
- **Errors and review.** A check's `kind` is `error` or `review`. Groups of errors are listed first; a group with problems has its count in the error color. Review groups use a plain count.
- **Check 10 is not in the core.** The core returns nothing for it. This note reads every artifact in use (the second part of each `<piece_tag_prefix>/<slug>` tag), asks `usePieces` for its pieces and lists each piece whose `whereCheck` sentence is set. Until the pieces' texts are read, the group says so.
- **Rows.** The note's link and the core's detail line. A note that is not in the vault index yet is shown by name.
- **Rebuilds** whenever any note changes, like the other hubs. There is no refresh button.
- If the location core cannot be loaded, the list says so instead of showing counts.

Embed it in a note with a `datacorejsx` block that loads `LocationChecks` from the Code section of this note with `dc.require` and returns it, as [[00 DM Screen]] does.

The block below is plain `jsx`, so it does not run on this page. Notes load it with `dc.require(dc.headerLink("00 DM Screen/Code/Location Checks.md", "Code"))`. After editing, reopen any note that uses it. Design: [[DM Hubs Design]].

## Code

```jsx
const { cfg, tagsOf, S, locations } = await dc.require(dc.headerLink("00 DM Screen/Code/Shared Helpers.md", "Code"));

const { usePieces } = await dc.require(dc.headerLink("00 DM Screen/Code/Artifact Pieces.md", "Code"));

const { usePartyLocation } = await dc.require(dc.headerLink("00 DM Screen/Code/Artifact Hub Views.md", "Code"));

const PIECE_CHECK = "piece-holder";

const L = {
  wrap: { margin: "8px 0 16px" },
  summary: { margin: "0 0 8px" },
  group: { margin: "4px 0" },
  head: { cursor: "pointer", fontWeight: 600 },
  list: { listStyle: "none", margin: "4px 0 10px 14px", padding: 0 },
  row: { margin: "2px 0" },
  bad: { color: "var(--text-error)", fontSize: "var(--font-ui-smaller)", marginLeft: "6px" },
  none: { color: "var(--text-muted)", fontSize: "var(--font-ui-smaller)", marginLeft: "6px" },
};

/** The artifact slugs in use: the second part of every `<piece_tag_prefix>/<slug>` tag. `tags` are lower-case, no `#`. */
function pieceSlugs(tags, prefix) {
  const want = String(prefix).replace(/^#/, "").toLowerCase();
  const out = new Set();
  for (const t of tags) {
    const parts = String(t).split("/");
    if (parts[0] === want && parts[1]) out.add(parts[1]);
  }
  return [...out].sort();
}

/**
 * The core's results grouped under its checks, in the core's order.
 * `results` is core.checks() ({ check, file, detail }); `pieceRows` are check 10's rows ({ path, name, detail }).
 * Returns [{ id, n, label, kind, rows: [{ path, name, detail }] }] with rows sorted by path.
 */
function groupResults(checkList, results, pieceRows) {
  const groups = new Map(checkList.map((c) => [c.id, { id: c.id, n: c.n, label: c.label, kind: c.kind, rows: [] }]));
  for (const r of results) groups.get(r.check)?.rows.push({ path: r.file.path, name: r.file.basename, detail: r.detail ?? "" });
  groups.get(PIECE_CHECK)?.rows.push(...pieceRows);
  for (const g of groups.values()) g.rows.sort((a, b) => a.path.localeCompare(b.path) || a.detail.localeCompare(b.detail));
  return [...groups.values()];
}

/** Reads one artifact's pieces and reports the rows for check 10 up to the list (renders nothing). */
function PieceReader({ slug, party, report }) {
  const { pieces, loading } = usePieces(slug, party);
  const rows = loading
    ? null
    : pieces.filter((p) => p.state.whereCheck).map((p) => ({ path: p.path, name: p.name, detail: p.state.whereCheck }));
  const signature = JSON.stringify(rows);
  dc.useEffect(() => {
    report(slug, rows);
  }, [signature]);
  return null;
}

function Group({ g, pageOf, reading }) {
  const bad = g.kind === "error" && g.rows.length > 0;
  return (
    <details style={L.group}>
      <summary style={L.head}>
        {g.n}. {g.label}
        <span style={bad ? L.bad : L.none}>{g.rows.length}</span>
        {reading ? <span style={L.none}>reading pieces…</span> : null}
      </summary>
      {g.rows.length ? (
        <ul style={L.list}>
          {g.rows.map((r, i) => {
            const page = pageOf.get(r.path);
            return (
              <li key={`${r.path}|${i}`} style={L.row}>
                {page ? <dc.Link link={page.$link} /> : <span>{r.name}</span>}
                {r.detail ? <span style={S.muted}> · {r.detail}</span> : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <div style={{ ...S.muted, margin: "2px 0 8px 14px" }}>Nothing to report.</div>
      )}
    </details>
  );
}

function LocationChecks() {
  const c = cfg();
  const all = dc.useQuery("@page");
  const party = usePartyLocation();
  const core = dc.useMemo(() => {
    try {
      return { loc: locations() };
    } catch (e) {
      console.error(e);
      return { loc: null, error: e };
    }
  }, [all]);
  const slugs = dc.useMemo(() => pieceSlugs(all.flatMap((p) => tagsOf(p)), c.piece_tag_prefix), [all]);
  const [read, setRead] = dc.useState({});
  const report = (slug, rows) => setRead((prev) => (JSON.stringify(prev[slug]) === JSON.stringify(rows) ? prev : { ...prev, [slug]: rows }));
  const results = dc.useMemo(() => (core.loc ? core.loc.checks() : []), [core]);
  const pageOf = dc.useMemo(() => new Map(all.map((p) => [p.$path, p])), [all]);

  if (!core.loc) return <div style={S.muted}>The location checks need the location core: {String(core.error?.message ?? "it could not be loaded")}</div>;

  const reading = slugs.some((s) => read[s] === undefined || read[s] === null);
  const pieceRows = slugs.flatMap((s) => read[s] ?? []);
  const groups = groupResults(core.loc.checkList, results, pieceRows);
  const errors = groups.filter((g) => g.kind === "error");
  const review = groups.filter((g) => g.kind === "review");
  const problems = errors.reduce((n, g) => n + g.rows.length, 0);
  const failing = errors.filter((g) => g.rows.length).length;

  return (
    <div style={L.wrap}>
      {slugs.map((s) => (
        <PieceReader key={s} slug={s} party={party} report={report} />
      ))}
      <div style={L.summary}>
        {problems ? (
          <span style={{ color: "var(--text-error)" }}>
            {problems} location {problems === 1 ? "problem" : "problems"} in {failing} {failing === 1 ? "check" : "checks"}
          </span>
        ) : (
          <span>No location problems</span>
        )}
        <span style={S.muted}> · {review.reduce((n, g) => n + g.rows.length, 0)} to review · core {core.loc.version}</span>
      </div>
      {errors.map((g) => (
        <Group key={g.id} g={g} pageOf={pageOf} reading={g.id === PIECE_CHECK && reading} />
      ))}
      <div style={{ ...S.muted, margin: "10px 0 2px" }}>For review, not mistakes</div>
      {review.map((g) => (
        <Group key={g.id} g={g} pageOf={pageOf} reading={false} />
      ))}
    </div>
  );
}

return { LocationChecks, groupResults, pieceSlugs };
```
