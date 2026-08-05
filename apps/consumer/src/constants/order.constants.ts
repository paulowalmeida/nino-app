import type { OrderChannel } from '@custom_types/order/order-channel'
import type { OrderStatus } from '@custom_types/order/order-status'
import type { PaymentMethod } from '@custom_types/order/payment-method'

/** Como o cliente lê cada etapa — a mesma linguagem da tela de acompanhamento. */
export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Recebemos seu pedido',
  ACCEPTED: 'A loja aceitou seu pedido',
  PREPARING: 'Sua comida está sendo preparada',
  OUT_FOR_DELIVERY: 'Seu pedido saiu para entrega',
  READY_FOR_PICKUP: 'Seu pedido está pronto para retirada',
  DELIVERED: 'Pedido entregue',
  COMPLETED: 'Pedido retirado',
  CANCELLED: 'Pedido cancelado',
}

export const CHANNEL_LABEL: Record<OrderChannel, string> = {
  DELIVERY: 'Entrega',
  PICKUP: 'Retirada',
  COUNTER: 'Balcão',
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  CARD_ON_DELIVERY: 'Cartão na entrega',
  PIX_ONLINE: 'Pix online',
  CARD_ONLINE: 'Cartão online',
}
