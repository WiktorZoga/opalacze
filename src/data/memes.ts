export interface Meme {
  id: string
  name: string
  top: string
  bottom: string
  /** emoji art, or 'krasnal' for the hand-drawn SVG hero */
  art: string
  /** secondary emoji layered on the art */
  accent?: string
  bg: string
  /** drop a real Grok Imagine PNG into public/memes/ and point here */
  img?: string
}

export const MEMES: Record<string, Meme> = {
  pigeon: {
    id: 'pigeon',
    name: 'Corporate Pigeon',
    top: 'me at 9am standup',
    bottom: 'pretending i read the jira ticket',
    art: '🐦',
    accent: '👔',
    bg: 'linear-gradient(135deg,#1b2a4a,#3b5b8f 60%,#9fb7d9)',
  },
  capybara: {
    id: 'capybara',
    name: 'Sigma Capybara',
    top: 'everyone panicking',
    bottom: 'capybara: ok',
    art: '🦫',
    accent: '🕶️',
    bg: 'linear-gradient(135deg,#2b1a0f,#8a5a2b 55%,#f2c46d)',
  },
  ohio: {
    id: 'ohio',
    name: 'Only in Ohio',
    top: 'normal day',
    bottom: 'in ohio',
    art: '🌽',
    accent: '👁️',
    bg: 'linear-gradient(135deg,#1d0b2e,#5c1a7a 60%,#ff5e9c)',
  },
  skibidi: {
    id: 'skibidi',
    name: 'Toilet Lore',
    top: 'season 74',
    bottom: 'the lore deepens',
    art: '🚽',
    accent: '🎤',
    bg: 'linear-gradient(135deg,#06222b,#0a6c7a 60%,#7df9ff)',
  },
  pierogi: {
    id: 'pierogi',
    name: 'Pierogi Rizz',
    top: 'babcia when you say',
    bottom: '"i already ate"',
    art: '🥟',
    accent: '😤',
    bg: 'linear-gradient(135deg,#2a0f0f,#8a2b2b 55%,#ffb86b)',
  },
  tram: {
    id: 'tram',
    name: 'Tram 33 Prophecy',
    top: 'mpk said 3 minutes',
    bottom: 'it has been 3 business days',
    art: '🚋',
    accent: '⏳',
    bg: 'linear-gradient(135deg,#1a2410,#4c7a1a 55%,#d4ff6b)',
  },
  gigachad: {
    id: 'gigachad',
    name: 'Gigachad Goose',
    top: 'honk',
    bottom: 'but make it sigma',
    art: '🪿',
    accent: '💪',
    bg: 'linear-gradient(135deg,#111,#444 60%,#bbb)',
  },
  mutant1: {
    id: 'mutant1',
    name: 'Pigeon-Capy Blob',
    top: 'when the merger',
    bottom: 'goes slightly wrong',
    art: '🐦',
    accent: '🦫',
    bg: 'linear-gradient(135deg,#2b0f2b,#6b2b8a 55%,#ff9de6)',
  },
  krasnal: {
    id: 'krasnal',
    name: 'Krasnal CEO',
    top: 'raised $40M pre-seed',
    bottom: 'product: vibes from wrocław',
    art: 'krasnal',
    bg: 'radial-gradient(circle at 50% 35%,#ff2bd6 0%,#5a0b6b 45%,#0b0220 100%)',
  },
  krasnalAlt: {
    id: 'krasnalAlt',
    name: 'Krasnal CEO (v2)',
    top: '"we are an ai company"',
    bottom: 'the ai: 300 krasnale in a trenchcoat',
    art: 'krasnal',
    bg: 'radial-gradient(circle at 50% 35%,#b6ff00 0%,#2b6b0b 45%,#021b08 100%)',
  },
}
