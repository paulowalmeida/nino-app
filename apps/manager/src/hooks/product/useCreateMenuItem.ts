import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateMenuItemRequest } from '@custom_types/product'
import { createItem } from '@services/product/product.service'

import { menuQueryKey } from './useMenu'

export const useCreateMenuItem = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* O erro aparece no fim do formulário; o sucesso navega pro cardápio. */
    meta: { success: 'Item adicionado ao cardápio', silentError: true },
    mutationFn: (data: CreateMenuItemRequest) =>
      createItem(tenantId as string, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
