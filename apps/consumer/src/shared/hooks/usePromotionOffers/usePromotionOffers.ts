import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { promotionService } from '@shared/services/promotion/promotion.service/promotion.service'
import { automaticDiscounts, couponSuggestions } from '@utils/discount/discount'
import {
  openFreeDeliveryOffers,
  pickFreeDeliveryOffer,
} from '@utils/free-delivery/free-delivery'
import { pickGiftOffer } from '@utils/gift/gift'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

type PackagePromotion = PublicPromotion & {
  packageGroups: NonNullable<PublicPromotion['packageGroups']>
}

const isPackagePromotion = (
  promotion: PublicPromotion
): promotion is PackagePromotion =>
  promotion.type === 'PACKAGE' &&
  !promotion.code &&
  !!promotion.packageGroups?.length

export const usePromotionOffers = (unitId: string | undefined) => {
  const query = useQuery({
    queryKey: queryKeys.promotions.visibleByUnit(unitId ?? ''),
    queryFn: () => promotionService.listVisible(unitId as string),
    enabled: !!unitId,
  })

  return {
    freeDelivery: pickFreeDeliveryOffer(query.data),
    freeDeliveryOffers: openFreeDeliveryOffers(query.data),
    discountOffers: automaticDiscounts(query.data),
    giftOffer: pickGiftOffer(query.data),
    giftOffers: (query.data ?? []).filter(
      ({ type, code }) => type === 'GIFT' && !code
    ),
    packageOffers: (query.data ?? []).filter(isPackagePromotion),
    bannerOffers: (query.data ?? []).filter(
      ({ imageUrl, showInBanner }) => showInBanner && !!imageUrl
    ),
    couponSuggestions: couponSuggestions(query.data),
    refetchOffers: query.refetch,
  }
}
