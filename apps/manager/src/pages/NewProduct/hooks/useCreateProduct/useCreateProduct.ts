import { useMutation, useQueryClient } from '@tanstack/react-query'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { queryKeys } from '@shared/lib/query-keys'
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
      /* WHY: o item novo aumenta a contagem da categoria — os chips do
       * cardápio precisam reler isso. */
      void queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.all(tenantId ?? ''),
      })
      /* WHY: a lista de itens do Cardápio é filtrada por categoria — o item
       * novo só apareceria nela depois de outro gatilho, sem isso. */
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.all(tenantId ?? ''),
      })
    },
  })
}
