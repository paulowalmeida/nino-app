import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { CustomerHistory, CustomerPage, TenantCustomer } from '@custom_types/customer'
import {
  CUSTOMER_PAGE_SIZE,
  getById,
  listCustomers,
} from '@services/customer/customer.service'

export const useCustomers = (tenantId: string | null) => {
  const query = useInfiniteQuery<CustomerPage>({
    queryKey: [...queryKeys.customers.list(tenantId ?? '')],
    queryFn: ({ pageParam }) =>
      listCustomers(tenantId as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) => {
      const loaded = pagination.page * CUSTOMER_PAGE_SIZE
      return loaded < pagination.total ? pagination.page + 1 : undefined
    },
    enabled: !!tenantId,
  })

  const customers: TenantCustomer[] =
    query.data?.pages.flatMap(({ data }) => data) ?? []

  return { ...query, customers, total: query.data?.pages[0]?.pagination.total }
}

export const useCustomer = (tenantId: string | null, customerId: string) =>
  useQuery<CustomerHistory>({
    queryKey: queryKeys.customers.detail(tenantId ?? '', customerId),
    queryFn: () => getById(tenantId as string, customerId),
    enabled: !!tenantId && !!customerId,
  })
