import { describe, expect, it, vi } from 'vitest'

import { setCategoryOrder } from '@pages/CatalogCategories/states/catalog-categories/operations/order/order'
import type { SetCatalogCategoriesState } from '@pages/CatalogCategories/types/SetCatalogCategoriesState.type'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

describe(setCategoryOrder.name, () => {
  it('stores the current visual category order', () => {
    const set = vi.fn() as SetCatalogCategoriesState
    const order = [{ id: 'drinks' }] as CategoryWithCount[]

    setCategoryOrder(set, order)

    expect(set).toHaveBeenCalledWith({ order })
  })
})
