import { afterEach, describe, expect, it, vi } from 'vitest'

import { resolveApiAssetUrl } from './api-asset-url'

afterEach(() => vi.unstubAllEnvs())

describe('resolveApiAssetUrl', () => {
  it('anchors API-owned paths to VITE_BASE_URL', () => {
    vi.stubEnv('VITE_BASE_URL', 'https://api-dev.nino.delivery')

    expect(resolveApiAssetUrl('/product-presets/x-bacon.png')).toBe(
      'https://api-dev.nino.delivery/product-presets/x-bacon.png'
    )
  })

  it('keeps external storage URLs unchanged', () => {
    vi.stubEnv('VITE_BASE_URL', 'https://api-dev.nino.delivery')

    expect(resolveApiAssetUrl('https://cdn.example/x-bacon.png')).toBe(
      'https://cdn.example/x-bacon.png'
    )
  })

  it('anchors to the dev proxy path when the base is relative', () => {
    // Arrange: `.env.local` do consumer usa `/api`, o proxy do Vite que
    // esconde os cookies sameSite:'strict' da API atrás da mesma origem.
    vi.stubEnv('VITE_BASE_URL', '/api')

    // Act
    const url = resolveApiAssetUrl('/product-presets/x-bacon.png')

    // Assert
    expect(url).toBe('/api/product-presets/x-bacon.png')
  })
})
