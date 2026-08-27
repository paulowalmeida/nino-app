import { useMutation, useQueryClient } from '@tanstack/react-query'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { ProductService } from '@shared/services/product/product.service'
import type { CreateMenuItemRequest } from '@shared/types/product/create-menu-item-request'

type CreateProductInput = {
  data: CreateMenuItemRequest
  image: File | null
}

export const useCreateProduct = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { success: 'Item adicionado ao cardápio', silentError: true },
    mutationFn: ({ data, image }: CreateProductInput) =>
      ProductService.createItemWithImage(tenantId as string, data, image),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
