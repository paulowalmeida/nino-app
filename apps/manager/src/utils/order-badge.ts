import type { BadgeVariant } from '@nino/ds/components/Badge'

import type { OrderStatusKey } from '@custom_types/order/order-status-key'

/**
 * The stamp on the ticket says the same thing on the board and on the detail
 * page. Only two statuses earn color: the one waiting for someone to act, and
 * the one that failed. Everything in between is the normal course of a shift.
 */
const STATUS_VARIANT: Record<OrderStatusKey, BadgeVariant> = {
  PENDING: 'brand',
  ACCEPTED: 'default',
  PREPARING: 'default',
  OUT_FOR_DELIVERY: 'default',
  READY_FOR_PICKUP: 'default',
  DELIVERED: 'success',
  COMPLETED: 'success',
  CANCELLED: 'error',
}

export const statusBadgeVariant = (status: OrderStatusKey): BadgeVariant =>
  STATUS_VARIANT[status]
