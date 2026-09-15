import { describe, expect, it } from 'vitest'

import { toCategoryIcon } from './category-icon.adapter'
import { categoryIconMock } from './category-icon.adapter.mock'

describe(toCategoryIcon.name, () => {
  it('prioritizes the explicit category icon', () => {
    expect(toCategoryIcon(categoryIconMock.name, categoryIconMock.explicitIcon)).toBe('🍕')
  })

  it('falls back to a name keyword', () => {
    expect(toCategoryIcon(categoryIconMock.name)).toBe('🍔')
  })

  it('returns null when there is no match', () => {
    expect(toCategoryIcon('Produto especial')).toBeNull()
  })
})
