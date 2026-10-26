import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { PromotionService } from '@shared/services/promotion/promotion.service/promotion.service'
import type { PromotionListQuery } from '@shared/types/marketing/promotion-list-query.type'

// WHY: mantém a página anterior na tela enquanto a próxima ordem/página chega.
export const usePromotions = (unitId: string | null, query: PromotionListQuery) =>
  useQuery({
    queryKey: queryKeys.promotions.list(unitId ?? '', query),
    queryFn: () => PromotionService.list(unitId as string, query),
    enabled: !!unitId,
    placeholderData: keepPreviousData,
  })
