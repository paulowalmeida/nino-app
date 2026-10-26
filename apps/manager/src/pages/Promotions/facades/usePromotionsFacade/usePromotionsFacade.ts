import { usePromotionListQuery } from '@pages/Promotions/hooks/ui/usePromotionListQuery/usePromotionListQuery'
import { usePromotionStatusChange } from '@pages/Promotions/hooks/usePromotionStatusChange/usePromotionStatusChange'
import { usePromotions } from '@shared/hooks/promotion/usePromotions/usePromotions'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const usePromotionsFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const listQuery = usePromotionListQuery()
  const promotions = usePromotions(unitId, listQuery.query)
  const statusChange = usePromotionStatusChange(unitId)

  return {
    ...statusChange,
    ...listQuery,
    promotions: promotions.data?.data ?? [],
    tabCounts: promotions.data?.tabCounts,
    total: promotions.data?.pagination.total ?? 0,
    isPending: promotions.isPending,
    isError: promotions.isError,
    retry: promotions.refetch,
  }
}
