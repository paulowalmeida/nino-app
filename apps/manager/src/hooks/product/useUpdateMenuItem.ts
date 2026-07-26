import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UpdateMenuItemRequest } from '@custom_types/product'
import { updateItem } from '@services/product/product.service'

import { menuQueryKey } from './useMenu'

export const useUpdateMenuItem = (
  tenantId: string | null,
  productId: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* O erro aparece no fim do formulário; o sucesso navega pro cardápio. */
    meta: { success: 'Item salvo', silentError: true },
    mutationFn: (data: UpdateMenuItemRequest) =>
      updateItem(tenantId as string, productId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
