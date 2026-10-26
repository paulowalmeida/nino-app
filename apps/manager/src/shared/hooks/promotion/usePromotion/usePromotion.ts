import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { PromotionService } from '@shared/services/promotion/promotion.service/promotion.service'

export const usePromotion = (unitId: string | null, promotionId: string | null) =>
  useQuery({
    queryKey: queryKeys.promotions.detail(unitId ?? '', promotionId ?? ''),
    queryFn: () =>
      PromotionService.getById(unitId as string, promotionId as string),
    enabled: !!unitId && !!promotionId,
  })
