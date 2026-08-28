import { useCreateCategory } from '@pages/NewProduct/hooks/useCreateCategory/useCreateCategory'
import { useNewProductSubmission } from '@pages/NewProduct/hooks/useNewProductSubmission/useNewProductSubmission'
import { useProductCategoryOptions } from '@shared/hooks/product/useProductCategoryOptions/useProductCategoryOptions'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useNewProductFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const categories = useProductCategoryOptions(tenantId)
  const submission = useNewProductSubmission(tenantId)
  const categoryCreation = useCreateCategory(tenantId)

  return {
    ...submission,
    categoryOptions: categories.categoryOptions,
    isCategoriesPending: categories.isPending,
    createCategory: categoryCreation.mutateAsync,
    isCreatingCategory: categoryCreation.isPending,
  }
}
