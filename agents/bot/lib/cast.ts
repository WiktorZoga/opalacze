// The ROT BOT swarm. Every agent signs its own git commits, so
// `git log --graph` doubles as the meme family tree.
export const CAST = {
  overlord: { name: "Overlord 🐙", email: "overlord@rotbot.ai", role: "orchestrator" },
  scout: { name: "Scout 🐦", email: "scout@rotbot.ai", role: "trend hunter" },
  geneticist: { name: "Geneticist 🦫", email: "geneticist@rotbot.ai", role: "viral DNA sequencer" },
  mutator: { name: "Mutator 🐊", email: "mutator@rotbot.ai", role: "crossover + mutation" },
  critic: { name: "Critic 🐱", email: "critic@rotbot.ai", role: "quality gate" },
  publisher: { name: "Publisher 🦜", email: "publisher@rotbot.ai", role: "TikTok + X poster" },
  analyst: { name: "Analyst 🦉", email: "analyst@rotbot.ai", role: "fitness scoring" },
} as const;

export type AgentId = keyof typeof CAST;

export const AGENT_IDS = Object.keys(CAST) as [AgentId, ...AgentId[]];
