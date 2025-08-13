export default function GradientBG() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-blue-500/30 blur-3xl" />
      <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-[-300px] left-[-200px] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
    </div>
  )
}

