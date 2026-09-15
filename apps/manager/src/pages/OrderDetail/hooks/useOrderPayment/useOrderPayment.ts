import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'

export const useOrderPayment = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, string>({
    meta: {
      success: 'Pagamento registrado',
      errorTitle: 'Não deu pra registrar o pagamento',
    },
    mutationFn: (orderId) =>
      OrderService.markOrderPaid(unitId as string, orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all(unitId ?? ''),
      })
    },
  })
}
