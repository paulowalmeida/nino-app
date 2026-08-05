import { useMutation } from '@tanstack/react-query'

import { createGuestOrder } from '@services/order.service'

export const useCreateGuestOrder = () =>
  useMutation({ mutationFn: createGuestOrder })
