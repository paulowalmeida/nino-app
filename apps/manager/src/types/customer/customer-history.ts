import type { CustomerAddress } from './customer-address'
import type { CustomerHistoryEntry } from './customer-history-entry'
import type { TenantCustomer } from './tenant-customer'

export type CustomerHistory = TenantCustomer & {
  cpf: string | null
  addresses: CustomerAddress[]
  history: CustomerHistoryEntry[]
}
