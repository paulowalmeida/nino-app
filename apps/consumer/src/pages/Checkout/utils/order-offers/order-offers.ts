import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

type OrderOffersInput = {
  freeDelivery: PublicPromotion | undefined
  discountOffers: PublicPromotion[]
  coupon: PublicPromotion | undefined
  hasPromotionEnded: boolean
}

/* WHY: o cupom digitado entra na disputa da sua classe — frete grátis ou
 * desconto — e, depois de um 409, nenhuma campanha vale mais neste pedido. */
export const orderOffers = ({
  freeDelivery,
  discountOffers,
  coupon,
  hasPromotionEnded,
}: OrderOffersInput) => {
  if (hasPromotionEnded) return { freeDelivery: undefined, discountCandidates: [] }
  const isFreeDeliveryCoupon = coupon?.type === 'FREE_DELIVERY'
  return {
    freeDelivery: isFreeDeliveryCoupon ? coupon : freeDelivery,
    discountCandidates: [isFreeDeliveryCoupon ? undefined : coupon, ...discountOffers],
  }
}
