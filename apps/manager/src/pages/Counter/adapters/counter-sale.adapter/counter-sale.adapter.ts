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
  guestName:
    (channel === 'DELIVERY' ? recipient?.name : customerName) || undefined,
  tableNumber: channel === 'COUNTER' && tableNumber ? tableNumber : undefined,
  guestPhone:
    channel === 'DELIVERY' ? recipient?.phone || undefined : undefined,
  guestZipCode:
    channel === 'DELIVERY' ? recipient?.zipCode || undefined : undefined,
  guestStreet:
    channel === 'DELIVERY' ? recipient?.street || undefined : undefined,
  guestNumber:
    channel === 'DELIVERY' ? recipient?.number || undefined : undefined,
  guestComplement:
    channel === 'DELIVERY' ? recipient?.complement || undefined : undefined,
  guestNeighborhood:
    channel === 'DELIVERY' ? recipient?.neighborhood || undefined : undefined,
  guestCity: channel === 'DELIVERY' ? recipient?.city || undefined : undefined,
  guestState:
    channel === 'DELIVERY' ? recipient?.state || undefined : undefined,
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
