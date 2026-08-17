import { describe, expect, it } from 'vitest'

import type { AuthUser } from '@custom_types/auth/auth-user'
import { loginEmailOf } from '@utils/login-email'

import {
  userWithGoogleThenEmail,
  userWithoutCredentials,
} from './login-email.mock'

describe(loginEmailOf.name, () => {
  it('reads the first credential that carries an email', () => {
    // Arrange / Act
    const email = loginEmailOf(userWithGoogleThenEmail as AuthUser)

    // Assert
    expect(email).toBe('joao@lojateste.com.br')
  })

  it('returns null for someone with no credential at all', () => {
    // Arrange / Act
    const email = loginEmailOf(userWithoutCredentials as AuthUser)

    // Assert
    expect(email).toBeNull()
  })
})
