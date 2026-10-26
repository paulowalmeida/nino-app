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
import {
  closeEdit,
  requestEdit,
  setEditIcon,
  setEditName,
} from '@pages/CatalogCategories/states/catalog-categories/operations/edit-dialog/edit-dialog'
import { setCategoryOrder } from '@pages/CatalogCategories/states/catalog-categories/operations/order/order'
import type { CatalogCategoriesState } from '@pages/CatalogCategories/types/CatalogCategoriesState.type'

export const useCatalogCategoriesStore = create<CatalogCategoriesState>(
  (set) => ({
    createName: '',
    createIcon: null,
    order: [],
    deleteTarget: null,
    deleteError: null,
    editTarget: null,
    editName: '',
    editIcon: null,
    setCreateName: (name) => setCreateName(set, name),
    setCreateIcon: (icon) => setCreateIcon(set, icon),
    clearCreateName: () => clearCreateName(set),
    setOrder: (order) => setCategoryOrder(set, order),
    requestDelete: (category) => requestDelete(set, category),
    setDeleteError: (error) => setDeleteError(set, error),
    closeDelete: () => closeDelete(set),
    requestEdit: (category) => requestEdit(set, category),
    setEditName: (name) => setEditName(set, name),
    setEditIcon: (icon) => setEditIcon(set, icon),
    closeEdit: () => closeEdit(set),
  })
)
