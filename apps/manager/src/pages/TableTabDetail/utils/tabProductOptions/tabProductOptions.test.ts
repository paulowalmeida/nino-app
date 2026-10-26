import { describe, expect, it } from 'vitest'

import { tabProductOptions } from './tabProductOptions'
import {
  tabProductOptionsExpectedMock,
  tabProductSectionsMock,
} from './tabProductOptions.mock'

describe('tabProductOptions', () => {
  it('lists every active product with its price, across categories', () => {
    expect(tabProductOptions(tabProductSectionsMock)).toEqual(
      tabProductOptionsExpectedMock
    )
  })

  it('returns no option for an empty menu', () => {
    expect(tabProductOptions([])).toEqual([])
  })
})
