import type { PaymentMethod } from '@custom_types/order/payment-method'
export const pixAndCard: { acceptedPaymentMethods: PaymentMethod[] } = {
  acceptedPaymentMethods: ['PIX', 'CARD_ONLINE'],
}

export const noneConfigured: { acceptedPaymentMethods: PaymentMethod[] } = {
  acceptedPaymentMethods: [],
}
