# gen-live-001: a real live run

- **When:** 2026-11-05, 18:07:11 to 18:13:27 UTC (6 min 16 s, one Overlord turn)
- **Runtime:** `@grok/agent-sdk` 0.6.0, `agent-sdk serve --mode single`, Node 22
- **Model:** `grok-4.7` (`reasoning_effort=high`, `fast=true`) for the Overlord and all subagents
- **Session:** `ses_d5f4f26a62feab3e5ef4a180`. The full event stream from `GET /v1/session/:id/stream` is in [`trace.ndjson`](trace.ndjson): 2,552 events, including 7 `subagent.called` and 7 `subagent.completed` handoffs.

## What was real

| Step | Agent | Real? | Evidence |
|---|---|---|---|
| Trend hunt | Scout 🐦 | **live**: xAI `x_search` via `x_trends` (`mode: "live"`) | `trend.json` |
| Sequencing | Geneticist 🦫 | **live** model output, validated by `save_genome` | `parents/*/genome.json` |
| Crossover | Mutator 🐊 | **live** | `mutation.json` |
| Critique | Critic 🐱 | **live**. Round 1 was "absolutely not" (fresh 7, reroll the hook). Round 2 was "fine. ship it." | `critique.json` |
| Reroll | Mutator 🐊 | **live**. The hook gene was rerolled. | `mutation.json` (second commit) |
| Media | Mutator 🐊 | **live**: `grok-imagine-image-2.0` | `media/krasnal-night-check.jpg`, `media/storyboard.json` |
| Publish / analytics | — | **skipped** for this run | — |

Each artifact was committed by the `commit_artifact` tool under its agent's git author.
The model chose when to commit. No human edits were made to the artifacts.

## Result

- **Trend:** "Hitting Vape to Investigate Night Sound" (X, 683k views, velocity 3.4)
- **Parents:** `bronze-krasnal` (brand seed, mother) × `midnight-vape-sound-check` (father)
- **Child:** `krasnal-night-check`. A bronze dwarf freezes mid-step at a night bump, then creeps toward the doorway. The caption reads *"the smallest boss checks the bump"*.
- **Overlord:** *"Eight hundred bosses, one doorway, zero permission asked."*

The prompt is in the first `message.received` event of the trace. Operator setup: `ROTBOT_GEN_DIR=gen-live-001`, `ROTBOT_IMAGE_MODEL=grok-imagine-image-2.0`.
