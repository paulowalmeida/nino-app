import type { OrderChannel } from '@custom_types/order/order-channel'
import type { PaymentMethod } from '@custom_types/order/payment-method'

export const CHANNEL_LABEL: Record<OrderChannel, string> = {
  DELIVERY: 'Entrega',
  PICKUP: 'Retirada',
  COUNTER: 'Balcão',
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  CARD_ON_DELIVERY: 'Cartão na entrega',
  PIX_ONLINE: 'Pix online',
  CARD_ONLINE: 'Cartão online',
}
