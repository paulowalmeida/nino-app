import { useInfiniteQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { CustomerHistoryEntry } from '@custom_types/customer/customer-history-entry'
import type { CustomerHistoryPage } from '@custom_types/customer/customer-history-page'
import { CustomerService, HISTORY_PAGE_SIZE } from '@services/customer.service'
import { nextPageParam } from '@utils/next-page-param'

/**
 * History on demand: the profile opens with the first page and fetches the
 * next one when the person reaches the end of the list, same as the menu
 * does with items.
 */
export const useCustomerOrders = (
  tenantId: string | null,
  customerId: string
) => {
  const query = useInfiniteQuery<CustomerHistoryPage>({
    queryKey: [
      ...queryKeys.customers.detail(tenantId ?? '', customerId),
      'orders',
    ],
    queryFn: ({ pageParam }) =>
      CustomerService.listCustomerOrders(
        tenantId as string,
        customerId,
        pageParam as number
      ),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      nextPageParam(pagination, HISTORY_PAGE_SIZE),
    enabled: !!tenantId && !!customerId,
  })

  const orders: CustomerHistoryEntry[] =
    query.data?.pages.flatMap(({ data }) => data) ?? []

  return { ...query, orders, total: query.data?.pages[0]?.pagination.total }
}
