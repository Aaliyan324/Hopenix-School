import prisma from '../src/lib/prisma.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    let dbConnected = false
    let dbError = null

    try {
      await prisma.$queryRaw`SELECT 1`
      dbConnected = true
    } catch (err) {
      dbError = err.message
    }

    return res.status(200).json({
      success: true,
      status: dbConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      database: {
        connected: dbConnected,
        error: dbError,
      },
      environment: process.env.NODE_ENV || 'development',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
}
