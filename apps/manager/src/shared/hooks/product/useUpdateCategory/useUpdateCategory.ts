import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidateCategoryQueries } from '@shared/hooks/product/invalidate-category-queries/invalidate-category-queries'
import { CategoryService } from '@shared/services/category/category.service'

export const useUpdateCategory = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Categoria renomeada',
      errorTitle: 'A categoria continua com o nome antigo',
    },
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      CategoryService.updateCategory(unitId as string, id, name),
    onSuccess: () => invalidateCategoryQueries(queryClient, unitId),
  })
}
