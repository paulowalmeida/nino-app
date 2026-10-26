import { LoyaltyTransactionType } from '../../enums'
import { PaginatedQuery } from '../common/paginated-query'

export type LoyaltyTransactionQuery = PaginatedQuery & {
  unitId?: string
  type?: LoyaltyTransactionType
}
