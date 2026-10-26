import { describe, expect, it, vi } from 'vitest'

import {
  closeDelete,
  requestDelete,
  setDeleteError,
} from '@pages/CatalogCategories/states/catalog-categories/operations/delete-dialog/delete-dialog'
import type { SetCatalogCategoriesState } from '@pages/CatalogCategories/types/SetCatalogCategoriesState.type'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

describe('catalog category delete-dialog operations', () => {
  it('opens, reports an error, and closes the deletion flow', () => {
    const set = vi.fn() as SetCatalogCategoriesState
    const category = { id: 'drinks', count: 0 } as CategoryWithCount

    requestDelete(set, category)
    setDeleteError(set, 'Falhou')
    closeDelete(set)

    expect(set).toHaveBeenNthCalledWith(1, {
      deleteTarget: category,
      deleteError: null,
    })
    expect(set).toHaveBeenNthCalledWith(2, { deleteError: 'Falhou' })
    expect(set).toHaveBeenNthCalledWith(3, {
      deleteTarget: null,
      deleteError: null,
    })
  })
})
