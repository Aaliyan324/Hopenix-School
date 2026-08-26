import prisma from '../src/lib/prisma.js'
import { requireRole } from './_lib/authUtils.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    requireRole(req, ['ADMIN', 'TEACHER'])

    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

    const { classId, sectionId } = req.query || {}

    // Return class summary / rosters if queried
    const where = {}
    if (classId) where.classId = classId
    if (sectionId) where.sectionId = sectionId

    const assignments = await prisma.teacherAssignment.findMany({
      where,
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: { include: { user: { select: { name: true } } } },
      },
    })

    return res.status(200).json({
      success: true,
      data: {
        assignments,
      },
    })
  } catch (error) {
    console.error('API Error in /api/students:', error)
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Internal server error' })
  }
}
