import { OrderStatus } from '../../enums'

export type OrderStatusHistoryItem = {
  id: string
  orderId: string
  statusId: string
  createdAt: string
  status: { id: string; name: OrderStatus }
}
