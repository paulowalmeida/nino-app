export type CreateConsumerPaymentMethodRequest = {
  methodId: string
  gatewayToken: string
  brand?: string
  lastFour?: string
  expiresAt?: string
  isDefault?: boolean
}
