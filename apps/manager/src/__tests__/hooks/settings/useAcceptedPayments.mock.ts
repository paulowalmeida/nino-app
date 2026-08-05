import type { PaymentMethod } from '@custom_types/order/payment-method'
export const pixAndCard: { acceptedPaymentMethods: PaymentMethod[] } = {
  acceptedPaymentMethods: ['PIX_ONLINE', 'CARD_ONLINE'],
}

export const noneConfigured: { acceptedPaymentMethods: PaymentMethod[] } = {
  acceptedPaymentMethods: [],
}
