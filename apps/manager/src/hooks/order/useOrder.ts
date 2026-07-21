import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Order } from '@custom_types/order'
import { getById } from '@services/order/order.service'

export const useOrder = (tenantId: string | null, orderId: string) =>
  useQuery<Order>({
    queryKey: queryKeys.orders.detail(tenantId ?? '', orderId),
    queryFn: () => getById(tenantId as string, orderId),
    enabled: !!tenantId && !!orderId,
    refetchInterval: 25_000,
  })
