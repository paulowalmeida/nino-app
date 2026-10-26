import type { CartLine } from '@shared/types/counter/cart-line'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { Recipient } from '@shared/types/order/recipient'

export type NewOrderState = {
  lines: CartLine[]
  channel: OrderChannel
  chosenMethod: PaymentMethod | null
  recipient: Recipient
  notes: string
  setChannel: (channel: OrderChannel) => void
  setChosenMethod: (method: PaymentMethod | null) => void
  setRecipient: (patch: Partial<Recipient>) => void
  setNotes: (notes: string) => void
  add: (line: Omit<CartLine, 'quantity'>) => void
  step: (productId: string, by: number) => void
  reset: () => void
}
