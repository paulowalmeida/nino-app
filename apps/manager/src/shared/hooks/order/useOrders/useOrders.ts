import { useInfiniteQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { ORDER_PAGE_SIZE, OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { OrderPage } from '@shared/types/order/order-page'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import type { PaymentStatus } from '@shared/types/order/payment-status'
import { nextPageParam } from '@shared/utils/next-page-param/next-page-param'

export const useOrders = (
  tenantId: string | null,
  search?: string,
  statuses?: OrderStatusKey[],
  channel?: OrderChannel | OrderChannel[],
  paymentStatus?: PaymentStatus,
  requiresPreparation?: boolean
) => {
  const term = search?.trim() || undefined
  const statusKey = statuses?.length ? statuses.join(',') : undefined
  const channelKey = channel
    ? Array.isArray(channel)
      ? channel.join(',')
      : channel
    : undefined

  const query = useInfiniteQuery<OrderPage>({
    queryKey: queryKeys.orders.list(
      tenantId ?? '',
      statusKey,
      term,
      channelKey,
      paymentStatus,
      requiresPreparation
    ),
    queryFn: ({ pageParam }) =>
      OrderService.listOrders(
        tenantId as string,
        pageParam as number,
        term,
        statuses,
        channel,
        paymentStatus,
        requiresPreparation
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
