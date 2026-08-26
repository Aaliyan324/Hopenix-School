import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminLogin = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await login(email.trim(), password)
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else if (user.role === 'TEACHER') {
        navigate('/teacher', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@hopenix.edu.pk')
      setPassword('Admin@123456')
    } else {
      setEmail('ahmed@hopenix.edu.pk')
      setPassword('Teacher@123456')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[var(--neutral-200)] shadow-xl">
        <div className="text-center mb-6">
          <h1 className="heading text-2xl font-black uppercase tracking-wider text-[var(--text)]">
            Hopenix School
          </h1>
          <p className="paragraph text-xs text-[var(--text-muted)] mt-1">
            Faculty & Administration Portal Sign In
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hopenix.edu.pk"
              className="w-full px-4 py-3 rounded-xl border border-[var(--neutral-300)] text-sm font-medium focus:ring-2 focus:ring-[var(--primary)] text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-[var(--neutral-300)] text-sm font-medium focus:ring-2 focus:ring-[var(--primary)] text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[var(--secondary)] text-white font-bold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 shadow-md mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        {/* Demo Helper buttons for fast testing */}
        <div className="mt-6 pt-6 border-t border-[var(--neutral-200)] text-center">
          <p className="text-xs text-[var(--text-muted)] font-semibold mb-2">Development Demo Credentials:</p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Fill Admin Demo
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('teacher')}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[var(--primary)] text-xs font-bold transition-colors"
            >
              Fill Teacher Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
