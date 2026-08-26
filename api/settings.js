import prisma from './lib/db.js'
import { verifyAuth, sendJson, handleAuthError, handleForbidden, handleBadRequest, handleServerError } from './lib/auth.js'

export default async function handler(req, res) {
  const method = req.method

  try {
    if (method === 'GET') {
      let settings = await prisma.setting.findUnique({ where: { id: 'school_settings' } })
      if (!settings) {
        settings = await prisma.setting.create({
          data: {
            id: 'school_settings',
            schoolName: 'Hopenix School System',
          },
        })
      }
      return sendJson(res, 200, { success: true, settings })
    }

    if (method === 'PUT') {
      const auth = verifyAuth(req)
      if (!auth) return handleAuthError(res)
      if (auth.role !== 'ADMIN') return handleForbidden(res)

      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
      const { schoolName, contactEmail, contactPhone, address } = body

      const updated = await prisma.setting.upsert({
        where: { id: 'school_settings' },
        update: {
          ...(schoolName && { schoolName: schoolName.trim() }),
          ...(contactEmail !== undefined && { contactEmail: contactEmail ? contactEmail.trim() : null }),
          ...(contactPhone !== undefined && { contactPhone: contactPhone ? contactPhone.trim() : null }),
          ...(address !== undefined && { address: address ? address.trim() : null }),
        },
        create: {
          id: 'school_settings',
          schoolName: schoolName ? schoolName.trim() : 'Hopenix School System',
          contactEmail: contactEmail ? contactEmail.trim() : null,
          contactPhone: contactPhone ? contactPhone.trim() : null,
          address: address ? address.trim() : null,
        },
      })

      return sendJson(res, 200, { success: true, settings: updated })
    }

    return handleBadRequest(res, `Method ${method} not allowed`)
  } catch (error) {
    return handleServerError(res, error)
  }
}
