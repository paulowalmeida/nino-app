import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { ProductService } from '@shared/services/product/product.service'
import type { MenuItem } from '@shared/types/product/menu-item'

export const useCatalogMutations = (tenantId: string | null) => {
  const queryClient = useQueryClient()
  
  const invalidateCatalog = () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.products.all(tenantId ?? ''),
    })

  const setAvailability = useMutation({
    mutationFn: (data: { id: string; isActive: boolean }) =>
      ProductService.setItemAvailability(tenantId as string, data.id, data.isActive),
    onSuccess: invalidateCatalog,
  })

  const reorderItems = useMutation({
    mutationFn: (items: MenuItem[]) =>
      ProductService.reorderItems(
        tenantId as string,
        items.map((item) => item.id)
      ),
    onSuccess: invalidateCatalog,
  })

  const deleteItem = useMutation({
    mutationFn: (id: string) =>
      ProductService.removeItem(tenantId as string, id),
    onSuccess: invalidateCatalog,
  })

  const deleteItems = useMutation({
    mutationFn: (ids: string[]) =>
      ProductService.removeItems(tenantId as string, ids),
    onSuccess: invalidateCatalog,
  })

  return {
    setAvailability,
    reorderItems,
    deleteItem,
    deleteItems,
  }
}
