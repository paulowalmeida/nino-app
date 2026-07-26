import { useMutation, useQueryClient } from '@tanstack/react-query'

import { removeItem } from '@services/product/product.service'

import { menuQueryKey } from './useMenu'

export const useDeleteMenuItem = (
  tenantId: string | null,
  productId: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Item excluído do cardápio',
      errorTitle: 'O item continua no cardápio',
    },
    mutationFn: () => removeItem(tenantId as string, productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
