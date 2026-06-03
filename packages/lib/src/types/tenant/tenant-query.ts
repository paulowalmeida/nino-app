import { PaginatedQuery } from '../common/paginated-query'

export type TenantQuery = PaginatedQuery & {
  companyId?: string
}
