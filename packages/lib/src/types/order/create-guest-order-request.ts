import { CreateOrderItemRequest } from './create-order-item-request'

export type CreateGuestOrderRequest = {
  tenantId: string
  isDelivery: boolean
  deliveryFee?: number
  guestName: string
  guestPhone: string
  guestEmail?: string
  guestCpf?: string
  guestZipCode?: string
  guestStreet?: string
  guestNumber?: string
  guestComplement?: string
  guestNeighborhood?: string
  guestCity?: string
  guestState?: string
  notes?: string
  items: CreateOrderItemRequest[]
}
