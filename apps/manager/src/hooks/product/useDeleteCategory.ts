import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CategoryService } from '@services/category.service'

import { invalidateCategoryQueries } from './invalidate-category-queries'

export const useDeleteCategory = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* The screen explains inline why a category with items can't be removed. */
    meta: { success: 'Categoria excluída', silentError: true },
    mutationFn: (id: string) =>
      CategoryService.removeCategory(tenantId as string, id),
    onSuccess: () => invalidateCategoryQueries(queryClient, tenantId),
  })
}
