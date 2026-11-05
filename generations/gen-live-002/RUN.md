# gen-live-002: a real live run, ROT Studio UGC campaign

- **When:** 2026-11-05, 18:52:44 to 18:59:57 UTC (7 min 13 s, one Overlord turn)
- **Runtime:** `@grok/agent-sdk` 0.6.0, `agent-sdk serve --mode single`, Node 22
- **Model:** `grok-4.7` (`reasoning_effort=high`, `fast=true`) for the Overlord and all subagents
- **Session:** `ses_a50f0e17cca3285abcc1361e`. The full event stream is in [`trace.ndjson`](trace.ndjson): 4,167 events, including 5 `subagent.called` and 5 `subagent.completed` handoffs (scout, geneticist, mutator as Creator, critic, mutator for the render).
- **Brief:** NOIR/05 eau de parfum (a fictional brand). Audience Gen-Z on TikTok and X. Goal: launch awareness. Tone: UGC. See [`brief.json`](brief.json).

## What was real

| Step | Agent | Real? | Evidence |
|---|---|---|---|
| Brief | Overlord 🐙 | **live** | `brief.json` |
| Trend pick + brand fit (84%) | Scout 🐦 | **live** model. The `x_trends` tool ran, but live X search returned nothing usable, so it fell back to `mode: "recorded"`: the Scout's saved snapshot of real trends in `generations/sources.json` (captured 2026-11-05). | `trend.json` |
| Trend DNA + insertion point (4.0 s) | Geneticist 🦫 | **live**, validated by `save_genome` | `parents/noir-05/genome.json`, `parents/why-would-i-deceive-you/genome.json` |
| Creator: persona + script | Mutator 🐊 | **live** | `mutation.json`, `script.json` |
| Compliance | Critic 🐱 | **live**: trendFidelity 9, brandSafe 9, claimsCheck 10, disclosure 10, "fine. ship it." on the first round | `critique.json` |
| UGC clip | Mutator 🐊 | **live**: `grok-imagine-video-1.5-lite`, 5 s, 9:16, 480x848, rendered in about 27 s | `media/noir-05-deceive.mp4`, `media/storyboard.json` |
| Publish / analytics | — | **skipped** | — |

Each artifact was committed by `commit_artifact` under its agent's git author, and the model chose when to commit.
Known quirks, left as-is:
- The commit for the trend genome reuses the subject "sequence noir-05 genome". The Geneticist retried after a git lock race.
- In the clip, the bottle is in hand from the first frame instead of entering at 4.0 s.
- The clip has no on-screen text. The `#ad · AI-generated` disclosure is in the script and caption, and the app overlays it.

The creator "Ren Hale" is a fictional AI persona, not a real person.

**Redaction:** one Critic `shell` call printed a shell environment snapshot. Every `export NAME=value` value in `trace.ndjson` was replaced with `[REDACTED]` before commit. No other edits were made to the trace.
