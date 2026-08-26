/**
 * Production-ready API client helper for fetching from Vercel Serverless Functions (/api/*).
 */

export const getAuthToken = () => {
  return localStorage.getItem('hopenix_token') || ''
}

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('hopenix_token', token)
  } else {
    localStorage.removeItem('hopenix_token')
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const res = await fetch(endpoint, config)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`)
    }

    return data
  } catch (err) {
    console.error(`API Request Error [${endpoint}]:`, err.message)
    throw err
  }
}

export const apiClient = {
  get: (endpoint, params = {}) => {
    const url = new URL(endpoint, window.location.origin)
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        url.searchParams.append(key, val)
      }
    })
    return request(url.pathname + url.search, { method: 'GET' })
  },
  post: (endpoint, body = {}) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body = {}) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, params = {}) => {
    const url = new URL(endpoint, window.location.origin)
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        url.searchParams.append(key, val)
      }
    })
    return request(url.pathname + url.search, { method: 'DELETE' })
  },
}

export default apiClient
