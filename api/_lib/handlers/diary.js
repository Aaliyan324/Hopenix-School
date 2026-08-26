import prisma from '../db.js'
import { verifyAuth, sendJson, handleAuthError, handleForbidden, handleBadRequest, handleServerError } from '../auth.js'

export default async function handler(req, res) {
  const method = req.method

  try {
    // ── GET: List & Search Diary Entries ──────────────────────────────
    if (method === 'GET') {
      const {
        classId,
        sectionId,
        subjectId,
        date,
        teacherId,
        page = '1',
        limit = '20',
      } = req.query || {}

      const pageNum = Math.max(1, parseInt(page))
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
      const skip = (pageNum - 1) * limitNum

      const where = {}
      if (classId) where.classId = classId
      if (sectionId) where.sectionId = sectionId
      if (subjectId) where.subjectId = subjectId
      if (date) where.date = date
      if (teacherId) where.teacherId = teacherId

      const [total, diaries] = await Promise.all([
        prisma.diary.count({ where }),
        prisma.diary.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
          include: {
            teacher: {
              include: { user: { select: { name: true, email: true } } },
            },
            class: { select: { id: true, name: true } },
            section: { select: { id: true, name: true } },
            subject: { select: { id: true, name: true } },
          },
        }),
      ])

      return sendJson(res, 200, {
        success: true,
        data: diaries,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      })
    }

    // ── Authentication Required for POST, PUT, DELETE ───────────────
    const auth = verifyAuth(req)
    if (!auth) return handleAuthError(res)

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})

    // ── POST: Create Daily Diary Entry ─────────────────────────────
    if (method === 'POST') {
      const { classId, sectionId, subjectId, date, homework, diary, notes, attachmentUrl } = body

      if (!classId || !sectionId || !subjectId || !date || !homework) {
        return handleBadRequest(res, 'Class, Section, Subject, Date, and Homework fields are required.')
      }

      let effectiveTeacherId = auth.teacherId

      // If user is ADMIN, they can provide a teacherId or default to system
      if (auth.role === 'ADMIN') {
        if (body.teacherId) {
          effectiveTeacherId = body.teacherId
        } else {
          // Find first teacher or admin teacher profile
          const firstTeacher = await prisma.teacher.findFirst()
          if (!firstTeacher) {
            return handleBadRequest(res, 'No teacher profile available in system.')
          }
          effectiveTeacherId = firstTeacher.id
        }
      } else if (auth.role === 'TEACHER') {
        if (!auth.teacherId) {
          return handleForbidden(res, 'Teacher profile not found.')
        }

        // STRICT TEACHER AUTHORIZATION CHECK
        const assignment = await prisma.teacherAssignment.findFirst({
          where: {
            teacherId: auth.teacherId,
            classId,
            sectionId,
            subjectId,
          },
        })

        if (!assignment) {
          return handleForbidden(res, 'You are not assigned to publish diary entries for this class, section, or subject.')
        }
      } else {
        return handleForbidden(res)
      }

      const newEntry = await prisma.diary.create({
        data: {
          teacherId: effectiveTeacherId,
          classId,
          sectionId,
          subjectId,
          date: date.trim(),
          homework: homework.trim(),
          diary: diary ? diary.trim() : null,
          notes: notes ? notes.trim() : null,
          attachmentUrl: attachmentUrl || null,
        },
        include: {
          teacher: { include: { user: { select: { name: true } } } },
          class: { select: { name: true } },
          section: { select: { name: true } },
          subject: { select: { name: true } },
        },
      })

      return sendJson(res, 201, { success: true, diary: newEntry })
    }

    // ── PUT: Update Daily Diary Entry ──────────────────────────────
    if (method === 'PUT') {
      const { id, homework, diary, notes, attachmentUrl, date } = body
      if (!id) return handleBadRequest(res, 'Diary entry ID is required.')

      const existing = await prisma.diary.findUnique({ where: { id } })
      if (!existing) return sendJson(res, 404, { success: false, error: 'Diary entry not found.' })

      // Authorization Check
      if (auth.role === 'TEACHER' && existing.teacherId !== auth.teacherId) {
        return handleForbidden(res, 'You can only edit your own diary entries.')
      }

      const updated = await prisma.diary.update({
        where: { id },
        data: {
          ...(homework !== undefined && { homework: homework.trim() }),
          ...(diary !== undefined && { diary: diary ? diary.trim() : null }),
          ...(notes !== undefined && { notes: notes ? notes.trim() : null }),
          ...(attachmentUrl !== undefined && { attachmentUrl }),
          ...(date && { date: date.trim() }),
        },
        include: {
          teacher: { include: { user: { select: { name: true } } } },
          class: { select: { name: true } },
          section: { select: { name: true } },
          subject: { select: { name: true } },
        },
      })

      return sendJson(res, 200, { success: true, diary: updated })
    }

    // ── DELETE: Remove Daily Diary Entry ───────────────────────────
    if (method === 'DELETE') {
      const id = req.query?.id || body.id
      if (!id) return handleBadRequest(res, 'Diary entry ID is required.')

      const existing = await prisma.diary.findUnique({ where: { id } })
      if (!existing) return sendJson(res, 404, { success: false, error: 'Diary entry not found.' })

      if (auth.role === 'TEACHER' && existing.teacherId !== auth.teacherId) {
        return handleForbidden(res, 'You can only delete your own diary entries.')
      }

      await prisma.diary.delete({ where: { id } })
      return sendJson(res, 200, { success: true, message: 'Diary entry deleted successfully.' })
    }

    return handleBadRequest(res, `Method ${method} not allowed`)
  } catch (error) {
    return handleServerError(res, error)
  }
}
