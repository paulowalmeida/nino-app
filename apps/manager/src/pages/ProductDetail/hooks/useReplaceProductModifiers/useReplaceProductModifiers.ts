import { useMutation, useQueryClient } from '@tanstack/react-query'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { ProductService } from '@shared/services/product/product.service'
import type { ReplaceProductModifierRequest } from '@shared/types/product/replace-product-modifier-request'

export const useReplaceProductModifiers = (
  unitId: string | null,
  productId: string | undefined
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (modifiers: ReplaceProductModifierRequest[]) =>
      ProductService.replaceItemModifiers(
        unitId as string,
        productId as string,
        modifiers
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(unitId) })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.all(unitId ?? ''),
      })
    },
  })
}
