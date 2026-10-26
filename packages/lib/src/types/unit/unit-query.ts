import { PaginatedQuery } from '../common/paginated-query'

export type UnitQuery = PaginatedQuery & {
  companyId?: string
}
