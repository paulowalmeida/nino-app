import { ORDERS_STAGES } from '@pages/Orders/constants/orders.constants'
import type { StageOption } from '@pages/Orders/types/stage-option'
import type { OrderQueueSummary } from '@shared/types/order/order-queue-summary'
import { statusesForStage } from '@shared/utils/order-stage/order-stage'

const countOf = (value: number | undefined): number =>
  value !== undefined && Number.isFinite(value) && value >= 0 ? value : 0

export const ordersStageOptions = (
  summary: OrderQueueSummary | undefined
): StageOption[] =>
  ORDERS_STAGES.map(({ id, label, icon }) => ({
    id,
    label,
    icon,
    count:
      id === 'table'
        ? countOf(summary?.TABLE_TAB)
        : statusesForStage(id).reduce(
            (total, status) => total + countOf(summary?.[status]),
            0
          ) + (id === 'closed' ? countOf(summary?.TABLE_TAB_CLOSED) : 0),
  }))
