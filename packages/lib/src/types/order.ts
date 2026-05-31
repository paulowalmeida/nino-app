import { OrderStatus } from '../enums'
import { PaginatedResponse, PaginatedQuery } from './common'

export interface CreateOrderItemRequest {
  productId: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderRequest {
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

export interface CreateGuestOrderRequest {
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

export interface UpdateOrderStatusRequest {
  statusId: string
}

export interface OrderQuery extends PaginatedQuery {
  tenantId?: string
  customerId?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  createdAt: string
  updatedAt: string
  product: {
    id: string
    name: string
    description: string | null
    price: number
    position: number | null
    isActive: boolean
    categoryId: string
    tenantId: string
    createdAt: string
    updatedAt: string
  }
}

export interface OrderStatusHistoryItem {
  id: string
  orderId: string
  statusId: string
  createdAt: string
  status: { id: string; name: OrderStatus }
}

export interface Order {
  id: string
  tenantId: string
  customerId: string | null
  deliveryAddressId: string | null
  isDelivery: boolean
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

export type OrderPaginatedResponse = PaginatedResponse<Order>
