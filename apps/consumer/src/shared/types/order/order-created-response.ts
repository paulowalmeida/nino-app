import type { OrderChannel } from './order-channel'
import type { OrderStatus } from './order-status'
import type { PaymentMethod } from './payment-method'

export type OrderCreatedResponse = {
  id: string
  orderNumber: number
  status: OrderStatus
  channel: OrderChannel
  paymentMethod: PaymentMethod
  totalAmount: string
  estimatedDeliveryAt: string | null
  trackingToken?: string
}
