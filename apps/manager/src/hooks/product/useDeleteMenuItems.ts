import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { ProductService } from '@services/product.service'

import { menuQueryKey } from './useMenu'

export const useDeleteMenuItems = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Itens excluídos do cardápio',
      errorTitle: 'Alguns itens não foram excluídos',
    },
    mutationFn: async (productIds: string[]) => {
      const results = await Promise.allSettled(
        productIds.map((id) =>
          ProductService.removeItem(tenantId as string, id)
        )
      )

      const failedCount = results.filter(
        (result) => result.status === 'rejected'
      ).length
      if (failedCount > 0) {
        throw new Error(`${failedCount} item(ns) não excluído(s)`)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.all(tenantId ?? ''),
      })
    },
  })
}
