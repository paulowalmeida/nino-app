import type { CartLine } from '@custom_types/counter'
import type { OrderChannel, PaymentMethod } from '@custom_types/order'

export type SaleTicketProps = {
  lines: CartLine[]
  channel: OrderChannel
  method: PaymentMethod
  isSending: boolean
  failed: boolean
  onStep: (productId: string, by: number) => void
  onChannel: (channel: OrderChannel) => void
  onMethod: (method: PaymentMethod) => void
  onClear: () => void
  onFinish: () => void
}
