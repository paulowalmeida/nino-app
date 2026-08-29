import { useMutation } from '@tanstack/react-query'

import { orderService } from '@shared/services/order/order.service'

export const useCreateGuestOrder = () =>
  useMutation({ mutationFn: orderService.createGuest })
