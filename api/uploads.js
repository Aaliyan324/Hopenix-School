import { requireRole } from './_lib/authUtils.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    requireRole(req, ['ADMIN', 'TEACHER'])

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

    const { filename, fileData, mimeType } = req.body || {}

    if (!fileData) {
      return res.status(400).json({ success: false, error: 'No file data provided' })
    }

    // Validate mime types
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (mimeType && !allowedMimeTypes.includes(mimeType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type. Allowed formats: PDF, DOC, DOCX, JPG, PNG, WEBP.',
      })
    }

    // Check Vercel Blob token if available
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN
    if (blobToken) {
      try {
        const { put } = await import('@vercel/blob')
        const buffer = Buffer.from(fileData.replace(/^data:[^;]+;base64,/, ''), 'base64')
        const blob = await put(filename || 'attachment.pdf', buffer, {
          access: 'public',
          token: blobToken,
          contentType: mimeType || 'application/octet-stream',
        })
        return res.status(200).json({ success: true, url: blob.url })
      } catch (err) {
        console.warn('Vercel blob upload error, using fallback:', err.message)
      }
    }

    // Base64 Data URL fallback for standalone / dev environments without Vercel Blob configured
    const safeDataUrl = fileData.startsWith('data:')
      ? fileData
      : `data:${mimeType || 'application/octet-stream'};base64,${fileData}`

    return res.status(200).json({
      success: true,
      url: safeDataUrl,
      message: 'Attachment encoded successfully. Set BLOB_READ_WRITE_TOKEN for production Vercel Blob storage.',
    })
  } catch (error) {
    console.error('API Error in /api/uploads:', error)
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Internal server error' })
  }
}
