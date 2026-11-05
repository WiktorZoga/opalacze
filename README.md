<p align="center">
  <img src="docs/hero.svg" alt="Riptide: the AI ad agency that rides virals. Run by a Grok Bot swarm." width="100%">
</p>

<h3 align="center">Riptide: the AI ad agency that rides virals. Run by a Grok Bot swarm.</h3>

<p align="center">
  <img alt="built with @grok/agent-sdk" src="https://img.shields.io/badge/built%20with-%40grok%2Fagent--sdk%200.6-2dd4bf?style=for-the-badge&labelColor=04121f">
  <a href="#proof-its-real"><img alt="2 live runs" src="https://img.shields.io/badge/live%20runs-2%20%C2%B7%20grok--4.7-38bdf8?style=for-the-badge&labelColor=04121f"></a>
  <a href="https://wiktorzoga.github.io/opalacze/"><img alt="try it live" src="https://img.shields.io/badge/try%20it-live-2dd4bf?style=for-the-badge&labelColor=04121f"></a>
</p>

<p align="center">
  <a href="docs/media/rotbot-demo-45s.mp4"><img src="docs/media/rotbot-hero.gif" alt="Riptide: a brand brief becomes trend-native UGC ads" width="100%"></a>
</p>

<p align="center">
  <b><a href="docs/media/rotbot-demo-45s.mp4">▶ 45s demo</a></b>
  &nbsp;·&nbsp;
  <b><a href="https://wiktorzoga.github.io/opalacze/">Try it live</a></b>
</p>

## The ads it made

<table>
<tr>
<td align="center" width="20%"><img src="docs/media/ugc/noir05-deceive-live.gif" alt="Ren Hale, NOIR/05, UGC, live run" width="100%"><br><sub><b>live</b> · Ren Hale · NOIR/05</sub></td>
<td align="center" width="20%"><img src="docs/media/ugc/noir05-unboxing.gif" alt="Maja unboxes NOIR/05" width="100%"><br><sub>Maja · NOIR/05 · UGC</sub></td>
<td align="center" width="20%"><img src="docs/media/ugc/noir05-grwm.gif" alt="Maja get ready with me, NOIR/05" width="100%"><br><sub>Maja · NOIR/05 · UGC</sub></td>
<td align="center" width="20%"><img src="docs/media/ugc/noir05-mirror-check.gif" alt="Maja mirror check, NOIR/05" width="100%"><br><sub>Maja · NOIR/05 · UGC</sub></td>
<td align="center" width="20%"><img src="docs/media/ugc/noir05-tram-sniff.gif" alt="Maja on a tram, NOIR/05" width="100%"><br><sub>Maja · NOIR/05 · UGC</sub></td>
</tr>
<tr>
<td align="center"><img src="docs/media/ugc/noir05-cafe-unbox.gif" alt="Maja unboxes NOIR/05 at a cafe" width="100%"><br><sub>Maja · NOIR/05 · UGC</sub></td>
<td align="center"><img src="docs/media/ugc/stride-sneaker-drop.gif" alt="Leo unboxes STRIDE sneakers" width="100%"><br><sub>Leo · STRIDE · UGC</sub></td>
<td align="center"><img src="docs/media/ugc/cafe-first-time-fancy-notext.gif" alt="Kuba at a fancy cafe, no caption" width="100%"><br><sub>Kuba · café · UGC</sub></td>
<td align="center"><img src="docs/media/ugc/noir05-brainrot-capybara.gif" alt="Capybara with NOIR/05, brainrot" width="100%"><br><sub>Capybara · NOIR/05 · Brainrot</sub></td>
<td align="center"><img src="docs/media/ugc/noir05-pigeon-pitch.gif" alt="Pigeon pitches NOIR/05, brainrot" width="100%"><br><sub>Pigeon · NOIR/05 · Brainrot</sub></td>
</tr>
</table>

## How it works

**One [Overlord](agents/bot/instructions.md) on `grok-4.7` delegates to six subagents. Every handoff is a real SDK `task` event in the [trace](generations/gen-live-002/trace.ndjson).**

<table>
<tr align="center">
<td width="16%">🐦<br><b><a href="agents/bot/subagents/scout/instructions.md">Scout</a></b><br><sub>picks the rising trend</sub><br><code>x_trends</code></td>
<td width="16%">🦫<br><b><a href="agents/bot/subagents/geneticist/instructions.md">Geneticist</a></b><br><sub>writes the trend DNA</sub><br><code>save_genome</code></td>
<td width="16%">🐊<br><b><a href="agents/bot/subagents/mutator/instructions.md">Creator</a></b><br><sub>renders the 9:16 ad</sub><br><code>generate_media</code></td>
<td width="16%">🐱<br><b><a href="agents/bot/subagents/critic/instructions.md">Critic</a></b><br><sub>blocks a bad disclosure</sub><br><code>commit_artifact</code></td>
<td width="16%">🦜<br><b><a href="agents/bot/subagents/publisher/instructions.md">Publisher</a></b><br><sub>queues TikTok and X</sub><br><code>commit_artifact</code></td>
<td width="16%">🦉<br><b><a href="agents/bot/subagents/analyst/instructions.md">Analyst</a></b><br><sub>scores the next variant</sub><br><code>commit_artifact</code></td>
</tr>
</table>

Each one commits the file it just made, under its own git name. Open [`agents/`](agents/) or the [live trace](generations/gen-live-002/trace.ndjson).

```mermaid
flowchart LR
    O(("Overlord<br/>grok-4.7")) -->|task| S["Scout<br/>x_trends"]
    O -->|task| G["Geneticist<br/>save_genome"]
    O -->|task| C["Creator<br/>generate_media"]
    O -->|task| K["Critic"]
    O -->|task| P["Publisher"]
    O -->|task| A["Analyst"]
    S --> G --> C --> K --> P --> A
```

## Proof it's real

<table>
<tr>
<td width="50%" valign="top">

<a href="generations/gen-live-002/media/noir-05-deceive.mp4"><img src="docs/live-002-poster.jpg" alt="Live run: Ren Hale holds the NOIR/05 bottle" width="46%"></a>

**gen-live-002** · NOIR/05 brief

`grok-4.7` · **7 min** · **5 handoffs** · **4,167 events**

> "All four scores clear 8, so I'm committing the approval."

[RUN.md](generations/gen-live-002/RUN.md) · [trace.ndjson](generations/gen-live-002/trace.ndjson) · [agent commits](https://github.com/WiktorZoga/opalacze/compare/2d31370~1...93a7265)

</td>
<td width="50%" valign="top">

<img src="generations/gen-live-001/media/krasnal-night-check.jpg" alt="Live run: a bronze dwarf on night cobblestones" width="46%">

**gen-live-001** · first R&D run

`grok-4.7` · **6 min** · **7 handoffs** · **2,552 events**

> "The thumb is gone and the hook is the dwarf."

[RUN.md](generations/gen-live-001/RUN.md) · [trace.ndjson](generations/gen-live-001/trace.ndjson) · [agent commits](https://github.com/WiktorZoga/opalacze/compare/f16e5c1~1...e2af1f7)

</td>
</tr>
</table>

**Under the hood.** A judge can check each of these in about 30 seconds.

- [`agents/`](agents/) is a real `@grok/agent-sdk` project. `npx agent-sdk validate --dir agents` passes.
- [`trace.ndjson`](generations/gen-live-002/trace.ndjson) is the raw SDK stream: `subagent.called`, `subagent.completed`, and every tool call.
- Commits are authored by Scout, Geneticist, Creator and Critic. [See the authors.](https://github.com/WiktorZoga/opalacze/commits/main)
- The clip and the stills come from `grok-imagine`, not a stock folder.
- The playground, mid-run: [docs/media/grokbot/](docs/media/grokbot/).


<details>
<summary><b>📋 What each step does · tones · integrations</b></summary>

- 📝 **Brief in:** brand, product, audience, goal, tone. The **Scout** finds rising TikTok / X trends and scores brand fit ("87% fit").
- 🧬 **Trend DNA:** the **Geneticist** extracts hook, format, pacing, audio and caption style, plus where the product fits in.
- 🎬 **UGC variants:** the **Creator** picks an AI creator persona, writes the script and renders 9:16 A/B variants with Grok Imagine.
- ✅ **Ship & learn:** the **Critic** checks trend fidelity, brand safety, claims and the `#ad · AI-generated` disclosure; the **Publisher** schedules; the **Analyst** reads hook rate, watch time and CTR to steer the next variant.

**Tones:** UGC · Polished ad · Brainrot

**The app:** a Briefs inbox, and per brief three views: **Campaign** (the swarm working the brief live), **Creative** (the A/B variants per tone) and **History** (the R&D lineage).

**Integrations.** Live: Grok Bot (`@grok/agent-sdk`), xAI Grok Imagine (image + video), xAI X search.
Roadmap: Higgsfield (AI video / UGC avatars), TikTok Creative Center, Meta + TikTok Ads APIs, ElevenLabs voice.

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
<summary><b>🧩 The swarm</b>: 7 Grok Bot agents</summary>

| Agent | Job |
| --- | --- |
| [Overlord](agents/bot/instructions.md) | turns the brief into a campaign and delegates every step via `task` |
| [Scout](agents/bot/subagents/scout/instructions.md) | rising trends on TikTok / X (`x_trends`) + brand-fit score |
| [Geneticist](agents/bot/subagents/geneticist/instructions.md) | trend DNA + product insertion point (`save_genome`) |
| [Creator](agents/bot/subagents/mutator/instructions.md) | AI UGC persona, script, 9:16 A/B variants (`generate_media`) |
| [Critic](agents/bot/subagents/critic/instructions.md) | trend fidelity, brand safety, claims, `#ad · AI-generated` disclosure |
| [Publisher](agents/bot/subagents/publisher/instructions.md) | schedules to TikTok / X / Reels; `publish_post` needs human approval |
| [Analyst](agents/bot/subagents/analyst/instructions.md) | hook rate, watch time, CTR → the next variant |

Every artifact is committed to git by the agent that made it (`commit_artifact`), so the history is the audit trail.

</details>

<details>
<summary><b>🗂️ Built on Grok Bot: project layout</b></summary>

[`agents/`](agents/) is a real [`@grok/agent-sdk`](https://cursor.com/docs/bdk) project (passes `agent-sdk validate`):

```text
agents/bot/
├── agent.ts, instructions.md     # Overlord (grok-4.7)
├── subagents/                    # scout · geneticist · mutator (Creator) · critic · publisher · analyst
├── tools/
│   ├── x_trends.ts               # xAI x_search
│   ├── save_genome.ts            # zod-validated viral DNA
│   ├── generate_media.ts         # Grok Imagine
│   ├── commit_artifact.ts        # git commit as the agent; crossover = merge
│   └── publish_post.ts           # X API, needsApproval
├── skills/brandrot.md            # Brainrot tone
├── schedules/next-generation.md  # every 6 h
└── hooks/memory.ts               # remembers the bloodline
```

More: [`agents/README.md`](agents/README.md).

</details>


<details>
<summary><b>🧪 R&D history</b>: how the swarm learned to read trend DNA (meme family tree)</summary>

Before Riptide, the swarm (R&D codename ROT BOT) bred memes from real virals of the week ([`generations/sources.json`](generations/sources.json)).
Each crossover is a `git merge`; the Critic's rejections are commits.

| Gen | Parents | Child | Critic | Fitness |
| :---: | --- | --- | --- | :---: |
| [001](generations/gen-001/) | Scientists Reveal the Hi × Black Cat Clapping | Scientists Reveal the Clap | ❌ → ✅ | 0.48 |
| [002](generations/gen-002/) | Wrocław Krasnal *(brand)* × gen-001 | Krasnal CEO | ✅ | 0.63 |
| [003](generations/gen-003/) | Krasnal CEO × Why Would I Deceive You? | Krasnal CEO: Series A | ❌ → ✅ | 0.81 |
| [live-001](generations/gen-live-001/) | brand mascot × live X trend | Krasnal Night Check | ❌ → ✅ | — |

**Sample genome** · [`generations/gen-003/mutation.json`](generations/gen-003/mutation.json), trimmed:

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

**Git graph**

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
<summary><b>⚡ Quickstart</b></summary>

```bash
cd agents && npm install && npx agent-sdk validate --dir .
export CURSOR_API_KEY=...  XAI_API_KEY=...
npx agent-sdk run --dir . --message "Brief: NOIR/05 eau de parfum, women 18-30, TikTok, tone UGC. Ship 2 variants."
npx agent-sdk dev                  # Grok Bot playground

npm install && npm run dev         # Riptide: Briefs inbox → Campaign / Creative / History
```

</details>


<sub>Riptide is run by a Grok Bot swarm. ROT BOT is the R&amp;D codename in older commits. Live runs are real; generations 001–003 are recorded runs over real trends; ad metrics are simulated. Creators are AI personas. [Team](TEAM.md) · [Presentation brief](docs/presentation-brief.md)</sub>
