import type { Meme } from './memes'

export interface BrandPreset {
  id: string
  name: string
  tagline: string
  memes: Meme[]
}

export const BRANDS: BrandPreset[] = [
  {
    id: 'kebab',
    name: 'Kebab u Mustafy',
    tagline: 'est. 2003 · Wrocław Nadodrze',
    memes: [
      {
        id: 'b-kebab-1',
        name: 'Kebab CEO',
        top: 'krasnal ceo after closing the series A',
        bottom: 'u mustafy. duży, wszystkie sosy.',
        art: 'krasnal',
        accent: '🥙',
        bg: 'radial-gradient(circle at 50% 35%,#ffb800 0%,#8a2b00 50%,#1a0500 100%)',
      },
      {
        id: 'b-kebab-2',
        name: 'Garlic Sauce Gen 8',
        top: 'investors: what is your moat?',
        bottom: 'me: garlic sauce',
        art: '🥙',
        accent: '🧄',
        bg: 'linear-gradient(135deg,#2a0f00,#a3460a 55%,#ffd36b)',
      },
    ],
  },
  {
    id: 'cafe',
    name: 'Kawiarnia Pod Krasnalem',
    tagline: 'specialty coffee · Rynek, Wrocław',
    memes: [
      {
        id: 'b-cafe-1',
        name: 'Flat White Founder',
        top: 'sigma capybara ordering',
        bottom: 'oat flat white. no thoughts.',
        art: '🦫',
        accent: '☕',
        bg: 'linear-gradient(135deg,#1a0f08,#6b4226 55%,#e8c9a0)',
      },
      {
        id: 'b-cafe-2',
        name: 'Krasnal Barista',
        top: '300 krasnale walk into a café',
        bottom: 'pod krasnalem: we were expecting you',
        art: 'krasnal',
        accent: '☕',
        bg: 'radial-gradient(circle at 50% 35%,#c58b52 0%,#4a2a12 50%,#120804 100%)',
      },
    ],
  },
  {
    id: 'startup',
    name: 'your startup',
    tagline: 'pre-revenue · post-vibes',
    memes: [
      {
        id: 'b-startup-1',
        name: 'Corporate Pigeon Pivot',
        top: 'we pivoted to ai',
        bottom: 'the ai: a pigeon with a laptop',
        art: '🐦',
        accent: '💻',
        bg: 'linear-gradient(135deg,#0a1a2e,#1a4a8a 55%,#00f0ff)',
      },
      {
        id: 'b-startup-2',
        name: 'Burn Rate Krasnal',
        top: 'runway: 3 weeks',
        bottom: 'krasnal ceo: "we are so back"',
        art: 'krasnal',
        accent: '🔥',
        bg: 'radial-gradient(circle at 50% 35%,#3b82f6 0%,#3a0b6b 50%,#06020f 100%)',
      },
    ],
  },
]
