import { describe, expect, it } from 'vitest'

import { resolveOtpCredentials } from './resolveOtpCredentials'
import { resolveOtpCredentialsMock } from './resolveOtpCredentials.mock'

describe('resolveOtpCredentials', () => {
  it('resolves phone credentials to E.164 when the channel is phone', () => {
    const credentials = resolveOtpCredentials(
      'phone',
      resolveOtpCredentialsMock.phone,
      resolveOtpCredentialsMock.email
    )

    expect(credentials).toEqual({ phone: '+5511987654321' })
  })

  it('resolves email credentials when the channel is email', () => {
    const credentials = resolveOtpCredentials(
      'email',
      resolveOtpCredentialsMock.phone,
      resolveOtpCredentialsMock.email
    )

    expect(credentials).toEqual({ email: resolveOtpCredentialsMock.email })
  })

  it('trims email credentials', () => {
    const credentials = resolveOtpCredentials(
      'email',
      resolveOtpCredentialsMock.phone,
      ` ${resolveOtpCredentialsMock.email} `
    )

    expect(credentials).toEqual({ email: resolveOtpCredentialsMock.email })
  })
})
