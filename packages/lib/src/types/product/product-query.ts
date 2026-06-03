import { PaginatedQuery } from '../common/paginated-query'

export type ProductQuery = PaginatedQuery & {
  categoryId?: string
  isActive?: boolean
}
