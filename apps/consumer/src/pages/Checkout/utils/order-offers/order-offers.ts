import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

type OrderOffersInput = {
  freeDelivery: PublicPromotion | undefined
  discountOffers: PublicPromotion[]
  giftOffer?: PublicPromotion
  coupon: PublicPromotion | undefined
  hasPromotionEnded: boolean
}

/* WHY: o cupom digitado entra na disputa da sua classe — frete grátis,
 * desconto ou brinde — e, depois de um 409, nenhuma campanha vale mais. */
export const orderOffers = ({
  freeDelivery,
  discountOffers,
  giftOffer,
  coupon,
  hasPromotionEnded,
}: OrderOffersInput) => {
  if (hasPromotionEnded)
    return { freeDelivery: undefined, discountCandidates: [], gift: undefined }
  const isFreeDeliveryCoupon = coupon?.type === 'FREE_DELIVERY'
  const isGiftCoupon = coupon?.type === 'GIFT'
  return {
    freeDelivery: isFreeDeliveryCoupon ? coupon : freeDelivery,
    discountCandidates: [
      isFreeDeliveryCoupon || isGiftCoupon ? undefined : coupon,
      ...discountOffers,
    ],
    gift: isGiftCoupon ? coupon : giftOffer,
  }
}
