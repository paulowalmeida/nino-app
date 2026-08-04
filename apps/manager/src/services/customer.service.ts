import type {
  CustomerHistory,
  CustomerHistoryPage,
  CustomerPage,
} from '@custom_types/customer'
import { api } from '@services/http.service'

type CustomerListParams = {
  target: string
  direction: string
  size: number
  page: number
}

export const CUSTOMER_PAGE_SIZE = 30
export const HISTORY_PAGE_SIZE = 15

export const CustomerService = {
  listCustomers: (tenantId: string, page: number): Promise<CustomerPage> =>
    api.getAll<CustomerListParams, CustomerPage>(
      `tenants/${tenantId}/customers`,
      {
        target: 'createdAt',
        direction: 'desc',
        size: CUSTOMER_PAGE_SIZE,
        page,
      }
    ),

  listCustomerOrders: (
    tenantId: string,
    customerId: string,
    page: number
  ): Promise<CustomerHistoryPage> =>
    api.getAll<CustomerListParams, CustomerHistoryPage>(
      `tenants/${tenantId}/customers/${customerId}/orders`,
      {
        target: 'createdAt',
        direction: 'desc',
        size: HISTORY_PAGE_SIZE,
        page,
      }
    ),

  getById: (tenantId: string, customerId: string): Promise<CustomerHistory> =>
    api.get<CustomerHistory>(`tenants/${tenantId}/customers/${customerId}`),
}
