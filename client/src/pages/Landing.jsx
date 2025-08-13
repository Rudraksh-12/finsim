import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'

export default function Landing() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-neutral-300 mb-8">
            <SparklesIcon className="size-4 text-emerald-400" />
            Learn finance by playing
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Become financially literate with
            <span className="block text-gradient">interactive simulations</span>
          </h1>
          <p className="mt-8 text-neutral-300 max-w-2xl text-lg">
            Choose life events, simulate your financial future, and visualize impact on cash flow, savings, and net worth. Compare scenarios side-by-side.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <NavLink to="/play" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3.5 text-neutral-900 font-semibold hover:bg-emerald-400 transition text-base">
              Start Playing
              <ArrowRightIcon className="size-5" />
            </NavLink>
            <NavLink to="/dashboard" className="inline-flex items-center gap-2 rounded-lg glass px-6 py-3.5 font-semibold hover:border-emerald-500/30 text-base">
              View Dashboard
            </NavLink>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <Feature kpi="50+" label="Life events" />
            <Feature kpi="10 yrs" label="Projections" />
            <Feature kpi="Real-time" label="Market data" />
          </div>
        </div>
        <HeroCard />
      </div>
    </section>
  )
}

function Feature({ kpi, label }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="text-2xl font-semibold text-white">{kpi}</div>
      <div className="text-xs text-neutral-400">{label}</div>
    </div>
  )
}

function HeroCard() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-3xl blur-2xl" />
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-400">Projected Net Worth</div>
          <div className="text-xs text-emerald-400">+18% YoY</div>
        </div>
        <div className="mt-4 h-40 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20" />
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="glass rounded-xl p-4">
            <div className="text-neutral-400">Savings</div>
            <div className="text-white text-lg">$12,840</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-neutral-400">Investments</div>
            <div className="text-white text-lg">$23,410</div>
          </div>
        </div>
      </div>
    </div>
  )
}

