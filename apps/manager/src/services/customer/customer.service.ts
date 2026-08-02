import type {
  CustomerHistory,
  CustomerHistoryPage,
  CustomerPage,
} from '@custom_types/customer'
import { ApiFactory } from '@services/api/api.service'

const { get, getAll } = ApiFactory()

type CustomerListParams = {
  target: string
  direction: string
  size: number
  page: number
}

export const CUSTOMER_PAGE_SIZE = 30

/** Os mais recentes primeiro: quem acabou de comprar é quem se lembra. */
export const listCustomers = (
  tenantId: string,
  page: number
): Promise<CustomerPage> =>
  getAll<CustomerListParams, CustomerPage>(`tenants/${tenantId}/customers`, {
    target: 'createdAt',
    direction: 'desc',
    size: CUSTOMER_PAGE_SIZE,
    page,
  })

export const HISTORY_PAGE_SIZE = 15

/**
 * Uma página do histórico. A janela de 90 dias mora no servidor; aqui só se
 * pede a próxima fatia conforme a pessoa rola.
 */
export const listCustomerOrders = (
  tenantId: string,
  customerId: string,
  page: number
): Promise<CustomerHistoryPage> =>
  getAll<CustomerListParams, CustomerHistoryPage>(
    `tenants/${tenantId}/customers/${customerId}/orders`,
    {
      target: 'createdAt',
      direction: 'desc',
      size: HISTORY_PAGE_SIZE,
      page,
    }
  )

export const getById = (
  tenantId: string,
  customerId: string
): Promise<CustomerHistory> =>
  get<CustomerHistory>(`tenants/${tenantId}/customers/${customerId}`)
