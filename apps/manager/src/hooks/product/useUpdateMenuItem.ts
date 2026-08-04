import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UpdateMenuItemRequest } from '@custom_types/product'
import { ProductService } from '@services/product.service'

import { menuQueryKey } from './useMenu'

export const useUpdateMenuItem = (
  tenantId: string | null,
  productId: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* Error shows at the bottom of the form; success navigates to the menu. */
    meta: { success: 'Item salvo', silentError: true },
    mutationFn: (data: UpdateMenuItemRequest) =>
      ProductService.updateItem(tenantId as string, productId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
