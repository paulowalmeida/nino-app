import { useMutation, useQueryClient } from '@tanstack/react-query'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { ProductService } from '@shared/services/product/product.service'

export const useRemoveProductImage = (
  unitId: string | null,
  productId: string | undefined
) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { success: 'Foto removida', errorTitle: 'A foto continua no item' },
    mutationFn: (imageId: string) =>
      ProductService.removeItemImage(
        unitId as string,
        productId as string,
        imageId
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(unitId) })
    },
  })
}
