import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { MyOrder } from '@custom_types/order/my-order'
import { orderService } from '@shared/services/order/order.service'

/**
 * Pedidos do cliente logado — só existe com sessão. O histórico de conta e o
 * pedido ativo em Notificações leem a mesma lista.
 */
export const useMyOrders = (enabled: boolean) =>
  useQuery<MyOrder[]>({
    queryKey: queryKeys.myOrders.all,
    queryFn: orderService.listMine,
    enabled,
  })
