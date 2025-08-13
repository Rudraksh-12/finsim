import { NavLink } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="text-6xl font-bold text-gradient">404</h1>
      <p className="mt-4 text-neutral-400">Page not found</p>
      <NavLink to="/" className="mt-6 inline-block rounded-lg bg-emerald-500 px-5 py-3 text-neutral-900 font-semibold">Back home</NavLink>
    </section>
  )
}

