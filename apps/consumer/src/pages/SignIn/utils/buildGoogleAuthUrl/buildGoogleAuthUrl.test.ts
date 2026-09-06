import { afterEach, describe, expect, it, vi } from 'vitest'

import { buildGoogleAuthUrl } from './buildGoogleAuthUrl'
import { buildGoogleAuthUrlMock } from './buildGoogleAuthUrl.mock'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('buildGoogleAuthUrl', () => {
  it('returns null when the client id is not configured', () => {
    // Arrange
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', '')
    vi.stubEnv('VITE_BASE_URL', 'https://api-dev.nino.delivery')

    // Act
    const url = buildGoogleAuthUrl(buildGoogleAuthUrlMock.returnUrl)

    // Assert
    expect(url).toBeNull()
  })

  it('builds the authorization url with the fixed api callback and state', () => {
    // Arrange
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'client-123')
    vi.stubEnv('VITE_BASE_URL', 'https://api-dev.nino.delivery')

    // Act
    const url = buildGoogleAuthUrl(buildGoogleAuthUrlMock.returnUrl)
    const params = new URL(url as string).searchParams

    // Assert
    expect(url).toMatch(
      /^https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth\?/
    )
    expect(params.get('client_id')).toBe('client-123')
    expect(params.get('redirect_uri')).toBe(
      'https://api-dev.nino.delivery/customer/auth/google/callback'
    )
    expect(params.get('response_type')).toBe('code')
    expect(params.get('state')).toBe(buildGoogleAuthUrlMock.returnUrl)
  })
})
