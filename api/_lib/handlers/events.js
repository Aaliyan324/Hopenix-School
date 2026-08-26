import prisma from '../db.js'
import { verifyAuth, sendJson, handleAuthError, handleForbidden, handleBadRequest, handleServerError } from '../auth.js'

export default async function handler(req, res) {
  const method = req.method

  try {
    // GET Events
    if (method === 'GET') {
      const auth = verifyAuth(req)
      const isAdmin = auth?.role === 'ADMIN'

      const where = isAdmin ? {} : { published: true }

      const events = await prisma.event.findMany({
        where,
        orderBy: { eventDate: 'asc' },
      })

      return sendJson(res, 200, { success: true, events })
    }

    // POST, PUT, DELETE require ADMIN
    const auth = verifyAuth(req)
    if (!auth) return handleAuthError(res)
    if (auth.role !== 'ADMIN') return handleForbidden(res)

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})

    // Create Event
    if (method === 'POST') {
      const { title, description, eventDate, location, imageUrl, published } = body
      if (!title || !description || !eventDate) {
        return handleBadRequest(res, 'Title, description, and event date are required.')
      }

      const event = await prisma.event.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          eventDate: eventDate.trim(),
          location: location ? location.trim() : null,
          imageUrl: imageUrl || null,
          published: published !== undefined ? Boolean(published) : true,
        },
      })

      return sendJson(res, 201, { success: true, event })
    }

    // Update Event
    if (method === 'PUT') {
      const { id, title, description, eventDate, location, imageUrl, published } = body
      if (!id) return handleBadRequest(res, 'Event ID is required.')

      const updated = await prisma.event.update({
        where: { id },
        data: {
          ...(title && { title: title.trim() }),
          ...(description && { description: description.trim() }),
          ...(eventDate && { eventDate: eventDate.trim() }),
          ...(location !== undefined && { location: location ? location.trim() : null }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(published !== undefined && { published: Boolean(published) }),
        },
      })

      return sendJson(res, 200, { success: true, event: updated })
    }

    // Delete Event
    if (method === 'DELETE') {
      const id = req.query?.id || body.id
      if (!id) return handleBadRequest(res, 'Event ID is required.')

      await prisma.event.delete({ where: { id } })
      return sendJson(res, 200, { success: true, message: 'Event deleted successfully.' })
    }

    return handleBadRequest(res, `Method ${method} not allowed`)
  } catch (error) {
    return handleServerError(res, error)
  }
}
