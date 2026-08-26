import adminHandler from './lib/handlers/admin.js'
import admissionsHandler from './lib/handlers/admissions.js'
import assignmentsHandler from './lib/handlers/assignments.js'
import authHandler from './lib/handlers/auth.js'
import classesHandler from './lib/handlers/classes.js'
import diaryHandler from './lib/handlers/diary.js'
import eventsHandler from './lib/handlers/events.js'
import healthHandler from './lib/handlers/health.js'
import settingsHandler from './lib/handlers/settings.js'
import studentsHandler from './lib/handlers/students.js'
import teachersHandler from './lib/handlers/teachers.js'
import uploadsHandler from './lib/handlers/uploads.js'

const handlers = {
  admin: adminHandler,
  admissions: admissionsHandler,
  assignments: assignmentsHandler,
  auth: authHandler,
  classes: classesHandler,
  diary: diaryHandler,
  events: eventsHandler,
  health: healthHandler,
  settings: settingsHandler,
  students: studentsHandler,
  teachers: teachersHandler,
  uploads: uploadsHandler,
}

export default async function handler(req, res) {
  const host = req.headers?.host || 'localhost'
  const protocol = req.headers?.['x-forwarded-proto'] || 'http'
  const url = new URL(req.url || '/', `${protocol}://${host}`)
  const pathname = url.pathname // e.g. /api/auth or /api/teachers

  // Extract the route segment after /api/
  const cleanPath = pathname.replace(/^\/api\/?/, '')
  const route = cleanPath.split('/')[0]

  // Parse search params into req.query if missing or incomplete
  if (!req.query) {
    req.query = Object.fromEntries(url.searchParams.entries())
  } else {
    for (const [key, value] of url.searchParams.entries()) {
      if (req.query[key] === undefined) {
        req.query[key] = value
      }
    }
  }

  const routeHandler = handlers[route]

  if (routeHandler) {
    return await routeHandler(req, res)
  }

  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify({ success: false, error: `API route '/api/${route}' not found.` }))
}
