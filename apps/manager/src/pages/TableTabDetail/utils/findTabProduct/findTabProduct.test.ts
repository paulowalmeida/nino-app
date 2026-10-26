import { describe, expect, it } from 'vitest'

import { findTabProduct } from './findTabProduct'
import { findTabProductSectionsMock } from './findTabProduct.mock'

describe('findTabProduct', () => {
  it('finds a product in any category', () => {
    expect(findTabProduct(findTabProductSectionsMock, 'product-2')?.name).toBe(
      'Caldo de cana'
    )
  })

  it('returns nothing for an unknown or empty product id', () => {
    expect(
      findTabProduct(findTabProductSectionsMock, 'missing')
    ).toBeUndefined()
    expect(findTabProduct(findTabProductSectionsMock, '')).toBeUndefined()
  })
})
