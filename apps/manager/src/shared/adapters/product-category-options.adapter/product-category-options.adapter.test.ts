import { describe, expect, it } from 'vitest'

import { toProductCategoryOptions } from './product-category-options.adapter'
import { productCategoriesMock } from './product-category-options.adapter.mock'

describe('toProductCategoryOptions', () => {
  it('turns each category into a select option', () => {
    expect(toProductCategoryOptions(productCategoriesMock)).toEqual([
      { value: 'category-1', label: 'Lanches' },
      { value: 'category-2', label: 'Bebidas' },
    ])
  })

  it('offers nothing while the store has no category', () => {
    expect(toProductCategoryOptions([])).toEqual([])
  })
})
