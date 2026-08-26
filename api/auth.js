import prisma from '../src/lib/prisma.js'
import { comparePassword, hashPassword, generateToken, getAuthUser } from './_lib/authUtils.js'

export default async function handler(req, res) {
  // CORS & Content-Type
  res.setHeader('Content-Type', 'application/json')

  const method = req.method
  const action = req.query?.action || req.body?.action

  try {
    // 1. GET /api/auth (me)
    if (method === 'GET') {
      const authUser = getAuthUser(req)
      if (!authUser) {
        return res.status(401).json({ success: false, error: 'Not authenticated' })
      }

      const user = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          teacher: {
            select: {
              id: true,
              employeeId: true,
              phone: true,
              assignments: {
                include: {
                  class: true,
                  section: true,
                  subject: true,
                },
              },
            },
          },
        },
      })

      if (!user || user.status !== 'ACTIVE') {
        return res.status(401).json({ success: false, error: 'User account is disabled or not found' })
      }

      return res.status(200).json({ success: true, data: user })
    }

    // 2. POST /api/auth (login / logout)
    if (method === 'POST') {
      if (action === 'logout') {
        res.setHeader('Set-Cookie', 'auth_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')
        return res.status(200).json({ success: true, message: 'Logged out successfully' })
      }

      // Default POST action is login
      const { email, password } = req.body || {}
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' })
      }

      const user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
        include: {
          teacher: {
            include: {
              assignments: {
                include: {
                  class: true,
                  section: true,
                  subject: true,
                },
              },
            },
          },
        },
      })

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' })
      }

      if (user.status !== 'ACTIVE') {
        return res.status(403).json({ success: false, error: 'Account is disabled. Contact administrator.' })
      }

      const valid = await comparePassword(password, user.passwordHash)
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' })
      }

      const tokenPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teacherId: user.teacher?.id || null,
      }

      const token = generateToken(tokenPayload)

      // Set HTTP-Only Cookie
      res.setHeader(
        'Set-Cookie',
        `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
      )

      const { passwordHash, ...userWithoutPassword } = user

      return res.status(200).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
      })
    }

    // 3. PUT /api/auth (change password)
    if (method === 'PUT') {
      const authUser = getAuthUser(req)
      if (!authUser) {
        return res.status(401).json({ success: false, error: 'Unauthorized' })
      }

      const { currentPassword, newPassword } = req.body || {}
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, error: 'Current and new password are required' })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' })
      }

      const dbUser = await prisma.user.findUnique({ where: { id: authUser.id } })
      const isValid = await comparePassword(currentPassword, dbUser.passwordHash)
      if (!isValid) {
        return res.status(400).json({ success: false, error: 'Current password is incorrect' })
      }

      const newHash = await hashPassword(newPassword)
      await prisma.user.update({
        where: { id: authUser.id },
        data: { passwordHash: newHash },
      })

      return res.status(200).json({ success: true, message: 'Password updated successfully' })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error in /api/auth:', error)
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Internal server error' })
  }
}
