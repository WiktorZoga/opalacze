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
  { screen: 'campaign', campaign: 'perfume', tone: 'ugc', ms: 4500, pl: 'Marka wysyła brief. Scout znajduje rosnący trend na TikToku: 87% dopasowania.', en: 'A brand sends a brief. Scout finds a rising TikTok trend: 87% brand fit.' },
  { screen: 'campaign', ms: 3600, pl: 'Geneticist wyciąga DNA trendu i miejsce na produkt. Creator pisze skrypt.', en: 'Geneticist extracts the trend DNA and the product slot. Creator writes the script.' },
  { screen: 'campaign', ms: 5200, pl: 'Critic odrzuca niesprawdzalny claim. Creator poprawia i renderuje warianty A/B.', en: 'Critic rejects an unprovable claim. Creator fixes it and renders A/B variants.' },
  { screen: 'campaign', ms: 5700, pl: 'Publisher planuje posty, Analyst mierzy wynik i zasila kolejny wariant.', en: 'Publisher schedules the posts; Analyst scores them and feeds the next variant.' },
  { screen: 'creative', ms: 6500, pl: 'Wynik: reklama UGC z kreatorką AI, oznaczona #ad · AI-generated.', en: 'The result: a UGC ad with an AI creator, labelled #ad · AI-generated.' },
  { screen: 'creative', tone: 'brainrot', ms: 4500, pl: 'Ten sam brief, inny ton: UGC, Polished ad albo Brainrot.', en: 'Same brief, another tone: UGC, polished ad, or brainrot.' },
  { screen: 'creative', campaign: 'cafe', tone: 'ugc', ms: 5000, pl: 'Kolejny brief: kawiarnia z Wrocławia na trendzie „Fancy Cafe” (10,8 mln).', en: 'Next brief: a Wrocław café riding “Your First Time in a Fancy Cafe” (10.8M).' },
  { screen: 'creative', ms: 10000, pl: 'ROT Studio: agencja AI, która jedzie na viralach.', en: 'ROT Studio: the AI ad agency that rides virals.' },
]
