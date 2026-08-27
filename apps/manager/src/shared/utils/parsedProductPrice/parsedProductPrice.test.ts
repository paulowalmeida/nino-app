import { describe, expect, it } from 'vitest'

import { parsedProductPrice } from './parsedProductPrice'
import { productPriceInputMock } from './parsedProductPrice.mock'

describe('parsedProductPrice', () => {
  it('reads the brazilian decimal comma', () => {
    expect(parsedProductPrice(productPriceInputMock.plain)).toBe(24.9)
  })

  it('drops the thousands separator', () => {
    expect(parsedProductPrice(productPriceInputMock.thousands)).toBe(1299.9)
  })

  it('reads a free item as zero', () => {
    expect(parsedProductPrice(productPriceInputMock.zero)).toBe(0)
  })

  it('reports text that is not a price as not a number', () => {
    expect(parsedProductPrice(productPriceInputMock.invalid)).toBeNaN()
  })
})
