import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'

export const useOrder = (tenantId: string | null, orderId: string) =>
  useQuery<Order>({
    queryKey: queryKeys.orders.detail(tenantId ?? '', orderId),
    queryFn: () => OrderService.getById(tenantId as string, orderId),
    enabled: !!tenantId && !!orderId,
    refetchInterval: 25_000,
  })
