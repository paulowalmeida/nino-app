import { PaginatedQuery } from '../common/paginated-query'

export type OrderQuery = PaginatedQuery & {
  unitId?: string
  consumerId?: string
}
