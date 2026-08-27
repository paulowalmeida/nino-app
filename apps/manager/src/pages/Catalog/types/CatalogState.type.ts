import type { MenuItem } from '@shared/types/product/menu-item'

export type CatalogState = {
  categoryId: string | null
  search: string
  isSelecting: boolean
  selectedIds: Set<string>
  itemPendingDelete: MenuItem | null
  idsPendingDelete: string[]
  setCategoryId: (categoryId: string | null) => void
  setSearch: (search: string) => void
  startSelection: () => void
  cancelSelection: () => void
  resetSelection: () => void
  toggleItemSelection: (id: string) => void
  toggleAllItemsSelection: (itemIds: string[]) => void
  requestDeleteItem: (item: MenuItem) => void
  closeDeleteItem: () => void
  requestDeleteItems: (ids: string[]) => void
  closeDeleteItems: () => void
}
