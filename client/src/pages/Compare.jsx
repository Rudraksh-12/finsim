import { useState } from 'react'
import { useSimulationStore } from '../store/simStore.js'

export default function Compare() {
  const { compareScenarios } = useSimulationStore()
  const [a, setA] = useState({ income: 60000, expense: 30000 })
  const [b, setB] = useState({ income: 70000, expense: 38000 })
  const result = compareScenarios(a, b)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Compare Scenarios</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <ScenarioCard label="Scenario A" params={a} setParams={setA} />
        <ScenarioCard label="Scenario B" params={b} setParams={setB} />
      </div>
      <div className="glass rounded-2xl p-5 mt-6">
        <div className="text-sm text-neutral-400 mb-3">Delta</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Delta label="Final Net Worth" a={result.a.finalNetWorth} b={result.b.finalNetWorth} />
          <Delta label="Savings Rate" a={result.a.savingsRate * 100} b={result.b.savingsRate * 100} suffix="%" />
          <Delta label="Avg. Cash" a={avg(result.a.timeline.map(t => t.cash))} b={avg(result.b.timeline.map(t => t.cash))} />
        </div>
      </div>
    </section>
  )
}

function ScenarioCard({ label, params, setParams }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-base text-neutral-400 mb-3">{label}</div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Income" value={params.income} onChange={(v) => setParams({ ...params, income: v })} />
        <Field label="Expense" value={params.expense} onChange={(v) => setParams({ ...params, expense: v })} />
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <label className="text-sm">
      <div className="text-neutral-400 mb-1">{label}</div>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-base" />
    </label>
  )
}

function Delta({ label, a, b, suffix = '' }) {
  const better = b - a
  const color = better >= 0 ? 'text-emerald-400' : 'text-red-400'
  return (
    <div className="rounded-xl p-5 bg-gradient-to-b from-white/5 to-white/0 border border-white/10">
      <div className="text-sm text-neutral-400">{label}</div>
      <div className="text-white font-semibold text-lg">A: {fmt(a)}{suffix} → B: {fmt(b)}{suffix}</div>
      <div className={`text-base ${color}`}>{better >= 0 ? '+' : ''}{fmt(better)}{suffix}</div>
    </div>
  )
}

function fmt(v) { return typeof v === 'number' ? Math.round(v).toLocaleString() : v }
function avg(arr) { if (arr.length === 0) return 0; return arr.reduce((s, v) => s + v, 0) / arr.length }

