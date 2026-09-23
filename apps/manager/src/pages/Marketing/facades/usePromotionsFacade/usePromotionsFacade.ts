import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useProductCategoryOptions } from '@shared/hooks/product/useProductCategoryOptions/useProductCategoryOptions'
import { usePromotions } from '@shared/hooks/promotion/usePromotions/usePromotions'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const usePromotionsFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const promotions = usePromotions(unitId)
  const menu = useMenu(unitId)
  const categories = useProductCategoryOptions(unitId)

  return {
    promotions: promotions.query.data ?? [],
    isPending:
      promotions.query.isPending || menu.isPending || categories.isPending,
    isSaving: promotions.save.isPending,
    products: menu.data?.data ?? [],
    categoryOptions: categories.categoryOptions,
    save: promotions.save.mutate,
  }
}
