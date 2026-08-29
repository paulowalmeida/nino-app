import type { InfiniteData } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'
import type { OrderPage } from '@shared/types/order/order-page'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import type { UpdateOrderStatusRequest } from '@shared/types/order/update-order-status-request'
import {
  applyStatusToList,
  findOrderInLists,
  statusesFromKey,
} from '@shared/utils/order-status-cache/order-status-cache'

type StatusChange = UpdateOrderStatusRequest & { orderId: string }

type CachedList = [readonly unknown[], InfiniteData<OrderPage> | undefined]

type StatusContext = { snapshot: CachedList[] }

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
  const listsKey = [...queryKeys.orders.all(tenantId ?? ''), 'list']

  return useMutation<Order, Error, StatusChange, StatusContext>({
    meta: { errorTitle: 'O pedido continua onde estava' },
    mutationFn: ({ orderId, ...data }) =>
      OrderService.updateOrderStatus(tenantId as string, orderId, data),

    /*
     * WHY: a comanda troca de trilho no toque, não na resposta. Cada trilho é
     * uma consulta com seu próprio filtro, então o pedido é removido de quem
     * não o aceita mais e inserido em quem passa a aceitar. Falhou, o
     * snapshot devolve tudo ao lugar.
     */
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: listsKey })

      const snapshot = queryClient.getQueriesData<InfiniteData<OrderPage>>({
        queryKey: listsKey,
      })
      const order = findOrderInLists(
        snapshot.flatMap(([, data]) => (data ? [data] : [])),
        orderId
      )

      if (order) {
        snapshot.forEach(([key, data]) => {
          if (!data) return

          queryClient.setQueryData<InfiniteData<OrderPage>>(
            key,
            applyStatusToList(data, statusesFromKey(key[3]), order, status)
          )
        })
      }

      return { snapshot }
    },

    onError: (_error, _variables, context) => {
      context?.snapshot.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
    },

    onSuccess: (_order, { status }) => {
      toast.success(confirmationByStatus[status])
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all(tenantId ?? ''),
      })
      void queryClient.invalidateQueries({
        queryKey: ['order-queue-summary', tenantId],
      })
    },
  })
}
