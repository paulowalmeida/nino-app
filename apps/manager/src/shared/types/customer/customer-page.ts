import type { TenantCustomer } from './tenant-customer'

export type CustomerPage = {
  data: TenantCustomer[]
  pagination: {
    total: number
    page: number
    size: number
  }
}
