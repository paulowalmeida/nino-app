import { expect, it } from 'vitest'
import { primaryImage } from './menu-image'
it('returns null without images', () =>
  expect(primaryImage({ images: [] } as never)).toBeNull())
