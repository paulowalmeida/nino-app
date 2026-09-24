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
})
