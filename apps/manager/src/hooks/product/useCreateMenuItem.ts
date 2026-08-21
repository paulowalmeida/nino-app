import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateMenuItemRequest } from '@custom_types/product/create-menu-item-request'
import { ProductService } from '@services/product.service'

import { menuQueryKey } from './useMenu'

type CreateMenuItemInput = {
  data: CreateMenuItemRequest
  image: File | null
}

export const useCreateMenuItem = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { success: 'Item adicionado ao cardápio', silentError: true },
    mutationFn: ({ data, image }: CreateMenuItemInput) =>
      ProductService.createItemWithImage(tenantId as string, data, image),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
