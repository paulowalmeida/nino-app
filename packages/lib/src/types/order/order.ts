import { OrderStatus } from '../../enums'
import { OrderItem } from './order-item'
import { OrderStatusHistoryItem } from './order-status-history-item'

export type Order = {
  id: string
  unitId: string
  consumerId: string | null
  deliveryAddressId: string | null
  channelId: string
  operatorId: string | null
  tableNumber: string | null
  deliveryFee: number
  subtotal: number
  totalAmount: number
  notes: string | null
  estimatedDeliveryAt: string | null
  loyaltyPointsUsed: number | null
  loyaltyDiscount: number | null
  guestName: string | null
  guestPhone: string | null
  guestEmail: string | null
  guestCpf: string | null
  guestZipCode: string | null
  guestStreet: string | null
  guestNumber: string | null
  guestComplement: string | null
  guestNeighborhood: string | null
  guestCity: string | null
  guestState: string | null
  createdAt: string
  updatedAt: string
  status: { id: string; name: OrderStatus }
  items: OrderItem[]
  statusHistory: OrderStatusHistoryItem[]
}
