import type { OrderStatusKey } from './order-queue-summary'

/** `cancelReason` é exigido pela API quando o alvo é CANCELLED. */
export type UpdateOrderStatusRequest = {
  status: OrderStatusKey
  cancelReason?: string
}
