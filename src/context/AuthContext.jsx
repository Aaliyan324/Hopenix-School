import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiClient, setAuthToken, getAuthToken } from '../lib/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify active session on load
  const checkSession = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const res = await apiClient.get('/api/auth')
      if (res.success && res.data) {
        setUser(res.data)
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
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = useCallback(async (email, password) => {
    const res = await apiClient.post('/api/auth', { email, password })
    if (res.success && res.data) {
      setAuthToken(res.data.token)
      setUser(res.data.user)
      return res.data.user
    } else {
      throw new Error(res.error || 'Login failed')
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/auth', { action: 'logout' })
    } catch {
      // Ignore logout request errors
    } finally {
      setAuthToken(null)
      setUser(null)
    }
  }, [])

  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    const res = await apiClient.put('/api/auth', { currentPassword, newPassword })
    return res
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        loading,
        login,
        logout,
        updatePassword,
        checkSession,
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
