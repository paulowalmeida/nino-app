import type { PaymentMethod } from '@custom_types/order/payment-method'

export const PROMOTION_PAYMENT_PHRASE: Record<PaymentMethod, string> = {
  CASH: 'em dinheiro',
  CARD_ON_DELIVERY: 'no cartão na entrega',
  PIX: 'no Pix',
  CARD_ONLINE: 'no cartão online',
}
