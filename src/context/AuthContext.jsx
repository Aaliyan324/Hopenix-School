import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiGet, apiPost, setAuthToken, getAuthToken } from '../lib/api-client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify active session on startup
  useEffect(() => {
    async function checkSession() {
      const token = getAuthToken()
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await apiGet('/api/auth', { action: 'me' })
        if (res.success && res.user) {
          setUser(res.user)
        } else {
          setAuthToken(null)
          setUser(null)
        }
      } catch {
        setAuthToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await apiPost('/api/auth', {
      action: 'login',
      email,
      password,
    })

    if (res.success && res.token) {
      setAuthToken(res.token)
      setUser(res.user)
      return res.user
    }
    throw new Error(res.error || 'Login failed')
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    setUser(null)
  }, [])

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    return apiPost('/api/auth', {
      action: 'change-password',
      currentPassword,
      newPassword,
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        role: user?.role || null,
        teacherId: user?.teacherId || null,
        loading,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
