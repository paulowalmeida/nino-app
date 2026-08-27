import type { OrderStatusKey } from './order-status-key'

export type OrderQueueSummary = Partial<Record<OrderStatusKey, number>>
