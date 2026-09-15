import type { IconName } from '@nino/ds/components/Icon'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { OrderStatusEntry } from '@shared/types/order/order-status-entry'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { PaymentStatus } from '@shared/types/order/payment-status'

/**
 * The panel speaks the kitchen's language, not the database's. Every label
 * below is what someone would say out loud on the floor.
 */
export const STATUS_LABEL = {
  PENDING: 'esperando aceite',
  ACCEPTED: 'confirmado',
  PREPARING: 'na cozinha',
  OUT_FOR_DELIVERY: 'na rua',
  READY_FOR_PICKUP: 'no balcão',
  DELIVERED: 'entregue',
  COMPLETED: 'retirado',
  CANCELLED: 'cancelado',
} as const satisfies Readonly<Record<OrderStatusKey, string>>

export const CHANNEL_LABEL = {
  DELIVERY: 'Delivery',
  PICKUP: 'Retirada',
  COUNTER: 'Balcão',
  TABLE_TAB: 'Comanda',
} as const satisfies Readonly<Record<OrderChannel, string>>

export const PAYMENT_METHOD_LABEL = {
  CASH: 'Dinheiro',
  CARD_ON_DELIVERY: 'Cartão na entrega',
  PIX: 'Pix',
  CARD_ONLINE: 'Cartão online',
} as const satisfies Readonly<Record<PaymentMethod, string>>

export const PAYMENT_METHOD_LABEL_BY_CHANNEL = {
  DELIVERY: PAYMENT_METHOD_LABEL,
  PICKUP: {
    ...PAYMENT_METHOD_LABEL,
    CARD_ON_DELIVERY: 'Cartão',
  },
  COUNTER: {
    ...PAYMENT_METHOD_LABEL,
    CARD_ON_DELIVERY: 'Cartão',
  },
  TABLE_TAB: {
    ...PAYMENT_METHOD_LABEL,
    CARD_ON_DELIVERY: 'Cartão',
  },
} as const satisfies Readonly<
  Record<OrderChannel, Readonly<Record<PaymentMethod, string>>>
>

export const PAYMENT_METHOD_ICON = {
  CASH: 'payment-cash',
  CARD_ON_DELIVERY: 'payment-card',
  PIX: 'payment-pix',
  CARD_ONLINE: 'payment-card',
} as const satisfies Readonly<Record<PaymentMethod, IconName>>

export const PAYMENT_STATUS_LABEL = {
  PENDING: 'a receber',
  PAID: 'pago',
  FAILED: 'falhou',
  REFUNDED: 'estornado',
  CANCELLED: 'cancelado',
} as const satisfies Readonly<Record<PaymentStatus, string>>

/** Descending bars: the list arrives sorted, and the skeleton says so too. */
export const ORDER_TIMELINE_REALM_LABEL = {
  OPERATIONAL: 'pela loja',
  BACKOFFICE: 'pelo suporte',
  CONSUMER: 'pelo cliente',
  GUEST: 'pelo cliente',
} as const satisfies Readonly<
  Record<OrderStatusEntry['changedByRealm'], string>
>
