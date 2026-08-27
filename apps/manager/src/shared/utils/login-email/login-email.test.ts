import { describe, expect, it } from 'vitest'

import { loginEmailOf } from './login-email'

describe('loginEmailOf', () => {
  it('reads the first credential with an email set', () => {
    // Arrange
    const user = { credentials: [{ email: null }, { email: 'a@b.com' }] }

    // Act
    const email = loginEmailOf(user)

    // Assert
    expect(email).toBe('a@b.com')
  })

  it('returns null when no credential has an email', () => {
    expect(loginEmailOf({ credentials: [{ email: null }] })).toBeNull()
  })

  it('returns null for an empty credential list', () => {
    expect(loginEmailOf({ credentials: [] })).toBeNull()
  })
})
