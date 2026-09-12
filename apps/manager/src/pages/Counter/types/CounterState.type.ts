import type { CounterStep } from '@pages/Counter/types/CounterStep.type'
import type { SaleReceipt } from '@pages/Counter/types/SaleReceipt.type'
import type { CartLine } from '@shared/types/counter/cart-line'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { Recipient } from '@shared/types/order/recipient'
import type { MenuItem } from '@shared/types/product/menu-item'

export type CounterState = {
  lines: CartLine[]
  sheet: boolean
  step: CounterStep
  channel: OrderChannel | null
  chosenPaymentMethod: PaymentMethod | null
  consumerName: string
  tableNumber: string
  recipient: Recipient
  changeFor: string
  lastSale: SaleReceipt | null
  add: (item: MenuItem) => void
  updateQuantity: (productId: string, by: number) => void
  clear: () => void
  setSheet: (sheet: boolean) => void
  setStep: (step: CounterStep) => void
  setChannel: (channel: OrderChannel) => void
  setChosenPaymentMethod: (method: PaymentMethod | null) => void
  setConsumerName: (name: string) => void
  setTableNumber: (table: string) => void
  setRecipient: (patch: Partial<Recipient>) => void
  setChangeFor: (value: string) => void
  setLastSale: (receipt: SaleReceipt) => void
  clearLastSale: () => void
}
