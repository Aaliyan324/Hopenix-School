import prisma from './lib/db.js'
import bcrypt from 'bcryptjs'
import { signToken, verifyAuth, sendJson, handleAuthError, handleBadRequest, handleServerError } from './lib/auth.js'

export default async function handler(req, res) {
  const method = req.method

  try {
    if (method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
      const action = req.query?.action || body.action || 'login'

      if (action === 'login') {
        const { email, password } = body
        if (!email || !password) {
          return handleBadRequest(res, 'Email and password are required.')
        }

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          include: { teacher: true },
        })

        if (!user || user.status !== 'ACTIVE') {
          return handleAuthError(res, 'Invalid email or password.')
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) {
          return handleAuthError(res, 'Invalid email or password.')
        }

        const token = signToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          teacherId: user.teacher?.id || null,
        })

        return sendJson(res, 200, {
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            teacherId: user.teacher?.id || null,
            employeeId: user.teacher?.employeeId || null,
          },
        })
      }

      if (action === 'change-password') {
        const auth = verifyAuth(req)
        if (!auth) return handleAuthError(res)

        const { currentPassword, newPassword } = body
        if (!currentPassword || !newPassword || newPassword.length < 6) {
          return handleBadRequest(res, 'New password must be at least 6 characters long.')
        }

        const user = await prisma.user.findUnique({ where: { id: auth.userId } })
        if (!user) return handleAuthError(res)

        const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
        if (!isValid) {
          return handleBadRequest(res, 'Current password is incorrect.')
        }

        const newHash = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: newHash },
        })

        return sendJson(res, 200, { success: true, message: 'Password updated successfully.' })
      }
    }

    if (method === 'GET') {
      const auth = verifyAuth(req)
      if (!auth) return handleAuthError(res)

      const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        include: { teacher: true },
      })

      if (!user) return handleAuthError(res)

      return sendJson(res, 200, {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          teacherId: user.teacher?.id || null,
          employeeId: user.teacher?.employeeId || null,
        },
      })
    }

    return handleBadRequest(res, `Method ${method} not allowed`)
  } catch (error) {
    return handleServerError(res, error)
  }
}
