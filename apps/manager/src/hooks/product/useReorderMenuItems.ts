import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { MenuPage } from '@custom_types/product/menu-page'
import { ProductService } from '@services/product.service'

import { menuQueryKey } from './useMenu'

type Variables = {
  positions: { id: string; position: number }[]
}

/**
 * Optimistic: the drag already moved the row on screen, so the cache has to
 * agree right away or the list snaps back before the response arrives.
 *
 * Writes to the menu screen's own slice — the list only accepts drag with a
 * category chosen and no search, so the key is always the same. The
 * `useMenu` cache (counter and counts) is invalidated at the end, not
 * patched: order doesn't affect it while the person is dragging.
 */
export const useReorderMenuItems = (
  tenantId: string | null,
  categoryId: string | null
) => {
  const queryClient = useQueryClient()
  const key = queryKeys.products.catalog(tenantId ?? '', categoryId, '')

  return useMutation({
    meta: { errorTitle: 'A ordem dos itens voltou ao que era' },

    mutationFn: ({ positions }: Variables) =>
      Promise.all(
        positions.map(({ id, position }) =>
          ProductService.setItemPosition(tenantId as string, id, position)
        )
      ),

    onMutate: async ({ positions }: Variables) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<InfiniteData<MenuPage>>(key)
      const nextPositionById = new Map(
        positions.map(({ id, position }) => [id, position])
      )

      queryClient.setQueryData<InfiniteData<MenuPage>>(key, (cached) => {
        if (!cached) return cached

        const ordered = cached.pages
          .flatMap((page) => page.data)
          .map((item) => {
            const position = nextPositionById.get(item.id)
            return position === undefined ? item : { ...item, position }
          })
          .sort((a, b) => a.position - b.position)

        /* Re-paginates keeping each page's size: the infinite query counts
           loaded items to know whether there's still more to fetch. */
        let cursor = 0
        const pages = cached.pages.map((page) => {
          const data = ordered.slice(cursor, cursor + page.data.length)
          cursor += page.data.length
          return { ...page, data }
        })

        return { ...cached, pages }
      })

      return { previous }
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
