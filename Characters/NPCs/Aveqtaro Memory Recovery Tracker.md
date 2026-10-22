---
tags:
  - atomic
  - campaign/eryndor
  - needs-work
---

## Aveqtaro Memory Recovery Tracker

Subnote of [[Aveqtaro Thaan]]: how her memories of [[Cadariel Ordo]] surface, what moves them, and what happens if the party doesn't engage. DM only. What she knows at each stage lives in [[What Aveqtaro Thaan Knows]].

**To update:** add a line to History; the hub at the top recomputes from it. Stage definitions are at the bottom, folded; the hub reads them.

## Now

```datacorejsx
const { TrackHub } = await dc.require(dc.headerLink("00 DM Screen/Code/Progress Tracks.md", "Code"));
return function Now() {
  return <TrackHub tracks={{ A: "Technical", B: "Personal" }} knows="What Aveqtaro Thaan Knows" riskLabel="Qalix risk" knowsLabel="What she can tell them" />;
};
```

## History

<!-- Append-only, newest last. - **date** · code · what happened · trigger · session link
Codes: A0–A3, B0–B3 (stage reached), phase <name>, risk <level>, note. -->

- **Before the campaign** · A0 · Her instruments and book-buying leave traces in the Empire.
- **Before the campaign** · B0 · Pulling away from her den for two to three years; her family has noticed.
- **27 Thunsheer 835** · risk low · Dreyara is dead and no one in her network has noticed Aveqtaro. See [[Qalix's Network]].

## Open Questions

- [ ] Specific triggers for each stage (3–4 per stage, a mix of party-driven and ambient)
- [ ] Confirm which stage unlocks each fact in [[What Aveqtaro Thaan Knows]]
- [ ] How Track B stages show at the table (what the DM describes or plays)
- [ ] The specific convergence choice: what she does, and what the party must decide
- [ ] Can stages be skipped under dramatic circumstances, or is the sequence strict?
- [ ] Does artifact proximity ever trigger Track B, or is that only emotional/relational?
- [ ] How Qalix's people could first notice her. Decide alongside Qalix's response in [[Qalix's Network]].
- [ ] When the Awareness phase starts (add a `phase Awareness` line to History when it does)

## Reference

> [!info]- Pacing and level targets
> - **Awareness** (levels 9–10, party in the Empire): they hear of her, see her work, or find her name. Two redundant trails; lay both and let the party choose.
>   - **Rexxentrum:** [[Archivist Ovedo]] owns an unusually fine instrument or reference from a Xhorhasian artisan and may mention the maker.
>   - **Zadash:** the black-market book trade mentions a Xhorhasian client with odd tastes in pre-Calamity texts. The trail runs back to the supply chain of Tazriin Velko, her book dealer in Rosohna (a goblin whose cover is a paper and ink shop serving the administrative district).
> - **Contact** (levels 11–13): the party reaches Xhorhas, or she has reason to travel. Both tracks can begin.
> - **Investment** (levels 13–17): deep engagement with both tracks.
> - **Convergence:** about levels 15–16 with full engagement, 17–18 with partial. It should land before or during the Qalix confrontation (about level 18), so the party carries the choice it forces into that fight.

> [!info]- Trigger types
> Each stage lists several possible triggers; pick whichever fits the session. Working assumption: artifacts and places move Track A; trust and feeling move Track B.
>
> | Type | Description | Examples |
> |---|---|---|
> | **Artifact proximity** | Near a Lorestone shard or Luxon Beacon | The party shows her the Beacon; she handles a shard |
> | **Resonant location** | Somewhere tied to Cadariel's life or work | Pre-Calamity ruins, a ley line nexus, an old observatory |
> | **Emotional catalyst** | Vulnerability, trust, or intense feeling | A genuine conversation; witnessing something beautiful or terrible; danger |
> | **Scholarly encounter** | Pre-Calamity knowledge or cartography | Old maps, Age of Arcanum texts, a scholar of that era |
> | **Party-driven action** | The party deliberately helps her understand | Researching her condition, consulting experts, asking the right questions |

> [!info]- What happens without the party
> **The Qalix threat:** [[Dreyara Drimvar - DM Notes|Dreyara]], who would have found her, is dead (25 Thunsheer 835). Her network runs on without her, and Qalix's response is undecided (see [[Qalix's Network]]). The danger now comes from whoever takes over her work, and from the network's people in Zadash and Rexxentrum, where both trails to Aveqtaro run. The longer she stays an anomaly (an artisan with inexplicable knowledge, buying forbidden books, pulling away from her den), the likelier she is to appear on their radar. The [[Obsidian Echoforge - DM Notes|Obsidian Echoforge]] is a second risk: when they learn of her, they will mistake her for Eryndor reborn.
>
> | Party investment | Likely convergence | Qalix risk |
> |---|---|---|
> | Full engagement | Levels 15–16 | Low: the party finds her first, builds trust, protects her |
> | Partial engagement | Levels 17–18 | Medium: they know her but haven't unlocked everything; Qalix's people may approach her on their own |
> | Neglect | Never | High: Qalix's people find her and manipulate or capture her. The party loses the Dynasty bridge and faces the rift-closing endgame without her knowledge |

## Stages

The data the hub reads. Each card: a one-line gist (shown on the track card), the level target, what changes in her, how she acts, what moves her into the stage (A0 and B0: how the party finds her), and what happens if the party leaves her alone at that stage. Stages within a track are sequential; the tracks are independent. Triggers are type-level drafts; specific ones are an open question.

### Track A: Technical (Cadariel's knowledge)

> [!abstract]- A0 · Residue
> **Gist:** Not met yet. Her work leaves traces in the Empire.
> **Level:** Awareness (9–10)
> **What changes:** Nothing in her yet. Her work shows knowledge she shouldn't have.
> **How she shows up:** The party hasn't met her. They meet traces without understanding them: an instrument with unusual properties, a reference in [[Archivist Ovedo]]'s notes, a name in a trade ledger.
> **Breadcrumbs:**
> - Rexxentrum: Ovedo owns an unusually fine instrument from a Xhorhasian artisan and may mention the maker.
> - Zadash: the black-market book trade mentions a Xhorhasian client with odd tastes in pre-Calamity texts.
> **If the party ignores her:** Her decline continues: the faith crisis deepens, her work suffers, her den ties fray. She doesn't find the truth on her own, and her habits eventually draw the attention of people who are looking.

> [!abstract]- A1 · Instinct
> **Gist:** Knows things she can't explain; calls it good instincts.
> **Level:** Contact (11–13)
> **What changes:** She knows things she can't explain.
> **How she acts:** Solves problems with methods no one taught her: spatial intuitions, geometric insights beyond her training. Calls it "good instincts." Asked about it, she gets uncomfortable and can't say what's happening.
> **Triggers (party):**
> - First contact: the party sees her work up close.
> - Scholarly encounter: the party brings her a measurement or mapping problem.
> **Triggers (ambient):**
> - Already present at a low level; contact makes it visible.
> **If the party ignores her:** Track A can still creep forward through ambient triggers. She becomes a source of partial, unreliable insight.

> [!abstract]- A2 · Fragments
> **Gist:** Knowledge surfaces unbidden near artifacts and rifts.
> **Level:** Investment (13–17)
> **What changes:** Specific technical knowledge surfaces involuntarily.
> **How she acts:** Sketches diagrams she doesn't recognize, uses terms from languages she doesn't know, understands how something works without being told. She can no longer deny something is happening, but can't control it.
> **Triggers (party):**
> - Artifact proximity: they show her the Beacon, or she handles a Lorestone shard.
> - Resonant location: pre-Calamity ruins, a ley line nexus, an old observatory.
> **Triggers (ambient):**
> - Rift phenomena she meets on her own; work that brings her near artifacts.
> **If the party ignores her:** Ambient triggers can carry her here slowly. What surfaces is fragmentary, and without trust she won't share it.

> [!abstract]- A3 · Comprehension
> **Gist:** Reaches Cadariel's knowledge at will; doesn't know why she can.
> **Level:** Investment (13–17)
> **What changes:** She can reach Cadariel's technical knowledge deliberately.
> **How she acts:** Explains instead of intuiting. She doesn't yet understand *why* she knows this or what it says about who she is.
> **Triggers (party):**
> - Party-driven action: researching her condition, consulting experts, asking the right questions.
> - Scholarly encounter: old maps, Age of Arcanum texts, a scholar of that era.
> **Triggers (ambient):**
> - Unlikely without the party.
> **If the party ignores her:** She stalls at A2.

### Track B: Personal (Cadariel's identity)

> [!abstract]- B0 · Rumors
> **Gist:** Not met yet. Gossip about a drow artisan acting strangely.
> **Level:** Awareness (9–10)
> **What changes:** Nothing in her yet.
> **How she shows up:** Someone mentions a drow artisan in Rosohna who's been acting strangely: withdrawing from her den, buying forbidden texts, saying odd things. Ambient flavor that may not register until later.
> **If the party ignores her:** As A0.

> [!abstract]- B1 · Unease
> **Gist:** Knows something is wrong; blames stress.
> **Level:** Contact (11–13)
> **What changes:** She knows something is wrong and treats it as a personal failing.
> **How she acts:** The dreams are getting worse and the distance from her den is growing. Privately frightened; presents it as stress or overwork. The party sees the surface, not the cause.
> **Triggers (party):**
> - First contact, then trust-building: a genuine conversation.
> **Triggers (ambient):**
> - Already present; contact makes it visible.
> **If the party ignores her:** Track B stalls here. Personal memories need emotional safety to surface, and she won't have it without trust.

> [!abstract]- B2 · Echoes
> **Gist:** Feels Cadariel's emotions; asks who she is remembering.
> **Level:** Investment (13–17)
> **What changes:** She feels Cadariel's emotions and relational memories.
> **How she acts:** Not facts, feelings: a sudden grief at ruins, warmth toward a stranger that makes no sense, a sense of having lost someone important. The question shifts from "what's wrong with me" to "who am I remembering."
> **Triggers (party):**
> - Emotional catalyst: vulnerability, trust, intense feeling; witnessing something beautiful or terrible; danger.
> - Resonant location visited with the party.
> **Triggers (ambient):**
> - None. Track B does not move without trust.
> **If the party ignores her:** Stalls at B1.

> [!abstract]- B3 · Integration
> **Gist:** Accepts she carries another life; can talk about Cadariel.
> **Level:** Investment (13–17); convergence about 15–18
> **What changes:** She accepts that she carries another life within her.
> **How she acts:** Tells Aveqtaro's feelings from Cadariel's. She is both herself and someone who came before; it expands her identity rather than erasing it. She can talk about Cadariel clearly.
> **Triggers (party):**
> - Party-driven action: the party deliberately helps her understand.
> - Emotional catalyst at depth.
> **Triggers (ambient):**
> - None.
> **If the party ignores her:** Stalls at B2.

### Convergence

> [!abstract]- Convergence (A3 and B3)
> **What it unlocks:** full understanding of who she was, what Cadariel knew, and why it matters now. She can explain the dual-artifact theory from personal understanding, and speak to the Kryn Dynasty with authority because she *was there*.
>
> **The DM choice moment:** convergence lets her take an action that forces the party to decide something. Possibilities, to detail later:
> - She offers to go to the Dynasty on their behalf, but only if they trust her with the Beacon.
> - She reveals the party's Beacon may be one of the specialized ones Cadariel identified, which makes it irreplaceable, not just sacred.
> - She names a place where the rift-closing ritual *must* happen, and it is politically or physically dangerous.
> - She tells them something about Qalix or the rifts that changes what they think they're walking into.
>
> Every option should be viable and each should cost something different.

## Source

Structural overview drafted in the April 2026 Aveqtaro design session; pacing and the two Awareness trails decided in the same session. Qalix-threat section revised 22 October 2026 after Dreyara's death. Rebuilt as a hub 22 October 2026: stage cards, History, and the hub view ([[Progress Tracks]]).

## Connected Elements

![[Related Notes.base]]
