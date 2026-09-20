import test from 'node:test'
import assert from 'node:assert/strict'

import { validateGoogleIdentity } from './googleAuth.js'

test('accepts Google identity payloads with boolean email_verified', () => {
  assert.equal(
    validateGoogleIdentity({ aud: 'client-id', email_verified: true, sub: 'abc', email: 'user@example.com' }, 'client-id'),
    true,
  )
})

test('accepts Google identity payloads with string email_verified', () => {
  assert.equal(
    validateGoogleIdentity({ aud: 'client-id', email_verified: 'true', sub: 'abc', email: 'user@example.com' }, 'client-id'),
    true,
  )
})

test('rejects mismatched Google client IDs', () => {
  assert.equal(
    validateGoogleIdentity({ aud: 'other-client', email_verified: true, sub: 'abc', email: 'user@example.com' }, 'client-id'),
    false,
  )
})
