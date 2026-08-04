import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateMenuItemRequest } from '@custom_types/product'
import { ProductService } from '@services/product.service'

import { menuQueryKey } from './useMenu'

export const useCreateMenuItem = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* O erro aparece no fim do formulário; o sucesso navega pro cardápio. */
    meta: { success: 'Item adicionado ao cardápio', silentError: true },
    mutationFn: (data: CreateMenuItemRequest) =>
      ProductService.createItem(tenantId as string, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
