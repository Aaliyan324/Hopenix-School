import prisma from '../db.js'
import bcrypt from 'bcryptjs'
import { verifyAuth, sendJson, handleAuthError, handleForbidden, handleBadRequest, handleServerError } from '../auth.js'

export default async function handler(req, res) {
  const auth = verifyAuth(req)
  if (!auth) return handleAuthError(res)
  if (auth.role !== 'ADMIN') return handleForbidden(res)

  const method = req.method

  try {
    // List Teachers
    if (method === 'GET') {
      const teachers = await prisma.teacher.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              createdAt: true,
            },
          },
          assignments: {
            include: {
              class: { select: { id: true, name: true } },
              section: { select: { id: true, name: true } },
              subject: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      return sendJson(res, 200, { success: true, teachers })
    }

    // Create Teacher
    if (method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
      const { name, email, password, employeeId, phone } = body

      if (!name || !email || !password || !employeeId) {
        return handleBadRequest(res, 'Name, email, password, and employee ID are required.')
      }

      // Check existing email or employeeId
      const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
      if (existingUser) {
        return handleBadRequest(res, 'A user with this email already exists.')
      }

      const existingEmp = await prisma.teacher.findUnique({ where: { employeeId: employeeId.trim() } })
      if (existingEmp) {
        return handleBadRequest(res, 'A teacher with this Employee ID already exists.')
      }

      const passwordHash = await bcrypt.hash(password, 10)

      // Transaction: create User + Teacher profile
      const newTeacher = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            role: 'TEACHER',
            status: 'ACTIVE',
          },
        })

        const teacher = await tx.teacher.create({
          data: {
            userId: user.id,
            employeeId: employeeId.trim(),
            phone: phone ? phone.trim() : null,
          },
          include: {
            user: { select: { id: true, name: true, email: true, status: true } },
          },
        })

        return teacher
      })

      return sendJson(res, 201, { success: true, teacher: newTeacher })
    }

    // Update Teacher Details / Status / Password Reset
    if (method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
      const { id, name, email, phone, employeeId, status, newPassword } = body

      if (!id) return handleBadRequest(res, 'Teacher ID is required.')

      const teacher = await prisma.teacher.findUnique({
        where: { id },
        include: { user: true },
      })
      if (!teacher) return sendJson(res, 404, { success: false, error: 'Teacher not found.' })

      await prisma.$transaction(async (tx) => {
        // Update user
        const userData = {}
        if (name) userData.name = name.trim()
        if (email) userData.email = email.toLowerCase().trim()
        if (status) userData.status = status
        if (newPassword && newPassword.length >= 6) {
          userData.passwordHash = await bcrypt.hash(newPassword, 10)
        }

        if (Object.keys(userData).length > 0) {
          await tx.user.update({
            where: { id: teacher.userId },
            data: userData,
          })
        }

        // Update teacher profile
        const teacherData = {}
        if (phone !== undefined) teacherData.phone = phone ? phone.trim() : null
        if (employeeId) teacherData.employeeId = employeeId.trim()

        if (Object.keys(teacherData).length > 0) {
          await tx.teacher.update({
            where: { id },
            data: teacherData,
          })
        }
      })

      return sendJson(res, 200, { success: true, message: 'Teacher updated successfully.' })
    }

    // Delete Teacher
    if (method === 'DELETE') {
      const teacherId = req.query?.id || (typeof req.body === 'string' ? JSON.parse(req.body).id : req.body?.id)
      if (!teacherId) return handleBadRequest(res, 'Teacher ID is required.')

      const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } })
      if (!teacher) return sendJson(res, 404, { success: false, error: 'Teacher not found.' })

      // Cascade delete: Deleting user deletes teacher profile and assignments
      await prisma.user.delete({ where: { id: teacher.userId } })

      return sendJson(res, 200, { success: true, message: 'Teacher deleted successfully.' })
    }

    return handleBadRequest(res, `Method ${method} not allowed`)
  } catch (error) {
    return handleServerError(res, error)
  }
}
