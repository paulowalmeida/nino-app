import type { CounterSaleInput } from '@pages/Counter/types/CounterSaleInput.type'
import type { CreateOrderRequest } from '@shared/types/order/create-order-request'
import { moneyValue } from '@shared/utils/money/money'

export const toCounterSaleRequest = ({
  lines,
  channel = 'COUNTER',
  paymentMethod,
  customerName,
  tableNumber,
  recipient,
  changeFor,
}: CounterSaleInput): CreateOrderRequest => ({
  channel,
  paymentMethod,
  cashReceived: paymentMethod === 'CASH' ? true : undefined,
  guestName:
    (channel === 'DELIVERY' || channel === 'PICKUP'
      ? recipient?.name
      : customerName) || undefined,
  deliveryZoneId:
    channel === 'DELIVERY' ? recipient?.zoneId || undefined : undefined,
  tableNumber: channel === 'COUNTER' && tableNumber ? tableNumber : undefined,
  guestPhone:
    channel === 'DELIVERY' || channel === 'PICKUP'
      ? recipient?.phone || undefined
      : undefined,
  guestZipCode:
    channel === 'DELIVERY' || channel === 'PICKUP'
      ? recipient?.zipCode || undefined
      : undefined,
  guestStreet:
    channel === 'DELIVERY' || channel === 'PICKUP'
      ? recipient?.street || undefined
      : undefined,
  guestNumber:
    channel === 'DELIVERY' || channel === 'PICKUP'
      ? recipient?.number || undefined
      : undefined,
  guestComplement:
    channel === 'DELIVERY' || channel === 'PICKUP'
      ? recipient?.complement || undefined
      : undefined,
  guestNeighborhood:
    channel === 'DELIVERY' || channel === 'PICKUP'
      ? recipient?.neighborhood || undefined
      : undefined,
  guestCity:
    channel === 'DELIVERY' || channel === 'PICKUP'
      ? recipient?.city || undefined
      : undefined,
  guestState:
    channel === 'DELIVERY' || channel === 'PICKUP'
      ? recipient?.state || undefined
      : undefined,
  changeFor:
    paymentMethod === 'CASH' && changeFor?.trim()
      ? moneyValue(changeFor)
      : undefined,
  items: lines.map(({ productId, quantity, unitPrice }) => ({
    productId,
    quantity,
    unitPrice: Number(unitPrice),
  })),
})
