import { useMutation, useQueryClient } from '@tanstack/react-query'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { queryKeys } from '@shared/lib/query-keys'
import { ProductService } from '@shared/services/product/product.service'
import type { UpdateMenuItemRequest } from '@shared/types/product/update-menu-item-request'

export const useUpdateProduct = (
  tenantId: string | null,
  productId: string | undefined
) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* WHY: o erro aparece no rodapé do formulário; o sucesso já navega. */
    meta: { success: 'Item salvo', silentError: true },
    mutationFn: (data: UpdateMenuItemRequest) =>
      ProductService.updateItem(tenantId as string, productId as string, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
      /* WHY: trocar a categoria do item muda a contagem das duas categorias
       * envolvidas — os chips do cardápio precisam reler isso. */
      void queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.all(tenantId ?? ''),
      })
    },
  })
}
