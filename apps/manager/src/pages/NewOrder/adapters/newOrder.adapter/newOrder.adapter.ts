import type { NewOrderSubmissionInput } from '@pages/NewOrder/types/NewOrderSubmissionInput.type'
import type { CreateOrderRequest } from '@shared/types/order/create-order-request'
import { toE164 } from '@shared/utils/phone/phone'

export const toCreateOrderRequest = ({
  lines,
  channel,
  paymentMethod,
  recipient,
  notes,
}: NewOrderSubmissionInput): CreateOrderRequest => ({
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
