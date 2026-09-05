import type { OrderStatusKey } from './order-status-key'

export type OrderQueueSummary = Partial<Record<OrderStatusKey, number>> & {
  TABLE_TAB?: number
  TABLE_TAB_CLOSED?: number
}
