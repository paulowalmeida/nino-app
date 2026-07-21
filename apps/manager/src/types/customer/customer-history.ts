import type { CustomerHistoryEntry } from './customer-history-entry'
import type { TenantCustomer } from './tenant-customer'

export type CustomerHistory = TenantCustomer & {
  history: CustomerHistoryEntry[]
}
