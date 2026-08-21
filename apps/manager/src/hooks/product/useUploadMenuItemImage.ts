import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ProductService } from '@services/product.service'

import { menuQueryKey } from './useMenu'

export const useUploadMenuItemImage = (
  tenantId: string | null,
  productId: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { success: 'Foto salva', silentError: true },
    mutationFn: (file: File) =>
      ProductService.uploadItemImage(tenantId as string, productId, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
