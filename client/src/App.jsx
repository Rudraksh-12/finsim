import { Routes, Route, NavLink } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Play from './pages/Play.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Compare from './pages/Compare.jsx'
import Scenarios from './pages/Scenarios.jsx'
import PublicScenario from './pages/PublicScenario.jsx'
import NotFound from './pages/NotFound.jsx'
import GradientBG from './components/GradientBG.jsx'

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <GradientBG />
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <NavLink to="/" className="text-xl sm:text-2xl font-semibold text-gradient">FinSim</NavLink>
          <nav className="flex items-center gap-4 sm:gap-8 text-sm sm:text-base text-neutral-300">
            <NavLink to="/play" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Play</NavLink>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Dashboard</NavLink>
            <NavLink to="/compare" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Compare</NavLink>
            <NavLink to="/scenarios" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Scenarios</NavLink>
          </nav>
        </div>
      </header>
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/play" element={<Play />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/public/:slug" element={<PublicScenario />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t border-white/10 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 text-sm sm:text-base text-neutral-400">
          © {new Date().getFullYear()} FinSim. Learn finance by playing.
        </div>
      </footer>
    </div>
  )
}

export default App
