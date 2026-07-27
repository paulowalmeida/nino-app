import { useInfiniteQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Order, OrderPage } from '@custom_types/order'
import { listOrders, ORDER_PAGE_SIZE } from '@services/order/order.service'

/**
 * Polls every 25s: the queue is a workstation, not a report, and a pending
 * order the store never sees is a lost sale. Well under the API's throttle.
 */
export const useOrders = (tenantId: string | null, search?: string) => {
  const term = search?.trim() || undefined

  const query = useInfiniteQuery<OrderPage>({
    queryKey: queryKeys.orders.list(tenantId ?? '', undefined, term),
    queryFn: ({ pageParam }) =>
      listOrders(tenantId as string, pageParam as number, term),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) => {
      const loaded = pagination.page * ORDER_PAGE_SIZE
      return loaded < pagination.total ? pagination.page + 1 : undefined
    },
    enabled: !!tenantId,
    refetchInterval: 25_000,
    refetchOnWindowFocus: true,
  })

  const orders: Order[] = query.data?.pages.flatMap(({ data }) => data) ?? []

  return { ...query, orders }
}
