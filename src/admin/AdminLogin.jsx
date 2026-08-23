import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/admin', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('Please enter your username and password.')
      return
    }

    setLoading(true)
    try {
      await login(username.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--secondary)] text-white mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="heading text-2xl font-black uppercase tracking-tight text-[var(--text)]">
            Admin Login
          </h1>
          <p className="paragraph text-sm text-[var(--text-secondary)] mt-2">
            Sign in to manage school events.
          </p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          {/* Username */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-[var(--text)] mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              placeholder="Enter username"
              autoComplete="username"
              className="
                w-full px-4 py-3 rounded-xl border border-[var(--neutral-200)]
                bg-[var(--background)] text-[var(--text)] text-sm paragraph
                placeholder-[var(--text-light)]
                focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)]/30
                transition-colors
              "
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[var(--text)] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="Enter password"
              autoComplete="current-password"
              className="
                w-full px-4 py-3 rounded-xl border border-[var(--neutral-200)]
                bg-[var(--background)] text-[var(--text)] text-sm paragraph
                placeholder-[var(--text-light)]
                focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)]/30
                transition-colors
              "
            />
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-[var(--error-light)] text-[var(--error)] text-sm paragraph">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl bg-[var(--secondary)] text-white font-semibold text-sm
              hover:bg-[var(--secondary-hover)] transition-colors duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              active:scale-[0.98]
            "
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="paragraph text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            &larr; Back to website
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
