import type { TopProduct } from './top-product'

/** Agregação de venda concluída num período. Valores já em número. */
export type SalesReport = {
  revenue: number
  orderCount: number
  averageTicket: number
  topProducts: TopProduct[]
}
