import { beforeEach, describe, expect, it } from 'vitest'

import { useCatalogCategoriesStore } from '@pages/CatalogCategories/states/catalog-categories/catalog-categories.store'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

const category = {
  id: 'drinks',
  name: 'Bebidas',
  count: 0,
} as CategoryWithCount

describe('useCatalogCategoriesStore', () => {
  beforeEach(() => {
    useCatalogCategoriesStore.setState({
      createName: '',
      order: [],
      deleteTarget: null,
      deleteError: null,
      editTarget: null,
      editName: '',
      editIcon: null,
    })
  })

  it('coordinates category creation and visual ordering state', () => {
    const store = useCatalogCategoriesStore.getState()

    store.setCreateName('Bebidas')
    store.setCreateIcon('beer')
    store.setOrder([category])

    expect(useCatalogCategoriesStore.getState()).toMatchObject({
      createName: 'Bebidas',
      createIcon: 'beer',
      order: [category],
    })

    useCatalogCategoriesStore.getState().clearCreateName()
    expect(useCatalogCategoriesStore.getState().createName).toBe('')
  })

  it('coordinates the deletion target, error, and reset', () => {
    const store = useCatalogCategoriesStore.getState()

    store.requestDelete(category)
    store.setDeleteError('Falhou')

    expect(useCatalogCategoriesStore.getState()).toMatchObject({
      deleteTarget: category,
      deleteError: 'Falhou',
    })

    useCatalogCategoriesStore.getState().closeDelete()
    expect(useCatalogCategoriesStore.getState()).toMatchObject({
      deleteTarget: null,
      deleteError: null,
    })
  })

  it('coordinates the edit target, draft fields, and reset', () => {
    const store = useCatalogCategoriesStore.getState()

    store.requestEdit(category)
    store.setEditName('Geladas')
    store.setEditIcon('beer')

    expect(useCatalogCategoriesStore.getState()).toMatchObject({
      editTarget: category,
      editName: 'Geladas',
      editIcon: 'beer',
    })

    useCatalogCategoriesStore.getState().closeEdit()
    expect(useCatalogCategoriesStore.getState()).toMatchObject({
      editTarget: null,
      editName: '',
      editIcon: null,
    })
  })
})
