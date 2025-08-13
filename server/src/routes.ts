import { Router } from 'express'
import { prisma } from './db'
import { z } from 'zod'
// Lightweight slug generator to avoid ESM loader issues
function generateSlug(length: number = 10): string {
  const alphabet = 'abcdef1234567890'
  let out = ''
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return out
}

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const ScenarioSchema = z.object({ name: z.string().min(1), income: z.number().int(), expense: z.number().int(), userId: z.string().optional() })

const SimSchema = z.object({ income: z.number(), expense: z.number() })

router.post('/simulate', (req, res) => {
  const parsed = SimSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { income, expense } = parsed.data
  const years = 10
  const annualReturn = 0.05
  let netWorth = 0
  const timeline: Array<{ year: number; cash: number; netWorth: number }> = []
  for (let y = 0; y < years; y++) {
    const cash = income - expense
    netWorth = (netWorth + cash) * (1 + annualReturn)
    timeline.push({ year: y + 1, cash, netWorth })
  }
  const finalNetWorth = timeline[timeline.length - 1]?.netWorth ?? 0
  const savingsRate = income > 0 ? (income - expense) / income : 0
  res.json({ finalNetWorth, savingsRate, timeline })
})

router.get('/scenarios', async (_req, res) => {
  const scenarios = await prisma.scenario.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(scenarios)
})

router.post('/scenarios', async (req, res) => {
  const parsed = ScenarioSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const created = await prisma.scenario.create({ data: parsed.data })
  res.json(created)
})

router.get('/scenarios/:id', async (req, res) => {
  const scenario = await prisma.scenario.findUnique({ where: { id: req.params.id } })
  if (!scenario) return res.status(404).json({ error: 'Not found' })
  res.json(scenario)
})

router.delete('/scenarios/:id', async (req, res) => {
  await prisma.scenario.delete({ where: { id: req.params.id } })
  res.json({ ok: true })
})

// Create or fetch a public share slug
router.post('/scenarios/:id/share', async (req, res) => {
  const slug = generateSlug(10)
  const updated = await prisma.scenario.update({ where: { id: req.params.id }, data: { publicSlug: slug } })
  res.json({ slug: updated.publicSlug })
})

router.get('/public/:slug', async (req, res) => {
  const scenario = await prisma.scenario.findUnique({ where: { publicSlug: req.params.slug } })
  if (!scenario) return res.status(404).json({ error: 'Not found' })
  res.json(scenario)
})

// External market data — FRED inflation series
router.get('/market/inflation', async (req, res) => {
  try {
    const series = (req.query.series as string) || 'CPIAUCSL'
    const apiKey = process.env.FRED_API_KEY
    if (!apiKey) {
      return res.json({ note: 'FRED_API_KEY missing', series, data: [] })
    }
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${encodeURIComponent(series)}&api_key=${apiKey}&file_type=json&observation_start=2018-01-01`
    const resp = await fetch(url)
    const json = await resp.json()
    res.json(json)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch FRED data' })
  }
})

// CoinGecko simple price
router.get('/market/crypto', async (req, res) => {
  try {
    const ids = (req.query.ids as string) || 'bitcoin,ethereum'
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`
    const resp = await fetch(url)
    const json = await resp.json()
    res.json(json)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch crypto data' })
  }
})

export default router

