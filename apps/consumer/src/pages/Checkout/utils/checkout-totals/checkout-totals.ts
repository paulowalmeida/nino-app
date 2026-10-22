import type { CartLine } from '@custom_types/cart/cart-line'
import type { PublicDeliveryZone } from '@custom_types/delivery-zone/PublicDeliveryZone.type'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { cartItemPrice } from '@utils/cart-item-price/cart-item-price'
import { largestDiscount } from '@utils/discount/discount'
import { freeDeliveryCoverage } from '@utils/free-delivery/free-delivery'
import { giftApplies } from '@utils/gift/gift'

export type CheckoutTotalsInput = {
  cartLines: CartLine[]
  isDelivery: boolean
  zone: PublicDeliveryZone | undefined
  estimatedMinutes: number | undefined
  freeDelivery?: PublicPromotion
  discountCandidates?: (PublicPromotion | undefined)[]
  gift?: PublicPromotion
}

export const checkoutTotals = ({
  cartLines,
  isDelivery,
  zone,
  estimatedMinutes,
  freeDelivery,
  discountCandidates = [],
  gift,
}: CheckoutTotalsInput) => {
  const subtotal = cartLines.reduce(
    (total, line) => total + cartItemPrice(line.item) * line.quantity,
    0
  )
  const deliveryFee = isDelivery ? Number(zone?.fee ?? 0) : 0
  const coverage = freeDeliveryCoverage(freeDelivery, {
    isDelivery,
    zoneId: zone?.id,
    subtotal,
    deliveryFee,
  })
  const deliveryDiscount = coverage === 'applied' ? deliveryFee : 0
  const discount = largestDiscount(discountCandidates, subtotal)
  const promotionDiscount = discount?.amount ?? 0
  const total = subtotal + deliveryFee - deliveryDiscount - promotionDiscount
  const deliveryNote = estimatedMinutes
    ? `Chega em ~${estimatedMinutes} min`
    : 'Levamos até você'

  return {
    subtotal,
    deliveryFee,
    deliveryDiscount,
    freeDeliveryCoverage: coverage,
    promotionDiscount,
    appliedDiscount: discount?.promotion,
    appliedGift: giftApplies(gift, subtotal) ? gift : undefined,
    total,
    deliveryNote,
  }
}
