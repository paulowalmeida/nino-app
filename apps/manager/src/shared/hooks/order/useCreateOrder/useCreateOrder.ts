import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { CreateOrderRequest } from '@shared/types/order/create-order-request'
import type { Order } from '@shared/types/order/order'

export const useCreateOrder = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, CreateOrderRequest>({
    mutationFn: (data) => OrderService.createOrder(unitId as string, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all(unitId ?? ''),
      })
      void queryClient.invalidateQueries({
        queryKey: ['order-queue-summary', unitId],
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.cash.all(unitId ?? ''),
      })
    },
  })
}
