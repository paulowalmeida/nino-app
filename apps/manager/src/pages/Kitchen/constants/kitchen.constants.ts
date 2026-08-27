import type { OrderStage } from '@shared/types/order/order-stage'

export const KITCHEN_LOADING_CARDS = ['first', 'second']

export const KITCHEN_COLUMNS: {
  stage: OrderStage
  title: string
  empty: string
}[] = [
  { stage: 'incoming', title: 'Chegou agora', empty: 'Nada esperando aceite.' },
  {
    stage: 'confirmed',
    title: 'Na fila',
    empty: 'Nada confirmado esperando a chapa.',
  },
  { stage: 'kitchen', title: 'Na chapa', empty: 'Nenhum pedido em preparo.' },
  { stage: 'street', title: 'Saiu', empty: 'Nada na rua.' },
  { stage: 'counter', title: 'No balcão', empty: 'Nada esperando retirada.' },
]
