import prisma from './lib/db.js'
import { verifyAuth, sendJson, handleAuthError, handleServerError } from './lib/auth.js'

export default async function handler(req, res) {
  const auth = verifyAuth(req)
  if (!auth) return handleAuthError(res)

  try {
    // Basic student overview query (returns count or info by class)
    const { classId } = req.query || {}

    const count = await prisma.admission.count({
      where: {
        status: 'APPROVED',
        ...(classId && { classApplyingFor: classId }),
      },
    })

    return sendJson(res, 200, {
      success: true,
      enrolledStudentsCount: count,
    })
  } catch (error) {
    return handleServerError(res, error)
  }
}
