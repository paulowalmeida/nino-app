import type { CounterSaleInput } from '@pages/Counter/types/CounterSaleInput.type'
import type { CreateOrderRequest } from '@shared/types/order/create-order-request'

export const toCounterSaleRequest = ({
  lines,
  paymentMethod,
  customerName,
  tableNumber,
}: CounterSaleInput): CreateOrderRequest => ({
  channel: 'COUNTER',
  paymentMethod,
  guestName: customerName || undefined,
  tableNumber: tableNumber || undefined,
  items: lines.map(({ productId, quantity, unitPrice }) => ({
    productId,
    quantity,
    unitPrice: Number(unitPrice),
  })),
})
