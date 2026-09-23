import { expect, it } from 'vitest'

import { primaryImage } from './menu-image'

it('uses the fallback URL returned by the API when there are no images', () =>
  expect(
    primaryImage({
      images: [],
      fallbackUrl: '/product-presets/x-bacon.png',
    } as never)
  ).toBe('/product-presets/x-bacon.png')
)

it('returns null for an unknown item without images', () =>
  expect(
    primaryImage({ images: [], fallbackUrl: null } as never)
  ).toBeNull())
