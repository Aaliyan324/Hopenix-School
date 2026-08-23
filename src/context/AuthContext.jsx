/**
 * Authentication context for the admin panel.
 *
 * Uses simple username/password stored in localStorage.
 * Passwords are hashed with PBKDF2 (Web Crypto API).
 * Session state is in-memory only — refreshing the page
 * or navigating from outside requires login again.
 */

import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const CREDENTIALS_KEY = 'hopenix_admin_credentials'

const DEFAULT_USERNAME = 'HopenixAdmin'
const DEFAULT_PASSWORD = 'pass123'

// ── Password hashing (PBKDF2) ──────────────────────────────

async function hashPassword(password, saltHex) {
  const encoder = new TextEncoder()
  const salt = saltHex
    ? Uint8Array.from(saltHex.match(/.{1,2}/g).map((b) => parseInt(b, 16)))
    : crypto.getRandomValues(new Uint8Array(16))

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  )

  const hashHex = Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  const saltOut = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return { hash: hashHex, salt: saltOut }
}

async function verifyPassword(password, storedHash, storedSalt) {
  const { hash } = await hashPassword(password, storedSalt)
  return hash === storedHash
}

// ── Credential helpers ──────────────────────────────────────

function getCredentials() {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Ensure default credentials exist on first access. */
async function ensureCredentials() {
  let creds = getCredentials()
  if (!creds) {
    const { hash, salt } = await hashPassword(DEFAULT_PASSWORD)
    creds = { username: DEFAULT_USERNAME, hash, salt }
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds))
  }
  return creds
}

/**
 * Update username and/or password.
 * Requires the current password for verification.
 * Pass `null` for newUsername or newPassword to leave unchanged.
 */
async function updateCredentials(currentPassword, newUsername, newPassword) {
  const creds = getCredentials()
  if (!creds) throw new Error('No credentials found')

  const valid = await verifyPassword(currentPassword, creds.hash, creds.salt)
  if (!valid) throw new Error('Current password is incorrect')

  const updated = { ...creds }

  if (newUsername && newUsername.trim() !== creds.username) {
    updated.username = newUsername.trim()
  }

  if (newPassword) {
    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters')
    const { hash, salt } = await hashPassword(newPassword)
    updated.hash = hash
    updated.salt = salt
  }

  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated))
  return updated.username
}

// ── Provider ────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = useCallback(async (username, password) => {
    const creds = await ensureCredentials()

    if (username.trim() !== creds.username) {
      throw new Error('Invalid username or password')
    }
    const valid = await verifyPassword(password, creds.hash, creds.salt)
    if (!valid) {
      throw new Error('Invalid username or password')
    }
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, updateCredentials }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { // eslint-disable-line react-refresh/only-export-components
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
