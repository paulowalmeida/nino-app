import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { CreateOrderRequest } from '@shared/types/order/create-order-request'
import type { Order } from '@shared/types/order/order'

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
      void queryClient.invalidateQueries({
        queryKey: queryKeys.cash.all(tenantId ?? ''),
      })
    },
  })
}
