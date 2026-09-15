import type { DeliveryAddress } from './delivery-address'
import type { OrderChannel } from './order-channel'
import type { OrderItem } from './order-item'
import type { OrderStatusEntry } from './order-status-entry'
import type { OrderStatusKey } from './order-status-key'
import type { PaymentMethod } from './payment-method'
import type { PaymentStatus } from './payment-status'

export type Order = {
  id: string
  orderNumber: number
  pickupCode?: string | null
  unitId: string
  consumerId: string | null
  status: OrderStatusKey
  channel: OrderChannel
  courierId: string | null
  kitchenAssigneeId?: string | null
  deliveryAddress: DeliveryAddress | null
  tableNumber: string | null
  notes: string | null
  subtotal: string
  deliveryFee: string
  totalAmount: string
  deliveryZoneName: string | null
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  changeFor: string | null
  cancelReason: string | null
  cancelledBy: 'CONSUMER' | 'UNIT' | 'BACKOFFICE' | null
  guestName: string | null
  guestPhone: string | null
  guestStreet: string | null
  guestNumber: string | null
  guestComplement: string | null
  guestNeighborhood: string | null
  guestCity: string | null
  guestState: string | null
  guestZipCode: string | null
  acceptedAt: string | null
  deliveredAt: string | null
  cancelledAt: string | null
  createdAt: string
  items: OrderItem[]
  statusHistory: OrderStatusEntry[]
}
