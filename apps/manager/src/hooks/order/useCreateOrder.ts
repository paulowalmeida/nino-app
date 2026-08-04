import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { CreateOrderRequest, Order } from '@custom_types/order'
import { OrderService } from '@services/order.service'

export const useCreateOrder = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, CreateOrderRequest>({
    mutationFn: (data) => OrderService.createOrder(tenantId as string, data),
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
