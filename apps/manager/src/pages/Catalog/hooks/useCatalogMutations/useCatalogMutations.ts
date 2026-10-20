import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { ProductService } from '@shared/services/product/product.service'
import type { MenuItem } from '@shared/types/product/menu-item'

export const useCatalogMutations = (unitId: string | null) => {
  const queryClient = useQueryClient()

  const invalidateCatalog = () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.products.all(unitId ?? ''),
    })

  const setAvailability = useMutation({
    mutationFn: (data: { id: string; isActive: boolean }) =>
      ProductService.setItemAvailability(
        unitId as string,
        data.id,
        data.isActive
      ),
    onSuccess: invalidateCatalog,
  })

  const reorderItems = useMutation({
    mutationFn: (items: MenuItem[]) =>
      ProductService.reorderItems(
        unitId as string,
        items.map((item) => item.id)
      ),
    onSuccess: invalidateCatalog,
  })

  const deleteItem = useMutation({
    mutationFn: (id: string) => ProductService.removeItem(unitId as string, id),
    onSuccess: invalidateCatalog,
  })

  const deleteItems = useMutation({
    mutationFn: (ids: string[]) =>
      ProductService.removeItems(unitId as string, ids),
    onSuccess: invalidateCatalog,
  })

  return {
    setAvailability,
    reorderItems,
    deleteItem,
    deleteItems,
  }
}
