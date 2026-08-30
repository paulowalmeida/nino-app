import { describe, expect, it } from 'vitest'

import { homeSlugMock } from './useStorefrontSlug.mock'
import { useStorefrontSlug } from './useStorefrontSlug'

describe('useStorefrontSlug', () => {
  it('exports the route slug contract', () => {
    expect(useStorefrontSlug).toBeDefined()
    expect(homeSlugMock).toBe('loja-do-ze')
  })
})
