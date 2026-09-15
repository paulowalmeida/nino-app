import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'

type ItemCancellation = {
  orderId: string
  itemId: string
  cancelReason: string
}

export const useTableTabItemCancellation = (unitId: string | null) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<Order, Error, ItemCancellation>({
    mutationFn: ({ orderId, itemId, cancelReason }) =>
      OrderService.cancelOrderItem(
        unitId as string,
        orderId,
        itemId,
        cancelReason
      ),
    onSuccess: (order) => {
      toast.success('Item cancelado da comanda')
      void queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all(unitId ?? ''),
      })
      void queryClient.setQueryData(
        queryKeys.orders.detail(unitId ?? '', order.id),
        order
      )
    },
  })

  return {
    cancelItem: mutation.mutateAsync,
    isCancelling: mutation.isPending,
  }
}
