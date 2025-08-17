import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicScenario } from '../lib/api.js'

export default function PublicScenario() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getPublicScenario(slug).then(setData).catch(() => setError('Not found'))
  }, [slug])

  if (error) return <div className="mx-auto max-w-3xl px-6 py-16 text-center text-neutral-400">{error}</div>
  if (!data) return <div className="mx-auto max-w-3xl px-6 py-16 text-center text-neutral-400">Loading...</div>

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gradient">Public Scenario</h1>
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="text-base text-neutral-400">{data.name}</div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-5 bg-white/5 border border-white/10">
            <div className="text-sm text-neutral-400">Income</div>
            <div className="text-white font-semibold text-lg">${data.income.toLocaleString()}</div>
          </div>
          <div className="rounded-xl p-5 bg-white/5 border border-white/10">
            <div className="text-sm text-neutral-400">Expense</div>
            <div className="text-white font-semibold text-lg">${data.expense.toLocaleString()}</div>
          </div>
        </div>
        <a href="/" className="mt-7 inline-block rounded-lg bg-emerald-500 px-6 py-3.5 text-neutral-900 font-semibold text-base">Try your own</a>
      </div>
    </section>
  )
}

