/** Um recorte da lista de produtos, do jeito que a API recebe. */
export type ProductListParams = {
  page: number
  size: number
  categoryId?: string
  search?: string
}
