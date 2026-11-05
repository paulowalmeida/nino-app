import type { PaymentMethod } from '@custom_types/order/payment-method'

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  CARD_ON_DELIVERY: 'Cartão na entrega',
  PIX: 'Pix',
  CARD_ONLINE: 'Cartão online',
}
