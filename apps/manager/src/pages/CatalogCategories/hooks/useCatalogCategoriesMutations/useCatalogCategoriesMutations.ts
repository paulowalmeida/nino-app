import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toCategoryDeleteError } from '@pages/CatalogCategories/adapters/catalog-categories.adapter/catalog-categories.adapter'
import { useCatalogCategoriesStore } from '@pages/CatalogCategories/states/catalog-categories/catalog-categories.store'
import { queryKeys } from '@shared/lib/query-keys'
import { CategoryService } from '@shared/services/category/category.service'

type ReorderVariables = {
  ids: string[]
}

const invalidateCategories = (
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string | null
) => {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.productCategories.all(tenantId ?? ''),
  })
  void queryClient.invalidateQueries({ queryKey: ['menu', tenantId] })
}

const useCreateCategoryMutation = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) =>
      CategoryService.createCategory(tenantId as string, name),
    onSuccess: () => invalidateCategories(queryClient, tenantId),
  })
}

const useDeleteCategoryMutation = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      CategoryService.removeCategory(tenantId as string, id),
    onSuccess: () => invalidateCategories(queryClient, tenantId),
  })
}

const useReorderCategoriesMutation = (tenantId: string | null) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids }: ReorderVariables) =>
      CategoryService.reorderCategories(tenantId as string, ids),
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.list(tenantId ?? ''),
      })
      void queryClient.invalidateQueries({ queryKey: ['menu', tenantId] })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.all(tenantId ?? ''),
      })
    },
  })
}

const useUpdateCategoryMutation = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      CategoryService.updateCategory(tenantId as string, id, name),
    onSuccess: () => invalidateCategories(queryClient, tenantId),
  })
}

export const useCatalogCategoriesMutations = (tenantId: string | null) => {
  const clientState = useCatalogCategoriesStore()
  const create = useCreateCategoryMutation(tenantId)
  const remove = useDeleteCategoryMutation(tenantId)
  const reorder = useReorderCategoriesMutation(tenantId)
  const update = useUpdateCategoryMutation(tenantId)

  const submitCreate = async () => {
    const name = clientState.createName.trim()
    if (!name) return

    await create.mutateAsync(name)
    clientState.clearCreateName()
  }

  const confirmDelete = async () => {
    const target = clientState.deleteTarget
    if (!target) return

    try {
      await remove.mutateAsync(target.id)
      clientState.closeDelete()
    } catch (error) {
      clientState.setDeleteError(toCategoryDeleteError(error))
    }
  }

  return {
    create,
    remove,
    reorder,
    update,
    submitCreate,
    confirmDelete,
  }
}
