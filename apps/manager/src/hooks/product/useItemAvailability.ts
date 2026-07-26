import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { MenuPage } from '@custom_types/product'
import { setItemAvailability } from '@services/product/product.service'

import { menuQueryKey } from './useMenu'

type Variables = {
  id: string
  isActive: boolean
}

/**
 * Optimistic on purpose: this is the rush-hour gesture — an item runs out and
 * the owner switches it off mid-service. Waiting for the round trip to see the
 * row change would make the panel feel broken. On failure the list rolls back.
 */
export const useItemAvailability = (tenantId: string | null) => {
  const queryClient = useQueryClient()
  const key = menuQueryKey(tenantId)

  return useMutation({
    meta: { errorTitle: 'O item voltou como estava' },
    mutationFn: ({ id, isActive }: Variables) =>
      setItemAvailability(tenantId as string, id, isActive),

    onMutate: async ({ id, isActive }: Variables) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<MenuPage>(key)

      queryClient.setQueryData<MenuPage>(key, (page) =>
        page && {
          ...page,
          data: page.data.map((item) =>
            item.id === id ? { ...item, isActive } : item
          ),
        }
      )

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
