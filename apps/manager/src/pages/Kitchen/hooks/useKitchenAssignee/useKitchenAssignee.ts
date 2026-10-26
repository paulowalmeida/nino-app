import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'

type KitchenAssigneeChange = {
  orderId: string
  kitchenAssigneeId: string | null
}

export const useKitchenAssignee = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, KitchenAssigneeChange>({
    meta: { errorTitle: 'O chapista não foi alterado' },
    mutationFn: ({ orderId, kitchenAssigneeId }) =>
      kitchenAssigneeId
        ? OrderService.assignKitchenAssignee(unitId as string, orderId, {
            kitchenAssigneeId,
          })
        : OrderService.clearKitchenAssignee(unitId as string, orderId),
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all(unitId ?? ''),
      })
    },
  })
}
