import { ORDERS_STAGES } from '@pages/Orders/constants/orders.constants'
import type { StageOption } from '@pages/Orders/types/stage-option'
import type { OrderQueueSummary } from '@shared/types/order/order-queue-summary'
import { statusesForStage } from '@shared/utils/order-stage/order-stage'

export const ordersStageOptions = (
  summary: OrderQueueSummary | undefined
): StageOption[] =>
  ORDERS_STAGES.map(({ id, label, icon }) => ({
    id,
    label,
    icon,
    count: statusesForStage(id).reduce(
      (total, status) => total + (summary?.[status] ?? 0),
      0
    ),
  }))
