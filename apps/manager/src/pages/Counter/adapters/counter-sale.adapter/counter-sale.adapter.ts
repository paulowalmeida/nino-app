import type { CounterSaleInput } from '@pages/Counter/types/CounterSaleInput.type'
import type { CreateOrderRequest } from '@shared/types/order/create-order-request'
import { moneyValue } from '@shared/utils/money/money'

export const toCounterSaleRequest = ({
  lines,
  paymentMethod,
  customerName,
  changeFor,
}: CounterSaleInput): CreateOrderRequest => ({
  channel: 'COUNTER',
  paymentMethod,
  guestName: customerName || undefined,
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
