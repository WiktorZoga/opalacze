# ROT BOT swarm (`@grok/agent-sdk`)

The Grok Bot project behind ROT BOT: one orchestrator (**Overlord** 🐙) and six subagents that breed memes.
Back to the [main README](../README.md).

## Agents

| Path | Agent | Model |
| --- | --- | --- |
| [`bot/agent.ts`](bot/agent.ts) + [`bot/instructions.md`](bot/instructions.md) | 🐙 Overlord, orchestrator | `grok-4.7`, `reasoning_effort=high` |
| [`bot/subagents/scout/`](bot/subagents/scout/) | 🐦 Scout | inherits |
| [`bot/subagents/geneticist/`](bot/subagents/geneticist/) | 🦫 Geneticist | inherits |
| [`bot/subagents/mutator/`](bot/subagents/mutator/) | 🐊 Mutator | inherits |
| [`bot/subagents/critic/`](bot/subagents/critic/) | 🐱 Critic | inherits |
| [`bot/subagents/publisher/`](bot/subagents/publisher/) | 🦜 Publisher | inherits |
| [`bot/subagents/analyst/`](bot/subagents/analyst/) | 🦉 Analyst | inherits |

The Overlord delegates with the built-in `task` tool. Subagents share the parent's tools.

## Tools

| Tool | Effect | What it does |
| --- | --- | --- |
| [`x_trends`](bot/tools/x_trends.ts) | read | xAI Responses API with `x_search`; replays the Scout's recorded run (`generations/sources.json`) without a key |
| [`save_genome`](bot/tools/save_genome.ts) | idempotent | validates a genome against the [zod schema](bot/lib/genome.ts) and files it under `generations/gen-NNN/` |
| [`generate_media`](bot/tools/generate_media.ts) | write | Grok Imagine image or 9:16 video, always with a reproducible `storyboard.json` |
| [`commit_artifact`](bot/tools/commit_artifact.ts) | write | commits as the agent ([cast](bot/lib/cast.ts)); `branch` = lineage, `mergeFrom` = crossover (`git merge --no-ff`) |
| [`publish_post`](bot/tools/publish_post.ts) | write, **needsApproval** | posts to X API v2; TikTok returns an upload package. A human approves every post |

Also: [`skills/brandrot.md`](bot/skills/brandrot.md) (brand mode), [`schedules/next-generation.md`](bot/schedules/next-generation.md)
(every 6 h), [`hooks/memory.ts`](bot/hooks/memory.ts) (turn journal), [`evals/smoke.eval.ts`](evals/smoke.eval.ts).

## Run it

```bash
npm install
npx agent-sdk validate --dir .
npx agent-sdk info --dir . --json
npx agent-sdk tool call x_trends --dir . --input '{"platform":"tiktok","limit":3}'

export CURSOR_API_KEY=...   # model turns
export XAI_API_KEY=...      # optional: live x_search + Grok Imagine
npx agent-sdk run --dir . --message "Breed the next generation."
npx agent-sdk dev           # playground
npx agent-sdk eval --dir .
```

| Env | Used by |
| --- | --- |
| `CURSOR_API_KEY` | every model turn |
| `XAI_API_KEY` | `x_trends` live mode, `generate_media` |
| `X_USER_ACCESS_TOKEN` | `publish_post` to X (otherwise the post is queued) |
| `ROTBOT_REPO` | where `generations/` lives (defaults to this checkout) |
