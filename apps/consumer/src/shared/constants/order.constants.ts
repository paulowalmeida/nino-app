import type { OrderStatus } from '@custom_types/order/order-status'

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
