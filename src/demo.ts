import type { ScreenId } from './data/dialogue'

export interface DemoStep {
  screen: ScreenId
  ms: number
  pl: string
  en: string
}

/** the 45 s pitch — this IS the presentation */
export const DEMO_STEPS: DemoStep[] = [
  {
    screen: 'radar',
    ms: 6000,
    pl: 'Internet rodzi tysiąc memów na godzinę. Ludzie nie nadążają.',
    en: 'The internet births 1,000 memes an hour. Humans can’t keep up.',
  },
  {
    screen: 'genome',
    ms: 5000,
    pl: 'Nasze Grok Boty polują na trendy z TikToka i X i wyciągają ich wirusowe DNA.',
    en: 'Our Grok Bots hunt TikTok + X trends and extract their viral DNA.',
  },
  {
    screen: 'breed',
    ms: 10500,
    pl: 'A potem je krzyżują — i wykluwa się coś zupełnie nowego.',
    en: 'Then they crossbreed them — and something new hatches.',
  },
  {
    screen: 'studio',
    ms: 5000,
    pl: 'Z nowego mema robią gotowe pionowe wideo.',
    en: 'The new meme becomes ready-to-post vertical video.',
  },
  {
    screen: 'publish',
    ms: 7000,
    pl: 'Publikują, mierzą wyniki i uczą się na nich.',
    en: 'They post it, read the metrics, and learn.',
  },
  {
    screen: 'tree',
    ms: 5000,
    pl: 'Każde pokolenie jest lepsze od poprzedniego.',
    en: 'Every generation beats the last.',
  },
  {
    screen: 'brand',
    ms: 6500,
    pl: 'Dziś brainrot. Jutro cały twój dział marketingu.',
    en: 'Today brainrot. Tomorrow your whole marketing department.',
  },
]
