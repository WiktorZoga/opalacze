// usage: node scripts/record-demo.mjs <outDir>  → <outDir>/raw-demo.webm (+ prints the lead-in offset in seconds)
import { chromium } from 'playwright-core'
import { renameSync } from 'node:fs'

const out = process.argv[2] ?? '/tmp/rec'
const base = process.env.BASE_URL ?? 'http://localhost:5173/'

const browser = await chromium.launch({
  executablePath: process.env.CHROME ?? '/usr/local/bin/google-chrome',
  args: ['--force-device-scale-factor=1'],
})
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: out, size: { width: 1920, height: 1080 } },
})
const page = await ctx.newPage()
const t0 = Date.now()
await page.goto(`${base}?demo`)
await page.waitForLoadState('networkidle')
const lead = (Date.now() - t0) / 1000
await page.waitForTimeout(46500)
const video = page.video()
await ctx.close()
renameSync(await video.path(), `${out}/raw-demo.webm`)
await browser.close()
console.log(JSON.stringify({ lead }))
