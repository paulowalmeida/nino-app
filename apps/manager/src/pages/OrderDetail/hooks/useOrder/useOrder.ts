import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'

export const useOrder = (unitId: string | null, orderId: string) =>
  useQuery<Order>({
    queryKey: queryKeys.orders.detail(unitId ?? '', orderId),
    queryFn: () => OrderService.getById(unitId as string, orderId),
    enabled: !!unitId && !!orderId,
    refetchInterval: 25_000,
  })
