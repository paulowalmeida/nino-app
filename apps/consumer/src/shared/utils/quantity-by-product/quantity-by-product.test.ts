import { describe, expect, it } from 'vitest'

import { quantityByProduct } from './quantity-by-product'
import { quantityByProductMock } from './quantity-by-product.mock'

describe('quantityByProduct', () => {
  it('sums every line of the same product', () => {
    expect(quantityByProduct(quantityByProductMock.lines)['item-1']).toBe(3)
  })

  it('keeps products apart', () => {
    expect(quantityByProduct(quantityByProductMock.lines)['item-2']).toBe(5)
  })

  it('returns nothing for an empty bag', () => {
    expect(quantityByProduct([])).toEqual({})
  })
})
