import { create } from 'zustand'

function simulate(params) {
  const years = 10
  const annualReturn = 0.05
  const timeline = []
  let netWorth = 0
  for (let y = 0; y < years; y++) {
    const cash = params.income - params.expense
    netWorth = (netWorth + cash) * (1 + annualReturn)
    timeline.push({ year: y + 1, cash, netWorth })
  }
  const finalNetWorth = timeline[timeline.length - 1]?.netWorth ?? 0
  const savingsRate = params.income > 0 ? (params.income - params.expense) / params.income : 0
  return { finalNetWorth, savingsRate, timeline }
}

export const useSimulationStore = create((set, get) => ({
  parameters: { baseIncome: 60000, baseExpense: 30000, income: 60000, expense: 30000 },
  lastResult: null,
  timeline: [],
  setParameters: (patch) => set((s) => ({ parameters: { ...s.parameters, ...patch } })),
  runLocalSimulation: () => {
    const { parameters } = get()
    const res = simulate({ income: parameters.income, expense: parameters.expense })
    set({ lastResult: res, timeline: res.timeline })
  },
  setServerResult: (res) => set({ lastResult: res, timeline: res.timeline }),
  compareScenarios: (a, b) => ({ a: simulate(a), b: simulate(b) }),
  reset: () => set({ lastResult: null, timeline: [] }),
}))

