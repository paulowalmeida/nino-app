import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { ProductCategory } from '@custom_types/product'
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '@services/product/product.service'

import { menuQueryKey } from './useMenu'

/**
 * Categorias direto da API, não do menu: uma categoria recém-criada ainda
 * não tem item e por isso não apareceria na lista do cardápio.
 */
export const useCategories = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.productCategories.list(tenantId ?? ''),
    queryFn: () => listCategories(tenantId as string),
    enabled: !!tenantId,
  })

  const categories: ProductCategory[] = query.data?.data ?? []

  return { ...query, categories }
}

export const useCreateCategory = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createCategory(tenantId as string, name),
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
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(tenantId as string, id, name),
    onSuccess: () => invalidateCategoryQueries(queryClient, tenantId),
  })
}

export const useDeleteCategory = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategory(tenantId as string, id),
    onSuccess: () => invalidateCategoryQueries(queryClient, tenantId),
  })
}
