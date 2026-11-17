import type { OrderDetails } from '@custom_types/order/order-details'
import type { PaymentMethod } from '@custom_types/order/payment-method'

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  CARD_ON_DELIVERY: 'Cartão na entrega',
  PIX: 'Pix',
  CARD_ONLINE: 'Cartão online',
}

export const PAYMENT_STATUS_LABEL: Partial<
  Record<OrderDetails['paymentStatus'], string>
> = {
  PAID: 'Pago',
  REFUNDED: 'Estornado',
}
