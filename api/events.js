import prisma from '../src/lib/prisma.js'
import { requireRole } from './_lib/authUtils.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const method = req.method

  try {
    // 1. GET /api/events (Public & Admin list events)
    if (method === 'GET') {
      const id = req.query?.id
      if (id) {
        const event = await prisma.event.findUnique({ where: { id } })
        if (!event) return res.status(404).json({ success: false, error: 'Event not found' })
        return res.status(200).json({ success: true, data: event })
      }

      const showAll = req.query?.all === 'true'
      const where = showAll ? {} : { published: true }

      const events = await prisma.event.findMany({
        where,
        orderBy: { eventDate: 'asc' },
      })

      return res.status(200).json({ success: true, data: events })
    }

    // Admin authorization required for POST, PUT, DELETE
    requireRole(req, ['ADMIN'])

    // 2. POST /api/events (Create Event)
    if (method === 'POST') {
      const { title, description, eventDate, location, imageUrl, published } = req.body || {}
      if (!title || !description || !eventDate || !location) {
        return res.status(400).json({
          success: false,
          error: 'Title, description, eventDate, and location are required.',
        })
      }

      const newEvent = await prisma.event.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          eventDate: eventDate.trim(),
          location: location.trim(),
          imageUrl: imageUrl || null,
          published: published !== undefined ? Boolean(published) : true,
        },
      })

      return res.status(201).json({ success: true, data: newEvent })
    }

    // 3. PUT /api/events (Update Event / Publish Toggle)
    if (method === 'PUT') {
      const { id, title, description, eventDate, location, imageUrl, published } = req.body || {}
      if (!id) return res.status(400).json({ success: false, error: 'Event ID is required' })

      const updated = await prisma.event.update({
        where: { id },
        data: {
          ...(title && { title: title.trim() }),
          ...(description && { description: description.trim() }),
          ...(eventDate && { eventDate: eventDate.trim() }),
          ...(location && { location: location.trim() }),
          ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
          ...(published !== undefined && { published: Boolean(published) }),
        },
      })

      return res.status(200).json({ success: true, data: updated })
    }

    // 4. DELETE /api/events (Delete Event)
    if (method === 'DELETE') {
      const id = req.query?.id || req.body?.id
      if (!id) return res.status(400).json({ success: false, error: 'Event ID is required' })

      await prisma.event.delete({ where: { id } })
      return res.status(200).json({ success: true, message: 'Event deleted successfully' })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error in /api/events:', error)
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Internal server error' })
  }
}
