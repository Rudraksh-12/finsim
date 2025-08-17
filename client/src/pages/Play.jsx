import { useEffect, useMemo, useState } from 'react'
import { useSimulationStore } from '../store/simStore.js'
import { runSimulation } from '../lib/api.js'
import { ArrowPathIcon, PlusIcon, BanknotesIcon, AcademicCapIcon, HomeModernIcon, BriefcaseIcon, XMarkIcon } from '@heroicons/react/24/outline'

const LIFE_EVENTS = [
  { id: 'job_promo', label: 'Job Promotion', icon: BriefcaseIcon, type: 'income', defaultAmount: 8000 },
  { id: 'buy_house', label: 'Buy House', icon: HomeModernIcon, type: 'expense', defaultAmount: 1200 },
  { id: 'student_loan', label: 'Student Loan', icon: AcademicCapIcon, type: 'expense', defaultAmount: 400 },
  { id: 'side_hustle', label: 'Side Hustle', icon: BanknotesIcon, type: 'income', defaultAmount: 3000 },
]

export default function Play() {
  const { parameters, setParameters, runLocalSimulation, setServerResult, lastResult, reset } = useSimulationStore()
  const [selectedEvents, setSelectedEvents] = useState([])
  const [loading, setLoading] = useState(false)

  const totalIncome = useMemo(() => (
    parameters.baseIncome + selectedEvents.filter(e => e.type === 'income').reduce((s, e) => s + (e.amount || 0), 0)
  ), [parameters, selectedEvents])
  const totalExpense = useMemo(() => (
    parameters.baseExpense + selectedEvents.filter(e => e.type === 'expense').reduce((s, e) => s + (e.amount || 0), 0)
  ), [parameters, selectedEvents])

  useEffect(() => {
    setParameters({ income: totalIncome, expense: totalExpense })
  }, [totalIncome, totalExpense, setParameters])

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">Build your scenario</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={() => runLocalSimulation()} className="rounded-lg bg-emerald-500 px-5 py-2.5 text-neutral-900 font-semibold text-base">Run Local</button>
          <button disabled={loading} onClick={async () => { setLoading(true); try { const res = await runSimulation({ income: totalIncome, expense: totalExpense }); setServerResult(res) } finally { setLoading(false) } }} className="rounded-lg glass px-5 py-2.5 text-neutral-200 inline-flex items-center gap-2 disabled:opacity-50 text-base">
            {loading ? 'Running...' : 'Run Server'}
          </button>
          <button onClick={() => { setSelectedEvents([]); reset(); }} className="rounded-lg glass px-4 py-2 text-neutral-200 inline-flex items-center gap-2">
            <ArrowPathIcon className="size-4" /> Reset
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BaselineCard
            baseIncome={parameters.baseIncome}
            baseExpense={parameters.baseExpense}
            onChange={(patch) => setParameters(patch)}
          />
          <EventPicker selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} />
          <SummaryCard income={totalIncome} expense={totalExpense} />
        </div>
        <div>
          <ResultsCard result={lastResult} />
        </div>
      </div>
    </section>
  )
}

function BaselineCard({ baseIncome, baseExpense, onChange }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-base text-neutral-400 mb-3">Your baseline</div>
      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm">
          <div className="text-neutral-400 mb-1">Income (per year)</div>
          <input
            type="number"
            value={baseIncome}
            onChange={(e) => onChange({ baseIncome: Number(e.target.value || 0) })}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          />
        </label>
        <label className="text-sm">
          <div className="text-neutral-400 mb-1">Expense (per year)</div>
          <input
            type="number"
            value={baseExpense}
            onChange={(e) => onChange({ baseExpense: Number(e.target.value || 0) })}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          />
        </label>
      </div>
    </div>
  )
}

function EventPicker({ selectedEvents, setSelectedEvents }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-base text-neutral-400 mb-3">Life events</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LIFE_EVENTS.map((evt) => (
          <button
            key={evt.id}
            onClick={() => setSelectedEvents((s) => s.some(e => e.id === evt.id) ? s : [...s, { ...evt, amount: evt.defaultAmount }])}
            className="card-hover glass rounded-xl p-5 text-left"
          >
            <evt.icon className="size-7 text-emerald-400" />
            <div className="mt-3 font-semibold text-lg">{evt.label}</div>
            <div className="text-sm text-neutral-400">{evt.type === 'income' ? `+ $${evt.defaultAmount} income` : `+ $${evt.defaultAmount} expense`}</div>
          </button>
        ))}
      </div>
      {selectedEvents.length > 0 && (
        <div className="mt-6 space-y-4">
          {selectedEvents.map((evt) => (
            <div key={evt.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="shrink-0 glass rounded-full px-3.5 py-1.5 text-sm">{evt.label}</span>
              <label className="text-sm grow">
                <div className="text-neutral-400 mb-1">{evt.type === 'income' ? 'Income change per year' : 'Expense change per year'}</div>
                <input
                  type="number"
                  value={evt.amount ?? 0}
                  onChange={(e) => {
                    const amt = Number(e.target.value || 0)
                    setSelectedEvents((s) => s.map(x => x.id === evt.id ? { ...x, amount: amt } : x))
                  }}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                />
              </label>
              <button
                aria-label="Remove event"
                onClick={() => setSelectedEvents((s) => s.filter(x => x.id !== evt.id))}
                className="glass rounded-lg p-2 hover:border-red-400/40"
              >
                <XMarkIcon className="size-5 text-neutral-300" />
              </button>
            </div>
          ))}
          <button onClick={() => setSelectedEvents([])} className="text-sm text-neutral-400 hover:text-white inline-flex items-center gap-1">
            <PlusIcon className="size-5 rotate-45" /> clear
          </button>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ income, expense }) {
  const savings = income - expense
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-base text-neutral-400 mb-3">Summary</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Income" value={`$${income.toLocaleString()}`} />
        <KPI label="Expense" value={`$${expense.toLocaleString()}`} />
        <KPI label="Savings / yr" value={`$${savings.toLocaleString()}`} positive={savings >= 0} />
      </div>
    </div>
  )
}

function KPI({ label, value, positive }) {
  return (
    <div className="rounded-xl p-5 bg-gradient-to-b from-white/5 to-white/0 border border-white/10">
      <div className="text-sm text-neutral-400">{label}</div>
      <div className={`text-xl font-semibold ${positive === true ? 'text-emerald-400' : positive === false ? 'text-red-400' : 'text-white'}`}>{value}</div>
    </div>
  )
}

function ResultsCard({ result }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-base text-neutral-400 mb-3">Results</div>
      {!result && <div className="text-neutral-400 text-base">Run a simulation to see your 10-year projection.</div>}
      {result && (
        <div className="space-y-3 text-base">
          <div className="flex justify-between"><span className="text-neutral-400">Final Net Worth</span><span className="text-white font-semibold">${result.finalNetWorth.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-neutral-400">Savings Rate</span><span className="text-emerald-400 font-semibold">{Math.round(result.savingsRate * 100)}%</span></div>
        </div>
      )}
    </div>
  )
}

