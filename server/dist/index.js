"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', routes_1.default);
const PORT = process.env.PORT || 5179;
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});
const SimSchema = zod_1.z.object({ income: zod_1.z.number(), expense: zod_1.z.number() });
app.post('/simulate', (req, res) => {
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
app.listen(PORT, () => {
    console.log(`FinSim server listening on port ${PORT}`);
});
