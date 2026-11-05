export interface Gene {
  key: string
  label: string
  value: number
  trait: string
  color: string
}

export const GENE_COLORS: Record<string, string> = {
  hook: '#b6ff00',
  humor: '#ff2bd6',
  absurdity: '#00f0ff',
  hero: '#ffb800',
  format: '#8b5cff',
  payoff: '#ff5a36',
  remix: '#3dffa8',
}

const g = (key: string, label: string, value: number, trait: string): Gene => ({
  key,
  label,
  value,
  trait,
  color: GENE_COLORS[key],
})

export const GENOMES: Record<string, Gene[]> = {
  pigeon: [
    g('hook', 'HOOK', 91, 'animal in a business suit'),
    g('humor', 'HUMOR MECHANISM', 78, 'office relatability'),
    g('absurdity', 'ABSURDITY', 64, 'bird has LinkedIn'),
    g('hero', 'HERO', 88, 'corporate pigeon'),
    g('format', 'FORMAT', 72, 'top/bottom caption'),
    g('payoff', 'PAYOFF', 69, 'nobody read the ticket'),
    g('remix', 'REMIXABILITY', 95, 'any job title works'),
  ],
  capybara: [
    g('hook', 'HOOK', 84, 'unbothered stare'),
    g('humor', 'HUMOR MECHANISM', 81, 'calm vs chaos contrast'),
    g('absurdity', 'ABSURDITY', 58, 'rodent with aura'),
    g('hero', 'HERO', 93, 'sigma capybara'),
    g('format', 'FORMAT', 66, 'reaction image'),
    g('payoff', 'PAYOFF', 87, '"ok."'),
    g('remix', 'REMIXABILITY', 90, 'drop into any crisis'),
  ],
  krasnal: [
    g('hook', 'HOOK', 97, 'tiny bronze CEO'),
    g('humor', 'HUMOR MECHANISM', 92, 'startup satire'),
    g('absurdity', 'ABSURDITY', 99, '300 gnomes = 1 AI'),
    g('hero', 'HERO', 96, 'krasnal z Wrocławia'),
    g('format', 'FORMAT', 85, 'pitch-deck slide'),
    g('payoff', 'PAYOFF', 94, '$40M for vibes'),
    g('remix', 'REMIXABILITY', 98, 'every city has a mascot'),
  ],
}
