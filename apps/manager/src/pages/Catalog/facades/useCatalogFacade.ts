import { useCatalogCategoriesQuery } from '@pages/Catalog/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery'
import { useCatalogCommands } from '@pages/Catalog/hooks/useCatalogCommands/useCatalogCommands'
import { useCatalogListReveal } from '@pages/Catalog/hooks/useCatalogListReveal/useCatalogListReveal'
import { useCatalogMutations } from '@pages/Catalog/hooks/useCatalogMutations/useCatalogMutations'
import { useCatalogQuery } from '@pages/Catalog/hooks/useCatalogQuery/useCatalogQuery'
import { useCatalogStore } from '@pages/Catalog/states/catalog/catalog.store'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useHasPermission } from '@shared/hooks/session/useHasPermission/useHasPermission'

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
  const listReveal = useCatalogListReveal(
    catalogQuery.items,
    catalogQuery.queryStatus === 'success',
    catalogQuery.isPlaceholderData
  )

  return {
    ...clientState,
    ...commands,
    unitId,
    canManageCatalog,
    items: catalogQuery.items,
    total: catalogQuery.total,
    status: catalogQuery.status,
    isPagePending:
      catalogQuery.status === 'loading' || categoriesQuery.status === 'loading',
    isFirstRevealPending: listReveal.isFirstRevealPending,
    isListSwitching: listReveal.isListSwitching,
    preloadedImageItemIds: listReveal.preloadedImageItemIds,
    isFetchingNextPage: catalogQuery.isFetchingNextPage,
    hasNextPage: catalogQuery.hasNextPage ?? false,
    categories: categoriesQuery.categories,
    categoriesStatus: categoriesQuery.status,
    isDeletingItem: mutations.deleteItem.isPending,
    isDeletingItems: mutations.deleteItems.isPending,
  }
}
