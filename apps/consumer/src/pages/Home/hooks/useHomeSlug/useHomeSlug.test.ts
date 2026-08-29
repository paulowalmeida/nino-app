import { describe, expect, it } from 'vitest'

import { homeSlugMock } from './useHomeSlug.mock'
import { useHomeSlug } from './useHomeSlug'

describe('useHomeSlug', () => {
  it('exports the route slug contract', () => {
    expect(useHomeSlug).toBeDefined()
    expect(homeSlugMock).toBe('loja-do-ze')
  })
})
