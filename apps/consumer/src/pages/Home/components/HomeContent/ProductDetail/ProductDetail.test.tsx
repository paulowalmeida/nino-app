import { describe, expect, it } from 'vitest'
import { ProductDetail } from './ProductDetail'
import { productDetailMock } from './ProductDetail.mock'

describe('ProductDetail', () => {
  it('exports the product detail contract', () => {
    expect(ProductDetail).toBeDefined()
    expect(productDetailMock.quantity).toBe(1)
  })
})
