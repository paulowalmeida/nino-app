import { afterEach, describe, expect, it, vi } from 'vitest'

import { buildGoogleAuthUrl } from './buildGoogleAuthUrl'
import { buildGoogleAuthUrlMock } from './buildGoogleAuthUrl.mock'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('buildGoogleAuthUrl', () => {
  it('returns null when the api base is not configured', () => {
    // Arrange
    vi.stubEnv('VITE_BASE_URL', '')

    // Act
    const url = buildGoogleAuthUrl(buildGoogleAuthUrlMock.returnUrl)

    // Assert
    expect(url).toBeNull()
  })

  it('sends the browser to the api start route, not to Google', () => {
    // Arrange
    vi.stubEnv('VITE_BASE_URL', 'https://api-dev.nino.delivery')

    // Act
    const url = buildGoogleAuthUrl(buildGoogleAuthUrlMock.returnUrl)

    // Assert
    expect(url).toBe(
      'https://api-dev.nino.delivery/consumer/auth/google/start?returnUrl=' +
        encodeURIComponent(buildGoogleAuthUrlMock.returnUrl)
    )
  })

  it('carries the return url so the store gets the guest back', () => {
    // Arrange
    vi.stubEnv('VITE_BASE_URL', 'https://api-dev.nino.delivery')

    // Act
    const url = buildGoogleAuthUrl(buildGoogleAuthUrlMock.returnUrl)
    const params = new URL(url as string).searchParams

    // Assert
    expect(params.get('returnUrl')).toBe(buildGoogleAuthUrlMock.returnUrl)
  })

  it('resolves the dev proxy base against the current origin', () => {
    // Arrange
    vi.stubEnv('VITE_BASE_URL', '/api')

    // Act
    const url = buildGoogleAuthUrl(buildGoogleAuthUrlMock.returnUrl)

    // Assert
    const { protocol, port } = window.location
    expect(url).toContain(
      `${protocol}//localhost:${port}/api/consumer/auth/google/start`
    )
  })

  it('drops the store subdomain so every store shares one start url', () => {
    // Arrange
    vi.stubEnv('VITE_BASE_URL', '/api')
    vi.stubGlobal('location', {
      ...window.location,
      origin: 'http://burgao-centro.localhost:3002',
      protocol: 'http:',
      port: '3002',
    })

    // Act
    const url = buildGoogleAuthUrl(buildGoogleAuthUrlMock.returnUrl)

    // Assert
    expect(url).toContain(
      'http://localhost:3002/api/consumer/auth/google/start'
    )
    expect(url).not.toContain('burgao-centro.localhost')
  })
})
