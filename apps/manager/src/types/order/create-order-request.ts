import type { OrderChannel } from './order-channel'
import type { PaymentMethod } from './payment-method'

export type CreateOrderItem = {
  productId: string
  quantity: number
  unitPrice: number
}

/**
 * Pedido aberto pelo painel. A API resolve o operador pelo token — e ainda
 * não aceita dados de cliente avulso aqui, só balcão e retirada.
 */
export type CreateOrderRequest = {
  channel: OrderChannel
  paymentMethod: PaymentMethod
  items: CreateOrderItem[]
  tableNumber?: string
  notes?: string
  changeFor?: number
}
