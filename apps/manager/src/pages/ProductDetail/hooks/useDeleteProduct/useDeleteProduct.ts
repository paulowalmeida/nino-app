import { useMutation, useQueryClient } from '@tanstack/react-query'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { ProductService } from '@shared/services/product/product.service'

export const useDeleteProduct = (
  unitId: string | null,
  productId: string | undefined
) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Item excluído do cardápio',
      errorTitle: 'O item continua no cardápio',
    },
    mutationFn: () =>
      ProductService.removeItem(unitId as string, productId as string),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(unitId) })
      /* WHY: excluir o item pode zerar a contagem da categoria — os chips
       * do cardápio precisam reler isso. */
      void queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.all(unitId ?? ''),
      })
      /* WHY: a lista de itens do Cardápio é filtrada por categoria — o item
       * excluído continuaria nela até outro gatilho, sem isso. */
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.all(unitId ?? ''),
      })
    },
  })
}
