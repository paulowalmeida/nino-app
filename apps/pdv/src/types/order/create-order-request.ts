import type { OrderChannel } from './order-channel'
import type { PaymentMethod } from './payment-method'

export type CreateOrderItem = {
  productId: string
  quantity: number
  unitPrice: number
}

/**
 * Pedido aberto pelo painel. A API resolve o operador pelo token e calcula a
 * taxa a partir da zona. Entrega sem cliente cadastrado exige nome, telefone
 * e rua de quem pediu.
 */
export type CreateOrderRequest = {
  channel: OrderChannel
  paymentMethod: PaymentMethod
  items: CreateOrderItem[]
  deliveryZoneId?: string
  tableNumber?: string
  notes?: string
  changeFor?: number
  guestName?: string
  guestPhone?: string
  guestStreet?: string
  guestNumber?: string
  guestComplement?: string
  guestNeighborhood?: string
}
