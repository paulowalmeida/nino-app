import type { KitchenStage } from '@pages/Kitchen/types/KitchenStage.type'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'

export const KITCHEN_LOADING_CARDS = ['first', 'second']

export const KITCHEN_STATUSES: OrderStatusKey[] = ['ACCEPTED', 'PREPARING']

/**
 * WHY: o que saiu da cozinha vem de uma consulta própria. A listagem ordena
 * por data e pagina, então juntar tudo numa chamada só faria os pedidos em
 * preparo empurrarem os concluídos para fora da primeira página.
 */
export const KITCHEN_FINISHED_STATUSES: OrderStatusKey[] = [
  'OUT_FOR_DELIVERY',
  'READY_FOR_PICKUP',
]

/** A parede mostra o que saiu há pouco; o resto é histórico, não operação. */
export const KITCHEN_FINISHED_WINDOW_MINUTES = 90

export const KITCHEN_COLUMNS: {
  stage: KitchenStage
  title: string
  empty: string
  /** Se a cozinha ainda decide o próximo passo dos pedidos deste trilho. */
  ownsNextStep: boolean
}[] = [
  {
    stage: 'waiting',
    title: 'Aguardando preparo',
    empty: 'Nenhum pedido aguardando preparo.',
    ownsNextStep: true,
  },
  {
    stage: 'preparing',
    title: 'Em preparo',
    empty: 'Nenhum pedido em preparo.',
    ownsNextStep: true,
  },
  {
    stage: 'finished',
    title: 'Saiu da cozinha',
    empty: 'Nada saiu nos últimos 90 minutos.',
    ownsNextStep: false,
  },
]
