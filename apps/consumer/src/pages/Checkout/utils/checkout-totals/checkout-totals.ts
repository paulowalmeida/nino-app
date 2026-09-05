import type { CartLine } from '@custom_types/cart/cart-line'
import type { PublicDeliveryZone } from '@custom_types/delivery-zone/PublicDeliveryZone.type'
import { cartItemPrice } from '@utils/cart-item-price/cart-item-price'

export type CheckoutTotalsInput = {
  cartLines: CartLine[]
  isDelivery: boolean
  zone: PublicDeliveryZone | undefined
  estimatedMinutes: number | undefined
}

export const checkoutTotals = ({
  cartLines,
  isDelivery,
  zone,
  estimatedMinutes,
}: CheckoutTotalsInput) => {
  const subtotal = cartLines.reduce(
    (total, line) => total + cartItemPrice(line.item) * line.quantity,
    0
  )
  const deliveryFee = isDelivery ? Number(zone?.fee ?? 0) : 0
  const total = subtotal + deliveryFee
  const deliveryNote = estimatedMinutes
    ? `Chega em ~${estimatedMinutes} min`
    : 'Levamos até você'

  return { subtotal, deliveryFee, total, deliveryNote }
}
