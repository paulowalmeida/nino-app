import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

type OrderOffersInput = {
  freeDelivery: PublicPromotion | undefined
  giftOffers?: PublicPromotion[]
  packageOffer?: PublicPromotion
  coupon: PublicPromotion | undefined
  hasPromotionEnded: boolean
}

/* WHY: o cupom escolhido entra na disputa da sua classe — frete grátis,
 * desconto ou brinde — e, depois de um 409, nenhuma campanha vale mais. */
export const orderOffers = ({
  freeDelivery,
  giftOffers = [],
  packageOffer,
  coupon,
  hasPromotionEnded,
}: OrderOffersInput) => {
  if (hasPromotionEnded)
    return {
      freeDelivery: undefined,
      discountCandidates: [],
      gift: undefined,
    }
  const isFreeDeliveryCoupon = coupon?.type === 'FREE_DELIVERY'
  const isGiftCoupon = coupon?.type === 'GIFT'
  return {
    freeDelivery: isFreeDeliveryCoupon ? coupon : freeDelivery,
    // WHY: desconto só entra quando o cliente o escolhe na lista de cupons.
    discountCandidates: [
      isFreeDeliveryCoupon || isGiftCoupon ? undefined : coupon,
    ],
    giftCandidates: isGiftCoupon ? [coupon] : giftOffers,
    gift: isGiftCoupon ? coupon : giftOffers[0],
    packageOffer,
  }
}
