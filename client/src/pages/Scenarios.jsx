import { useEffect, useState } from 'react'
import { createScenario, listScenarios, shareScenario } from '../lib/api.js'

export default function Scenarios() {
  const [scenarios, setScenarios] = useState([])
  const [name, setName] = useState('My Scenario')
  const [income, setIncome] = useState(60000)
  const [expense, setExpense] = useState(30000)
  const [loading, setLoading] = useState(false)

  async function refresh() {
    const data = await listScenarios()
    setScenarios(data)
  }

  useEffect(() => { refresh() }, [])

  async function onCreate() {
    setLoading(true)
    try {
      await createScenario({ name, income, expense })
      setName('My Scenario')
      await refresh()
    } finally {
      setLoading(false)
    }
  }

  async function onShare(id) {
    const res = await shareScenario(id)
    alert(`Public link created: ${window.location.origin}/public/${res.slug}`)
    await refresh()
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Your Scenarios</h2>
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="text-base text-neutral-400 mb-3">Create</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Name" value={name} onChange={setName} type="text" />
          <Field label="Income" value={income} onChange={(v) => setIncome(Number(v))} />
          <Field label="Expense" value={expense} onChange={(v) => setExpense(Number(v))} />
          <div className="flex items-end">
            <button disabled={loading} onClick={onCreate} className="w-full rounded-lg bg-emerald-500 px-5 py-2.5 text-neutral-900 font-semibold disabled:opacity-60 text-base">{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((s) => (
          <div key={s.id} className="glass rounded-xl p-5">
            <div className="font-semibold text-white text-lg">{s.name}</div>
            <div className="mt-1 text-sm text-neutral-400">Income ${s.income.toLocaleString()} • Expense ${s.expense.toLocaleString()}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => onShare(s.id)} className="rounded-lg bg-white/10 px-3.5 py-1.5 text-base">Share</button>
              {s.publicSlug && (
                <a className="rounded-lg bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 text-base" href={`/public/${s.publicSlug}`} target="_blank">Open public</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Field({ label, value, onChange, type = 'number' }) {
  return (
    <label className="text-sm w-full">
      <div className="text-neutral-400 mb-1">{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
    </label>
  )
}

