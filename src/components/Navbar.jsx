import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const dashboardPath = user?.role === 'candidate' ? '/candidate' : '/admin'
  const navItems = user
    ? [
        { to: '/feed', label: 'Feed' },
        { to: dashboardPath, label: 'Dashboard' },
        ...(user.role === 'candidate' ? [{ to: '/profile', label: 'Profile' }] : []),
      ]
    : []

  const navClass = ({ isActive }) =>
    `rounded-xl border px-4 py-2 text-sm font-bold transition duration-300 hover:-translate-y-0.5 ${
      isActive
        ? 'border-cyan-300/50 bg-cyan-300/15 text-cyan-100 shadow-lg shadow-cyan-950/20'
        : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/30 hover:bg-white/10 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col leading-tight">
          <Link to={user ? '/feed' : '/login'} className="text-2xl font-black tracking-tight text-white">
            RecruitFlow
          </Link>
          <span className="text-xs font-semibold text-cyan-200">Hiring operations platform</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {user ? (
            <>
              <nav className="hidden items-center gap-2 sm:flex">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} className={navClass}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <button onClick={logout} className="hidden rounded-xl bg-white px-5 py-2 text-sm font-black text-slate-950 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-50 sm:inline-flex">
                Logout
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white sm:hidden"
                aria-expanded={menuOpen}
                aria-label="Toggle navigation menu"
              >
                {menuOpen ? 'Close' : 'Menu'}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-xl bg-white px-5 py-2 text-sm font-black text-slate-950 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-50">
                Login
              </Link>
              <Link to="/register" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
      {user && menuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className={navClass}>
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false)
                logout()
              }}
              className="rounded-xl bg-white px-5 py-2 text-sm font-black text-slate-950"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
