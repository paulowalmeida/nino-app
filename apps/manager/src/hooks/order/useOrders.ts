import { useInfiniteQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Order } from '@custom_types/order/order'
import type { OrderPage } from '@custom_types/order/order-page'
import type { OrderStatusKey } from '@custom_types/order/order-status-key'
import { ORDER_PAGE_SIZE, OrderService } from '@services/order.service'
import { nextPageParam } from '@utils/next-page-param'

/**
 * Polls every 25s: the queue is a workstation, not a report, and a pending
 * order the store never sees is a lost sale. Well under the API's throttle.
 *
 * `statuses` filtra no servidor, não na página já carregada — sem isso um
 * pedido antigo ainda aberto (fora das primeiras `ORDER_PAGE_SIZE` por
 * `createdAt`) nunca aparece na aba da etapa dele.
 */
export const useOrders = (
  tenantId: string | null,
  search?: string,
  statuses?: OrderStatusKey[]
) => {
  const term = search?.trim() || undefined
  const statusKey = statuses?.length ? statuses.join(',') : undefined

  const query = useInfiniteQuery<OrderPage>({
    queryKey: queryKeys.orders.list(tenantId ?? '', statusKey, term),
    queryFn: ({ pageParam }) =>
      OrderService.listOrders(
        tenantId as string,
        pageParam as number,
        term,
        statuses
      ),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      nextPageParam(pagination, ORDER_PAGE_SIZE),
    enabled: !!tenantId,
    refetchInterval: 25_000,
    refetchOnWindowFocus: true,
  })

  const orders: Order[] = query.data?.pages.flatMap(({ data }) => data) ?? []

  return { ...query, orders }
}
