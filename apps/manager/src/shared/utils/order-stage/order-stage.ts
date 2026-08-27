import type { OrderStage } from '@shared/types/order/order-stage'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'

const STAGE_OF: Record<OrderStatusKey, OrderStage> = {
  PENDING: 'incoming',
  ACCEPTED: 'confirmed',
  PREPARING: 'kitchen',
  OUT_FOR_DELIVERY: 'street',
  READY_FOR_PICKUP: 'counter',
  DELIVERED: 'closed',
  COMPLETED: 'closed',
  CANCELLED: 'closed',
}

export const stageOf = (status: OrderStatusKey): OrderStage => STAGE_OF[status]

export const isOpen = (status: OrderStatusKey): boolean =>
  STAGE_OF[status] !== 'closed'

export const statusesForStage = (stage: OrderStage): OrderStatusKey[] =>
  (Object.keys(STAGE_OF) as OrderStatusKey[]).filter(
    (status) => STAGE_OF[status] === stage
  )
