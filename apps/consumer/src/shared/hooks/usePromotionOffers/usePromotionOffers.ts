import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { promotionService } from '@shared/services/promotion/promotion.service/promotion.service'
import {
  automaticDiscounts,
  couponSuggestions,
} from '@utils/discount/discount'
import { pickFreeDeliveryOffer } from '@utils/free-delivery/free-delivery'

export const usePromotionOffers = (unitId: string | undefined) => {
  const query = useQuery({
    queryKey: queryKeys.promotions.visibleByUnit(unitId ?? ''),
    queryFn: () => promotionService.listVisible(unitId as string),
    enabled: !!unitId,
  })

  return {
    freeDelivery: pickFreeDeliveryOffer(query.data),
    discountOffers: automaticDiscounts(query.data),
    couponSuggestions: couponSuggestions(query.data),
    refetchOffers: query.refetch,
  }
}
