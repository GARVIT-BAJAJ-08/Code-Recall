import { apiClient } from './client'

// Express API contract:
// POST /auth/signup/request-otp { name, email, password } -> { message }
// POST /auth/signup/verify-otp { email, otp } -> { user, token }
// POST /auth/login  { email, password }       -> { user, token }
// PATCH /auth/password { currentPassword, newPassword } -> { message }
// DELETE /auth/account                         -> 204
// POST /auth/password-reset/request-otp { email } -> { message }
// POST /auth/password-reset/verify-otp { email, otp, newPassword } -> { message }
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

export function changePassword(data) {
  return apiClient.patch('/auth/password', data)
}

export function deleteAccount() {
  return apiClient.delete('/auth/account')
}

export function requestPasswordResetOtp(email) {
  return apiClient.post('/auth/password-reset/request-otp', { email })
}

export function resetPassword(data) {
  return apiClient.post('/auth/password-reset/verify-otp', data)
}

export function googleLogin(credential) {
  return apiClient.post('/auth/google', { credential })
}

export async function fetchCurrentUser() {
  const { user } = await apiClient.get('/auth/me')
  return user
}
