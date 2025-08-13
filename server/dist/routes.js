"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const db_1 = require("./db");
const zod_1 = require("zod");
const nanoid_1 = require("nanoid");
exports.router = (0, express_1.Router)();
exports.router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
const ScenarioSchema = zod_1.z.object({ name: zod_1.z.string().min(1), income: zod_1.z.number().int(), expense: zod_1.z.number().int(), userId: zod_1.z.string().optional() });
const SimSchema = zod_1.z.object({ income: zod_1.z.number(), expense: zod_1.z.number() });
exports.router.post('/simulate', (req, res) => {
    const parsed = SimSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { income, expense } = parsed.data;
    const years = 10;
    const annualReturn = 0.05;
    let netWorth = 0;
    const timeline = [];
    for (let y = 0; y < years; y++) {
        const cash = income - expense;
        netWorth = (netWorth + cash) * (1 + annualReturn);
        timeline.push({ year: y + 1, cash, netWorth });
    }
    const finalNetWorth = timeline[timeline.length - 1]?.netWorth ?? 0;
    const savingsRate = income > 0 ? (income - expense) / income : 0;
    res.json({ finalNetWorth, savingsRate, timeline });
});
exports.router.get('/scenarios', async (_req, res) => {
    const scenarios = await db_1.prisma.scenario.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(scenarios);
});
exports.router.post('/scenarios', async (req, res) => {
    const parsed = ScenarioSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const created = await db_1.prisma.scenario.create({ data: parsed.data });
    res.json(created);
});
exports.router.get('/scenarios/:id', async (req, res) => {
    const scenario = await db_1.prisma.scenario.findUnique({ where: { id: req.params.id } });
    if (!scenario)
        return res.status(404).json({ error: 'Not found' });
    res.json(scenario);
});
exports.router.delete('/scenarios/:id', async (req, res) => {
    await db_1.prisma.scenario.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
});
// Create or fetch a public share slug
exports.router.post('/scenarios/:id/share', async (req, res) => {
    const nano = (0, nanoid_1.customAlphabet)('abcdef1234567890', 10);
    const slug = nano();
    const updated = await db_1.prisma.scenario.update({ where: { id: req.params.id }, data: { publicSlug: slug } });
    res.json({ slug: updated.publicSlug });
});
exports.router.get('/public/:slug', async (req, res) => {
    const scenario = await db_1.prisma.scenario.findUnique({ where: { publicSlug: req.params.slug } });
    if (!scenario)
        return res.status(404).json({ error: 'Not found' });
    res.json(scenario);
});
// External market data — FRED inflation series
exports.router.get('/market/inflation', async (req, res) => {
    try {
        const series = req.query.series || 'CPIAUCSL';
        const apiKey = process.env.FRED_API_KEY;
        if (!apiKey) {
            return res.json({ note: 'FRED_API_KEY missing', series, data: [] });
        }
        const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${encodeURIComponent(series)}&api_key=${apiKey}&file_type=json&observation_start=2018-01-01`;
        const resp = await fetch(url);
        const json = await resp.json();
        res.json(json);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch FRED data' });
    }
});
// CoinGecko simple price
exports.router.get('/market/crypto', async (req, res) => {
    try {
        const ids = req.query.ids || 'bitcoin,ethereum';
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`;
        const resp = await fetch(url);
        const json = await resp.json();
        res.json(json);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch crypto data' });
    }
});
exports.default = exports.router;
