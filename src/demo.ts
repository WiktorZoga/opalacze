import type { ScreenId } from './data/dialogue'
import type { Campaign, Tone } from './data/campaigns'

export interface DemoStep {
  screen: ScreenId
  ms: number
  pl: string
  en: string
  campaign?: Campaign['id']
  tone?: Tone
}

/** guided walkthrough: one brief in, trend-native ads out, 45 s */
export const DEMO_STEPS: DemoStep[] = [
  { screen: 'campaign', campaign: 'perfume', tone: 'ugc', ms: 4500, pl: 'Marka wysyła brief. Scout (Grok Bot, na żywo) dopasowuje trend: 84% zgodności z marką.', en: 'A brand sends a brief. The live Scout matches a trend: 84% brand fit.' },
  { screen: 'campaign', ms: 3800, pl: 'Geneticist wyciąga DNA trendu i miejsce na produkt. Creator pisze skrypt.', en: 'Geneticist extracts the trend DNA and the product slot. Creator writes the script.' },
  { screen: 'campaign', ms: 5200, pl: 'Creator tworzy personę AI i skrypt. Critic sprawdza claimy i oznaczenie #ad: 9 · 9 · 10 · 10.', en: 'Creator casts an AI persona and writes the script. Critic checks claims and the #ad label: 9 · 9 · 10 · 10.' },
  { screen: 'campaign', ms: 6200, pl: 'Creator renderuje klip w grok-imagine. Każdy krok to prawdziwy commit agenta.', en: 'Creator renders the clip with grok-imagine. Every step is a real agent commit.' },
  { screen: 'creative', ms: 6500, pl: 'Wynik: klip z przebiegu na żywo plus warianty A/B, oznaczone #ad · AI-generated.', en: 'The result: the live-run clip plus A/B variants, labelled #ad · AI-generated.' },
  { screen: 'creative', tone: 'brainrot', ms: 4500, pl: 'Ten sam brief, inny ton: UGC, Polished ad albo Brainrot.', en: 'Same brief, another tone: UGC, polished ad, or brainrot.' },
  { screen: 'creative', campaign: 'cafe', tone: 'ugc', ms: 5000, pl: 'Kolejny brief: kawiarnia z Wrocławia na trendzie „Fancy Cafe” (10,8 mln).', en: 'Next brief: a Wrocław café riding “Your First Time in a Fancy Cafe” (10.8M).' },
  { screen: 'creative', ms: 10000, pl: 'ROT Studio: agencja AI, która jedzie na viralach.', en: 'ROT Studio: the AI ad agency that rides virals.' },
]
