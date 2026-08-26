import prisma from './lib/db.js'
import { verifyAuth, sendJson, handleAuthError, handleForbidden, handleBadRequest, handleServerError } from './lib/auth.js'

export default async function handler(req, res) {
  const method = req.method

  try {
    // Public POST: Parent Admission Form Submission
    if (method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
      const { studentName, parentName, phone, email, classApplyingFor, message } = body

      if (!studentName || !parentName || !phone || !classApplyingFor) {
        return handleBadRequest(res, 'Student name, parent name, phone number, and applying class are required.')
      }

      const application = await prisma.admission.create({
        data: {
          studentName: studentName.trim(),
          parentName: parentName.trim(),
          phone: phone.trim(),
          email: email ? email.trim() : null,
          classApplyingFor: classApplyingFor.trim(),
          message: message ? message.trim() : null,
          status: 'PENDING',
        },
      })

      return sendJson(res, 201, {
        success: true,
        message: 'Admission application submitted successfully.',
        applicationId: application.id,
      })
    }

    // Admin-only endpoints for GET, PUT, DELETE
    const auth = verifyAuth(req)
    if (!auth) return handleAuthError(res)
    if (auth.role !== 'ADMIN') return handleForbidden(res)

    // Admin List Applications
    if (method === 'GET') {
      const { status, search } = req.query || {}

      const where = {}
      if (status) where.status = status
      if (search) {
        where.OR = [
          { studentName: { contains: search, mode: 'insensitive' } },
          { parentName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      }

      const applications = await prisma.admission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })

      return sendJson(res, 200, { success: true, applications })
    }

    // Admin Update Application Status
    if (method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
      const { id, status } = body

      if (!id || !status) return handleBadRequest(res, 'Application ID and status are required.')

      const validStatuses = ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED']
      if (!validStatuses.includes(status)) {
        return handleBadRequest(res, 'Invalid status value.')
      }

      const updated = await prisma.admission.update({
        where: { id },
        data: { status },
      })

      return sendJson(res, 200, { success: true, application: updated })
    }

    // Admin Delete Application
    if (method === 'DELETE') {
      const id = req.query?.id || (typeof req.body === 'string' ? JSON.parse(req.body).id : req.body?.id)
      if (!id) return handleBadRequest(res, 'Application ID is required.')

      await prisma.admission.delete({ where: { id } })
      return sendJson(res, 200, { success: true, message: 'Application deleted successfully.' })
    }

    return handleBadRequest(res, `Method ${method} not allowed`)
  } catch (error) {
    return handleServerError(res, error)
  }
}
