const TOKEN_KEY = 'hopenix_auth_token'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  })

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error(`Server returned ${response.status} ${response.statusText}`)
  }

  if (!response.ok || data.success === false) {
    const errorMsg = data?.error || `Request failed with status ${response.status}`
    const error = new Error(errorMsg)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export async function apiGet(endpoint, params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val)
    }
  })

  const queryString = query.toString()
  const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint
  return apiFetch(fullEndpoint, { method: 'GET' })
}

export async function apiPost(endpoint, body = {}) {
  return apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function apiPut(endpoint, body = {}) {
  return apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function apiDelete(endpoint, params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val)
    }
  })

  const queryString = query.toString()
  const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint
  return apiFetch(fullEndpoint, { method: 'DELETE' })
}
