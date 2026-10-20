import { create } from 'zustand'

import {
  closeDeleteItem,
  closeDeleteItems,
  requestDeleteItem,
  requestDeleteItems,
} from '@pages/Catalog/states/catalog/operations/delete-dialog'
import {
  setCategoryId,
  setSearch,
} from '@pages/Catalog/states/catalog/operations/filters'
import {
  clearSelection,
  startSelection,
  toggleAllItemsSelection,
  toggleItemSelection,
} from '@pages/Catalog/states/catalog/operations/selection'
import type { CatalogState } from '@pages/Catalog/types/CatalogState.type'

export const useCatalogStore = create<CatalogState>((set, get) => ({
  categoryId: null,
  search: '',
  isSelecting: false,
  selectedIds: new Set(),
  itemPendingDelete: null,
  idsPendingDelete: [],
  setCategoryId: (categoryId) => setCategoryId(set, categoryId),
  setSearch: (search) => setSearch(set, search),
  startSelection: () => startSelection(set),
  cancelSelection: () => clearSelection(set),
  resetSelection: () => clearSelection(set),
  toggleItemSelection: (id) => toggleItemSelection(set, get, id),
  toggleAllItemsSelection: (itemIds) =>
    toggleAllItemsSelection(set, get, itemIds),
  requestDeleteItem: (item) => requestDeleteItem(set, item),
  closeDeleteItem: () => closeDeleteItem(set),
  requestDeleteItems: (ids) => requestDeleteItems(set, ids),
  closeDeleteItems: () => closeDeleteItems(set),
}))
