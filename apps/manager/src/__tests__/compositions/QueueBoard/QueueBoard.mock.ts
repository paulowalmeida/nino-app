import type { OrderQueueSummary } from '@custom_types/order/order-queue-summary'
export const busySummary: OrderQueueSummary = {
  PENDING: 2,
  ACCEPTED: 1,
  PREPARING: 3,
  OUT_FOR_DELIVERY: 1,
  READY_FOR_PICKUP: 0,
}

export const idleSummary: OrderQueueSummary = {}
