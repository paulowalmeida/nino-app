import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { PromotionService } from '@shared/services/promotion/promotion.service/promotion.service'

export const usePromotions = (unitId: string | null) =>
  useQuery({
    queryKey: queryKeys.promotions.list(unitId ?? ''),
    queryFn: () => PromotionService.list(unitId as string),
    enabled: !!unitId,
  })
