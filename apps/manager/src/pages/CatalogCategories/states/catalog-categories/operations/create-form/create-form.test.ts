import { describe, expect, it, vi } from 'vitest'

import {
  clearCreateName,
  setCreateName,
} from '@pages/CatalogCategories/states/catalog-categories/operations/create-form/create-form'
import type { SetCatalogCategoriesState } from '@pages/CatalogCategories/types/SetCatalogCategoriesState.type'

describe('catalog category create-form operations', () => {
  it('sets and clears the category draft', () => {
    const set = vi.fn() as SetCatalogCategoriesState

    setCreateName(set, 'Bebidas')
    clearCreateName(set)

    expect(set).toHaveBeenNthCalledWith(1, { createName: 'Bebidas' })
    expect(set).toHaveBeenNthCalledWith(2, { createName: '' })
  })
})
