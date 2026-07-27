/** Um balde da série de venda. `at` é o início do balde no fuso da loja. */
export type SalesSeriesPoint = {
  at: string
  revenue: number
  orderCount: number
  averageTicket: number
}
