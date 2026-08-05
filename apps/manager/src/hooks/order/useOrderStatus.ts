import { toast } from '@nino/ds/components/Toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Order } from '@custom_types/order/order'
import type { OrderStatusKey } from '@custom_types/order/order-status-key'
import type { UpdateOrderStatusRequest } from '@custom_types/order/update-order-status-request'
import { OrderService } from '@services/order.service'

type StatusChange = UpdateOrderStatusRequest & { orderId: string }

/**
 * The confirmation names the stage the order landed on, not the fact that a
 * request went through: on the kitchen screen the card leaves the column and
 * the person needs to know where it went.
 */
const confirmationByStatus: Record<OrderStatusKey, string> = {
  PENDING: 'Pedido voltou para a fila',
  ACCEPTED: 'Pedido aceito',
  PREPARING: 'Pedido em preparo',
  OUT_FOR_DELIVERY: 'Pedido saiu para entrega',
  READY_FOR_PICKUP: 'Pedido pronto para retirada',
  DELIVERED: 'Pedido entregue',
  COMPLETED: 'Pedido concluído',
  CANCELLED: 'Pedido cancelado',
}

/**
 * Invalidates the whole order domain plus the queue board: a status change
 * moves the order between stages and changes the counters at the same time.
 */
export const useOrderStatus = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, StatusChange>({
    meta: { errorTitle: 'O pedido continua onde estava' },
    mutationFn: ({ orderId, ...data }) =>
      OrderService.updateOrderStatus(tenantId as string, orderId, data),
    onSuccess: (_order, { status }) => {
      toast.success(confirmationByStatus[status])
      void queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all(tenantId ?? ''),
      })
      void queryClient.invalidateQueries({
        queryKey: ['order-queue-summary', tenantId],
      })
    },
  })
}
