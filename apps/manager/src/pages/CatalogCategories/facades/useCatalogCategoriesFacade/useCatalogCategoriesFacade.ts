import { useCatalogCategoriesMutations } from '@pages/CatalogCategories/hooks/useCatalogCategoriesMutations/useCatalogCategoriesMutations'
import { useCatalogCategoriesOrder } from '@pages/CatalogCategories/hooks/useCatalogCategoriesOrder/useCatalogCategoriesOrder'
import { useCatalogCategoriesQuery } from '@pages/CatalogCategories/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery'
import { useCatalogCategoriesStore } from '@pages/CatalogCategories/states/catalog-categories/catalog-categories.store'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useCatalogCategoriesFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const clientState = useCatalogCategoriesStore()
  const categoriesQuery = useCatalogCategoriesQuery(tenantId)
  const mutations = useCatalogCategoriesMutations(tenantId)
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
    categories: categoriesQuery.categories,
    isPending: categoriesQuery.isPending,
    isError: categoriesQuery.isError,
    order: categoryOrder.order,
    setOrder: categoryOrder.setOrder,
    persistOrder: categoryOrder.persistOrder,
    isCreating: mutations.create.isPending,
    submitCreate: mutations.submitCreate,
    isRenaming: mutations.update.isPending,
    renamingId: mutations.update.variables?.id,
    rename: mutations.update.mutateAsync,
    isDeleting: mutations.remove.isPending,
    confirmDelete: mutations.confirmDelete,
  }
}
