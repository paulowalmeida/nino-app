import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { MenuPage } from '@custom_types/product'
import { setItemPosition } from '@services/product/product.service'

import { menuQueryKey } from './useMenu'

type Variables = {
  positions: { id: string; position: number }[]
}

/**
 * Optimistic, like useItemAvailability: the drag already moved the row on
 * screen, so the cache has to agree immediately or the list snaps back
 * before the round trip finishes. Re-sorts by position so useMenu's grouping
 * (which walks the list in order) keeps building sections correctly.
 */
export const useReorderMenuItems = (tenantId: string | null) => {
  const queryClient = useQueryClient()
  const key = menuQueryKey(tenantId)

  return useMutation({
    meta: { errorTitle: 'A ordem dos itens voltou ao que era' },

    mutationFn: ({ positions }: Variables) =>
      Promise.all(
        positions.map(({ id, position }) =>
          setItemPosition(tenantId as string, id, position)
        )
      ),

    onMutate: async ({ positions }: Variables) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<MenuPage>(key)
      const nextPositionById = new Map(
        positions.map(({ id, position }) => [id, position])
      )

      queryClient.setQueryData<MenuPage>(key, (page) => {
        if (!page) return page
        return {
          ...page,
          data: page.data
            .map((item) => {
              const position = nextPositionById.get(item.id)
              return position === undefined ? item : { ...item, position }
            })
            .sort((a, b) => a.position - b.position),
        }
      })

      return { previous }
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
    },
  })
}
