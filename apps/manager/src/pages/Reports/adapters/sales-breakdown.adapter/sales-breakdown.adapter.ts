import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import { brl } from '@shared/utils/money/money'

type BreakdownItem = {
  id: string
  label: string
  value: number
  display: string
}

const displayText = (revenue: number, orderCount: number): string =>
  `${brl(revenue)} · ${orderCount} ${orderCount === 1 ? 'pedido' : 'pedidos'}`

export const toChannelBreakdownItems = (
  records: { channel: OrderChannel; revenue: number; orderCount: number }[],
  labelOf: (channel: OrderChannel) => string
): BreakdownItem[] =>
  records.map(({ channel, revenue, orderCount }) => ({
    id: channel,
    label: labelOf(channel),
    value: revenue,
    display: displayText(revenue, orderCount),
  }))

export const toPaymentMethodBreakdownItems = (
  records: { method: PaymentMethod; revenue: number; orderCount: number }[],
  labelOf: (method: PaymentMethod) => string
): BreakdownItem[] =>
  records.map(({ method, revenue, orderCount }) => ({
    id: method,
    label: labelOf(method),
    value: revenue,
    display: displayText(revenue, orderCount),
  }))
