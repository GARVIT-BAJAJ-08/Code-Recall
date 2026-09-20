// Thin fetch wrapper. Point VITE_API_URL at your Express server
// (e.g. http://localhost:5000/api) and the mock functions in
// questions.js can be swapped for real calls through this client
// without touching any component code.

export const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const storedAuth = localStorage.getItem('coderecall.auth')
  let token
  try {
    token = JSON.parse(storedAuth)?.token
  } catch {
    token = null
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.message || res.statusText
    throw new Error(message || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
