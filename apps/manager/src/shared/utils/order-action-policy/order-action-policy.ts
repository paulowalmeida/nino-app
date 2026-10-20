import type { Order } from '@shared/types/order/order'
import type { OrderStep } from '@shared/types/order/order-step'

/** Item de comanda sem preparo não passa pela cozinha: vai direto à mesa. */
const isServedWithoutKitchen = ({ channel, items }: Order): boolean =>
  channel === 'TABLE_TAB' &&
  items.length > 0 &&
  items.every(({ product }) => product.requiresPreparation === false)

export const nextStep = (order: Order): OrderStep | null => {
  const { status, channel } = order

  if (status === 'ACCEPTED' && isServedWithoutKitchen(order)) {
    return { target: 'DELIVERED', label: 'Entregue na mesa' }
  }

  if (status === 'PENDING')
    return { target: 'ACCEPTED', label: 'Confirmar pedido' }
  if (status === 'ACCEPTED')
    return { target: 'PREPARING', label: 'Começar a preparar' }
  if (status === 'PREPARING') {
    return channel === 'DELIVERY'
      ? { target: 'OUT_FOR_DELIVERY', label: 'Saiu para entrega' }
      : { target: 'READY_FOR_PICKUP', label: 'Pronto para retirada' }
  }
  if (status === 'OUT_FOR_DELIVERY')
    return { target: 'DELIVERED', label: 'Marcar como entregue' }
  if (status === 'READY_FOR_PICKUP')
    return { target: 'COMPLETED', label: 'Cliente retirou' }
  return null
}

/**
 * WHY: espelha os retrocessos que a API aceita — desfazer o passo que a loja
 * acabou de dar. Nada volta de estado terminal nem desfaz o aceite, então
 * qualquer outro status devolve null e o card não oferece a volta.
 */
export const previousStep = (order: Order): OrderStep | null => {
  const { status } = order

  if (status === 'PREPARING') {
    return { target: 'ACCEPTED', label: 'Voltar para a fila' }
  }
  if (status === 'OUT_FOR_DELIVERY' || status === 'READY_FOR_PICKUP') {
    return { target: 'PREPARING', label: 'Voltar para o preparo' }
  }

  return null
}
