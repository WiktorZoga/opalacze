// usage: node scripts/shots.mjs [outDir] [screen:waitMs ...]
import { chromium } from 'playwright-core'

const out = process.argv[2] ?? 'shots'
const specs = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ['radar:3500', 'genome:2500', 'breed:10500', 'studio:3500', 'publish:5500', 'tree:3500', 'brand:3000']
const base = process.env.BASE_URL ?? 'http://localhost:5173/'

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/usr/local/bin/google-chrome' })
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
for (const spec of specs) {
  const [screen, wait] = spec.split(':')
  await page.goto(`${base}?screen=${screen}`)
  await page.waitForTimeout(Number(wait ?? 3000))
  await page.screenshot({ path: `${out}/${screen}.png` })
  console.log(`${out}/${screen}.png`)
}
await browser.close()
