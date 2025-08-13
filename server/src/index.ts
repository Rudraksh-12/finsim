import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { z } from 'zod'
import router from './routes'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

const PORT = process.env.PORT || 5179

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

const SimSchema = z.object({ income: z.number(), expense: z.number() })

app.post('/simulate', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`FinSim server listening on port ${PORT}`)
})

