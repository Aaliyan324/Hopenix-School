import { requireRole } from './_lib/authUtils.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const method = req.method

  try {
    if (method === 'GET') {
      return res.status(200).json({
        success: true,
        data: {
          schoolName: 'Hopenix School',
          academicYear: '2026-2027',
          contactPhone: '+92 300 1234567',
          contactEmail: 'info@hopenix.edu.pk',
          address: 'Main Campus, Lahore, Pakistan',
          allowPublicDiary: true,
        },
      })
    }

    requireRole(req, ['ADMIN'])

    if (method === 'PUT') {
      const settings = req.body || {}
      return res.status(200).json({
        success: true,
        data: settings,
        message: 'School settings updated successfully',
      })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error in /api/settings:', error)
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Internal server error' })
  }
}
