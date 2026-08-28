import { describe, expect, it, vi } from 'vitest'

import {
  closeEdit,
  requestEdit,
  setEditIcon,
  setEditName,
} from '@pages/CatalogCategories/states/catalog-categories/operations/edit-dialog/edit-dialog'
import type { SetCatalogCategoriesState } from '@pages/CatalogCategories/types/SetCatalogCategoriesState.type'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

describe('catalog category edit-dialog operations', () => {
  it('opens with the category draft, edits the fields, and closes', () => {
    const set = vi.fn() as SetCatalogCategoriesState
    const category = {
      id: 'drinks',
      name: 'Bebidas',
      icon: 'drinks',
      count: 0,
    } as CategoryWithCount

    requestEdit(set, category)
    setEditName(set, 'Geladas')
    setEditIcon(set, 'beer')
    closeEdit(set)

    expect(set).toHaveBeenNthCalledWith(1, {
      editTarget: category,
      editName: 'Bebidas',
      editIcon: 'drinks',
    })
    expect(set).toHaveBeenNthCalledWith(2, { editName: 'Geladas' })
    expect(set).toHaveBeenNthCalledWith(3, { editIcon: 'beer' })
    expect(set).toHaveBeenNthCalledWith(4, {
      editTarget: null,
      editName: '',
      editIcon: null,
    })
  })

  it('falls back to a null icon when the category has none', () => {
    const set = vi.fn() as SetCatalogCategoriesState
    const category = { id: 'drinks', name: 'Bebidas' } as CategoryWithCount

    requestEdit(set, category)

    expect(set).toHaveBeenCalledWith({
      editTarget: category,
      editName: 'Bebidas',
      editIcon: null,
    })
  })
})
