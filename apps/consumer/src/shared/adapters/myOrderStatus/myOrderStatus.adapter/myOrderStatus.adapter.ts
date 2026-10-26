import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'

type MyOrderStatusResponse = {
  id: string
  orderNumber: number
  status: GuestOrderStatus['status']
  channel: GuestOrderStatus['channel']
  estimatedDeliveryAt: string | null
  createdAt: string
  statusHistory: { status: GuestOrderStatus['status']; createdAt: string }[]
}

export const myOrderStatus = (
  order: MyOrderStatusResponse
): GuestOrderStatus => ({
  id: order.id,
  orderNumber: order.orderNumber,
  status: order.status,
  channel: order.channel,
  estimatedDeliveryAt: order.estimatedDeliveryAt,
  createdAt: order.createdAt,
  timeline: order.statusHistory.map(({ status, createdAt }) => ({
    status,
    at: createdAt,
  })),
})
