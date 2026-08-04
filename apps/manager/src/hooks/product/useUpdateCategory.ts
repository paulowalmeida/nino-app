import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CategoryService } from '@services/category.service'

import { invalidateCategoryQueries } from './invalidate-category-queries'

export const useUpdateCategory = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Categoria renomeada',
      errorTitle: 'A categoria continua com o nome antigo',
    },
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      CategoryService.updateCategory(tenantId as string, id, name),
    onSuccess: () => invalidateCategoryQueries(queryClient, tenantId),
  })
}
