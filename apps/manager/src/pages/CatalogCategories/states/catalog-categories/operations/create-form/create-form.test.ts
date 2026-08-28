import { describe, expect, it, vi } from 'vitest'

import {
  clearCreateName,
  setCreateIcon,
  setCreateName,
} from '@pages/CatalogCategories/states/catalog-categories/operations/create-form/create-form'
import type { SetCatalogCategoriesState } from '@pages/CatalogCategories/types/SetCatalogCategoriesState.type'

describe('catalog category create-form operations', () => {
  it('sets the name, the icon, and clears the category draft', () => {
    const set = vi.fn() as SetCatalogCategoriesState

    setCreateName(set, 'Bebidas')
    setCreateIcon(set, 'beer')
    clearCreateName(set)

    expect(set).toHaveBeenNthCalledWith(1, { createName: 'Bebidas' })
    expect(set).toHaveBeenNthCalledWith(2, { createIcon: 'beer' })
    expect(set).toHaveBeenNthCalledWith(3, {
      createName: '',
      createIcon: null,
    })
  })
})
