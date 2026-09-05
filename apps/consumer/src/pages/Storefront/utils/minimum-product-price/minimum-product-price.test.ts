import { describe, expect, it } from 'vitest'

import type { MenuItem } from '@custom_types/menu/menu-item'

import { minimumProductPrice } from './minimum-product-price'

const product = {
  price: '20',
  pricingType: 'COMPOSED',
  modifiers: [
    {
      isRequired: true,
      role: 'COMPOSITION',
      minSelections: 1,
      maxSelections: 1,
      options: [{ price: '25' }, { price: '20' }],
    },
    {
      isRequired: true,
      role: 'COMPOSITION',
      minSelections: 1,
      maxSelections: 1,
      options: [{ price: '30' }, { price: '22' }],
    },
  ],
} as MenuItem

describe('minimumProductPrice', () => {
  it('sums the cheapest valid composition without the catalog base price', () => {
    expect(minimumProductPrice(product)).toBe(42)
  })

  it('keeps the base price for fixed products', () => {
    expect(minimumProductPrice({ ...product, pricingType: 'FIXED' })).toBe(62)
  })
})
