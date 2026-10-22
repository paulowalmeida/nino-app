import { usePromotionStatusChange } from '@pages/Promotions/hooks/usePromotionStatusChange/usePromotionStatusChange'
import { usePromotions } from '@shared/hooks/promotion/usePromotions/usePromotions'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const usePromotionsFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const promotions = usePromotions(unitId)
  const statusChange = usePromotionStatusChange(unitId)

  return {
    ...statusChange,
    promotions: promotions.data,
    isPending: promotions.isPending,
    isError: promotions.isError,
    retry: promotions.refetch,
  }
}
