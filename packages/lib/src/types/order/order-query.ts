import { PaginatedQuery } from '../common/paginated-query'

export type OrderQuery = PaginatedQuery & {
  tenantId?: string
  customerId?: string
}
