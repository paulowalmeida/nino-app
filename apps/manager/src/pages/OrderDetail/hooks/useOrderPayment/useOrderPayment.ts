import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'

export const useOrderPayment = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, string>({
    meta: {
      success: 'Pagamento registrado',
      errorTitle: 'Não deu pra registrar o pagamento',
    },
    mutationFn: (orderId) =>
      OrderService.markOrderPaid(tenantId as string, orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all(tenantId ?? ''),
      })
    },
  })
}
