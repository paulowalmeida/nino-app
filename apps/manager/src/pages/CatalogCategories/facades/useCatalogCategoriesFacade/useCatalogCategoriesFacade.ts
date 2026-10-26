import { useCatalogCategoriesMutations } from '@pages/CatalogCategories/hooks/useCatalogCategoriesMutations/useCatalogCategoriesMutations'
import { useCatalogCategoriesOrder } from '@pages/CatalogCategories/hooks/useCatalogCategoriesOrder/useCatalogCategoriesOrder'
import { useCatalogCategoriesQuery } from '@pages/CatalogCategories/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery'
import { useCatalogCategoriesStore } from '@pages/CatalogCategories/states/catalog-categories/catalog-categories.store'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useCatalogCategoriesFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const clientState = useCatalogCategoriesStore()
  const categoriesQuery = useCatalogCategoriesQuery(unitId)
  const mutations = useCatalogCategoriesMutations(unitId)
  const categoryOrder = useCatalogCategoriesOrder(
    categoriesQuery.rows,
    clientState.order,
    clientState.setOrder,
    mutations.reorder.mutate
  )

  return {
    createName: clientState.createName,
    createIcon: clientState.createIcon,
    setCreateName: clientState.setCreateName,
    setCreateIcon: clientState.setCreateIcon,
    deleteTarget: clientState.deleteTarget,
    deleteError: clientState.deleteError,
    requestDelete: clientState.requestDelete,
    closeDelete: clientState.closeDelete,
    editTarget: clientState.editTarget,
    editName: clientState.editName,
    editIcon: clientState.editIcon,
    requestEdit: clientState.requestEdit,
    setEditName: clientState.setEditName,
    setEditIcon: clientState.setEditIcon,
    closeEdit: clientState.closeEdit,
    categories: categoriesQuery.categories,
    isPending: categoriesQuery.isPending,
    isError: categoriesQuery.isError,
    order: categoryOrder.order,
    setOrder: categoryOrder.setOrder,
    persistOrder: categoryOrder.persistOrder,
    isCreating: mutations.create.isPending,
    submitCreate: mutations.submitCreate,
    isRenaming: mutations.update.isPending,
    submitEdit: mutations.submitEdit,
    isDeleting: mutations.remove.isPending,
    confirmDelete: mutations.confirmDelete,
  }
}
