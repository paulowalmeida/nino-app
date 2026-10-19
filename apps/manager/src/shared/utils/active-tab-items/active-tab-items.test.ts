import { describe, expect, it } from 'vitest'

import { activeTabItems } from './active-tab-items'
import { openTabMock } from './active-tab-items.mock'

describe('activeTabItems', () => {
  it('keeps only the items that still count toward the total', () => {
    const items = activeTabItems(openTabMock)

    expect(items.map(({ id }) => id)).toEqual(['item-1'])
  })

  it('returns an empty list for a tab without items', () => {
    expect(activeTabItems({ items: [] })).toEqual([])
  })
})
