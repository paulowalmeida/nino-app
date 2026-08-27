import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import type { UpdateOrderStatusRequest } from '@shared/types/order/update-order-status-request'

type StatusChange = UpdateOrderStatusRequest & { orderId: string }

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
