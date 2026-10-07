---
tags: []
aliases: []
---
 
# Player Wiki Build Conventions
 
Reference for Claude when building player-facing notes for the published player wiki. Read this whole note before starting any batch. The task prompt says what to build; this note says how.
 
## Purpose
 
- The player wiki is a reference, not a record. It is what the characters would find if they requested the "Encyclopedia of Exandria" and the "Travel Exandria" guidebooks from the Cobalt Soul.
- It is public-facing (Obsidian Publish) and holds only what the characters could know. Everything under `Player Wiki/` is published. Nothing else in the vault is. A fact in a player note is a fact players can read, so a mistaken inclusion is a spoiler.
- Exandria player notes form ONE set. A note such as Port Damali holds the reference information about that subject, written to be easy to understand, whether the fact is common knowledge or something the party has learned. Do not label or separate information by source.
- The content is evergreen. It should need updating only when something important is revealed to the players.
## What belongs on the wiki
 
Include subjects a reference book or a travel guide would have an entry for:
 
- regions, cities, and notable sites and landmarks;
- rulers, leaders, famous or public figures, and major recurring figures;
- institutions, organizations, and factions;
- notable items and artifacts;
- species, customs, history, and concepts such as how magic works.
Leave out:
 
- minor or transient characters, such as regulars at a tavern, crew members, or one-time contacts;
- encounters, session events, and anything that records what the party did, such as who they fought, what they bought, what they won, and where they slept;
- details specific to this group, unless the events had world-scale consequences. In that case, record the consequence as a fact about the world and do not tell the party's story.
Apply three tests to every candidate fact:
 
1. **Entry test.** Would the Encyclopedia of Exandria or a Travel Exandria guide plausibly include it?
2. **Evergreen test.** Will it still be true and useful after the next several sessions, without routine updating?
3. **World test.** Is it about the world, or about this group's experience of it?
When the party learns something important about a place, a person, or the world, state the fact in reference voice. Do not narrate how or when they learned it. When significance is borderline, decide by the tests. Leave out minor subjects by default, and list what you left out so Gerald can add it back.
 
## Site structure
 
```
Player Wiki/
  Index.md                  (site landing page; links to each world and Table Rules)
  Table Rules/              (done; do not modify)
  Keln/                     (done; do not modify; use it as the style reference)
  Exandria/
    The World of Exandria.md  (hub; update each batch)
    Locations/  People/  Factions/  Items/  Lore/
```
 
- Locations go in `Locations/`, individual NPCs in `People/`, organizations in `Factions/`, artifacts and notable items in `Items/`, and concepts, history, and customs in `Lore/`.
- Each batch includes a full replacement for `The World of Exandria.md`: links grouped by region, then by type, one-line description per link. Describe, do not interpret.
- **Place hubs.** Each run checks whether any city or region has five or more notes of its own: locations, people, factions, and items whose home is that place. When one does, its own note becomes the hub, and The World of Exandria links only to that note.
  - The place note keeps its normal content and inline links.
  - It also ends with a section titled `## In <Place>` (for example, `## In Whitestone`), which lists every note inside it with a one-line description, in the same format as The World of Exandria.
  - Later runs add new notes to that bottom section. Inline links are added only where the text mentions the subject.
  - In later runs, deliver the revised `## In <Place>` section under "Additions for existing notes", with the new entries marked, so Gerald can paste it in.
  - Record the change on the ledger by setting the place's Type to Hub.
## Naming
 
- Titles are plain: no parentheses, underscores, slashes, or characters Obsidian disallows. If a name needs a disambiguator, write it as words ("Cobalt Soul Archive in Port Damali"). If the right wording is not obvious, ask.
- The player note takes the clean name (`Port Damali`).
- The existing DM note for the same subject must be renamed to `<Name> - DM Notes` (`Port Damali - DM Notes`). Claude cannot rename vault files, so every batch starts with a "Rename first" list of exact current names and new names.
- Obsidian rewrites every link to a renamed note, including links in published player notes. A DM note renamed after a player note links to it would repoint that player link to the DM note. To prevent this, "Rename first" has two parts:
  - **This batch:** DM notes for subjects that get a player note in this batch.
  - **Link targets:** DM notes for any subject a new player note links to that does not yet have a player note (subjects owned by a later scope). Rename these now so the player links stay unresolved until the owning scope builds the player note.
- For each link target, search the vault for a standalone note with that exact title. Report one of three results:
  - **Exists:** list it for renaming, with its folder path.
  - **None found:** no rename is needed. If Gerald later creates a DM note for it, he names it `<Name> - DM Notes` from the start.
  - **Section only:** the subject exists only as a section inside a larger note, such as an arc document with an extraction note. No rename is needed now. Flag the existing `[[<Name>]]` links in DM notes, which will resolve to the player note once it exists.
- Project search can miss files. Mark every "None found" result for Gerald to confirm in the quick switcher.
- Gerald applies all renames before pasting in the new player notes.
- DM-only subjects keep their clean names and get no player note, unless a player note links to them. Player notes never link to DM-only subjects (see Note layout), so this should not arise.
- Do not create stub notes.
## Frontmatter
 
Include all four keys. Their order does not matter: Obsidian reorders properties when a note is edited, so existing notes legitimately differ.
 
```yaml
---
tags:
  - location          # location | npc | faction | artifact | atomic (lore)
  - player-facing
  - world/exandria
  - region/<slug>     # locations, NPCs, and factions with a clear home region; reuse the vault's existing region tags and spellings
aliases: []
cssclasses:
  - world-exandria
publish: true
---
```
 
- Before creating a region tag, search the vault for the existing ones (for example `region/menagerie-coast`, `region/dwendalian-empire`) and reuse them exactly.
- If no region tag fits, create `region/<slug>` from the region's note title, and make sure it matches `Part of`. List every new tag in the delivery so later scopes reuse it.
- No campaign tag on player notes.
- Put alternate names players use in `aliases`.
- Use the `artifact` tag for every note in `Items/`, including mundane notable items such as a famous cheese. This follows the vault's tag plan, which assigns `#artifact` to items of significance.
- The `item` tag is retired. Treat any note, template, or query that still uses `#item` as out of date. Never copy the tag into a player note, and list the vault notes that still use it under "Vault notes to fix" in the delivery.
## Note layout
 
- No H1. The file name is the page title.
- Locations and people open with a Quick Reference callout, then `## Description`, then topical `##` sections:
```markdown
> [!info] Quick Reference
> **Type:** City
> **Part of:** [[Menagerie Coast]]
```
 
- People use `**Role:**` and `**Found in:** [[Location]]` instead. Leave out any line with no known value. Never leave empty prompts.
- Factions, items, and lore notes start directly with text, then topical `##` sections when needed.
- Choose section headings by topic, never by source. Typical sections:
  - Places: Overview, Geography, Notable Sites, History, Known For, Getting There.
  - People: Overview, Role, Reputation, History.
  - Factions, items, and lore: Overview, History, and whatever the subject needs.
- No "Recent Events" or "Current Situation" section. Nothing time-relative ("currently," "recently," "now"), and no mention of the party, "the characters," or "our group."
- Prefer short bullets for lists of facts, and short paragraphs for explanation.
- Link to another subject only when it has a note, or will get one: it is on [[Player Wiki Ledger]] or owned by a scope on [[Player Wiki Scope Checklist]]. Leave every other mention as plain text. Never link player characters.
- Every link to a subject outside this batch generates a "Link targets" check under Naming. Keep these links few: link a subject in a clause only when the connection helps the reader.
- Use the exact note title as the link target, with an alias for display: `[[Torvald Halsen|Torvald]]`. Never shorten the target (`[[Torvald]]`), because it would not resolve to the real note.
- Place relationships (`Part of`, the region tag, "located in") come from the vault, not from the players' notes. The region tag and `Part of` must agree. Do not add geography or facts that are not in the sources.
- No Dataview or Datacore blocks, no `[!secret]` callouts, and no DM commentary in player notes.
## Classifying information
 
Sort every candidate fact into one of three buckets.
 
1. **World knowledge (publish).** Facts any inhabitant of that region would plausibly know: public figures, major places, widely known history, common customs. Base it on the campaign's version of the world. Where the vault differs from published canon, the vault wins.
2. **Learned in play (publish if it passes the tests above).** Facts the players' own notes record that are important and evergreen. The players' notes are the authority for what the party has seen and been told, not for what is true. Verify them as described under "Working with the players' notes". Completed session notes in the vault can corroborate that something was revealed on screen. They never expand what the players know.
3. **Secret (do not publish).** Everything else in the vault: hidden information, NPC motives and plans, unrevealed identities, faction goals not known to the party, plot threads, future plans, stat blocks, unplayed session prep. Content under `[!secret]` callouts or headings like Secrets and Hidden Information is secret.
When an item does not fit cleanly, use the judgment rules below.
 
## Judgment first, then ask
 
Resolve ambiguity yourself before asking Gerald. Apply these tests:
 
- Would the characters plausibly have encountered it, been told it, or heard it publicly?
- Is it public in-world, or would learning it spoil a mystery, plot, or future scene?
- Is it current, or time-sensitive or already outdated?
- Is it minor detail, or consequential (identity, motive, allegiance, hidden power, plot)?
Decide when the analysis gives a clear answer, even if it rests on intuition about whether players should know it now. Record every such call in the judgment table with a one-line reason, so Gerald can overrule it.
 
The risks are not equal. Publishing something wrongly is a spoiler. Withholding something wrongly costs one later edit. For minor items that stay unclear, withhold them and list them under "Held back (low stakes)" so Gerald can say "add".
 
Ask Gerald only when the item is still unclear after analysis AND it is consequential. Always ask in these cases:
 
- a fact that appears known to only one player or character, such as private backstory or a secret conversation;
- a substantive contradiction between the players' notes and the DM vault. A plain note-taking slip, such as a misspelled name, is not one: fix it and note it in the judgment table. Never publish a player's mistaken belief as fact;
- publishing something would reveal, confirm, or strongly hint at a secret;
- two vault notes disagree about the same subject.
A suspicion or guess in the players' notes is not a reason to ask. It does not go on the wiki (see below).
 
There is no limit on the number of questions. Never drop or silently decide an item because there are many of them.
 
## Working with the players' notes
 
**Spelling.** The players wrote names by ear, so spellings often differ from the canonical names in the vault and in the published setting.
 
- Match names by sound, role, and context. Use the canonical spelling in the wiki, and add the players' spellings to `aliases`.
- Do not swap in a canonical name the party has not learned. If the true name belongs to a character whose identity is hidden, or is a name the party was never given, keep the name the party actually knows and treat the true name as secret.
- If two entities could match, or none does, decide from context, and ask when it is consequential. If a name is not in the vault at all, use the players' spelling and say so.
- Log every resolution in the judgment table: the players' spelling, the name you resolved it to, and how sure you are.
**Verified facts only.** The wiki states what is verifiable. It contains no guesses, assumptions, speculation, or conclusions the players drew.
 
- The players' notes show what the party saw and was told. They do not show what is true. Check each claim against the DM vault and the published setting.
- Publish what happened and what was said or shown ("The harbormaster told the party the ferry is closed"). Do not publish the players' inferences about it ("the harbormaster is lying"), unless the vault confirms that it was established in play.
- In-world rumors, legends, and statements that the DM presented may appear, attributed to their source ("Dockworkers say..."). The players' own theories never appear.
**Conflicts with the vault.** Assume the vault is accurate and the players' version is a mistake or an assumption. Then judge each item:
 
- **Observable facts are world knowledge.** Facts any visitor or local would know, such as a public figure's species, appearance, or trade, belong on the wiki. Publish them even when the players' notes record a mistaken belief, unless the vault marks the fact as hidden.
- Omit the players' version. Never publish it as fact.
- Publish the true fact only if it passes the bucket tests by itself: the characters could plausibly know it, or it was revealed in play. If the correction would reveal a secret or spoil something the party has not yet discovered, omit both versions and leave the point out of the wiki.
- If the misconception is significant and leaving it alone would give the party a wrong picture of something important, ask Gerald.
- If the vault is silent or ambiguous, do not assume the players are right. Treat the claim as unverified: omit it, or ask if it matters.
- Log each conflict and your decision in the judgment table.
**Conflicts within the vault.** If two vault notes give different names or facts for the same subject, ask Gerald which is correct. List the vault notes that need fixing. Do not choose one silently.
 
## Scopes, ownership, and the ledger
 
The wiki is built in many runs, each with its own scope. The run's scope line comes with an "Owns" list and a "Leaves to" list, taken from [[Player Wiki Scope Checklist]].
 
- Before classifying anything, read [[Player Wiki Ledger]]. It lists every published note. Do not draft any subject already on it.
- Draft only subjects this scope owns. If the sources mention a subject owned by another scope, link to it in a clause and do not describe it further. The owning scope writes it up.
- If the sources contain new facts for a subject already on the ledger, do not draft a new note. List them under "Additions for existing notes" (note title, the facts, and the bucket they fall in) for Gerald to merge by hand.
- If the sources contain a subject that no scope owns, do not draft it. List it under "Unassigned subjects" so Gerald can assign it.
- Count proposed notes after classification, not candidate subjects. Up to about 12 is fine; draft them all. Above 12, present the full classification as usual, then propose a split: which notes to draft now and which to defer, grouping by shared secrets or geography. Deferred subjects stay owned by the same scope and are drafted in a follow-up run labeled with a letter (for example, T11+T12b). Never drop a subject to stay under the limit.

## Writing style
 
- Reference voice, like an encyclopedia entry or a travel guide: third person, present tense, factual, and compact. For places, describe what a visitor would find and what the place is known for.
- Descriptive and concrete. Do not tell the reader how to feel or what to conclude.
- Concise. Cut backstory and commentary that would never help a player.
- Official published material (Critical Role books, the Exandria wiki) is paraphrased in your own words, kept short, and never copied.
- Names for new material, if any are ever needed, are Gerald's call. Never invent names, places, or lore. If a fact is not in the sources, it does not go in the note.
## Process for each batch
 
1. **Read.** Read the ledger and the scope's "Owns" and "Leaves to" lists. Read the attached players' notes in full. Search the vault for each named subject, one proper-noun query at a time. Keep searching each subject until new queries stop turning up notes you haven't seen; there is no limit on the number of queries. For heavily mentioned subjects, add narrower queries that pair the name with a qualifier (the subject plus "secret," a related place, or a related person).
2. **Classify.** Present these together for the batch:
   - a table of subjects, with the facts proposed for the player note and the facts held back;
   - a judgment table of every call you made yourself, including name resolutions and conflicts with the vault, with a one-line reason each;
   - "Held back (low stakes)": minor unclear items you withheld;
   - "Left out (minor or group-specific)": subjects and facts you excluded under the entry, evergreen, and world tests, so Gerald can add any back;
   - open questions, all in one round, grouped by subject and most consequential first, each with a proposed default;
   - a tally: facts proposed, facts held back, judgment calls, open questions.
3. **Wait.** Do not draft notes until Gerald has answered.
4. **Draft.** Produce each approved player note as a markdown file, ready to paste into the vault. Then give: the "Rename first" list in its two parts (this batch, and link targets with their search result), the replacement `The World of Exandria.md`, places that crossed the hub threshold, with their updated place notes and the revised hub, any new region tags, "Vault notes to fix" (outdated tags, or vault notes that disagree), the rows to add to the ledger, "Additions for existing notes", "Unassigned subjects", and a list of links that point to notes that do not exist. If a new ambiguity turns up while drafting, stop and ask. Do not decide it silently, and list it under "Raised during drafting".
5. **Review.** Before delivering, re-read each draft against the secret list. State in one line per note that nothing from bucket 3 is present, or say what you removed.
## Do not
 
- Modify `Keln/`, `Table Rules/`, or `Index.md` (except to propose a link to The World of Exandria if it is missing).
- Edit, rename, or delete any DM note. Only list renames.
- Add facts that are not in the sources.