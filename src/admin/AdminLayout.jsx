import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
    ),
  },
  {
    to: '/admin/events',
    label: 'Events',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
  },
  {
    to: '/admin/settings',
    label: 'Settings',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
    ),
  },
]

const AdminLayout = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/admin/login', { replace: true })
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-[var(--secondary)] text-white'
        : 'text-[var(--text-secondary)] hover:bg-[var(--neutral-100)] hover:text-[var(--text)]'
    }`

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--surface)] border-r border-[var(--neutral-200)] p-6 shrink-0">
        {/* Brand */}
        <div className="mb-8">
          <h1 className="heading text-lg font-black uppercase tracking-wider text-[var(--text)]">
            Admin Panel
          </h1>
          <p className="paragraph text-xs text-[var(--text-muted)] mt-1">Hopenix School</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/admin'} className={linkClass}>
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--error-light)] hover:text-[var(--error)] transition-colors duration-200 mt-auto"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 h-full bg-[var(--surface)] p-6 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="heading text-lg font-black uppercase tracking-wider text-[var(--text)]">
                Admin
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--neutral-100)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1.5 flex-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={linkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={() => { handleLogout(); setSidebarOpen(false) }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--error-light)] hover:text-[var(--error)] transition-colors mt-auto"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--surface)] border-b border-[var(--neutral-200)]">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text)] hover:bg-[var(--neutral-100)] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="heading text-sm font-bold uppercase tracking-wider text-[var(--text)]">
            Admin Panel
          </h1>
          <div className="w-10" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
