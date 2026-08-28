import type { CartLine } from '@shared/types/counter/cart-line'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { MenuItem } from '@shared/types/product/menu-item'

export type CounterState = {
  lines: CartLine[]
  sheet: boolean
  chosenPaymentMethod: PaymentMethod | null
  customerName: string
  tableNumber: string
  changeFor: string
  add: (item: MenuItem) => void
  step: (productId: string, by: number) => void
  clear: () => void
  setSheet: (sheet: boolean) => void
  setChosenPaymentMethod: (method: PaymentMethod | null) => void
  setCustomerName: (name: string) => void
  setTableNumber: (table: string) => void
  setChangeFor: (value: string) => void
}
