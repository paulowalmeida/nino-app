import { useCallback } from 'react'

import { useKitchenWallStore } from '@pages/Kitchen/states/kitchen-wall/kitchen-wall.state'
import type { KitchenStage } from '@pages/Kitchen/types/KitchenStage.type'
import { moveWithin } from '@pages/Kitchen/utils/arrange-orders/arrange-orders'
import { dropTarget } from '@pages/Kitchen/utils/drop-target/drop-target'
import type { Order } from '@shared/types/order/order'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'

type AdvanceOrder = (orderId: string, status: OrderStatusKey) => void

/**
 * A parede em uso: quem está no ar, qual trilho está sob o ponteiro, e o que
 * o pouso significa — mudar de etapa quando muda de trilho, reordenar quando
 * cai no mesmo.
 */
export const useKitchenWall = (
  ordersByStage: Partial<Record<KitchenStage, Order[]>>,
  advance: AdvanceOrder
) => {
  const draggingOrderId = useKitchenWallStore((state) => state.draggingOrderId)
  const arrangement = useKitchenWallStore((state) => state.arrangement)
  const startDrag = useKitchenWallStore((state) => state.startDrag)
  const endDrag = useKitchenWallStore((state) => state.endDrag)
  const arrangeStage = useKitchenWallStore((state) => state.arrangeStage)

  const everyOrder = Object.values(ordersByStage).flat()
  const draggingOrder =
    everyOrder.find(({ id }) => id === draggingOrderId) ?? null

  const dropOrder = useCallback(
    (stage: KitchenStage | null, overOrderId: string | null) => {
      const order = everyOrder.find(({ id }) => id === draggingOrderId)

      if (!order || !stage) {
        endDrag()
        return
      }

      const target = dropTarget(order, stage)
      const staysInStage = (ordersByStage[stage] ?? []).some(
        ({ id }) => id === order.id
      )

      if (target) advance(order.id, target)
      else if (staysInStage) {
        const current =
          arrangement[stage] ?? (ordersByStage[stage] ?? []).map(({ id }) => id)
        arrangeStage(stage, moveWithin(current, order.id, overOrderId))
      }

      endDrag()
    },
    [
      everyOrder,
      draggingOrderId,
      advance,
      endDrag,
      arrangement,
      ordersByStage,
      arrangeStage,
    ]
  )

  return {
    draggingOrder,
    arrangement,
    liftOrder: startDrag,
    dropOrder,
  }
}
