import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { MyOrder } from '@custom_types/order/my-order'
import { orderService } from '@shared/services/order/order.service'

/** Histórico do cliente logado — só existe com sessão. */
export const useMyOrders = (enabled: boolean) =>
  useQuery<MyOrder[]>({
    queryKey: queryKeys.myOrders.all,
    queryFn: orderService.listMine,
    enabled,
  })
