import type { OrderStatusKey } from './order-status-key'

/** Statuses with no orders are absent from the aggregation. */
export type OrderQueueSummary = Partial<Record<OrderStatusKey, number>>
