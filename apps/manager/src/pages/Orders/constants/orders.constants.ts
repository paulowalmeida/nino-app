import type { IconName } from '@nino/ds/components/Icon'
import type { OrderStage } from '@shared/types/order/order-stage'

export type OrderStageOption = {
  id: OrderStage
  label: string
  empty: string
  icon: IconName
}

export const ORDERS_LOADING_TICKETS = ['first', 'second', 'third', 'fourth']

export const ORDERS_STAGES: OrderStageOption[] = [
  {
    id: 'incoming',
    label: 'Novos',
    empty: 'Nenhum pedido esperando aceite.',
    icon: 'receipt',
  },
  {
    id: 'confirmed',
    label: 'Confirmados',
    empty: 'Nenhum pedido confirmado esperando produção.',
    icon: 'clock',
  },
  {
    id: 'kitchen',
    label: 'Na cozinha',
    empty: 'A cozinha está livre.',
    icon: 'chef-hat',
  },
  {
    id: 'street',
    label: 'Na rua',
    empty: 'Nenhuma entrega em andamento.',
    icon: 'pin',
  },
  {
    id: 'counter',
    label: 'No balcão',
    empty: 'Nada esperando retirada.',
    icon: 'cash-register',
  },
  {
    id: 'table',
    label: 'Na mesa',
    empty: 'Nenhuma comanda aberta.',
    icon: 'clipboard',
  },
  {
    id: 'closed',
    label: 'Fechados',
    empty: 'Os pedidos concluídos aparecem aqui.',
    icon: 'check',
  },
]
