import type { Order } from '@shared/types/order/order'
import type { OrderStep } from '@shared/types/order/order-step'

export const nextStep = (order: Order): OrderStep | null => {
  const { status, channel } = order

  if (status === 'PENDING') return { target: 'ACCEPTED', label: 'Confirmar pedido' }
  if (status === 'ACCEPTED') return { target: 'PREPARING', label: 'Começar a preparar' }
  if (status === 'PREPARING') {
    return channel === 'DELIVERY'
      ? { target: 'OUT_FOR_DELIVERY', label: 'Saiu para entrega' }
      : { target: 'READY_FOR_PICKUP', label: 'Pronto para retirada' }
  }
  if (status === 'OUT_FOR_DELIVERY') return { target: 'DELIVERED', label: 'Marcar como entregue' }
  if (status === 'READY_FOR_PICKUP') return { target: 'COMPLETED', label: 'Cliente retirou' }
  return null
}
