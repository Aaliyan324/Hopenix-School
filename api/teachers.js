import prisma from '../src/lib/prisma.js'
import { requireRole, hashPassword } from './_lib/authUtils.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  const method = req.method

  try {
    // 1. GET /api/teachers (List teachers)
    if (method === 'GET') {
      requireRole(req, ['ADMIN', 'TEACHER'])

      const id = req.query?.id
      if (id) {
        const teacher = await prisma.teacher.findUnique({
          where: { id },
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
            },
            assignments: {
              include: {
                class: true,
                section: true,
                subject: true,
              },
            },
          },
        })
        if (!teacher) return res.status(404).json({ success: false, error: 'Teacher not found' })
        return res.status(200).json({ success: true, data: teacher })
      }

      const teachers = await prisma.teacher.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
          },
          assignments: {
            include: {
              class: true,
              section: true,
              subject: true,
            },
          },
        },
      })

      return res.status(200).json({ success: true, data: teachers })
    }

    // Admin authorization required for POST, PUT, DELETE
    requireRole(req, ['ADMIN'])

    // 2. POST /api/teachers (Create Teacher)
    if (method === 'POST') {
      const { name, email, password, employeeId, phone, assignments } = req.body || {}

      if (!name || !email || !password || !employeeId) {
        return res.status(400).json({
          success: false,
          error: 'Name, email, password, and employee ID are required.',
        })
      }

      // Check for existing user or teacher ID
      const existingUser = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
      if (existingUser) {
        return res.status(409).json({ success: false, error: 'User with this email already exists' })
      }

      const existingEmp = await prisma.teacher.findUnique({ where: { employeeId: employeeId.trim() } })
      if (existingEmp) {
        return res.status(409).json({ success: false, error: 'Teacher with this Employee ID already exists' })
      }

      const passwordHash = await hashPassword(password)

      // Execute SQL Transaction
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
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
        })

        if (Array.isArray(assignments) && assignments.length > 0) {
          for (const assign of assignments) {
            if (assign.classId && assign.sectionId && assign.subjectId) {
              await tx.teacherAssignment.create({
                data: {
                  teacherId: teacher.id,
                  classId: assign.classId,
                  sectionId: assign.sectionId,
                  subjectId: assign.subjectId,
                },
              })
            }
          }
        }

        return tx.teacher.findUnique({
          where: { id: teacher.id },
          include: {
            user: { select: { id: true, name: true, email: true, status: true } },
            assignments: { include: { class: true, section: true, subject: true } },
          },
        })
      })

      return res.status(201).json({ success: true, data: result })
    }

    // 3. PUT /api/teachers (Update / Disable / Reset Password)
    if (method === 'PUT') {
      const { id, name, phone, status, password } = req.body || {}
      if (!id) return res.status(400).json({ success: false, error: 'Teacher ID is required' })

      const teacher = await prisma.teacher.findUnique({ where: { id } })
      if (!teacher) return res.status(404).json({ success: false, error: 'Teacher not found' })

      const updateUserData = {}
      if (name) updateUserData.name = name.trim()
      if (status) updateUserData.status = status
      if (password) updateUserData.passwordHash = await hashPassword(password)

      const updated = await prisma.$transaction(async (tx) => {
        if (Object.keys(updateUserData).length > 0) {
          await tx.user.update({
            where: { id: teacher.userId },
            data: updateUserData,
          })
        }

        if (phone !== undefined) {
          await tx.teacher.update({
            where: { id },
            data: { phone: phone ? phone.trim() : null },
          })
        }

        return tx.teacher.findUnique({
          where: { id },
          include: {
            user: { select: { id: true, name: true, email: true, status: true } },
            assignments: { include: { class: true, section: true, subject: true } },
          },
        })
      })

      return res.status(200).json({ success: true, data: updated })
    }

    // 4. DELETE /api/teachers (Delete Teacher)
    if (method === 'DELETE') {
      const { id } = req.query?.id ? req.query : req.body || {}
      if (!id) return res.status(400).json({ success: false, error: 'Teacher ID is required' })

      const teacher = await prisma.teacher.findUnique({ where: { id } })
      if (!teacher) return res.status(404).json({ success: false, error: 'Teacher not found' })

      // Delete User (Cascades to Teacher & Assignments)
      await prisma.user.delete({ where: { id: teacher.userId } })

      return res.status(200).json({ success: true, message: 'Teacher deleted successfully' })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error in /api/teachers:', error)
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Internal server error' })
  }
}
