# generations/

The swarm's lab notebook. Each folder is one generation, written by the agents' tools
(`save_genome`, `generate_media`, `commit_artifact`) and committed by the agent that produced each file.

| Gen | Child | Parents | Fitness |
| :---: | --- | --- | :---: |
| [gen-001](gen-001/) | Scientists Reveal the Clap | Scientists Reveal the Hi × Black Cat Clapping | 0.48 |
| [gen-002](gen-002/) | Krasnal CEO | Wrocław Krasnal (BRANDROT seed) × Scientists Reveal the Clap | 0.63 |
| [gen-003](gen-003/) | Krasnal CEO: Series A | Krasnal CEO × Why Would I Deceive You? | 0.81 |

## Files per generation

| File | Agent | What |
| --- | --- | --- |
| `brief.json` | 🐙 Overlord | brand brief (BRANDROT generations only) |
| `trend.json` | 🐦 Scout | candidates, the two picked parents, and why |
| `parents/<id>/genome.json` | 🦫 Geneticist | sequenced parent genome (the father lives on a `lineage/<id>` branch until crossover) |
| `mutation.json` | 🐊 Mutator | the child genome; committed as the merge of both lineages |
| `critique.json` | 🐱 Critic | every round, scores, and the final verdict |
| `media/storyboard.json` | 🐊 Mutator | Grok Imagine shot list for the 8 s vertical video |
| `post.json` | 🦜 Publisher | TikTok + X posts, queued for human approval |
| `metrics.json` | 🦉 Analyst | per-platform engagement, fitness, carrying and dragging genes |

[`sources.json`](sources.json) is the Scout's recorded run: 10 real trends from TikTok and X with links and public
signals (Know Your Meme, Virlo, Trendhaus, NewEngen, Business Insider). Links and descriptions only; no creator media
is stored here.
