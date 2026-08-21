import type { CartLine } from '@custom_types/counter/cart-line'
import type { CreateOrderRequest } from '@custom_types/order/create-order-request'
import type { OrderChannel } from '@custom_types/order/order-channel'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { Recipient } from '@custom_types/order/recipient'
import { toE164 } from '@utils/phone'

type NewOrderInput = {
  lines: CartLine[]
  channel: OrderChannel
  paymentMethod: PaymentMethod
  recipient: Recipient
  notes: string
}

export const toCreateOrderRequest = ({
  lines,
  channel,
  paymentMethod,
  recipient,
  notes,
}: NewOrderInput): CreateOrderRequest => ({
  channel,
  paymentMethod,
  notes: notes || undefined,
  items: lines.map(({ productId, quantity, unitPrice }) => ({
    productId,
    quantity,
    unitPrice: Number(unitPrice),
  })),
  guestName: recipient.name || undefined,
  guestPhone: recipient.phone ? toE164(recipient.phone) : undefined,
  ...(channel === 'DELIVERY'
    ? {
        deliveryZoneId: recipient.zoneId,
        guestStreet: recipient.street,
        guestNumber: recipient.number || undefined,
        guestComplement: recipient.complement || undefined,
        guestNeighborhood: recipient.neighborhood || undefined,
      }
    : {}),
})
