import prisma from '../src/lib/prisma.js'
import { getAuthUser, requireRole } from './_lib/authUtils.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const method = req.method

  try {
    // 1. GET /api/diary (Public & Dashboard query with pagination & DB filtering)
    if (method === 'GET') {
      const {
        date,
        classId,
        sectionId,
        subjectId,
        teacherId,
        page = 1,
        limit = 20,
      } = req.query || {}

      const pageNum = Math.max(1, parseInt(page, 10) || 1)
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
      const skip = (pageNum - 1) * limitNum

      const where = {}
      if (date) where.date = date
      if (classId) where.classId = classId
      if (sectionId) where.sectionId = sectionId
      if (subjectId) where.subjectId = subjectId
      if (teacherId) where.teacherId = teacherId

      const [total, diaries] = await Promise.all([
        prisma.diary.count({ where }),
        prisma.diary.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
          include: {
            class: true,
            section: true,
            subject: true,
            teacher: {
              include: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        }),
      ])

      return res.status(200).json({
        success: true,
        data: diaries,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      })
    }

    // Authentication required for POST, PUT, DELETE
    const authUser = requireRole(req, ['ADMIN', 'TEACHER'])

    // 2. POST /api/diary (Publish Daily Diary)
    if (method === 'POST') {
      const { date, classId, sectionId, subjectId, homework, diary, notes, attachmentUrl } = req.body || {}

      if (!date || !classId || !sectionId || !subjectId || !homework || !diary) {
        return res.status(400).json({
          success: false,
          error: 'Date, Class, Section, Subject, Homework, and Diary are required.',
        })
      }

      let teacherId = null

      if (authUser.role === 'TEACHER') {
        // Find teacher record for logged in user
        const teacher = await prisma.teacher.findUnique({
          where: { userId: authUser.id },
        })
        if (!teacher) {
          return res.status(403).json({ success: false, error: 'Teacher profile not found' })
        }
        teacherId = teacher.id

        // SERVER-SIDE AUTHORIZATION VERIFICATION:
        // Verify teacher assignment in database before allowing diary creation!
        const assignment = await prisma.teacherAssignment.findUnique({
          where: {
            teacherId_classId_sectionId_subjectId: {
              teacherId,
              classId,
              sectionId,
              subjectId,
            },
          },
        })

        if (!assignment) {
          return res.status(403).json({
            success: false,
            error: 'Forbidden. You are not assigned to publish diary for this class, section, and subject.',
          })
        }
      } else {
        // ADMIN can assign to specified teacherId or default to first teacher
        teacherId = req.body.teacherId
        if (!teacherId) {
          const firstTeacher = await prisma.teacher.findFirst()
          if (!firstTeacher) {
            return res.status(400).json({ success: false, error: 'No teacher available in system' })
          }
          teacherId = firstTeacher.id
        }
      }

      const newEntry = await prisma.diary.create({
        data: {
          teacherId,
          classId,
          sectionId,
          subjectId,
          date,
          homework,
          diary,
          notes: notes || null,
          attachmentUrl: attachmentUrl || null,
        },
        include: {
          class: true,
          section: true,
          subject: true,
          teacher: { include: { user: { select: { name: true } } } },
        },
      })

      return res.status(201).json({ success: true, data: newEntry })
    }

    // 3. PUT /api/diary (Edit Daily Diary)
    if (method === 'PUT') {
      const { id, homework, diary, notes, attachmentUrl } = req.body || {}
      if (!id) return res.status(400).json({ success: false, error: 'Diary ID is required' })

      const existing = await prisma.diary.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Diary entry not found' })

      if (authUser.role === 'TEACHER') {
        const teacher = await prisma.teacher.findUnique({ where: { userId: authUser.id } })
        if (!teacher || existing.teacherId !== teacher.id) {
          return res.status(403).json({ success: false, error: 'Forbidden. You can only edit your own diary entries.' })
        }
      }

      const updated = await prisma.diary.update({
        where: { id },
        data: {
          ...(homework !== undefined && { homework }),
          ...(diary !== undefined && { diary }),
          ...(notes !== undefined && { notes: notes || null }),
          ...(attachmentUrl !== undefined && { attachmentUrl: attachmentUrl || null }),
        },
        include: {
          class: true,
          section: true,
          subject: true,
          teacher: { include: { user: { select: { name: true } } } },
        },
      })

      return res.status(200).json({ success: true, data: updated })
    }

    // 4. DELETE /api/diary (Delete Daily Diary)
    if (method === 'DELETE') {
      const id = req.query?.id || req.body?.id
      if (!id) return res.status(400).json({ success: false, error: 'Diary ID is required' })

      const existing = await prisma.diary.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Diary entry not found' })

      if (authUser.role === 'TEACHER') {
        const teacher = await prisma.teacher.findUnique({ where: { userId: authUser.id } })
        if (!teacher || existing.teacherId !== teacher.id) {
          return res.status(403).json({ success: false, error: 'Forbidden. You can only delete your own diary entries.' })
        }
      }

      await prisma.diary.delete({ where: { id } })
      return res.status(200).json({ success: true, message: 'Diary entry deleted successfully' })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error in /api/diary:', error)
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Internal server error' })
  }
}
