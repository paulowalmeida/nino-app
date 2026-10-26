import { useCreateCategory } from '@pages/NewProduct/hooks/useCreateCategory/useCreateCategory'
import { useNewProductSubmission } from '@pages/NewProduct/hooks/useNewProductSubmission/useNewProductSubmission'
import { useProductCategoryOptions } from '@shared/hooks/product/useProductCategoryOptions/useProductCategoryOptions'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useNewProductFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const categories = useProductCategoryOptions(unitId)
  const submission = useNewProductSubmission(unitId)
  const categoryCreation = useCreateCategory(unitId)

  return {
    ...submission,
    categoryOptions: categories.categoryOptions,
    isCategoriesPending: categories.isPending,
    createCategory: categoryCreation.mutateAsync,
    isCreatingCategory: categoryCreation.isPending,
  }
}
