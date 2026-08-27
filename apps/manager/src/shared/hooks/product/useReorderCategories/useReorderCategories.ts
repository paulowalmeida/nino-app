import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { CategoryService } from '@shared/services/category/category.service'

import { menuQueryKey } from '../useMenu/useMenu'

type Variables = {
  ids: string[]
}

export const useReorderCategories = (tenantId: string | null) => {
  const queryClient = useQueryClient()
  const key = queryKeys.productCategories.list(tenantId ?? '')

  return useMutation({
    meta: { errorTitle: 'A ordem das categorias voltou ao que era' },

    mutationFn: ({ ids }: Variables) =>
      CategoryService.reorderCategories(tenantId as string, ids),

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.all(tenantId ?? ''),
      })
    },
  })
}
