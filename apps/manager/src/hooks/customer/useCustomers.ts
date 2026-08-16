import { useInfiniteQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { CustomerPage } from '@custom_types/customer/customer-page'
import type { TenantCustomer } from '@custom_types/customer/tenant-customer'
import { CUSTOMER_PAGE_SIZE, CustomerService } from '@services/customer.service'
import { nextPageParam } from '@utils/next-page-param'

export const useCustomers = (tenantId: string | null, search = '') => {
  const query = useInfiniteQuery<CustomerPage>({
    queryKey: [...queryKeys.customers.list(tenantId ?? '', search)],
    queryFn: ({ pageParam }) =>
      CustomerService.listCustomers(
        tenantId as string,
        pageParam as number,
        search || undefined
      ),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      nextPageParam(pagination, CUSTOMER_PAGE_SIZE),
    enabled: !!tenantId,
  })

  const customers: TenantCustomer[] =
    query.data?.pages.flatMap(({ data }) => data) ?? []

  return { ...query, customers, total: query.data?.pages[0]?.pagination.total }
}
