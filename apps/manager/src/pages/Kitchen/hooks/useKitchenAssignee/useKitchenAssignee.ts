import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'

type KitchenAssigneeChange = {
  orderId: string
  kitchenAssigneeId: string | null
}

export const useKitchenAssignee = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, KitchenAssigneeChange>({
    meta: { errorTitle: 'O chapista não foi alterado' },
    mutationFn: ({ orderId, kitchenAssigneeId }) =>
      kitchenAssigneeId
        ? OrderService.assignKitchenAssignee(tenantId as string, orderId, {
            kitchenAssigneeId,
          })
        : OrderService.clearKitchenAssignee(tenantId as string, orderId),
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all(tenantId ?? ''),
      })
    },
  })
}
