import { useCatalogCategoriesQuery } from '@pages/Catalog/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery'
import { useCatalogCommands } from '@pages/Catalog/hooks/useCatalogCommands/useCatalogCommands'
import { useCatalogMutations } from '@pages/Catalog/hooks/useCatalogMutations/useCatalogMutations'
import { useCatalogQuery } from '@pages/Catalog/hooks/useCatalogQuery/useCatalogQuery'
import { useCatalogStore } from '@pages/Catalog/states/catalog/catalog.store'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useCatalogFacade = () => {
  const currentTenant = useCurrentTenant()
  const tenantId = currentTenant?.tenantId ?? null
  const tenantRole = currentTenant?.role ?? null
  const clientState = useCatalogStore()
  const catalogQuery = useCatalogQuery(
    tenantId,
    clientState.categoryId,
    clientState.search
  )
  const categoriesQuery = useCatalogCategoriesQuery(tenantId)
  const mutations = useCatalogMutations(tenantId)
  const commands = useCatalogCommands(catalogQuery, clientState, mutations)

  return {
    ...clientState,
    ...commands,
    tenantId,
    tenantRole,
    items: catalogQuery.items,
    total: catalogQuery.total,
    status: catalogQuery.status,
    isFetchingNextPage: catalogQuery.isFetchingNextPage,
    hasNextPage: catalogQuery.hasNextPage ?? false,
    categories: categoriesQuery.categories,
    categoriesStatus: categoriesQuery.status,
    isDeletingItem: mutations.deleteItem.isPending,
    isDeletingItems: mutations.deleteItems.isPending,
  }
}
