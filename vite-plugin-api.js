import path from 'path'
import { urlToHttpOptions } from 'url'

export default function viteApiPlugin() {
  return {
    name: 'vite-plugin-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next()
        }

        try {
          const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
          const pathname = urlObj.pathname.replace('/api/', '')
          const routeName = pathname.split('/')[0].split('?')[0]

          if (!routeName) {
            return next()
          }

          const apiModulePath = path.resolve(process.cwd(), `api/${routeName}.js`)

          // Dynamically import the handler
          const module = await server.ssrLoadModule(`/api/${routeName}.js`)
          const handler = module.default

          if (typeof handler !== 'function') {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ success: false, error: `API route /api/${routeName} not found` }))
          }

          // Parse JSON body for POST/PUT/DELETE
          let body = null
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            const buffers = []
            for await (const chunk of req) {
              buffers.push(chunk)
            }
            const rawBody = Buffer.concat(buffers).toString('utf-8')
            if (rawBody) {
              try {
                body = JSON.parse(rawBody)
              } catch {
                body = rawBody
              }
            }
          }

          // Format query params into object
          const query = {}
          urlObj.searchParams.forEach((val, key) => {
            query[key] = val
          })

          req.query = query
          req.body = body

          // Invoke handler
          await handler(req, res)
        } catch (error) {
          console.error(`Vite API Plugin Error [${req.url}]:`, error)
          if (!res.headersSent) {
            res.statusCode = error.status || 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, error: error.message || 'Internal server error' }))
          }
        }
      })
    },
  }
}
