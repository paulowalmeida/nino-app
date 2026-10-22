import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { promotionService } from '@shared/services/promotion/promotion.service/promotion.service'
import { pickFreeDeliveryOffer } from '@utils/free-delivery/free-delivery'

export const useFreeDeliveryOffer = (unitId: string | undefined) => {
  const query = useQuery({
    queryKey: queryKeys.promotions.visibleByUnit(unitId ?? ''),
    queryFn: () => promotionService.listVisible(unitId as string),
    enabled: !!unitId,
  })

  return { freeDelivery: pickFreeDeliveryOffer(query.data), refetchOffer: query.refetch }
}
