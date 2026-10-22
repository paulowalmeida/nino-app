import type { CartLine } from '@custom_types/cart/cart-line'
import type { PublicDeliveryZone } from '@custom_types/delivery-zone/PublicDeliveryZone.type'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { cartItemPrice } from '@utils/cart-item-price/cart-item-price'
import { freeDeliveryCoverage } from '@utils/free-delivery/free-delivery'

export type CheckoutTotalsInput = {
  cartLines: CartLine[]
  isDelivery: boolean
  zone: PublicDeliveryZone | undefined
  estimatedMinutes: number | undefined
  freeDelivery?: PublicPromotion
}

export const checkoutTotals = ({
  cartLines,
  isDelivery,
  zone,
  estimatedMinutes,
  freeDelivery,
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
  const total = subtotal + deliveryFee - deliveryDiscount
  const deliveryNote = estimatedMinutes
    ? `Chega em ~${estimatedMinutes} min`
    : 'Levamos até você'

  return {
    subtotal,
    deliveryFee,
    deliveryDiscount,
    freeDeliveryCoverage: coverage,
    total,
    deliveryNote,
  }
}
