import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateMenuItemRequest } from '@custom_types/product'
import { createItem } from '@services/product/product.service'

import { menuQueryKey } from './useMenu'

export const useCreateMenuItem = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMenuItemRequest) =>
      createItem(tenantId as string, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
