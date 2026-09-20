export function validateGoogleIdentity(google, expectedClientId) {
  if (!google || typeof google !== 'object') return false
  if (!expectedClientId) return false
  if (google.aud !== expectedClientId) return false
  if (!google.sub || !google.email) return false

  const emailVerified = google.email_verified
  const isVerified = emailVerified === true || emailVerified === 'true'
  if (!isVerified) return false

  return true
}
