import { useSimulationStore } from '../store/simStore.js'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

export default function Dashboard() {
  const { timeline } = useSimulationStore()

  const data = timeline.map((t, i) => ({ year: i + 1, cash: t.cash, netWorth: t.netWorth }))

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <h2 className="text-3xl font-semibold mb-6">Your Dashboard</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="text-base text-neutral-400 mb-3">Net Worth Projection</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNW" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="netWorth" stroke="#34d399" fillOpacity={1} fill="url(#colorNW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-base text-neutral-400 mb-3">Cash Flow</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="year" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Line type="monotone" dataKey="cash" stroke="#60a5fa" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}

