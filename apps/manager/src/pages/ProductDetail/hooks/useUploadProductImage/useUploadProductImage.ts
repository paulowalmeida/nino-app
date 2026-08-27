import { useMutation, useQueryClient } from '@tanstack/react-query'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { ProductService } from '@shared/services/product/product.service'

export const useUploadProductImage = (
  tenantId: string | null,
  productId: string | undefined
) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { success: 'Foto salva', silentError: true },
    mutationFn: (file: File) =>
      ProductService.uploadItemImage(
        tenantId as string,
        productId as string,
        file
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
