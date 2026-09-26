import { afterEach, describe, expect, it, vi } from 'vitest'

import { resolveApiAssetUrl } from './api-asset-url'
import { apiAssetUrlMock } from './api-asset-url.mock'

afterEach(() => vi.unstubAllEnvs())

describe('resolveApiAssetUrl', () => {
  it('anchors API-owned paths to an absolute VITE_BASE_URL', () => {
    vi.stubEnv('VITE_BASE_URL', apiAssetUrlMock.absoluteBase)

    expect(resolveApiAssetUrl(apiAssetUrlMock.presetPath)).toBe(
      `${apiAssetUrlMock.absoluteBase}${apiAssetUrlMock.presetPath}`
    )
  })

  it('anchors to the dev proxy path when the base is relative', () => {
    vi.stubEnv('VITE_BASE_URL', apiAssetUrlMock.proxyBase)

    expect(resolveApiAssetUrl(apiAssetUrlMock.presetPath)).toBe(
      `${apiAssetUrlMock.proxyBase}${apiAssetUrlMock.presetPath}`
    )
  })

  it('keeps external storage URLs unchanged', () => {
    vi.stubEnv('VITE_BASE_URL', apiAssetUrlMock.absoluteBase)

    expect(resolveApiAssetUrl(apiAssetUrlMock.externalUrl)).toBe(
      apiAssetUrlMock.externalUrl
    )
  })

  it('returns null when there is no url', () =>
    expect(resolveApiAssetUrl(null)).toBeNull())
})
