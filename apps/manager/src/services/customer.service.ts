import type { CustomerHistory } from '@custom_types/customer/customer-history'
import type {
  CustomerHistoryPage,
} from '@custom_types/customer/customer-history-page'
import type { CustomerPage } from '@custom_types/customer/customer-page'
import type { TopCustomer } from '@custom_types/customer/top-customer'
import type {
  TopCustomerMetric,
} from '@custom_types/customer/top-customer-metric'
import { api } from '@services/http.service'

export const CUSTOMER_PAGE_SIZE = 30
export const HISTORY_PAGE_SIZE = 15

export const CustomerService = {
  listCustomers: (
    tenantId: string,
    page: number,
    search?: string
  ): Promise<CustomerPage> => {
    const params: Record<string, string | number> = {
      target: 'createdAt',
      direction: 'desc',
      size: CUSTOMER_PAGE_SIZE,
      page,
    }
    if (search) params['search'] = search

    return api.getAll<CustomerPage>(`tenants/${tenantId}/customers`, params)
  },

  listCustomerOrders: (
    tenantId: string,
    customerId: string,
    page: number
  ): Promise<CustomerHistoryPage> =>
    api.getAll<CustomerHistoryPage>(
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

  getTopCustomers: (
    tenantId: string,
    metric: TopCustomerMetric,
    limit: number
  ): Promise<TopCustomer[]> =>
    api.getAll<TopCustomer[]>(`tenants/${tenantId}/customers/top`, {
      metric,
      limit,
    }),
}
