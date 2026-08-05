import type { OrderChannel } from '@custom_types/order/order-channel'
import type { OrderStage } from '@custom_types/order/order-stage'
import type { Recipient } from '@custom_types/order/recipient'
import type { PeriodChoice } from '@custom_types/ui/period-choice'
import type { Stage } from '@pages/orders/Orders'

/** Descending bars: the list arrives sorted, and the skeleton says so too. */
export const TOP_PRODUCTS_SKELETON_WIDTHS = ['92%', '74%', '58%', '43%', '31%']

export const ORDER_TIMELINE_REALM_LABEL: Record<string, string> = {
  OPERATIONAL: 'pela loja',
  BACKOFFICE: 'pelo suporte',
  CUSTOMER: 'pelo cliente',
  GUEST: 'pelo cliente',
}

export const NEW_ORDER_TICKET_CHANNELS: OrderChannel[] = [
  'COUNTER',
  'PICKUP',
  'DELIVERY',
]

/** Four rows while loading — matches the count that arrives. */
export const DAY_TALLY_SKELETON_ROWS = ['first', 'second', 'third', 'fourth']

/*
 * Room for the axes to breathe, in two sizes: on mobile the Y-axis label is
 * shorter and the wide margin would eat into the drawing area.
 */
export const SALES_CHART_MARGIN = { top: 12, right: 20, bottom: 32, left: 52 }
/* The right side holds the last axis label: at 8px, the final date was
   getting cut off at the card's edge. */
export const SALES_CHART_NARROW_MARGIN = {
  top: 8,
  right: 20,
  bottom: 28,
  left: 38,
}

/** Seven days at the chart's base — the same slice the series brings. */
export const SALES_TREND_SKELETON_DAYS = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
]

/** Cinco linhas: o tamanho usual do ranking que a API devolve. */
export const TOP_SALES_TABLE_GHOST_ROWS = [
  'one',
  'two',
  'three',
  'four',
  'five',
]

/** Quatro comandas: uma linha cheia no desktop, duas telas no celular. */
export const ORDERS_LOADING_TICKETS = ['first', 'second', 'third', 'fourth']

export const ORDERS_STAGES: Stage[] = [
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
    id: 'closed',
    label: 'Fechados',
    empty: 'Os pedidos concluídos aparecem aqui.',
    icon: 'check',
  },
]

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

export const COLLABORATOR_DETAIL_COLUMNS = [
  'Pedido',
  'Cliente',
  'Canal',
  'Situação',
  'Quando',
  'Valor',
]

export const NEW_ORDER_EMPTY_RECIPIENT: Recipient = {
  name: '',
  phone: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  zoneId: '',
}

export const REPORTS_PERIODS: { id: PeriodChoice; label: string }[] = [
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: '7 dias' },
  { id: 'fortnight', label: '15 dias' },
  { id: 'month', label: '30 dias' },
  { id: 'custom', label: 'Escolher' },
]

export const REPORTS_FIGURES: {
  key: 'revenue' | 'orderCount' | 'averageTicket'
  label: string
  money: boolean
}[] = [
  { key: 'revenue', label: 'Faturamento', money: true },
  { key: 'orderCount', label: 'Pedidos concluídos', money: false },
  { key: 'averageTicket', label: 'Ticket médio', money: true },
]

export const REPORTS_TIMING_FIGURES: {
  key: 'averagePreparationMinutes' | 'averageDeliveryMinutes'
  sampleKey: 'preparationSampleSize' | 'deliverySampleSize'
  label: string
  empty: string
}[] = [
  {
    key: 'averagePreparationMinutes',
    sampleKey: 'preparationSampleSize',
    label: 'Tempo médio de preparo',
    empty: 'Sem pedidos no período',
  },
  {
    key: 'averageDeliveryMinutes',
    sampleKey: 'deliverySampleSize',
    label: 'Tempo médio de entrega',
    empty: 'Sem entregas no período',
  },
]
