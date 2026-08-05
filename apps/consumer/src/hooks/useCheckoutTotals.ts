import type { CartLine } from '@custom_types/cart/cart-line'
import type { PublicDeliveryZone } from '@custom_types/delivery-zone/public-delivery-zone'

type UseCheckoutTotalsParams = {
  cartLines: CartLine[]
  isDelivery: boolean
  zone: PublicDeliveryZone | undefined
  estimatedMinutes: number | undefined
}

/** O que o pedido custa — puro cálculo, sem tocar no formulário. */
export const useCheckoutTotals = ({
  cartLines,
  isDelivery,
  zone,
  estimatedMinutes,
}: UseCheckoutTotalsParams) => {
  const subtotal = cartLines.reduce(
    (total, line) => total + Number(line.item.price) * line.quantity,
    0
  )
  const deliveryFee = isDelivery ? Number(zone?.fee ?? 0) : 0
  const total = subtotal + deliveryFee

  const deliveryNote = estimatedMinutes
    ? `Chega em ~${estimatedMinutes} min`
    : 'Levamos até você'

  return { subtotal, deliveryFee, total, deliveryNote }
}
