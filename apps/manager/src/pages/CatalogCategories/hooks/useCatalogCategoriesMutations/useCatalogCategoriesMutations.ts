import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'
import { toCategoryDeleteError } from '@pages/CatalogCategories/adapters/catalog-categories.adapter/catalog-categories.adapter'
import { useCatalogCategoriesStore } from '@pages/CatalogCategories/states/catalog-categories/catalog-categories.store'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { CategoryService } from '@shared/services/category/category.service'

type ReorderVariables = {
  ids: string[]
}

const invalidateCategories = (
  queryClient: ReturnType<typeof useQueryClient>,
  unitId: string | null
) => {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.productCategories.all(unitId ?? ''),
  })
  void queryClient.invalidateQueries({ queryKey: ['menu', unitId] })
}

const useCreateCategoryMutation = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      variables: string | { name: string; icon: ProductCategoryIcon | null }
    ) => {
      const { name, icon } =
        typeof variables === 'string'
          ? { name: variables, icon: undefined }
          : variables
      return icon == null
        ? CategoryService.createCategory(unitId as string, name)
        : CategoryService.createCategory(unitId as string, name, icon)
    },
    onSuccess: () => invalidateCategories(queryClient, unitId),
  })
}

const useDeleteCategoryMutation = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      CategoryService.removeCategory(unitId as string, id),
    onSuccess: () => invalidateCategories(queryClient, unitId),
  })
}

const useReorderCategoriesMutation = (unitId: string | null) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids }: ReorderVariables) =>
      CategoryService.reorderCategories(unitId as string, ids),
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.list(unitId ?? ''),
      })
      void queryClient.invalidateQueries({ queryKey: ['menu', unitId] })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.all(unitId ?? ''),
      })
    },
  })
}

const useUpdateCategoryMutation = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      name,
      icon,
    }: {
      id: string
      name: string
      icon?: ProductCategoryIcon | null
    }) =>
      icon === undefined
        ? CategoryService.updateCategory(unitId as string, id, name)
        : CategoryService.updateCategory(unitId as string, id, name, icon),
    onSuccess: () => invalidateCategories(queryClient, unitId),
  })
}

export const useCatalogCategoriesMutations = (unitId: string | null) => {
  const clientState = useCatalogCategoriesStore()
  const create = useCreateCategoryMutation(unitId)
  const remove = useDeleteCategoryMutation(unitId)
  const reorder = useReorderCategoriesMutation(unitId)
  const update = useUpdateCategoryMutation(unitId)

  const submitCreate = async () => {
    const name = clientState.createName.trim()
    if (!name) return

    await create.mutateAsync({ name, icon: clientState.createIcon })
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

  const submitEdit = async () => {
    const target = clientState.editTarget
    const name = clientState.editName.trim()
    if (!target || !name) return

    try {
      await update.mutateAsync({
        id: target.id,
        name,
        icon: clientState.editIcon,
      })
      clientState.closeEdit()
    } catch {
      return
    }
  }

  return {
    create,
    remove,
    reorder,
    update,
    submitCreate,
    confirmDelete,
    submitEdit,
  }
}
