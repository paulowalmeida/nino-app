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
  if (status === 'PREPARING') return readyStep(channel)
  if (status === 'OUT_FOR_DELIVERY')
    return { target: 'DELIVERED', label: 'Marcar como entregue' }
  if (status === 'READY_FOR_PICKUP') return handOverStep(channel)
  return null
}

/* WHY: pedido de mesa usa o mesmo trilho da retirada na API, mas no salão
 * ninguém "retira": o garçom serve. Só o rótulo muda, o status é o mesmo. */
const readyStep = (channel: Order['channel']): OrderStep => {
  if (channel === 'DELIVERY')
    return { target: 'OUT_FOR_DELIVERY', label: 'Saiu para entrega' }
  if (channel === 'TABLE_TAB')
    return { target: 'READY_FOR_PICKUP', label: 'Pronto para servir' }
  return { target: 'READY_FOR_PICKUP', label: 'Pronto para retirada' }
}

const handOverStep = (channel: Order['channel']): OrderStep =>
  channel === 'TABLE_TAB'
    ? { target: 'COMPLETED', label: 'Entregue na mesa' }
    : { target: 'COMPLETED', label: 'Cliente retirou' }

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
