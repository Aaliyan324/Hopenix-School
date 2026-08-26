import prisma from '../src/lib/prisma.js'
import { requireRole } from './_lib/authUtils.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const method = req.method

  try {
    // 1. GET /api/assignments
    if (method === 'GET') {
      const user = requireRole(req, ['ADMIN', 'TEACHER'])
      const teacherId = req.query?.teacherId || (user.role === 'TEACHER' ? user.teacherId : null)

      const where = teacherId ? { teacherId } : {}
      const assignments = await prisma.teacherAssignment.findMany({
        where,
        include: {
          teacher: { include: { user: { select: { name: true, email: true } } } },
          class: true,
          section: true,
          subject: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      return res.status(200).json({ success: true, data: assignments })
    }

    // Admin authorization required for POST and DELETE
    requireRole(req, ['ADMIN'])

    // 2. POST /api/assignments (Create Assignment)
    if (method === 'POST') {
      const { teacherId, classId, sectionId, subjectId } = req.body || {}
      if (!teacherId || !classId || !sectionId || !subjectId) {
        return res.status(400).json({
          success: false,
          error: 'teacherId, classId, sectionId, and subjectId are required.',
        })
      }

      // Check duplicate
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
        return res.status(409).json({ success: false, error: 'Teacher is already assigned to this class, section, and subject.' })
      }

      const assignment = await prisma.teacherAssignment.create({
        data: { teacherId, classId, sectionId, subjectId },
        include: { class: true, section: true, subject: true, teacher: { include: { user: true } } },
      })

      return res.status(201).json({ success: true, data: assignment })
    }

    // 3. DELETE /api/assignments (Remove Assignment)
    if (method === 'DELETE') {
      const id = req.query?.id || req.body?.id
      if (!id) return res.status(400).json({ success: false, error: 'Assignment ID is required' })

      await prisma.teacherAssignment.delete({ where: { id } })
      return res.status(200).json({ success: true, message: 'Assignment removed successfully' })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error in /api/assignments:', error)
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Internal server error' })
  }
}
