import { PaginatedQuery } from '../common/paginated-query'

export type UserQuery = PaginatedQuery & {
  companyId?: string
}
