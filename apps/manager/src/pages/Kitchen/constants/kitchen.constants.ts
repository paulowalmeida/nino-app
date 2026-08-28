import type { OrderStage } from '@shared/types/order/order-stage'

export const KITCHEN_LOADING_CARDS = ['first', 'second']

export const KITCHEN_COLUMNS: { stage: OrderStage; empty: string }[] = [
  { stage: 'incoming', empty: 'Nada esperando aceite.' },
  { stage: 'confirmed', empty: 'Nada confirmado esperando a chapa.' },
  { stage: 'kitchen', empty: 'Nenhum pedido em preparo.' },
  { stage: 'street', empty: 'Nada na rua.' },
  { stage: 'counter', empty: 'Nada esperando retirada.' },
]
