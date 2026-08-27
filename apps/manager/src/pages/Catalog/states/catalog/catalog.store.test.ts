import { beforeEach, describe, expect, it } from 'vitest'

import { useCatalogStore } from '@pages/Catalog/states/catalog/catalog.store'
import type { MenuItem } from '@shared/types/product/menu-item'

const item = { id: 'item-1', name: 'Coxinha' } as MenuItem
const secondItem = { id: 'item-2', name: 'Pastel' } as MenuItem

describe('useCatalogStore', () => {
  beforeEach(() => {
    useCatalogStore.setState({
      categoryId: null,
      search: '',
      isSelecting: false,
      selectedIds: new Set(),
      itemPendingDelete: null,
      idsPendingDelete: [],
    })
  })

  it('updates and clears catalog filters', () => {
    useCatalogStore.getState().setCategoryId('cat-1')
    useCatalogStore.getState().setSearch('burger')

    expect(useCatalogStore.getState().categoryId).toBe('cat-1')
    expect(useCatalogStore.getState().search).toBe('burger')
  })

  it('toggles individual and all loaded item selections', () => {
    const store = useCatalogStore.getState()

    store.startSelection()
    store.toggleItemSelection(item.id)
    expect(useCatalogStore.getState().selectedIds).toEqual(new Set([item.id]))

    useCatalogStore.getState().toggleItemSelection(item.id)
    expect(useCatalogStore.getState().selectedIds).toEqual(new Set())

    store.toggleAllItemsSelection([item.id, secondItem.id])
    expect(useCatalogStore.getState().selectedIds).toEqual(
      new Set([item.id, secondItem.id])
    )

    useCatalogStore.getState().toggleAllItemsSelection([item.id, secondItem.id])
    expect(useCatalogStore.getState().selectedIds).toEqual(new Set())
  })

  it('clears selection when cancelling selection mode', () => {
    const store = useCatalogStore.getState()

    store.startSelection()
    store.toggleItemSelection(item.id)
    store.cancelSelection()

    expect(useCatalogStore.getState().isSelecting).toBe(false)
    expect(useCatalogStore.getState().selectedIds).toEqual(new Set())
  })

  it('resets selection through the explicit reset action', () => {
    const store = useCatalogStore.getState()

    store.startSelection()
    store.toggleItemSelection(item.id)
    store.resetSelection()

    expect(useCatalogStore.getState().isSelecting).toBe(false)
    expect(useCatalogStore.getState().selectedIds).toEqual(new Set())
  })

  it('keeps select-all empty when there are no loaded items', () => {
    useCatalogStore.getState().toggleAllItemsSelection([])

    expect(useCatalogStore.getState().selectedIds).toEqual(new Set())
  })

  it('opens and closes single and bulk delete dialogs', () => {
    const store = useCatalogStore.getState()

    store.requestDeleteItem(item)
    expect(useCatalogStore.getState().itemPendingDelete).toBe(item)
    store.closeDeleteItem()
    expect(useCatalogStore.getState().itemPendingDelete).toBeNull()

    store.requestDeleteItems([item.id, secondItem.id])
    expect(useCatalogStore.getState().idsPendingDelete).toEqual([
      item.id,
      secondItem.id,
    ])
    store.closeDeleteItems()
    expect(useCatalogStore.getState().idsPendingDelete).toEqual([])
  })
})
