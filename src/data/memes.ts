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
  doorPrank: {
    id: 'doorPrank',
    name: 'Closing the Door Prank',
    top: 'run through the door',
    bottom: 'the door:',
    art: '🚪',
    accent: '💨',
    bg: 'linear-gradient(135deg,#0f1a2b,#2b4a7a 55%,#7ab8ff)',
  },
  never25: {
    id: 'never25',
    name: "You'll Never Look 25 Again",
    top: "you'll never look 25 again",
    bottom: 'thank god',
    art: '🪞',
    accent: '✨',
    bg: 'linear-gradient(135deg,#2b0f22,#8a2b6b 55%,#ffb3e6)',
  },
  scientistsHi: {
    id: 'scientistsHi',
    name: 'Scientists Reveal the Hi',
    top: 'scientists reveal',
    bottom: 'the hi',
    art: '🐈',
    accent: '👋',
    bg: 'linear-gradient(135deg,#2b1a05,#b36b12 55%,#ffd27a)',
  },
  candyMatch: {
    id: 'candyMatch',
    name: 'Ding Ding Ding Match-3',
    top: 'ding ding ding',
    bottom: 'combo x3',
    art: '🍬',
    accent: '🎵',
    bg: 'linear-gradient(135deg,#1a0b2e,#6b1a9a 55%,#ff7ae0)',
  },
  memeWar: {
    id: 'memeWar',
    name: 'First Twitter World War',
    top: 'one cat meme',
    bottom: '17 million impressions later',
    art: '🐱',
    accent: '🚩',
    bg: 'linear-gradient(135deg,#2b0505,#8a1212 55%,#ff6b6b)',
  },
  blackCat: {
    id: 'blackCat',
    name: 'Black Cat Clapping',
    top: 'me when',
    bottom: 'the ai cat claps',
    art: '🐈‍⬛',
    accent: '👏',
    bg: 'linear-gradient(135deg,#050505,#2a2a3a 55%,#6b6b8a)',
  },
  soldier: {
    id: 'soldier',
    name: 'Permission to Cry Soldier',
    top: 'permission to cry',
    bottom: 'granted, soldier',
    art: '🪖',
    accent: '😭',
    bg: 'linear-gradient(135deg,#0f1a0a,#3a5a1a 55%,#9ab86b)',
  },
  dataCenter: {
    id: 'dataCenter',
    name: 'Data Centers in Space',
    top: 'every data center',
    bottom: 'is going to space tomorrow',
    art: '🛰️',
    accent: '🖥️',
    bg: 'linear-gradient(135deg,#02021a,#1a1a6b 55%,#6b8aff)',
  },
  malfoid: {
    id: 'malfoid',
    name: 'Malfoid',
    top: 'october: unavoidable',
    bottom: 'november: fading',
    art: '🐍',
    accent: '🎀',
    bg: 'linear-gradient(135deg,#021a0a,#0a5a2a 55%,#b8c8b8)',
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

/** `img: '/memes/x.png'` → URL that also works under the GitHub Pages base path */
export const assetUrl = (p: string) => (p.startsWith('/') ? `${import.meta.env.BASE_URL}${p.slice(1)}` : p)
