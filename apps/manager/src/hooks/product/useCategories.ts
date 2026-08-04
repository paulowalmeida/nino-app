import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { ProductCategory } from '@custom_types/product'
import { CategoryService } from '@services/category.service'

import { menuQueryKey } from './useMenu'

/**
 * Categorias direto da API, não do menu: uma categoria recém-criada ainda
 * não tem item e por isso não apareceria na lista do cardápio.
 */
export const useCategories = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.productCategories.list(tenantId ?? ''),
    queryFn: () => CategoryService.listCategories(tenantId as string),
    enabled: !!tenantId,
  })

  const categories: ProductCategory[] = query.data?.data ?? []

  return { ...query, categories }
}

export const useCreateCategory = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Categoria criada',
      errorTitle: 'A categoria não foi criada',
    },
    mutationFn: (name: string) => CategoryService.createCategory(tenantId as string, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.all(tenantId ?? ''),
      })
    },
  })
}

const invalidateCategoryQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string | null
) => {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.productCategories.all(tenantId ?? ''),
  })
  void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
}

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

export const useDeleteCategory = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* A tela explica na hora por que uma categoria com itens não sai. */
    meta: { success: 'Categoria excluída', silentError: true },
    mutationFn: (id: string) => CategoryService.removeCategory(tenantId as string, id),
    onSuccess: () => invalidateCategoryQueries(queryClient, tenantId),
  })
}
