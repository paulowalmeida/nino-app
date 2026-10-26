import type { OrderStage } from '@shared/types/order/order-stage'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'

export const ORDER_STAGE_BY_STATUS = {
  PENDING: 'incoming',
  ACCEPTED: 'confirmed',
  PREPARING: 'kitchen',
  OUT_FOR_DELIVERY: 'street',
  READY_FOR_PICKUP: 'counter',
  DELIVERED: 'closed',
  COMPLETED: 'closed',
  CANCELLED: 'closed',
} as const satisfies Readonly<Record<OrderStatusKey, OrderStage>>
