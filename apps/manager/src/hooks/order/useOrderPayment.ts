import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Order } from '@custom_types/order/order'
import { OrderService } from '@services/order.service'

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
