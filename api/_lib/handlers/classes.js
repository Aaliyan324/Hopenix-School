import prisma from '../db.js'
import { verifyAuth, sendJson, handleAuthError, handleForbidden, handleBadRequest, handleServerError } from '../auth.js'

export default async function handler(req, res) {
  const method = req.method

  try {
    // GET: Publicly accessible so parents/students can load class/section/subject dropdowns on /daily-diary
    if (method === 'GET') {
      const [classes, subjects] = await Promise.all([
        prisma.class.findMany({
          include: {
            sections: {
              orderBy: { name: 'asc' },
            },
          },
          orderBy: { displayOrder: 'asc' },
        }),
        prisma.subject.findMany({
          orderBy: { name: 'asc' },
        }),
      ])

      return sendJson(res, 200, { success: true, classes, subjects })
    }

    // POST, PUT, DELETE require ADMIN role
    const auth = verifyAuth(req)
    if (!auth) return handleAuthError(res)
    if (auth.role !== 'ADMIN') return handleForbidden(res)

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
    const type = req.query?.type || body.type // 'class' | 'section' | 'subject'

    if (method === 'POST') {
      if (type === 'class') {
        const { name, displayOrder } = body
        if (!name) return handleBadRequest(res, 'Class name is required.')

        const count = await prisma.class.count()
        const createdClass = await prisma.class.create({
          data: {
            name: name.trim(),
            displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : count + 1,
          },
          include: { sections: true },
        })

        // Automatically create Section 'A' by default for convenience
        await prisma.section.create({
          data: {
            classId: createdClass.id,
            name: 'A',
          },
        })

        const refreshed = await prisma.class.findUnique({
          where: { id: createdClass.id },
          include: { sections: true },
        })

        return sendJson(res, 201, { success: true, class: refreshed })
      }

      if (type === 'section') {
        const { classId, name } = body
        if (!classId || !name) return handleBadRequest(res, 'Class ID and Section name are required.')

        const section = await prisma.section.create({
          data: {
            classId,
            name: name.trim().toUpperCase(),
          },
        })
        return sendJson(res, 201, { success: true, section })
      }

      if (type === 'subject') {
        const { name } = body
        if (!name) return handleBadRequest(res, 'Subject name is required.')

        const subject = await prisma.subject.create({
          data: {
            name: name.trim(),
          },
        })
        return sendJson(res, 201, { success: true, subject })
      }

      return handleBadRequest(res, 'Invalid entity type.')
    }

    if (method === 'PUT') {
      if (type === 'class') {
        const { id, name, displayOrder } = body
        if (!id) return handleBadRequest(res, 'Class ID required.')

        const updated = await prisma.class.update({
          where: { id },
          data: {
            ...(name && { name: name.trim() }),
            ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
          },
        })
        return sendJson(res, 200, { success: true, class: updated })
      }

      if (type === 'section') {
        const { id, name } = body
        if (!id || !name) return handleBadRequest(res, 'Section ID and name required.')

        const updated = await prisma.section.update({
          where: { id },
          data: { name: name.trim().toUpperCase() },
        })
        return sendJson(res, 200, { success: true, section: updated })
      }

      if (type === 'subject') {
        const { id, name } = body
        if (!id || !name) return handleBadRequest(res, 'Subject ID and name required.')

        const updated = await prisma.subject.update({
          where: { id },
          data: { name: name.trim() },
        })
        return sendJson(res, 200, { success: true, subject: updated })
      }
    }

    if (method === 'DELETE') {
      const id = req.query?.id || body.id
      if (!id) return handleBadRequest(res, 'ID is required.')

      if (type === 'class') {
        await prisma.class.delete({ where: { id } })
        return sendJson(res, 200, { success: true, message: 'Class deleted successfully.' })
      }
      if (type === 'section') {
        await prisma.section.delete({ where: { id } })
        return sendJson(res, 200, { success: true, message: 'Section deleted successfully.' })
      }
      if (type === 'subject') {
        await prisma.subject.delete({ where: { id } })
        return sendJson(res, 200, { success: true, message: 'Subject deleted successfully.' })
      }
    }

    return handleBadRequest(res, `Method ${method} not allowed`)
  } catch (error) {
    return handleServerError(res, error)
  }
}
