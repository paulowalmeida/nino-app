import { useCallback } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { toCustomerOrderRows } from '@pages/CustomerDetail/adapters/customerOrderRows.adapter/customerOrderRows.adapter'
import { queryKeys } from '@shared/lib/query-keys'
import { CustomerService, HISTORY_PAGE_SIZE } from '@shared/services/customer/customer.service'
import { nextPageParam } from '@shared/utils/next-page-param/next-page-param'

/* WHY: a ficha abre com a primeira página e só busca a próxima quando quem
 * atende chega ao fim da lista, como o cardápio faz com os itens.
 */
export const useCustomerOrderHistory = (
  tenantId: string | null,
  customerId: string
) => {
  const query = useInfiniteQuery({
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

  const { fetchNextPage } = query
  const loadMoreOrders = useCallback(() => {
    void fetchNextPage()
  }, [fetchNextPage])

  const entries = query.data?.pages.flatMap(({ data }) => data) ?? []

  return {
    orderRows: toCustomerOrderRows(entries),
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    loadMoreOrders,
  }
}
