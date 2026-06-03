import { CreateOrderItemRequest } from './create-order-item-request'

export type CreateOrderRequest = {
  tenantId: string
  statusId: string
  customerId?: string
  deliveryAddressId?: string
  isDelivery: boolean
  deliveryFee: number
  notes?: string
  estimatedDeliveryAt?: string
  loyaltyPointsUsed?: number
  loyaltyDiscount?: number
  guestName?: string
  guestPhone?: string
  guestEmail?: string
  guestCpf?: string
  guestZipCode?: string
  guestStreet?: string
  guestNumber?: string
  guestComplement?: string
  guestNeighborhood?: string
  guestCity?: string
  guestState?: string
  items: CreateOrderItemRequest[]
}
