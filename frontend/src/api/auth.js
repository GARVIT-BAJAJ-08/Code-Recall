import { apiClient } from './client'

// Express API contract:
// POST /auth/signup/request-otp { name, email, password } -> { message }
// POST /auth/signup/verify-otp { email, otp } -> { user, token }
// POST /auth/login  { email, password }       -> { user, token }
// GET  /auth/me                              -> { user }

export function requestSignupOtp(data) {
  return apiClient.post('/auth/signup/request-otp', data)
}

export function verifySignupOtp(data) {
  return apiClient.post('/auth/signup/verify-otp', data)
}

export function login(credentials) {
  return apiClient.post('/auth/login', credentials)
}

export function googleLogin(credential) {
  return apiClient.post('/auth/google', { credential })
}

export async function fetchCurrentUser() {
  const { user } = await apiClient.get('/auth/me')
  return user
}
