## NPC Folder Audit & Reorganization Recommendation

### Context for Continuing This Work

This document was produced through an extended conversation analyzing the `Characters/NPCs/` folder and related notes across the vault. The goal was to establish a principled approach to NPC note organization that balances atomicity with practicality.

**The core problem:** Many NPC-adjacent notes (status files, description files, "What X Knows" files, backstory fragments) were created as separate atomic notes following Zettelkasten-style advice, but they only serve a single parent NPC and are only ever accessed through that parent. This creates clutter, pollutes `#npc` tag queries, and spreads information across files that should be consolidated.

**The solution:** A tiered system where note complexity matches the NPC's campaign role, with a "three zoom levels" approach (always visible → collapsed callout → linked note) that respects how the DM actually reads and uses notes. Default-collapsed callouts (`> [!secret]-` and `> [!note]-`) serve as the middle tier for brief drill-down content.

**Key design decisions made during the conversation:**

- Obsidian callouts with `-` suffix (default collapsed) are the preferred way to hide detail in a single note, but only for relatively brief content without its own substructure
- Stat blocks are omitted from vault NPC notes if the NPC is unlikely to be in combat; combat stats live in Roll20
- The `#needs-work` tag is retained on all refactored notes until separately reviewed in a different process
- When merging, content is streamlined for scannability—narrative prose is condensed to bullet-friendly summaries focused on what helps run the game
- Lyren Willowwhisper's character was developed in depth during this conversation: her role as the face of the Echoforge's institutional will, the "warmth and steel" characterization, and five specific "oh wait" trigger scenarios tied to shard locations. See the Lyren note for the full design rationale in the Hidden Information section.
- The three-faction conflict (Echoforge right about goal/wrong about method, Malachite Cord right about danger/no alternative plan, Qalix wrong about everything) was clarified and informs NPC characterization.
- **Name change:** Aelora Willowwhisper was renamed to **Veyda Willowwhisper** during this process. The Lyren note and other references should use the new name. Older vault notes may still reference "Aelora" and need updating.

**What's been completed:** Phase 1 (all merges) is done. See the Execution Sequence below for current status and remaining tasks.

**To resume this work:** Start a new conversation, include this document in the project knowledge or paste it, and reference the specific phase/task you want to work on. The new NPC notes (Aethor, Lyren, Radelia, Dreyara) are already in the vault and serve as examples of the target format.

---

### Guiding Principles

1. **Atomic when shared, consolidated when owned.** If content belongs to one NPC and you only access it through that NPC, it goes in the NPC note. If multiple unrelated notes need to reference it independently, it earns its own file.
2. **Overview first, drill-down on demand.** The default view of any NPC should be a concise reference card. Depth lives in collapsed callouts (brief content) or linked notes (extended content with its own structure).
3. **Three zoom levels:** Always visible → collapsed callout → linked note.
4. **If it won't help you run a scene or plan NPC actions, it doesn't belong.**
5. **Notes should be short enough to *actually feel short* when opened.** Collapsible sections aren't reliable because Obsidian opens everything expanded.

---

### NPC Tiers

Not all NPCs need the same level of documentation. The tier determines how much structure a note gets.

#### Tier 1: Major NPCs (Hub + Subnotes)

Characters with multiple active storylines, complex hidden agendas, or extended content that serves genuinely different use cases (running a scene vs. planning behind-the-scenes moves vs. tracking a spy network).

**Current candidates:** Dreyara Drimvar, Vaud Qalix, Korfel Withrethin, Aveqtaro Thaan

**Structure:** A hub note (concise reference card) with links to purposeful subnotes. Each subnote should represent a different *use case*, not just a different topic.

#### Tier 2: Supporting NPCs (Single Comprehensive Note)

Characters the party interacts with regularly who have goals, secrets, and roleplay needs, but whose content fits comfortably in one note using collapsed callouts for deeper material.

**Current candidates:** Aethor Kalisk, Lyren Willowwhisper, Calderax Dunhall, Radelia Caphax, Varnes Dwell, Lady Emer, Eledyr Dephar, Veyda Willowwhisper, Brother Kelmen

**Structure:** Single note with Quick Reference always visible, roleplay always visible, and deeper content (background, hidden info, stats) in collapsed callouts.

#### Tier 3: Minor NPCs (Minimal Note or Table Row)

Characters who serve a functional role but don't need deep documentation. A shopkeeper, a guard captain, a one-scene informant.

**Structure:** Either a minimal note (Quick Reference + a few sentences) or a row in the Quick NPCs table. No subnotes, no elaborate templates.

---

### Audit of Existing NPC-Adjacent Notes

#### Notes to MERGE into their parent NPC note

| Note | Merge Into | Rationale |
|------|-----------|-----------|
| `Aethor Kalisk Status` | `Aethor Kalisk` | Single-owner. Status info belongs in Current Situation section. |
| `Aethor Kalisk Description` | `Aethor Kalisk` | Single-owner. A few sentences of appearance—belongs at top of note. |
| `Arcane Refraction Research` | `Aethor Kalisk` | Single-owner. Two paragraphs. Collapsed callout. |
| `Arcane Refraction Device` | `Aethor Kalisk` | Single-owner. Component list and description. Collapsed callout. |
| `Recruiting Aethor Kalisk` | `Aethor Kalisk` | Referenced from Aethor and Lyren, but deep backstory unlikely to reach the table. Condense to a brief collapsed callout in Aethor's note; replace the transclusion in Lyren's note with a 1-2 sentence summary and link to Aethor. |
| `Radelia Caphax Current Status` | `Radelia Caphax` | Single-owner. Same pattern as Aethor's status note. |
| `What Radelia Knows` | `Radelia Caphax` | The revealed/unrevealed checklist is useful but belongs as a collapsed callout within Radelia's note rather than a separate file. |
| `What Aveqtaro Thaan Knows` | `Aveqtaro Thaan` | Empty template with no content filled in. Delete the file; add a placeholder section in Aveqtaro's note if needed later. |
| `The Controversial Ascendancy of Lyren Willowwhisper` | `Lyren Willowwhisper` | Internal Echoforge politics are flavor, not gameplay-driving. Condense to a brief collapsed callout summarizing the key dynamic (Veyda endorsed Lyren, skeptics exist). |
| `Dreyara Drimvar's Background` | `Dreyara Drimvar` | Dreyara is Tier 1, but her background is a single narrative that doesn't represent a separate use case. Condense the key beats into a collapsed callout; cut the extended prose. |
| `Possible Connections Between Qalix and the Myriad in Port Damali` | `Vaud Qalix` or relevant faction note | Reads as a brainstorming transcript. Extract any actionable intelligence not already captured elsewhere; delete the rest. |

#### Notes to RELOCATE (not NPC notes, wrong folder)

| Note | Move To | Rationale |
|------|---------|-----------|
| `Aethor Kalisk's Workshop` | `Worlds/Exandria/` (appropriate location subfolder) | This is a location, not a character. |

#### Notes that are correctly atomic (keep as-is)

These follow the "atomic when shared" principle—referenced from multiple unrelated contexts:

- `The Massacre` (faction event, multi-reference)
- `The Capture of Melthes` (referenced by Hesterian, Cree, Assembly plots)
- `Port Damali Murders` (referenced by Hesterian, Korfel, Rylan Estevez)
- `Rylan Estevez Frame Job` (referenced by Korfel, Hesterian, justice subplot)
- `The Gentleman's Criminal Empire` (referenced by Korfel, Myriad, Hesterian plot)
- `Legacy of the Seekers` (faction history, multi-reference)
- `Luxon Beacon Integration with Lorestone` (referenced by multiple artifact/plot notes)

---

### Recommended NPC Note Template (Tier 2)

```markdown
---
tags:
  - npc
  - world/exandria
  - region/menagerie-coast
aliases: []
current_location: 
affiliations: []
---

# Quick Reference
> [!info] Essential Details
> - **Location:** 
> - **Goal:** 
> - **Attitude toward party:** 
> - **Key knowledge:** 

# Description & Roleplay
[Appearance in 2-3 sentences. Then:]
- **Voice:** 
- **Mannerisms:** 
- **Key traits:** 

# Current Situation
[What's happening with them RIGHT NOW. 
Update this as the campaign progresses.
This replaces the separate "Status" note.]

> [!secret]- Hidden Information
> [DM-only secrets, future plans, what they're hiding.
> Collapsed by default.]

> [!note]- Background
> [Condensed background — just what informs their behavior.
> If extended content exists, link to it here.
> Aim for <15 lines; anything longer probably needs its own note.]

> [!note]- Stats
> [Stat block if needed. Collapsed by default.
> Many NPCs won't need this at all.]

# Connected Elements
[Keep existing Dataview blocks — low-cost, useful for planning.]
```

#### Key differences from current template

- **No transclusions of single-owner atomic notes**—that content is now inline
- **Description and Roleplay combined** into one always-visible section
- **Current Situation is inline**, not a link to a separate status note
- **Hidden Information uses `> [!secret]-`** (collapsed by default)
- **Background is a collapsed callout** for brief content, or contains a link for extended content
- **No separate "Relationships" section**—relationships are implicit in Connected Elements and Current Situation

---

### Tagging Rules

**Going forward:**

- `#npc` = this note IS an individual NPC character
- Atomic notes about NPC-related topics use `#atomic` and/or content-specific tags, NOT `#npc`
- `#needs-work` is retained on all notes that currently have it, even after refactoring, until separately reviewed

---

### Execution Sequence

#### Phase 1: Merge and restructure individual NPCs

- [x] Consolidate all Aethor Kalisk satellite notes (`Status`, `Description`, `Arcane Refraction Research`, `Arcane Refraction Device`, `Recruiting Aethor Kalisk`) into a single Tier 2 note using the new template
- [x] Update Lyren Willowwhisper: merge `Controversial Ascendancy` into a collapsed callout; replace `Recruiting Aethor` transclusion with brief summary + link; develop character voice, roleplay cues, and "oh wait" trigger scenarios
- [x] Consolidate Radelia Caphax: merge `Current Status` and `What Radelia Knows` into the main note
- [x] Delete `What Aveqtaro Thaan Knows` (empty template, no content; main note unchanged)
- [x] Merge `Dreyara Drimvar's Background` into Dreyara's main note as a condensed collapsed callout; also merged actionable Myriad contact info from Qalix brainstorming note into a new collapsed callout on Dreyara's note
- [x] Delete `Possible Connections Between Qalix and the Myriad in Port Damali` (brainstorming transcript; actionable content moved to Dreyara)

**Files to delete after vault replacement:**

- [x] `Aethor Kalisk Status`
- [x] `Aethor Kalisk Description`
- [x] `Arcane Refraction Research`
- [x] `Arcane Refraction Device`
- [x] `Recruiting Aethor Kalisk`
- [x] `The Controversial Ascendancy of Lyren Willowwhisper`
- [x] `Radelia Caphax Current Status`
- [x] `What Radelia Knows`
- [x] `What Aveqtaro Thaan Knows`
- [x] `Dreyara Drimvar's Background`
- [x] `Possible Connections Between Qalix and the Myriad in Port Damali`

**Post-merge link updates needed:**

- [x] Update `Veyda Willowwhisper` (formerly `Aelora Willowwhisper`)—remove reference to `Controversial Ascendancy` note
- [x] Search vault for any remaining links to deleted files and redirect

#### Phase 2: Relocate misplaced notes

- [x] Move `Aethor Kalisk's Workshop` to appropriate location folder in `Worlds/Exandria/`

#### Phase 3: Link cleanup

- [x] After all merges and relocations: comprehensive search for broken links to deleted/merged notes

#### Phase 4: Tier 1 NPC restructuring

- [ ] Restructure `Aveqtaro Thaan` as a Tier 1 hub note with purposeful subnotes (complex multi-stage campaign role; significant existing content about Lorestone-Beacon integration and three-stage reveal)
- [ ] Evaluate other Tier 1 candidates (`Vaud Qalix`, `Korfel Withrethin`) for similar restructuring

#### Phase 5: Broader audit

- [ ] Scan full `Characters/NPCs/` folder for other notes that aren't individual NPCs
- [ ] Apply the same merge/relocate/keep principles
- [ ] Apply new template to remaining NPCs incrementally as time allows

---

### The "Should This Be a Separate Note?" Test

For future note creation:

1. **Will this content be referenced from 2+ unrelated contexts?** → Separate note
2. **Does this represent a different use case from the parent note?** (e.g., "running a scene" vs. "planning a heist") → Separate note
3. **Is it long enough to make the parent note feel like white noise?** (roughly >15 lines with its own internal headings) → Separate note
4. **Is it a location, item, event, or faction masquerading as an NPC note?** → Separate note in the correct folder

If none apply → it belongs in the parent note, possibly as a collapsed callout.
