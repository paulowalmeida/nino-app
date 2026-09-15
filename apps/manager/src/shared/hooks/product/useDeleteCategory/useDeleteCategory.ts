import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidateCategoryQueries } from '@shared/hooks/product/invalidate-category-queries/invalidate-category-queries'
import { CategoryService } from '@shared/services/category/category.service'

export const useDeleteCategory = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* The screen explains inline why a category with items can't be removed. */
    meta: { success: 'Categoria excluída', silentError: true },
    mutationFn: (id: string) =>
      CategoryService.removeCategory(unitId as string, id),
    onSuccess: () => invalidateCategoryQueries(queryClient, unitId),
  })
}
