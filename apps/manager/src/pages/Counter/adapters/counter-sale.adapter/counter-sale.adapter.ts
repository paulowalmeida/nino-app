import type { CounterSaleInput } from '@pages/Counter/types/CounterSaleInput.type'
import type { CreateOrderRequest } from '@shared/types/order/create-order-request'

export const toCounterSaleRequest = ({
  lines,
  paymentMethod,
  customerName,
  tableNumber,
  changeFor,
}: CounterSaleInput): CreateOrderRequest => ({
  channel: 'COUNTER',
  paymentMethod,
  guestName: customerName || undefined,
  tableNumber: tableNumber || undefined,
  changeFor:
    paymentMethod === 'CASH' && changeFor?.trim()
      ? Number(changeFor)
      : undefined,
  items: lines.map(({ productId, quantity, unitPrice }) => ({
    productId,
    quantity,
    unitPrice: Number(unitPrice),
  })),
})
