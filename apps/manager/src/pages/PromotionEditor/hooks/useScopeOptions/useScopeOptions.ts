import { toScopeProductOptions } from '@pages/PromotionEditor/adapters/scopeProductOptions.adapter/scopeProductOptions.adapter'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useProductCategoryOptions } from '@shared/hooks/product/useProductCategoryOptions/useProductCategoryOptions'

export const useScopeOptions = (unitId: string | null) => {
  const menu = useMenu(unitId)
  const categories = useProductCategoryOptions(unitId)
  return {
    scopeProductOptions: toScopeProductOptions(menu.data?.data),
    scopeCategoryOptions: categories.categoryOptions,
    isPending: menu.isPending || categories.isPending,
  }
}
