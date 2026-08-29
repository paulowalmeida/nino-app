import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'

type ItemCancellation = {
  orderId: string
  itemId: string
  cancelReason: string
}

export const useTableTabItemCancellation = (tenantId: string | null) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<Order, Error, ItemCancellation>({
    mutationFn: ({ orderId, itemId, cancelReason }) =>
      OrderService.cancelOrderItem(
        tenantId as string,
        orderId,
        itemId,
        cancelReason
      ),
    onSuccess: (order) => {
      toast.success('Item cancelado da comanda')
      void queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all(tenantId ?? ''),
      })
      void queryClient.setQueryData(
        queryKeys.orders.detail(tenantId ?? '', order.id),
        order
      )
    },
  })

  return {
    cancelItem: mutation.mutateAsync,
    isCancelling: mutation.isPending,
  }
}
