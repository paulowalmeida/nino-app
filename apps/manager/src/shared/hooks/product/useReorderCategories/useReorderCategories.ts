import { useMutation, useQueryClient } from '@tanstack/react-query'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { CategoryService } from '@shared/services/category/category.service'

type Variables = {
  ids: string[]
}

export const useReorderCategories = (unitId: string | null) => {
  const queryClient = useQueryClient()
  const key = queryKeys.productCategories.list(unitId ?? '')

  return useMutation({
    meta: { errorTitle: 'A ordem das categorias voltou ao que era' },

    mutationFn: ({ ids }: Variables) =>
      CategoryService.reorderCategories(unitId as string, ids),

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(unitId) })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.all(unitId ?? ''),
      })
    },
  })
}
