import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InfiniteData } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { MenuItem } from '@custom_types/product/menu-item'
import type { MenuPage } from '@custom_types/product/menu-page'
import { ProductService } from '@services/product.service'

import { menuQueryKey } from './useMenu'

type Variables = {
  id: string
  isActive: boolean
}

type CatalogData = InfiniteData<MenuPage>

const patchAvailability = (
  items: MenuItem[],
  id: string,
  isActive: boolean
): MenuItem[] =>
  items.map((item) => (item.id === id ? { ...item, isActive } : item))

/**
 * Optimistic on purpose: this is the rush-hour gesture — an item runs out and
 * the owner switches it off mid-service. Waiting for the round trip to see the
 * row change would make the panel feel broken. On failure the list rolls back.
 *
 * The row lives in two caches: the flat menu and the catalog screen, which is
 * an infinite query keyed by category + search. The same item can sit in
 * several cached slices at once, so the patch walks every catalog query of the
 * tenant instead of a single key — a rollback of one of them would leave the
 * others showing the old state.
 */
export const useItemAvailability = (tenantId: string | null) => {
  const queryClient = useQueryClient()
  const key = menuQueryKey(tenantId)
  const catalogFilter = {
    queryKey: queryKeys.products.all(tenantId ?? ''),
  }

  return useMutation({
    meta: { errorTitle: 'O item voltou como estava' },
    mutationFn: ({ id, isActive }: Variables) =>
      ProductService.setItemAvailability(tenantId as string, id, isActive),

    onMutate: async ({ id, isActive }: Variables) => {
      await queryClient.cancelQueries({ queryKey: key })
      await queryClient.cancelQueries(catalogFilter)

      const previous = queryClient.getQueryData<MenuPage>(key)
      const previousCatalogs =
        queryClient.getQueriesData<CatalogData>(catalogFilter)

      queryClient.setQueryData<MenuPage>(
        key,
        (page) =>
          page && {
            ...page,
            data: patchAvailability(page.data, id, isActive),
          }
      )

      queryClient.setQueriesData<CatalogData>(catalogFilter, (data) =>
        data?.pages
          ? {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                data: patchAvailability(page.data, id, isActive),
              })),
            }
          : data
      )

      return { previous, previousCatalogs }
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
      context?.previousCatalogs?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
      void queryClient.invalidateQueries(catalogFilter)
    },
  })
}
