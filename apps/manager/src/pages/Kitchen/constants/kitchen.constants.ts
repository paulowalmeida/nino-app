import type { OrderStatusKey } from '@shared/types/order/order-status-key'

export const KITCHEN_LOADING_CARDS = ['first', 'second']

export const KITCHEN_STATUSES: OrderStatusKey[] = ['ACCEPTED', 'PREPARING']

export const KITCHEN_COLUMNS: {
  statuses: OrderStatusKey[]
  title: string
  empty: string
}[] = [
  {
    statuses: ['ACCEPTED'],
    title: 'Aguardando preparo',
    empty: 'Nenhum pedido aguardando preparo.',
  },
  {
    statuses: ['PREPARING'],
    title: 'Em preparo',
    empty: 'Nenhum pedido em preparo.',
  },
]
