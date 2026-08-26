import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function expressLikeRes(res) {
  res.status = (statusCode) => {
    res.statusCode = statusCode
    return res
  }
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
    return res
  }
  return res
}

function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()

        try {
          const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
          const pathname = url.pathname // e.g. /api/auth
          const routeName = pathname.replace('/api/', '').split('/')[0] // 'auth'

          if (!routeName) return next()

          const modulePath = path.resolve(__dirname, `api/${routeName}.js`)
          const handlerModule = await server.ssrLoadModule(modulePath)

          if (handlerModule && typeof handlerModule.default === 'function') {
            req.query = Object.fromEntries(url.searchParams.entries())

            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
              const buffers = []
              for await (const chunk of req) {
                buffers.push(chunk)
              }
              const bodyText = Buffer.concat(buffers).toString('utf-8')
              try {
                req.body = bodyText ? JSON.parse(bodyText) : {}
              } catch {
                req.body = bodyText
              }
            }

            expressLikeRes(res)
            return await handlerModule.default(req, res)
          }
        } catch (err) {
          console.error('Vite API Dev Plugin Error:', err)
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), vercelApiDevPlugin()],
})
