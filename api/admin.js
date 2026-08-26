import prisma from './lib/db.js'
import { verifyAuth, sendJson, handleAuthError, handleForbidden, handleServerError } from './lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { success: false, error: 'Method not allowed' })
  }

  try {
    const auth = verifyAuth(req)
    if (!auth) return handleAuthError(res)
    if (auth.role !== 'ADMIN') return handleForbidden(res)

    const todayISO = new Date().toISOString().split('T')[0]

    // Parallel SQL queries using Prisma aggregates
    const [
      totalTeachers,
      totalClasses,
      totalSubjects,
      totalDiaryEntries,
      todayDiaryEntries,
      pendingAdmissions,
      totalAdmissions,
      totalEvents,
      recentDiary,
      recentAdmissions,
    ] = await Promise.all([
      prisma.teacher.count(),
      prisma.class.count(),
      prisma.subject.count(),
      prisma.diary.count(),
      prisma.diary.count({ where: { date: todayISO } }),
      prisma.admission.count({ where: { status: 'PENDING' } }),
      prisma.admission.count(),
      prisma.event.count(),
      prisma.diary.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: { include: { user: { select: { name: true } } } },
          class: { select: { name: true } },
          section: { select: { name: true } },
          subject: { select: { name: true } },
        },
      }),
      prisma.admission.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return sendJson(res, 200, {
      success: true,
      stats: {
        totalTeachers,
        totalClasses,
        totalSubjects,
        totalDiaryEntries,
        todayDiaryEntries,
        pendingAdmissions,
        totalAdmissions,
        totalEvents,
      },
      recentActivity: {
        recentDiary,
        recentAdmissions,
      },
    })
  } catch (error) {
    return handleServerError(res, error)
  }
}
