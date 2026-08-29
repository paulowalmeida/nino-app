import type { OrderChannel } from './order-channel'
import type { OrderStatus } from './order-status'

/**
 * O pedido como o histórico do cliente o mostra. É um recorte do que a API
 * devolve em `my/orders` — a lista precisa de identidade, estado e valor,
 * não da comanda inteira.
 */
export type MyOrder = {
  id: string
  orderNumber: number
  status: OrderStatus
  channel: OrderChannel
  totalAmount: string
  createdAt: string
  estimatedDeliveryAt: string | null
}
