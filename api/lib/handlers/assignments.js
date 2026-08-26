import prisma from '../db.js'
import { verifyAuth, sendJson, handleAuthError, handleForbidden, handleBadRequest, handleServerError } from '../auth.js'

export default async function handler(req, res) {
  const auth = verifyAuth(req)
  if (!auth) return handleAuthError(res)

  const method = req.method

  try {
    if (method === 'GET') {
      const teacherId = req.query?.teacherId || (auth.role === 'TEACHER' ? auth.teacherId : null)

      const where = teacherId ? { teacherId } : {}

      const assignments = await prisma.teacherAssignment.findMany({
        where,
        include: {
          teacher: {
            include: { user: { select: { name: true, email: true } } },
          },
          class: true,
          section: true,
          subject: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      return sendJson(res, 200, { success: true, assignments })
    }

    if (auth.role !== 'ADMIN') return handleForbidden(res)

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})

    if (method === 'POST') {
      const { teacherId, classId, sectionId, subjectId } = body
      if (!teacherId || !classId || !sectionId || !subjectId) {
        return handleBadRequest(res, 'Teacher, Class, Section, and Subject IDs are required.')
      }

      const existing = await prisma.teacherAssignment.findUnique({
        where: {
          teacherId_classId_sectionId_subjectId: {
            teacherId,
            classId,
            sectionId,
            subjectId,
          },
        },
      })

      if (existing) {
        return handleBadRequest(res, 'This assignment already exists for the teacher.')
      }

      const assignment = await prisma.teacherAssignment.create({
        data: { teacherId, classId, sectionId, subjectId },
        include: {
          class: true,
          section: true,
          subject: true,
        },
      })

      return sendJson(res, 201, { success: true, assignment })
    }

    if (method === 'DELETE') {
      const id = req.query?.id || body.id
      if (!id) return handleBadRequest(res, 'Assignment ID required.')

      await prisma.teacherAssignment.delete({ where: { id } })
      return sendJson(res, 200, { success: true, message: 'Assignment removed successfully.' })
    }

    return handleBadRequest(res, `Method ${method} not allowed`)
  } catch (error) {
    return handleServerError(res, error)
  }
}
