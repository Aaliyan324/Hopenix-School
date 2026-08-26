import { verifyAuth, sendJson, handleAuthError, handleBadRequest, handleServerError } from '../auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method not allowed' })
  }

  const auth = verifyAuth(req)
  if (!auth) return handleAuthError(res)

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
    const { filename, fileData, contentType } = body

    if (!filename || !fileData) {
      return handleBadRequest(res, 'Filename and base64 fileData are required.')
    }

    // 1. Try Vercel Blob if token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob')
        const buffer = Buffer.from(fileData.replace(/^data:.*;base64,/, ''), 'base64')
        const blob = await put(filename, buffer, {
          access: 'public',
          contentType: contentType || 'application/octet-stream',
        })
        return sendJson(res, 200, { success: true, url: blob.url })
      } catch (blobErr) {
        console.warn('Vercel blob upload fallback:', blobErr.message)
      }
    }

    // 2. Fallback: Return formatted Data URL (for local dev / lightweight attachments)
    const formattedUrl = fileData.startsWith('data:')
      ? fileData
      : `data:${contentType || 'application/octet-stream'};base64,${fileData}`

    return sendJson(res, 200, {
      success: true,
      url: formattedUrl,
      filename,
    })
  } catch (error) {
    return handleServerError(res, error)
  }
}
