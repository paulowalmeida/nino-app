import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import {
  toOrderDetails,
  type OrderDetailsSource,
} from '@shared/adapters/orderDetails/orderDetails.adapter'

type GuestOrderStatusResponse = Omit<GuestOrderStatus, 'details'> &
  OrderDetailsSource

/** Resposta de `orders/guest/:id/status`: comanda solta no topo vira `details`. */
export const guestOrderStatus = (
  order: GuestOrderStatusResponse
): GuestOrderStatus => ({
  id: order.id,
  orderNumber: order.orderNumber,
  status: order.status,
  channel: order.channel,
  estimatedDeliveryAt: order.estimatedDeliveryAt,
  createdAt: order.createdAt,
  timeline: order.timeline,
  storeMessage: order.storeMessage,
  details: toOrderDetails(order),
})
