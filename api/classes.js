import prisma from '../src/lib/prisma.js'
import { requireRole } from './_lib/authUtils.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const method = req.method

  try {
    // 1. GET /api/classes (Public / Auth: list classes, sections, subjects)
    if (method === 'GET') {
      const type = req.query?.type // 'classes' | 'subjects' | 'all' (default)

      if (type === 'subjects') {
        const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })
        return res.status(200).json({ success: true, data: subjects })
      }

      const classes = await prisma.class.findMany({
        orderBy: { displayOrder: 'asc' },
        include: {
          sections: {
            orderBy: { name: 'asc' },
          },
        },
      })

      const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })

      return res.status(200).json({
        success: true,
        data: {
          classes,
          subjects,
        },
      })
    }

    // Admin authorization required for modification
    requireRole(req, ['ADMIN'])

    // 2. POST /api/classes (Create Class / Section / Subject)
    if (method === 'POST') {
      const { type, name, classId, displayOrder } = req.body || {}

      if (type === 'section') {
        if (!classId || !name) {
          return res.status(400).json({ success: false, error: 'classId and section name are required' })
        }
        const section = await prisma.section.create({
          data: { classId, name: name.trim().toUpperCase() },
        })
        return res.status(201).json({ success: true, data: section })
      }

      if (type === 'subject') {
        if (!name) {
          return res.status(400).json({ success: false, error: 'Subject name is required' })
        }
        const subject = await prisma.subject.create({
          data: { name: name.trim() },
        })
        return res.status(201).json({ success: true, data: subject })
      }

      // Default type: Class
      if (!name) {
        return res.status(400).json({ success: false, error: 'Class name is required' })
      }

      const count = await prisma.class.count()
      const newClass = await prisma.class.create({
        data: {
          name: name.trim(),
          displayOrder: displayOrder !== undefined ? Number(displayOrder) : count + 1,
          sections: {
            create: [{ name: 'A' }, { name: 'B' }],
          },
        },
        include: { sections: true },
      })

      return res.status(201).json({ success: true, data: newClass })
    }

    // 3. PUT /api/classes (Update Class / Subject)
    if (method === 'PUT') {
      const { type, id, name, displayOrder } = req.body || {}
      if (!id) return res.status(400).json({ success: false, error: 'Item ID is required' })

      if (type === 'subject') {
        const subject = await prisma.subject.update({
          where: { id },
          data: { name: name.trim() },
        })
        return res.status(200).json({ success: true, data: subject })
      }

      const updatedClass = await prisma.class.update({
        where: { id },
        data: {
          ...(name && { name: name.trim() }),
          ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
        },
        include: { sections: true },
      })
      return res.status(200).json({ success: true, data: updatedClass })
    }

    // 4. DELETE /api/classes (Delete Class / Section / Subject)
    if (method === 'DELETE') {
      const { type, id } = req.query?.id ? req.query : req.body || {}
      if (!id) return res.status(400).json({ success: false, error: 'ID is required' })

      if (type === 'section') {
        await prisma.section.delete({ where: { id } })
        return res.status(200).json({ success: true, message: 'Section deleted successfully' })
      }

      if (type === 'subject') {
        await prisma.subject.delete({ where: { id } })
        return res.status(200).json({ success: true, message: 'Subject deleted successfully' })
      }

      await prisma.class.delete({ where: { id } })
      return res.status(200).json({ success: true, message: 'Class deleted successfully' })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error in /api/classes:', error)
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Internal server error' })
  }
}
