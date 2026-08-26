import prisma from './lib/db.js'
import { sendJson } from './lib/auth.js'

export default async function handler(req, res) {
  try {
    await prisma.$queryRaw`SELECT 1`
    return sendJson(res, 200, {
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return sendJson(res, 500, {
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}
