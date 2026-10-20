import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { TabStatus } from '@shared/types/tab/tab-status'

export const ACTIVE_TAB_STATUSES = [
  'OPEN',
  'AWAITING_PAYMENT',
] as const satisfies readonly TabStatus[]

export const FINALIZED_TAB_STATUSES = [
  'FINALIZED',
] as const satisfies readonly TabStatus[]

export const TAB_STATUS_LABEL = {
  OPEN: 'Aberta',
  AWAITING_PAYMENT: 'Aguardando pagamento',
  FINALIZED: 'Finalizada',
} as const satisfies Readonly<Record<TabStatus, string>>

export const TAB_PAYMENT_OPTIONS = [
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'CARD_ON_DELIVERY', label: 'Cartão na maquininha' },
  { value: 'PIX', label: 'Pix' },
] as const satisfies readonly { value: PaymentMethod; label: string }[]

export const TAB_PAYMENT_METHOD_LABEL = {
  CASH: 'Dinheiro',
  CARD_ON_DELIVERY: 'Cartão na maquininha',
  PIX: 'Pix',
  CARD_ONLINE: 'Cartão online',
} as const satisfies Readonly<Record<PaymentMethod, string>>

export const TAB_STATUS_BADGE_VARIANT = {
  OPEN: 'brand',
  AWAITING_PAYMENT: 'warning',
  FINALIZED: 'default',
} as const satisfies Readonly<
  Record<TabStatus, 'brand' | 'warning' | 'default'>
>
