export type OrderStatusKey =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'READY_FOR_PICKUP'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'

/** Statuses with no orders are absent from the aggregation. */
export type OrderQueueSummary = Partial<Record<OrderStatusKey, number>>
