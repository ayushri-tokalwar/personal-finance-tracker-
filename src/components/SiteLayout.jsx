import { Menu, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { name: 'Home', to: '/' },
  { name: 'Content', to: '/content' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
]

function SiteLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-900">
      <div className="grain fixed inset-0 opacity-50" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-30 rounded-[2rem] border border-slate-900/10 bg-white/80 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#132a24] p-3 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-slate-900">Finova AI</p>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Finance Intelligence Suite
                </p>
              </div>
            </NavLink>

            <nav className="hidden items-center gap-2 lg:flex">
              {links.map((link) => (
                <NavItem key={link.to} to={link.to} label={link.name} />
              ))}
            </nav>

            <div className="hidden lg:block">
              <NavLink
                to="/contact"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Start Demo
              </NavLink>
            </div>

            <button
              type="button"
              className="inline-flex rounded-2xl border border-slate-200 p-3 lg:hidden"
              onClick={() => setOpen((current) => !current)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {open ? (
            <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4 lg:hidden">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? 'bg-slate-900 text-white' : 'bg-[#fcfaf5] text-slate-700'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          ) : null}
        </header>

        <main className="flex-1 py-6">
          <Outlet />
        </main>

        <footer className="rounded-[2rem] border border-slate-900/10 bg-[#132a24] px-6 py-8 text-[#e3efe9] shadow-[0_30px_80px_rgba(19,42,36,0.22)]">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#b8cec3]">Finova AI</p>
              <h2 className="mt-3 font-display text-3xl text-white">
                Personal finance product website for final-year submission.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#c8d9d1]">
                Designed to present both the business story and the working dashboard in one
                professional, industry-style React experience.
              </p>
            </div>
            <div>
              <p className="font-display text-xl text-white">Pages</p>
              <div className="mt-4 grid gap-2 text-sm">
                {links.map((link) => (
                  <NavLink key={link.to} to={link.to} className="text-[#c8d9d1] transition hover:text-white">
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div>
              <p className="font-display text-xl text-white">Highlights</p>
              <div className="mt-4 grid gap-2 text-sm text-[#c8d9d1]">
                <p>Expense categorization</p>
                <p>Reports and charts</p>
                <p>Budget alerts</p>
                <p>AI savings suggestions</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-medium transition ${
          isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-[#fcfaf5] hover:text-slate-900'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

export default SiteLayout
