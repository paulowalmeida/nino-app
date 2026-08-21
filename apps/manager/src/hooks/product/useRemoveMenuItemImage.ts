import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ProductService } from '@services/product.service'

import { menuQueryKey } from './useMenu'

export const useRemoveMenuItemImage = (
  tenantId: string | null,
  productId: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { success: 'Foto removida', errorTitle: 'A foto continua no item' },
    mutationFn: (imageId: string) =>
      ProductService.removeItemImage(tenantId as string, productId, imageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
