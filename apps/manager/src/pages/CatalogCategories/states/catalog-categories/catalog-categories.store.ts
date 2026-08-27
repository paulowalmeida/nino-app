import { create } from 'zustand'

import {
  clearCreateName,
  setCreateIcon,
  setCreateName,
} from '@pages/CatalogCategories/states/catalog-categories/operations/create-form/create-form'
import {
  closeDelete,
  requestDelete,
  setDeleteError,
} from '@pages/CatalogCategories/states/catalog-categories/operations/delete-dialog/delete-dialog'
import { setCategoryOrder } from '@pages/CatalogCategories/states/catalog-categories/operations/order/order'
import type { CatalogCategoriesState } from '@pages/CatalogCategories/types/CatalogCategoriesState.type'

export const useCatalogCategoriesStore = create<CatalogCategoriesState>(
  (set) => ({
    createName: '',
    createIcon: null,
    order: [],
    deleteTarget: null,
    deleteError: null,
    setCreateName: (name) => setCreateName(set, name),
    setCreateIcon: (icon) => setCreateIcon(set, icon),
    clearCreateName: () => clearCreateName(set),
    setOrder: (order) => setCategoryOrder(set, order),
    requestDelete: (category) => requestDelete(set, category),
    setDeleteError: (error) => setDeleteError(set, error),
    closeDelete: () => closeDelete(set),
  })
)
