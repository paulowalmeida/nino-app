import type { CustomerHistory, CustomerPage } from '@custom_types/customer'
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

export const getById = (
  tenantId: string,
  customerId: string
): Promise<CustomerHistory> =>
  get<CustomerHistory>(`tenants/${tenantId}/customers/${customerId}`)
