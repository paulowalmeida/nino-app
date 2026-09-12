import type { IconName } from '@nino/ds/components/Icon'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { PaymentStatus } from '@shared/types/order/payment-status'

/**
 * The panel speaks the kitchen's language, not the database's. Every label
 * below is what someone would say out loud on the floor.
 */
export const STATUS_LABEL: Record<OrderStatusKey, string> = {
  PENDING: 'esperando aceite',
  ACCEPTED: 'confirmado',
  PREPARING: 'na cozinha',
  OUT_FOR_DELIVERY: 'na rua',
  READY_FOR_PICKUP: 'no balcão',
  DELIVERED: 'entregue',
  COMPLETED: 'retirado',
  CANCELLED: 'cancelado',
}

export const CHANNEL_LABEL: Record<OrderChannel, string> = {
  DELIVERY: 'Delivery',
  PICKUP: 'Retirada',
  COUNTER: 'Balcão',
  TABLE_TAB: 'Comanda',
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  CARD_ON_DELIVERY: 'Cartão na entrega',
  PIX: 'Pix',
  CARD_ONLINE: 'Cartão online',
}

export const PAYMENT_METHOD_LABEL_BY_CHANNEL: Record<
  OrderChannel,
  Record<PaymentMethod, string>
> = {
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
}

export const PAYMENT_METHOD_ICON: Record<PaymentMethod, IconName> = {
  CASH: 'payment-cash',
  CARD_ON_DELIVERY: 'payment-card',
  PIX: 'payment-pix',
  CARD_ONLINE: 'payment-card',
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: 'a receber',
  PAID: 'pago',
  FAILED: 'falhou',
  REFUNDED: 'estornado',
  CANCELLED: 'cancelado',
}

/** Descending bars: the list arrives sorted, and the skeleton says so too. */
export const ORDER_TIMELINE_REALM_LABEL: Record<string, string> = {
  OPERATIONAL: 'pela loja',
  BACKOFFICE: 'pelo suporte',
  CONSUMER: 'pelo cliente',
  GUEST: 'pelo cliente',
}
