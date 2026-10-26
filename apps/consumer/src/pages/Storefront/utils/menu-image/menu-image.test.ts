import { afterEach, expect, it, vi } from 'vitest'

import { primaryImage } from './menu-image'

afterEach(() => {
  vi.unstubAllEnvs()
})

it('uses the fallback URL returned by the API when there are no images', () => {
  // Arrange
  vi.stubEnv('VITE_BASE_URL', '/api')

  // Act
  const image = primaryImage({
    images: [],
    fallbackUrl: '/product-presets/x-bacon.png',
  } as never)

  // Assert
  expect(image).toBe('/api/product-presets/x-bacon.png')
})

it('returns null for an unknown item without images', () =>
  expect(primaryImage({ images: [], fallbackUrl: null } as never)).toBeNull())
