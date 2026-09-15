import { ORDER_STAGE_BY_STATUS } from '@shared/constants/order-stage.constants'
import type { OrderStage } from '@shared/types/order/order-stage'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'

export const stageOf = (status: OrderStatusKey): OrderStage =>
  ORDER_STAGE_BY_STATUS[status]

export const isOpen = (status: OrderStatusKey): boolean =>
  ORDER_STAGE_BY_STATUS[status] !== 'closed'

export const statusesForStage = (stage: OrderStage): OrderStatusKey[] =>
  (Object.keys(ORDER_STAGE_BY_STATUS) as OrderStatusKey[]).filter(
    (status) => ORDER_STAGE_BY_STATUS[status] === stage
  )
