import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { CategoryService } from '@services/category.service'

export const useCreateCategory = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Categoria criada',
      errorTitle: 'A categoria não foi criada',
    },
    mutationFn: (name: string) =>
      CategoryService.createCategory(tenantId as string, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.all(tenantId ?? ''),
      })
    },
  })
}
