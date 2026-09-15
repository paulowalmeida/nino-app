import { useMutation, useQueryClient } from '@tanstack/react-query'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { ProductService } from '@shared/services/product/product.service'
import type { UpdateMenuItemRequest } from '@shared/types/product/update-menu-item-request'

export const useUpdateProduct = (
  unitId: string | null,
  productId: string | undefined
) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* WHY: o erro aparece no rodapé do formulário; o sucesso já navega. */
    meta: { success: 'Item salvo', silentError: true },
    mutationFn: (data: UpdateMenuItemRequest) =>
      ProductService.updateItem(unitId as string, productId as string, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(unitId) })
      /* WHY: trocar a categoria do item muda a contagem das duas categorias
       * envolvidas — os chips do cardápio precisam reler isso. */
      void queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.all(unitId ?? ''),
      })
      /* WHY: a lista de itens do Cardápio é filtrada por categoria — sem
       * isso, o item some da categoria antiga só depois de outro gatilho. */
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.all(unitId ?? ''),
      })
    },
  })
}
