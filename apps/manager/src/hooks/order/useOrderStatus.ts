import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Order, UpdateOrderStatusRequest } from '@custom_types/order'
import { updateOrderStatus } from '@services/order/order.service'

type StatusChange = UpdateOrderStatusRequest & { orderId: string }

/**
 * Invalidates the whole order domain plus the queue board: a status change
 * moves the order between stages and changes the counters at the same time.
 */
export const useOrderStatus = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, StatusChange>({
    mutationFn: ({ orderId, ...data }) =>
      updateOrderStatus(tenantId as string, orderId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all(tenantId ?? ''),
      })
      void queryClient.invalidateQueries({
        queryKey: ['order-queue-summary', tenantId],
      })
    },
  })
}
