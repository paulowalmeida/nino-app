import { describe, expect, it, vi } from 'vitest'

import { endSession } from '@shared/services/session/end-session'
import { hadSession } from '@shared/utils/session-hint/session-hint'

import { apiMock, clientMock } from './http.service.mock'

const createHttpClientMock = vi.fn(() => clientMock)
const createApiMock = vi.fn(() => apiMock)

vi.mock('@nino/lib/lib/http-client', () => ({
  createHttpClient: createHttpClientMock,
}))

vi.mock('@nino/lib/services/http.service', () => ({
  createApi: createApiMock,
}))

vi.mock('@shared/services/session/end-session', () => ({ endSession: vi.fn() }))
vi.mock('@shared/utils/session-hint/session-hint', () => ({ hadSession: vi.fn() }))

describe('http.service', () => {
  it('builds the shared client with session-aware config', async () => {
    // Act
    const { api } = await import('./http.service')

    // Assert
    expect(createHttpClientMock).toHaveBeenCalledWith(
      expect.objectContaining({
        refreshPath: 'auth/refresh',
        exemptPaths: [
          'auth/login',
          'auth/signup',
          'auth/refresh',
          'auth/check-availability',
          'auth/forgot-password',
          'auth/reset-password',
        ],
        sessionProbePath: 'auth/me',
        hasPriorSession: hadSession,
        onUnrecoverable: endSession,
      })
    )
    expect(createApiMock).toHaveBeenCalledWith(clientMock)
    expect(api).toBe(apiMock)
  })
})
