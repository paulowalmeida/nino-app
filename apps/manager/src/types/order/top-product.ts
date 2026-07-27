export type TopProduct = {
  productId: string
  name: string
  quantity: number
  /** Preço médio ponderado no período — a tabela pode ter mudado no meio. */
  unitPrice: number
  /** Receita real do produto: soma de quantidade × preço praticado. */
  revenue: number
}
