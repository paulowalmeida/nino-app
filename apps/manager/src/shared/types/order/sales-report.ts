import type { SalesByChannel } from './sales-by-channel'
import type { SalesByPaymentMethod } from './sales-by-payment-method'
import type { TopProduct } from './top-product'

export type SalesReport = {
  revenue: number
  orderCount: number
  averageTicket: number
  topProducts: TopProduct[]
  byChannel: SalesByChannel[]
  byPaymentMethod: SalesByPaymentMethod[]
}
