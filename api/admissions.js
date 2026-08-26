import prisma from '../src/lib/prisma.js'
import { requireRole } from './_lib/authUtils.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const method = req.method

  try {
    // 1. POST /api/admissions (Public submission)
    if (method === 'POST') {
      const { studentName, parentName, phone, email, classApplyingFor, message } = req.body || {}

      if (!studentName || !parentName || !phone || !email || !classApplyingFor) {
        return res.status(400).json({
          success: false,
          error: 'Student name, parent name, phone, email, and class are required.',
        })
      }

      const application = await prisma.admission.create({
        data: {
          studentName: studentName.trim(),
          parentName: parentName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          classApplyingFor: classApplyingFor.trim(),
          message: message ? message.trim() : null,
          status: 'PENDING',
        },
      })

      return res.status(201).json({
        success: true,
        data: {
          id: application.id,
          studentName: application.studentName,
          status: application.status,
          createdAt: application.createdAt,
        },
        message: 'Admission application submitted successfully.',
      })
    }

    // Admin authorization required for GET, PUT, DELETE
    requireRole(req, ['ADMIN'])

    // 2. GET /api/admissions (Admin view & filter)
    if (method === 'GET') {
      const { status, search, page = 1, limit = 20 } = req.query || {}

      const pageNum = Math.max(1, parseInt(page, 10) || 1)
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
      const skip = (pageNum - 1) * limitNum

      const where = {}
      if (status && status !== 'ALL') where.status = status
      if (search) {
        where.OR = [
          { studentName: { contains: search, mode: 'insensitive' } },
          { parentName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ]
      }

      const [total, items] = await Promise.all([
        prisma.admission.count({ where }),
        prisma.admission.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
      ])

      return res.status(200).json({
        success: true,
        data: items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      })
    }

    // 3. PUT /api/admissions (Update status)
    if (method === 'PUT') {
      const { id, status } = req.body || {}
      if (!id || !status) {
        return res.status(400).json({ success: false, error: 'Application ID and status are required' })
      }

      const validStatuses = ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status value' })
      }

      const updated = await prisma.admission.update({
        where: { id },
        data: { status },
      })

      return res.status(200).json({ success: true, data: updated })
    }

    // 4. DELETE /api/admissions (Delete application)
    if (method === 'DELETE') {
      const id = req.query?.id || req.body?.id
      if (!id) return res.status(400).json({ success: false, error: 'Application ID is required' })

      await prisma.admission.delete({ where: { id } })
      return res.status(200).json({ success: true, message: 'Application deleted successfully' })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error in /api/admissions:', error)
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Internal server error' })
  }
}
