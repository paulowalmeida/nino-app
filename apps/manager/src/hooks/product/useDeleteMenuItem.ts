import { useMutation, useQueryClient } from '@tanstack/react-query'

import { removeItem } from '@services/product/product.service'

import { menuQueryKey } from './useMenu'

export const useDeleteMenuItem = (
  tenantId: string | null,
  productId: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => removeItem(tenantId as string, productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
