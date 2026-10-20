import { useCatalogCategoriesQuery } from '@pages/Catalog/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery'
import { useCatalogCommands } from '@pages/Catalog/hooks/useCatalogCommands/useCatalogCommands'
import { useCatalogMutations } from '@pages/Catalog/hooks/useCatalogMutations/useCatalogMutations'
import { useCatalogQuery } from '@pages/Catalog/hooks/useCatalogQuery/useCatalogQuery'
import { useCatalogStore } from '@pages/Catalog/states/catalog/catalog.store'
import { useHasPermission } from '@shared/hooks/session/useHasPermission/useHasPermission'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useCatalogFacade = () => {
  const currentUnit = useCurrentUnit()
  const unitId = currentUnit?.unitId ?? null
  const canManageCatalog = useHasPermission('catalog.manage')
  const clientState = useCatalogStore()
  const catalogQuery = useCatalogQuery(
    unitId,
    clientState.categoryId,
    clientState.search
  )
  const categoriesQuery = useCatalogCategoriesQuery(unitId)
  const mutations = useCatalogMutations(unitId)
  const commands = useCatalogCommands(catalogQuery, clientState, mutations)

  return {
    ...clientState,
    ...commands,
    unitId,
    canManageCatalog,
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
