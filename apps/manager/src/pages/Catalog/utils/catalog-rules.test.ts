import { describe, expect, it } from 'vitest'

import { canReorderCatalog } from '@pages/Catalog/utils/catalog-rules'

describe('canReorderCatalog', () => {
  it('allows reordering inside a category without search', () => {
    expect(canReorderCatalog('category-id', '')).toBe(true)
  })

  it('disallows reordering without a category', () => {
    expect(canReorderCatalog(null, '')).toBe(false)
  })

  it('disallows reordering while searching', () => {
    expect(canReorderCatalog('category-id', 'burger')).toBe(false)
  })
})
