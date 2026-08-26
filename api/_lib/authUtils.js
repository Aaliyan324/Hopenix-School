import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET || 'hopenix-school-jwt-secret-key-2026'

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10)
}

export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash)
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}

export function getAuthUser(req) {
  let token = null

  // 1. Authorization header: Bearer <token>
  const authHeader = req.headers?.authorization || req.headers?.Authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  }

  // 2. Cookie header: token=<token>
  if (!token && req.headers?.cookie) {
    const cookies = Object.fromEntries(
      req.headers.cookie.split(';').map((c) => {
        const [k, v] = c.trim().split('=')
        return [k, decodeURIComponent(v || '')]
      })
    )
    token = cookies.auth_token || cookies.token
  }

  if (!token) return null
  return verifyToken(token)
}

export function requireRole(req, roles = []) {
  const user = getAuthUser(req)
  if (!user) {
    throw { status: 401, message: 'Unauthorized. Authentication token missing or invalid.' }
  }
  if (roles.length > 0 && !roles.includes(user.role)) {
    throw { status: 403, message: 'Forbidden. You do not have permission for this resource.' }
  }
  return user
}
