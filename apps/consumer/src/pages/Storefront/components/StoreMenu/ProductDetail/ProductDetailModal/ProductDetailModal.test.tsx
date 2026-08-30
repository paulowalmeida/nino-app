import { describe, expect, it } from 'vitest'

import { ProductDetailModal } from './ProductDetailModal'
import { productDetailModalMock } from './ProductDetailModal.mock'

describe('ProductDetailModal', () => {
  it('exports the product detail modal contract', () => {
    expect(ProductDetailModal).toBeDefined()
    expect(productDetailModalMock.isOpen).toBe(true)
  })
})
