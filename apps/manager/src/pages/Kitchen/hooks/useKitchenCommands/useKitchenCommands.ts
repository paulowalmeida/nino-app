import { useCallback } from 'react'

import type { OrderStatusKey } from '@shared/types/order/order-status-key'

type AdvanceOrderMutation = (input: {
  orderId: string
  status: OrderStatusKey
}) => void

export const useKitchenCommands = (advanceMutation: AdvanceOrderMutation) => {
  const advanceOrder = useCallback(
    (orderId: string, status: OrderStatusKey) =>
      advanceMutation({ orderId, status }),
    [advanceMutation]
  )

  return { advanceOrder }
}
