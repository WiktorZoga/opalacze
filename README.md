<p align="center">
  <img src="docs/hero.svg" alt="ROT BOT: we don't follow trends, we mutate them" width="100%">
</p>

<h3 align="center">Seven Grok Bot agents turn today's TikTok + X virals into brand-new content, on their own.</h3>

<p align="center">
  <img alt="built with @grok/agent-sdk" src="https://img.shields.io/badge/built%20with-%40grok%2Fagent--sdk%200.6-b6ff00?style=for-the-badge&labelColor=05060a">
  <a href="generations/gen-live-001/RUN.md"><img alt="live run" src="https://img.shields.io/badge/live%20run-grok--4.7%20%C2%B7%202%2C552%20events-ff2bd6?style=for-the-badge&labelColor=05060a"></a>
  <a href="https://wiktorzoga.github.io/opalacze/"><img alt="try it live" src="https://img.shields.io/badge/try%20it-live-b6ff00?style=for-the-badge&labelColor=05060a"></a>
</p>

<p align="center">
  <a href="docs/media/rotbot-demo-45s.mp4"><img src="docs/media/rotbot-hero.gif" alt="ROT BOT app: the agent swarm takes a viral trend from radar to published post" width="100%"></a>
</p>

<p align="center">
  <b><a href="docs/media/rotbot-demo-45s.mp4">▶ Watch the 45s demo</a></b> &nbsp;·&nbsp; <b><a href="https://wiktorzoga.github.io/opalacze/">🚀 Try it live</a></b>
</p>

## What it does

- 🔥 **Finds** real virals on TikTok and X (live xAI `x_search`).
- 🧬 **Extracts their viral DNA**: 8 genes per meme (hook, hero, humor, audio…).
- 🐊 **Breeds** two genomes into a new concept, and a 🐱 Critic rejects it until it's good.
- 🚀 **Renders, posts and learns**: Grok Imagine → TikTok / X → the fittest child parents the next generation.

```mermaid
flowchart LR
    T["🔥 TikTok + X<br/>virals"] -->|x_trends| S["🐦 Scout"]
    S --> G["🦫 Geneticist<br/>viral DNA"]
    G --> M["🐊 Mutator<br/>crossover"]
    M --> C{"🐱 Critic"}
    C -->|absolutely not| M
    C -->|ship it| R["🎬 Grok Imagine"]
    R --> P["🦜 Publisher<br/>✋ human approves"]
    P --> A["🦉 Analyst<br/>fitness"]
    A -->|next generation| S
    O(("🐙 Overlord")) -. delegates .-> S & G & M & C & P & A

    classDef hot fill:#ff2bd6,stroke:#ff2bd6,color:#05060a
    classDef acid fill:#b6ff00,stroke:#b6ff00,color:#05060a
    class T hot
    class O acid
```

## 🔴 Live run: real, not simulated

<table>
<tr>
<td width="30%" valign="top">
  <img src="generations/gen-live-001/media/krasnal-night-check.jpg" alt="Grok Imagine render: a bronze Wrocław dwarf creeping across night cobblestones, caption 'the smallest boss checks the bump'" width="100%">
</td>
<td valign="top">

**`grok-4.7` · 6 min · 7 subagent handoffs · 2,552 events.** Live X trend *"Hitting Vape to Investigate Night Sound"*
(683k views) × a Wrocław dwarf → *"the smallest boss checks the bump"*, rendered by Grok Imagine.

> 🐱 *"The hook is still the father's thumb on a statue that has none. First draft fails freshness, so this does not ship."*
>
> 🐱 *"The thumb is gone and the hook is the dwarf."*
>
> 🐙 *"Eight hundred bosses, one doorway, zero permission asked."*

📄 [RUN.md](generations/gen-live-001/RUN.md) · 🧾 [trace.ndjson](generations/gen-live-001/trace.ndjson) · 🌱 [agent commits](https://github.com/WiktorZoga/opalacze/compare/f16e5c1~1...e2af1f7)

</td>
</tr>
</table>

## Every agent commits as itself

The git history is the meme family tree: each artifact is committed by the agent that made it, and every crossover is a `git merge`.

| Gen | Parents | Child | Critic | Fitness |
| :---: | --- | --- | --- | :---: |
| [001](generations/gen-001/) | Scientists Reveal the Hi × Black Cat Clapping | **Scientists Reveal the Clap** | ❌ → ✅ | 0.48 |
| [002](generations/gen-002/) | Wrocław Krasnal *(brand)* × gen-001 | **Krasnal CEO** | ✅ | 0.63 |
| [003](generations/gen-003/) | Krasnal CEO × Why Would I Deceive You? | **Krasnal CEO: Series A** | ❌ → ✅ | **0.81** |
| [🔴 live](generations/gen-live-001/) | Wrocław Krasnal × Night Sound Vape *(live x_search)* | **Krasnal Night Check** | ❌ → ✅ | — |

<details>
<summary><b>🌳 See the git graph</b></summary>

```text
*   Mutator 🐊: crossover krasnal-ceo × why-would-i-deceive-you → krasnal-ceo-series-a
|\
| * Geneticist 🦫: sequence why-would-i-deceive-you genome
* | Geneticist 🦫: sequence krasnal-ceo genome
|/
* Scout 🐦: spot why-would-i-deceive-you for the krasnal-ceo bloodline
* Analyst 🦉: fitness krasnal-ceo = 0.63
  ...
*   Mutator 🐊: crossover krasnal-wroclaw × scientists-reveal-the-clap → krasnal-ceo
|\
| * Geneticist 🦫: sequence scientists-reveal-the-clap genome
* | Geneticist 🦫: sequence krasnal-wroclaw genome
|/
* Overlord 🐙: open gen-002: BRANDROT brief for Wrocław
  ...
* Critic 🐱: absolutely not (hero)
*   Mutator 🐊: crossover scientists-reveal-the-hi × black-cat-clapping → scientists-reveal-the-clap
|\
| * Geneticist 🦫: sequence black-cat-clapping genome
* | Geneticist 🦫: sequence scientists-reveal-the-hi genome
|/
* Scout 🐦: record run scout-2026-11-05: 10 real trends from TikTok + X
```

Reproduce: `git log --graph --format='%an: %s' -- generations/`. Real sources: [`generations/sources.json`](generations/sources.json).

</details>

<details>
<summary><b>🔍 Inside Grok Bot: playground and trace</b></summary>

<p align="center">
  <img src="docs/media/grokbot/grokbot-playground-live-run.gif" alt="Grok Bot playground: the Overlord delegating to subagents, 2x speed" width="90%"><br>
  <sub>Demo session at 2× speed. <a href="docs/media/grokbot/grokbot-playground-live-run-2x.mp4">▶ MP4 (60 s)</a></sub>
</p>

<table>
<tr>
<td width="50%" valign="top"><img src="docs/media/grokbot/01-playground-live-run-report.png" alt="Playground chat view of the gen-live-001 session" width="100%"><br><sub>🐙 Live run report: 7 handoff cards and the agent panel.</sub></td>
<td width="50%" valign="top"><img src="docs/media/grokbot/02-trace-overlord-to-scout-handoff.png" alt="Trace: Overlord hands off to Scout" width="100%"><br><sub>🐦 Overlord → Scout: 63 tool calls, live <code>x_trends</code> in 48.5 s.</sub></td>
</tr>
<tr>
<td width="50%" valign="top"><img src="docs/media/grokbot/03-trace-geneticist-mutator-handoffs.png" alt="Trace: Geneticist and Mutator handoffs" width="100%"><br><sub>🦫🐊 Geneticist → Mutator: sequence, then cross.</sub></td>
<td width="50%" valign="top"><img src="docs/media/grokbot/04-trace-critic-absolutely-not-then-reroll.png" alt="Trace: Critic rejects, Mutator rerolls" width="100%"><br><sub>🐱 "absolutely not", then the hook is rerolled.</sub></td>
</tr>
<tr>
<td width="50%" valign="top"><img src="docs/media/grokbot/05-tool-call-critic-commit-artifact.png" alt="Tool call: Critic commits its verdict with commit_artifact" width="100%"><br><sub>🐱 <code>commit_artifact</code>: the Critic commits its verdict.</sub></td>
<td width="50%" valign="top"><img src="docs/media/grokbot/06-tool-call-generate-media-grok-imagine.png" alt="Tool call: generate_media renders with Grok Imagine" width="100%"><br><sub>🐊 <code>generate_media</code>: Grok Imagine render.</sub></td>
</tr>
</table>

</details>

<details>
<summary><b>🎭 The cast: 7 agents</b></summary>

| | Agent | Job | Signature move |
| :---: | --- | --- | --- |
| 🐙 | [Overlord](agents/bot/instructions.md) | orchestrates the loop via `task` | eight arms, seven employees |
| 🐦 | [Scout](agents/bot/subagents/scout/instructions.md) | `x_trends`, picks parents by velocity | coos once per report |
| 🦫 | [Geneticist](agents/bot/subagents/geneticist/instructions.md) | 8-gene genomes, `save_genome` | finds the meme's soul gene |
| 🐊 | [Mutator](agents/bot/subagents/mutator/instructions.md) | crossover, mutations, git merge, `generate_media` | laughs in three syllables |
| 🐱 | [Critic](agents/bot/subagents/critic/instructions.md) | funny / fresh / loopable / brand-safe | *"absolutely not"* |
| 🦜 | [Publisher](agents/bot/subagents/publisher/instructions.md) | TikTok + X posts, `publish_post` (human approval) | squawks while waiting |
| 🦉 | [Analyst](agents/bot/subagents/analyst/instructions.md) | fitness from watch-through, shares, saves | one owl joke, never two |

</details>

<details>
<summary><b>🧩 Built on Grok Bot: project layout</b></summary>

[`agents/`](agents/) is a real [`@grok/agent-sdk`](https://cursor.com/docs/bdk) project (passes `agent-sdk validate`):

```text
agents/bot/
├── agent.ts, instructions.md     # 🐙 Overlord (grok-4.7)
├── subagents/                    # scout · geneticist · mutator · critic · publisher · analyst
├── tools/
│   ├── x_trends.ts               # xAI x_search
│   ├── save_genome.ts            # zod-validated viral DNA
│   ├── generate_media.ts         # Grok Imagine
│   ├── commit_artifact.ts        # git commit as the agent; crossover = merge
│   └── publish_post.ts           # X API, needsApproval
├── skills/brandrot.md            # brand mode
├── schedules/next-generation.md  # every 6 h
└── hooks/memory.ts               # remembers the bloodline
```

More: [`agents/README.md`](agents/README.md).

</details>

<details>
<summary><b>🧬 Viral DNA: a sample genome</b></summary>

[`generations/gen-003/mutation.json`](generations/gen-003/mutation.json), trimmed:

```json
{
  "id": "krasnal-ceo-series-a",
  "parents": ["krasnal-ceo", "why-would-i-deceive-you"],
  "genes": {
    "hook":        { "allele": "pitch slide: 'we are not a dwarf, we are a Small Language Model'", "dominance": 0.85 },
    "hero":        { "allele": "bronze krasnal CEO in a tiny fleece vest", "dominance": 0.95 },
    "humor":       { "allele": "deadpan irony: confident promise, guaranteed disappointment", "dominance": 0.95 },
    "catchphrase": { "allele": "Why would a dwarf deceive you?", "dominance": 0.9 },
    "structure":   { "allele": "pitch → catchphrase → black cat claps → loop", "dominance": 0.85 }
  },
  "mutations": [
    { "gene": "structure", "to": "… → black cat claps → loop", "reason": "Critic: 'it ends. memes must not end.'" }
  ]
}
```

</details>

<details>
<summary><b>📱 App screens</b></summary>

| Trend Radar | Breeding | Publish + Metrics |
| :---: | :---: | :---: |
| <img src="docs/media/rotbot-radar-sources.gif" alt="Trend Radar with real TikTok and X sources" width="100%"> | <img src="docs/media/rotbot-breeding-hatch.gif" alt="Two memes cross and a new meme hatches" width="100%"> | <img src="docs/media/rotbot-publish-metrics.gif" alt="Publisher queues posts, Analyst scores fitness" width="100%"> |

</details>

## 💼 BRANDROT: turn any brand into brainrot

Agencies need two weeks for one on-trend video; trends die in five days. BRANDROT makes the brand a seed genome that
survives every crossover and ships a new on-trend post every 6 hours, with a human approving each one.
Example: brief *Wrocław* → **Krasnal CEO**. [Pitch →](docs/pitch.md)

## Quickstart

```bash
cd agents && npm install && npx agent-sdk validate --dir .
export CURSOR_API_KEY=...  XAI_API_KEY=...
npx agent-sdk run --dir . --message "Breed the next generation."
npx agent-sdk dev                  # Grok Bot playground

npm install && npm run dev         # the app (repo root)
```

<sub>`gen-live-001` is a real end-to-end run; generations 001–003 are recorded agent runs over real, linked trends with projected metrics. Team: [TEAM.md](TEAM.md).</sub>
