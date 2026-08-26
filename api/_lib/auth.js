import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'hopenix-dev-jwt-secret-2026-key'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function parseAuthHeader(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  // Check cookie if provided
  if (req.cookies && req.cookies.token) {
    return req.cookies.token
  }
  return null
}

export function verifyAuth(req) {
  const token = parseAuthHeader(req)
  if (!token) return null
  return verifyToken(token)
}

export function sendJson(res, statusCode, data) {
  if (typeof res.status === 'function') {
    return res.status(statusCode).json(data)
  }
  // Standard Node HTTP fallback
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export function handleAuthError(res, message = 'Unauthorized access') {
  return sendJson(res, 401, { success: false, error: message })
}

export function handleForbidden(res, message = 'Forbidden: insufficient privileges') {
  return sendJson(res, 403, { success: false, error: message })
}

export function handleBadRequest(res, message = 'Bad request') {
  return sendJson(res, 400, { success: false, error: message })
}

export function handleServerError(res, error) {
  console.error('API Server Error:', error)
  const message = process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  return sendJson(res, 500, { success: false, error: message })
}
