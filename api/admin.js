import prisma from '../src/lib/prisma.js'
import { requireRole } from './_lib/authUtils.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    requireRole(req, ['ADMIN'])

    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

    const todayStr = new Date().toISOString().split('T')[0]

    // Parallel SQL aggregations for dashboard metrics
    const [
      totalTeachers,
      totalClasses,
      totalSubjects,
      totalDiaryEntries,
      todaysDiaryCount,
      pendingAdmissionsCount,
      upcomingEventsCount,
      recentDiary,
      recentAdmissions,
    ] = await Promise.all([
      prisma.teacher.count(),
      prisma.class.count(),
      prisma.subject.count(),
      prisma.diary.count(),
      prisma.diary.count({ where: { date: todayStr } }),
      prisma.admission.count({ where: { status: 'PENDING' } }),
      prisma.event.count({ where: { published: true } }),
      prisma.diary.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: { include: { user: { select: { name: true } } } },
          class: true,
          section: true,
          subject: true,
        },
      }),
      prisma.admission.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return res.status(200).json({
      success: true,
      data: {
        totalTeachers,
        totalClasses,
        totalSubjects,
        totalDiaryEntries,
        todaysDiaryCount,
        pendingAdmissionsCount,
        upcomingEventsCount,
        recentDiary,
        recentAdmissions,
      },
    })
  } catch (error) {
    console.error('API Error in /api/admin:', error)
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Internal server error' })
  }
}
